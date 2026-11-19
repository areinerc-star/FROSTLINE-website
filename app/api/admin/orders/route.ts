import { NextResponse } from 'next/server'
import { sendOrderEmail } from '@/lib/server/order-email'
import { kv, kvConfigured } from '@/lib/server/kv'
import { getOrder, isAdmin, listOrders, saveOrder, type OrderStatus } from '@/lib/server/orders'
import { consumeVoucher, findVoucher } from '@/lib/server/vouchers'

export const dynamic = 'force-dynamic'

const STATUSES: OrderStatus[] = ['Processing', 'Preparing Shipment', 'Shipped', 'Delivered']

function guard(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: 'Wrong admin password.' }, { status: 401 })
  if (!kvConfigured()) {
    return NextResponse.json({ success: false, error: 'The order database is not connected yet.' }, { status: 503 })
  }
  return null
}

// GET → all orders saved on the server (newest first). Requires the x-admin-password header.
export async function GET(req: Request) {
  const denied = guard(req)
  if (denied) return denied
  try {
    return NextResponse.json({ success: true, orders: await listOrders() })
  } catch (error) {
    console.error('Admin orders error:', error)
    return NextResponse.json({ success: false, error: 'Could not load orders.' }, { status: 500 })
  }
}

// PATCH { id, status, verifyPayment? } → update an order. Verifying payment marks its voucher as used.
export async function PATCH(req: Request) {
  const denied = guard(req)
  if (denied) return denied
  try {
    const { id, status, verifyPayment } = await req.json()
    const order = typeof id === 'string' ? await getOrder(id) : null
    if (!order) return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 })
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: 'Unknown status.' }, { status: 400 })
    }

    const newlyPaid = verifyPayment && !order.paymentVerified
    const newlyShipped = status === 'Shipped' && order.status !== 'Shipped'
    if (newlyPaid) {
      const voucher = order.voucherCode ? findVoucher(order.voucherCode) : undefined
      if (voucher && !(await consumeVoucher(voucher, order.id))) {
        return NextResponse.json(
          {
            success: false,
            error: `Voucher ${voucher.code} was already used by another order (this order's hold expired). Collect the ₱${order.discount} difference before shipping.`,
          },
          { status: 409 }
        )
      }
      order.paymentVerified = true
    }
    order.status = status
    await saveOrder(order)
    const failedEmails: string[] = []
    for (const [kind, changed] of [['payment', newlyPaid], ['shipped', newlyShipped], ['delivered', status === 'Delivered']] as const) {
      const key = `order:${order.id}:email:${kind}`
      if (changed) await kv(['SET', key, 'pending', 'NX'])
      if (await kv(['GET', key]) !== 'pending') continue
      if (await kv(['SET', key + ':lock', '1', 'NX', 'EX', '120']) !== 'OK') continue
      try {
        if (await kv(['GET', key]) !== 'pending') continue
        if (await sendOrderEmail(order, kind)) await kv(['SET', key, 'sent'])
        else failedEmails.push(kind)
      } finally {
        await kv(['DEL', key + ':lock'])
      }
    }
    return NextResponse.json({ success: true, order, failedEmails })
  } catch (error) {
    console.error('Admin order update error:', error)
    return NextResponse.json({ success: false, error: 'Could not update the order.' }, { status: 500 })
  }
}
