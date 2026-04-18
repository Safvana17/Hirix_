import puppeteer from 'puppeteer'
import { IPdfService } from "../../Application/interface/service/IPdfService"
import { PaymentEntity } from "../../Domain/entities/Payment.entity"
import { SubscriptionEntity } from "../../Domain/entities/Subscription.entity"
import { SubscriptionPlanEntity } from "../../Domain/entities/SubscriptionPlan.entity"
import UserEntity from "../../Domain/entities/user.entity"

export class PdfService implements IPdfService {

  async generateInvoice(data: {
    user: UserEntity
    payment: PaymentEntity
    subscriptionPlan: SubscriptionPlanEntity
    subscription: SubscriptionEntity
  }): Promise<Buffer> {

    const html = this.buildHtml(data)

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // 🔥 important for production
    })

    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: 'domcontentloaded' })

    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true
    })

    await browser.close()

    return Buffer.from(buffer)
  }

private buildHtml(data: {
  user: UserEntity
  payment: PaymentEntity
  subscriptionPlan: SubscriptionPlanEntity
}): string {

  const statusMap: Record<string, string> = {
    success: 'success',
    failed: 'failed'
  }

  const statusClass = statusMap[data.payment.status] || 'failed'

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      background: #f4f6f8;
    }

    .container {
      width: 800px;
      margin: auto;
      background: white;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: #6B4705;
      color: white;
      padding: 30px;
      display: flex;
      justify-content: space-between;
    }

    .invoice-title {
      font-size: 32px;
      font-weight: bold;
    }

    .company-info {
      text-align: right;
    }

    .company-name {
      font-size: 20px;
      font-weight: bold;
    }

    .website {
      font-size: 12px;
      opacity: 0.8;
    }

    .content {
      padding: 30px;
    }

    .section {
      margin-top: 20px;
    }

    .label {
      font-weight: bold;
      color: #555;
    }

    /* TABLE */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th {
      background: #6B4705;
      color: white;
      padding: 10px;
      text-align: left;
    }

    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }

    /* STATUS */
    .status {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      display: inline-block;
    }

    .success {
      background: #e6f4ea;
      color: #2e7d32;
    }

    .failed {
      background: #fdecea;
      color: #c62828;
    }

    .total-box {
      margin-top: 20px;
      text-align: right;
      font-size: 16px;
      font-weight: bold;
    }

    .footer {
      position: absolute;
      background: #6B4705;
      color: white;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      margin-top: 30px;
      bottom: 0;
      width: 100%
    }

  </style>
</head>

<body>
  <div class="container">

    <!-- HEADER -->
    <div class="header">
      <div>
        <div class="invoice-title">INVOICE</div>
        <div style="font-size:12px;">
          Invoice ID: ${data.payment.id}<br/>
          Date: ${new Date(data.payment.paymentDate).toLocaleDateString()}
          Order ID: ${data.payment.orderId}
        </div>
      </div>

      <div class="company-info">
        <div class="company-name">HiriX</div>
        <div class="website">www.hirix.com</div>
      </div>
    </div>


    <div class="content">

      <div class="section">
        <div class="label">Billed To</div>
        <div>${data.user.getName()}</div>
        <div>${data.user.getEmail()}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${data.subscriptionPlan.planName}</td>
            <td>${data.payment.currency} ${data.payment.amount}</td>
            <td>
              <span class="status ${statusClass}">
                ${data.payment.status.toUpperCase()}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="total-box">
        Total: ${data.payment.currency} ${data.payment.amount}
      </div>

    </div>


    <div class="footer">
      © ${new Date().getFullYear()} HiriX • www.hirix.com
    </div>

  </div>
</body>
</html>
`
}
}