export const companyRestoreAccountTemplate = (
  companyName: string,
  restoreLink: string
) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
    <h2 style="color: #2c3e50; text-align: center;">Restore Your Account</h2>
    <p>Dear <strong>${companyName}</strong>,</p>
    <p>We received a request to restore your Hirix company account, which is currently deactivated.</p>
    <p>If this was you, you can securely restore your account by clicking the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="${restoreLink}" 
           style="background-color: #f39c12; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
           Restore My Account
        </a>
    </div>
    <p>This link is valid for <strong>24 hours</strong>. After that, you will need to request a new restore link.</p>
    <p>If you did not request this, please ignore this email. Your account will remain deactivated.</p>
    <p>For security reasons, this link can only be used once.</p>
    <p>Best regards,<br>The Hirix Team</p>
</div>
`;