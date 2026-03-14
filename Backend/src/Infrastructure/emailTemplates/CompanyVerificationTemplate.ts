export const CompanyVerificationLinkTemplate = (companyName: string, verificationLink: string) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
    <h2 style="color: #2c3e50; text-align: center;">Security Verification</h2>
    <p>Dear <strong>${companyName}</strong>,</p>
    <p>We noticed a login attempt to your Hirix account. To ensure it's you, please click the button below to verify your email address.</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #27ae60; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Yes, it's me - Verify Email</a>
    </div>
    <p>If you did not attempt to log in, please ignore this email or contact support if you have concerns.</p>
    <p>This link will expire in 24 hours.</p>
    <p>Best regards,<br>The Hirix Team</p>
</div>
`;
