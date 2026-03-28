export const accountDeletionEmailTemplate = (companyName: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <h2 style="color: #d32f2f;">Account Deletion Request</h2>
    <p>Dear ${companyName},</p>
    <p>We received a request to delete your Hirix account. Your account has been deactivated and is scheduled for permanent deletion in <strong>30 days</strong>.</p>
    <p>If this was not you, or if you change your mind, you can restore your account simply by logging into Hirix within the next 30 days.</p>
    <p>After 30 days, all your data, including company profiles, job postings, and candidate information, will be <strong>permanently removed</strong> and cannot be recovered.</p>
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #757575;">
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The Hirix Team</p>
    </div>
</div>
`;
