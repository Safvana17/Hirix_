export const subscriptionReminderTemplate = (userName: string, planName: string, expiryDate: string) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
    <h2 style="color: #e67e22; text-align: center;">Subscription Renewal Reminder</h2>
    <p>Dear <strong>${userName}</strong>,</p>
    <p>This is a friendly reminder that your <strong>${planName}</strong> subscription is set to expire in <strong>3 days</strong> on <strong>${expiryDate}</strong>.</p>
    <p>To ensure uninterrupted access to all premium features, including job postings and advanced candidate searches, please renew your subscription before it expires.</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/company/subscription" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Renew Subscription</a>
    </div>
    <p>If your subscription expires, your account will be automatically moved to the <strong>Free Plan</strong>, which has limited features.</p>
    <p>If you have any questions, please feel free to contact our support team.</p>
    <p>Best regards,<br>The Hirix Team</p>
</div>
`;