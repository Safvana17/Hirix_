export const CompanyRegisterRejectionEmailTemplate = (companyName: string, reason?: string) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
    <h2 style="color: #c0392b; text-align: center;">Registration Update</h2>
    <p>Dear <strong>${companyName}</strong>,</p>
    <p>We regret to inform you that your registration on Hirix has been <strong>rejected</strong> by our admin team.</p>
    ${reason ? `<div style="background-color: #fceae9; border-left: 5px solid #c0392b; padding: 15px; margin: 20px 0;"><strong>Reason:</strong> ${reason}</div>` : ''}
    <p>If you believe this was a mistake or would like more information, please contact our support team.</p>
    <p>Best regards,<br>The Hirix Team</p>
</div>
`;
