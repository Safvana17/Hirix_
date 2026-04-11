// export const CompanyRegisterRejectionEmailTemplate = (companyName: string, reason?: string) => `
// <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
//     <h2 style="color: #c0392b; text-align: center;">Registration Update</h2>
//     <p>Dear <strong>${companyName}</strong>,</p>
//     <p>We regret to inform you that your registration on Hirix has been <strong>rejected</strong> by our admin team.</p>
//     ${reason ? `<div style="background-color: #fceae9; border-left: 5px solid #c0392b; padding: 15px; margin: 20px 0;"><strong>Reason:</strong> ${reason}</div>` : ''}
//     <p>If you believe this was a mistake or would like more information, please contact our support team.</p>
//     <p>Best regards,<br>The Hirix Team</p>
// </div>
// `;

export const CompanyRegisterRejectionEmailTemplate = (
  companyName: string,
  reason?: string
) => `
<div style="
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background-color: #ffffff;
">

  <h2 style="
    color: #c0392b;
    text-align: center;
    margin-bottom: 20px;
  ">
    Registration Not Approved
  </h2>

  <p>Dear <strong>${companyName}</strong>,</p>

  <p>
    Thank you for registering with <strong>Hirix</strong>. After reviewing your application,
    we’re unable to approve your company profile at this time.
  </p>

  ${
    reason
      ? `
      <div style="
        background-color: #fdecea;
        border-left: 5px solid #c0392b;
        padding: 16px;
        margin: 20px 0;
        border-radius: 6px;
      ">
        <strong>Reason for rejection:</strong>
        <p style="margin-top: 8px;">${reason}</p>
      </div>
      `
      : ''
  }

  <p>
    You can <strong>reapply</strong> after addressing the ${
      reason ? 'above issue' : 'required details'
    }. Please make sure all information is accurate and complete before submitting again.
  </p>

  <!-- CTA BUTTON -->
  <div style="text-align: center; margin-top: 30px;">
    <a href=""
       style="
         display: inline-block;
         padding: 12px 24px;
         background-color: #6B4705;
         color: #ffffff;
         text-decoration: none;
         border-radius: 8px;
         font-weight: bold;
       ">
       Update Profile & Reapply
    </a>
  </div>

  <!-- LOGIN FALLBACK -->
  <p style="
    margin-top: 20px;
    font-size: 13px;
    color: #777;
    text-align: center;
  ">
    If you're not logged in, you can
    <a href="" style="color: #6B4705;">
      login here
    </a>
    and continue.
  </p>

  <p style="margin-top: 30px;">
    If you need any help, feel free to contact our support team.
  </p>

  <p>
    Best regards,<br/>
    <strong>The Hirix Team</strong>
  </p>

</div>
`;
