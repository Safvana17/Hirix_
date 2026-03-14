export const CompanyRegisterApprovalEmailTemplate = (companyName: string) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
    <h2 style="color: #2c3e50; text-align: center;">Welcome to Hirix!</h2>
    <p>Dear <strong>${companyName}</strong>,</p>
    <p>We are pleased to inform you that your registration on Hirix has been <strong>approved</strong> by our admin team.</p>
    <p>You can now log in to your account and start using our platform.</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/login" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In to Hirix</a>
    </div>
    <p>If you have any questions, please feel free to contact our support team.</p>
    <p>Best regards,<br>The Hirix Team</p>
</div>
`;