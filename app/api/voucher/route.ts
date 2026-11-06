import { NextResponse } from 'next/server'
import { buildQuote } from '@/lib/server/pricing'
import { kvConfigured } from '@/lib/server/kv'

// POST { items: [{ sku }], code? } → the order total worked out on the server.
// With a code: checks it (exists, not expired, uses left) and returns the discount.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const code = typeof body.code === 'string' ? body.code.trim() : ''
    if (code && !kvConfigured()) {
      return NextResponse.json({ success: false, error: 'Vouchers are not available right now.' }, { status: 503 })
    }

    const result = await buildQuote(body.items, code)
    if (!result.ok) return NextResponse.json({ success: false, error: result.error }, { status: result.status })

    const { subtotal, shipping, discount, total, voucher } = result.quote
    return NextResponse.json({
      success: true,
      subtotal,
      shipping,
      discount,
      total,
      voucherCode: voucher?.code ?? null,
    })
  } catch (error) {
    console.error('Voucher API error:', error)
    return NextResponse.json({ success: false, error: 'Could not check that code. Please try again.' }, { status: 500 })
  }
}
