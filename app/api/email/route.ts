import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId, customerName, customerEmail, items, total, status, paymentMethod, referenceNumber } = body

    // 1. Make.com Webhook forwarding (If MAKE_WEBHOOK_URL is set in environment variables)
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL
    if (makeWebhookUrl) {
      await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'order.updated',
          orderId,
          customerName,
          customerEmail,
          items,
          total,
          status,
          paymentMethod,
          referenceNumber,
          timestamp: new Date().toISOString(),
        }),
      })
    }

    // 2. Custom HTML Email Receipt Template
    const htmlEmailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation #${orderId}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#0B0F17;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#F8FAFC;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0B0F17;padding:40px 10px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#111827;border:1px solid #1E293B;border-radius:8px;padding:32px;text-align:left;">
              <!-- Logo Header -->
              <tr>
                <td style="border-bottom:1px solid #1E293B;padding-bottom:20px;text-align:center;">
                  <h1 style="margin:0;font-size:24px;font-weight:900;letter-spacing:0.15em;color:#FFFFFF;text-transform:uppercase;">FROSTLINE</h1>
                  <p style="margin:4px 0 0 0;font-size:11px;letter-spacing:0.1em;color:#94A3B8;text-transform:uppercase;">Wear Your Confidence</p>
                </td>
              </tr>

              <!-- Greeting & Status -->
              <tr>
                <td style="padding:28px 0 16px 0;">
                  <h2 style="margin:0;font-size:20px;font-weight:700;color:#FFFFFF;">Order Confirmed #${orderId}</h2>
                  <p style="margin:8px 0 0 0;font-size:14px;color:#94A3B8;line-height:1.6;">
                    Hi ${customerName || 'Customer'}, thank you for your order! Your payment via <strong>${paymentMethod}</strong> has been received.
                  </p>
                </td>
              </tr>

              <!-- Order Status Badge -->
              <tr>
                <td>
                  <div style="background-color:#0F172A;border:1px solid #334155;border-radius:6px;padding:16px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Status:</span>
                    <span style="background-color:#065F46;color:#34D399;font-size:12px;font-weight:800;padding:4px 12px;border-radius:4px;text-transform:uppercase;">${status || 'Payment Verified'}</span>
                  </div>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:24px;">
                    <tr style="border-bottom:1px solid #1E293B;color:#64748B;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">
                      <th align="left" style="padding-bottom:8px;">Item</th>
                      <th align="right" style="padding-bottom:8px;">Price</th>
                    </tr>
                    ${(items || [])
                      .map(
                        (item: { name: string; price: number }) => `
                      <tr style="border-bottom:1px solid #1E293B;">
                        <td style="padding:12px 0;font-size:13px;color:#F8FAFC;font-weight:600;">${item.name}</td>
                        <td align="right" style="padding:12px 0;font-size:13px;color:#34D399;font-weight:700;">₱${item.price.toLocaleString()}</td>
                      </tr>
                    `
                      )
                      .join('')}
                    <tr>
                      <td style="padding-top:16px;font-size:14px;font-weight:700;color:#FFFFFF;">Total Paid</td>
                      <td align="right" style="padding-top:16px;font-size:18px;font-weight:900;color:#34D399;">₱${(total || 0).toLocaleString()}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Payment Reference -->
              ${
                referenceNumber
                  ? `
              <tr>
                <td style="background-color:#0F172A;border:1px solid #1E293B;padding:12px 16px;border-radius:6px;font-size:12px;color:#94A3B8;margin-bottom:24px;">
                  Payment Reference Number: <strong style="color:#F8FAFC;font-family:monospace;">${referenceNumber}</strong>
                </td>
              </tr>
              `
                  : ''
              }

              <!-- Footer -->
              <tr>
                <td style="border-top:1px solid #1E293B;padding-top:24px;text-align:center;font-size:12px;color:#64748B;line-height:1.6;">
                  If you have any questions, reply to this email or contact support at <a href="mailto:hello@oddritualgolf.com" style="color:#38BDF8;text-decoration:none;">hello@oddritualgolf.com</a>.<br>
                  FROSTLINE © 2026. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `

    return NextResponse.json({
      success: true,
      orderId,
      sentTo: customerEmail,
      htmlPreview: htmlEmailTemplate,
    })
  } catch (error) {
    console.error('Email API Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate email' }, { status: 500 })
  }
}
