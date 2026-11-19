import nodemailer from 'nodemailer'
import { findCatalogProduct } from '@/lib/catalog'
import type { StoredOrder } from './orders'
import copy from './email-copy.json'

const mailbox = 'admin.wearfrostline@gmail.com'
const shop = 'https://wearfrostline.vercel.app'
const heading = "font-family:Antonio,Anton,'Arial Narrow',Arial,sans-serif"
const money = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character] ?? character))

export async function sendOrderReceived(order: StoredOrder): Promise<boolean> {
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '')
  if (!password || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(order.customerEmail)) return false

  const firstName = order.customerName.trim().split(/\s+/)[0]?.toUpperCase() || 'THERE'
  const fill = (value: string) => value.replaceAll('{orderId}', order.id).replaceAll('{firstName}', firstName)
  const bank = order.paymentMethod === 'Bank Transfer'
  const paymentHeading = order.paymentVerified ? copy.paidHeading : bank ? copy.bankHeading : copy.gcashHeading
  const paymentMessage = order.paymentVerified ? copy.paidMessage : bank ? copy.bankMessage : copy.gcashMessage
  const qr = 'cid:bank-qr@frostline'
  const items = order.items.map((item) => {
    const product = findCatalogProduct({ sku: item.sku })
    const image = (item.color && product?.colorVariations[item.color]?.heroImg) || product?.flatImg
    const details = [item.size, item.color, item.fabric].filter(Boolean).join(' · ')
    return `<tr><td style="padding:8px">${image ? `<img src="${escape(shop + encodeURI(image))}" alt="" width="64" style="float:left;margin-right:12px">` : ''}<strong>${escape(item.name)}</strong><br>${escape(details)}</td><td align="right">${money.format(item.price)}</td></tr>`
  }).join('')
  const row = (label: string, value: number) => `<tr><td style="padding:6px 8px">${escape(label)}</td><td align="right">${money.format(value)}</td></tr>`
  const html = `<div style="background:#eee;padding:20px;color:#161616;font-family:'Times New Roman',Georgia,serif">
<table role="presentation" align="center" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff">
<tr><td align="center" bgcolor="#101010" style="padding:25px;color:#fff;${heading};font-size:27px;font-weight:bold"><img src="cid:logo@frostline" alt="" width="44" style="vertical-align:middle;margin-right:7px">FROSTLINE</td></tr>
<tr><td style="padding:28px"><h1 style="margin:0;${heading};font-size:30px">${escape(fill(copy.greeting))}</h1><p>${escape(fill(copy.message))}</p>
<table width="100%" cellspacing="0" cellpadding="0"><tr><th colspan="2" align="left" bgcolor="#eee" style="padding:8px;${heading}">${escape(copy.summary)}</th></tr>
${items}${row(copy.subtotal, order.subtotal)}${row(copy.shipping, order.shipping)}
${order.voucherCode ? row(`${copy.voucher} · ${order.voucherCode}`, -order.discount) : ''}${row(copy.total, order.total)}</table>
<div style="background:#f5f5f5;margin-top:20px;padding:18px"><h2 style="margin:0;${heading}">${escape(paymentHeading)}</h2><p>${escape(paymentMessage)}</p>
${order.paymentVerified ? '' : `<img src="${qr}" alt="MariBank InstaPay QR" width="260" style="display:block;max-width:100%;height:auto;margin:auto"><p>${escape(copy.receipt)}</p>`}</div>
</td></tr><tr><td bgcolor="#202020" style="padding:25px;color:white;background-image:linear-gradient(120deg,#080808,#525252)">
<img src="cid:logo@frostline" alt="" width="92" align="right" style="opacity:.21"><strong style="${heading};font-size:24px"><img src="cid:logo@frostline" alt="" width="33" style="vertical-align:middle;margin-right:6px">FROSTLINE</strong>
<p><a href="tel:+639606716680" style="color:white">+63 960 671 6680</a><br><a href="mailto:${mailbox}" style="color:white">${mailbox}</a></p>
<div style="border-top:1px solid #777;padding-top:12px;${heading}">${escape(copy.signOff)}</div></td></tr></table></div>`

  try {
    const smtp = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: mailbox, pass: password },
      connectionTimeout: 6000,
      greetingTimeout: 6000,
      socketTimeout: 10000,
    })
    const result = await smtp.sendMail({
      from: { name: 'FROSTLINE', address: mailbox },
      replyTo: mailbox,
      to: { name: '', address: order.customerEmail },
      subject: fill(copy.subject),
      html,
      attachments: [
        { filename: 'frostline.png', path: 'public/FROSTLINEwhiteLOGOonly.png', cid: 'logo@frostline' },
        ...(!order.paymentVerified ? [{ filename: 'maribank.png', path: 'public/images/email-maribank-qr.png', cid: 'bank-qr@frostline' }] : []),
      ],
    })
    return result.accepted.length > 0
  } catch {
    console.error('FROSTLINE order confirmation failed', order.id)
    return false
  }
}
