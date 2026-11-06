import { NextResponse } from 'next/server'
import { buildQuote } from '@/lib/server/pricing'
import { kvConfigured } from '@/lib/server/kv'
import { consumeVoucher, holdVoucher } from '@/lib/server/vouchers'
import { newOrderId, saveOrder, type StoredOrder } from '@/lib/server/orders'

// Card payments are switched off until PayMongo is connected.
const PAYMENT_LABELS: Record<string, string> = {
  bank: 'Bank Transfer',
  gcash: 'GCash',
}

const field = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, voucherCode, paymentMethod } = body
    const code = field(voucherCode, 40)

    if (!PAYMENT_LABELS[paymentMethod]) {
      return NextResponse.json({ success: false, error: 'Please choose a payment method.' }, { status: 400 })
    }
    if (code && !kvConfigured()) {
      return NextResponse.json({ success: false, error: 'Vouchers are not available right now.' }, { status: 503 })
    }

    // Prices, shipping and the voucher discount are all worked out here, never trusted from the browser.
    const result = await buildQuote(items, code)
    if (!result.ok) return NextResponse.json({ success: false, error: result.error }, { status: result.status })
    const quote = result.quote

    const storeReady = kvConfigured()
    const orderId = storeReady ? await newOrderId() : 'FRL-' + Math.floor(100000 + Math.random() * 900000)

    // Hold the voucher for this order. It only counts as used once the order is paid.
    if (quote.voucher && !(await holdVoucher(quote.voucher, orderId))) {
      return NextResponse.json({ success: false, error: 'That voucher code has already been used.' }, { status: 409 })
    }

    // A ₱0 order has nothing to pay, so it is paid now and the voucher is used now.
    const paymentVerified = quote.total === 0
    if (paymentVerified && quote.voucher) await consumeVoucher(quote.voucher, orderId)

    const now = Date.now()
    const order: StoredOrder = {
      id: orderId,
      createdAt: now,
      date: new Date(now).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'Asia/Manila',
      }),
      customerName: field(body.fullName),
      customerEmail: field(body.email),
      address: field(body.address, 300),
      city: field(body.city),
      postalCode: field(body.postalCode, 20),
      paymentMethod: PAYMENT_LABELS[paymentMethod],
      referenceNumber: field(body.referenceNumber, 40) || undefined,
      items: quote.lines,
      subtotal: quote.subtotal,
      shipping: quote.shipping,
      discount: quote.discount,
      total: quote.total,
      voucherCode: quote.voucher?.code,
      paymentVerified,
      status: 'Processing',
    }
    if (storeReady) await saveOrder(order)

    const response = {
      success: true,
      orderId,
      subtotal: quote.subtotal,
      shipping: quote.shipping,
      discount: quote.discount,
      total: quote.total,
      voucherCode: quote.voucher?.code ?? null,
      paymentVerified,
    }

    // PayMongo GCash (only when PAYMONGO_SECRET_KEY is set). PayMongo needs at least ₱1, so ₱0 orders skip it.
    const paymongoSecretKey = process.env.PAYMONGO_SECRET_KEY
    if (paymongoSecretKey && paymentMethod === 'gcash' && quote.total > 0) {
      const paymongoResponse = await fetch('https://api.paymongo.com/v1/sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(paymongoSecretKey + ':').toString('base64')}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              type: 'gcash',
              amount: Math.round(quote.total * 100),
              currency: 'PHP',
              redirect: {
                success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}?payment=success`,
                failed: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}?payment=failed`,
              },
            },
          },
        }),
      })

      const paymongoData = await paymongoResponse.json()
      if (paymongoData?.data?.attributes?.redirect?.checkout_url) {
        return NextResponse.json({ ...response, redirectUrl: paymongoData.data.attributes.redirect.checkout_url })
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to process checkout' }, { status: 500 })
  }
}
