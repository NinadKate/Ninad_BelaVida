import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderNotification(orderId: number, total: number, currency: string, shippingInfo: any) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email not sent.");
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Bella Vida <onboarding@resend.dev>', // Use registered domain in prod
            to: ['admin@bellavida.cl'], // Send to admin
            subject: `New Order #${orderId}`,
            html: `
        <h1>New Order Received</h1>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Customer:</strong> ${shippingInfo.fullName} (${shippingInfo.email})</p>
        <p><strong>Total:</strong> ${currency} ${total}</p>
        <br/>
        <p>Please check the admin dashboard for more details.</p>
        <a href="${process.env.NEXTAUTH_URL}/admin">Go to Dashboard</a>
      `,
        });

        if (error) {
            console.error("Resend error:", error);
        }
    } catch (err) {
        console.error("Email sending failed:", err);
    }
}
