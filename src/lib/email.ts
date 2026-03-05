import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
    name: string;
    sku?: string;
    quantity: number;
    price: number | string;
    currency: string;
}

export async function sendOrderNotification(
    orderId: number,
    total: number,
    currency: string,
    shippingInfo: any,
    items: OrderItem[] = []
) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email not sent.");
        return;
    }

    const itemRows = items.map(item => `
        <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#777;">${item.sku || '—'}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${currency} ${Number(item.price).toLocaleString()}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${currency} ${(Number(item.price) * item.quantity).toLocaleString()}</td>
        </tr>
    `).join('');

    const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px;">
        <h1 style="color:#111;font-size:22px;margin-bottom:4px;">🛒 New Order #${orderId}</h1>
        <p style="color:#555;margin-top:0;">A new order has been placed on Bella Vida.</p>

        <div style="background:#fff;border-radius:8px;padding:16px;margin:16px 0;border:1px solid #e5e7eb;">
            <h2 style="font-size:15px;color:#374151;margin-top:0;">Customer Details</h2>
            <p style="margin:4px 0;"><strong>Name:</strong> ${shippingInfo.fullName}</p>
            <p style="margin:4px 0;"><strong>Email:</strong> ${shippingInfo.email}</p>
            <p style="margin:4px 0;"><strong>Phone:</strong> ${shippingInfo.phone || '—'}</p>
            <p style="margin:4px 0;"><strong>Address:</strong> ${shippingInfo.address || '—'}, ${shippingInfo.city || ''}, ${shippingInfo.country || ''}</p>
        </div>

        <div style="background:#fff;border-radius:8px;padding:16px;margin:16px 0;border:1px solid #e5e7eb;">
            <h2 style="font-size:15px;color:#374151;margin-top:0;">Order Items</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <thead>
                    <tr style="background:#f3f4f6;">
                        <th style="padding:8px 12px;text-align:left;color:#6b7280;">Product</th>
                        <th style="padding:8px 12px;text-align:left;color:#6b7280;">SKU</th>
                        <th style="padding:8px 12px;text-align:center;color:#6b7280;">Qty</th>
                        <th style="padding:8px 12px;text-align:right;color:#6b7280;">Unit Price</th>
                        <th style="padding:8px 12px;text-align:right;color:#6b7280;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows || '<tr><td colspan="5" style="padding:12px;color:#999;text-align:center;">No items</td></tr>'}
                </tbody>
            </table>
        </div>

        <div style="background:#111;border-radius:8px;padding:16px;color:#fff;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:16px;font-weight:600;">Order Total</span>
            <span style="font-size:20px;font-weight:700;">${currency} ${Number(total).toLocaleString()}</span>
        </div>

        <div style="text-align:center;margin-top:24px;">
            <a href="${process.env.NEXTAUTH_URL}/admin" 
               style="background:#16a34a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;display:inline-block;">
               View in Admin Dashboard →
            </a>
        </div>
    </div>
    `;

    try {
        const { error } = await resend.emails.send({
            from: 'Bella Vida <onboarding@resend.dev>',
            to: ['kinesis.it2025@gmail.com'],
            subject: `🛒 New Order #${orderId} — ${currency} ${Number(total).toLocaleString()}`,
            html,
        });

        if (error) {
            console.error("Resend error:", error);
        }
    } catch (err) {
        console.error("Email sending failed:", err);
    }
}
