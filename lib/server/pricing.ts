// Server-side order pricing. Prices always come from the catalog — never from the browser.

import { findCatalogProduct, TEST_PRODUCTS } from '@/lib/catalog'
import { findVoucher, hasUsesLeft, isExpired, type Voucher } from './vouchers'

export const SHIPPING_FEE = 150

export interface QuoteLine {
  sku: string
  name: string
  price: number
  size?: string
  color?: string
  fabric?: string
}

export interface Quote {
  lines: QuoteLine[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  voucher: Voucher | null
}

export type QuoteResult = { ok: true; quote: Quote } | { ok: false; status: number; error: string }

const str = (v: unknown, max = 60) => (typeof v === 'string' ? v.slice(0, max) : undefined)

export async function buildQuote(rawItems: unknown, rawCode?: unknown): Promise<QuoteResult> {
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 50) {
    return { ok: false, status: 400, error: 'Your cart is empty.' }
  }

  const lines: QuoteLine[] = []
  for (const raw of rawItems as Record<string, unknown>[]) {
    const product = findCatalogProduct({ sku: str(raw?.sku) })
    if (!product) return { ok: false, status: 400, error: 'An item in your cart is no longer available.' }
    lines.push({
      sku: product.sku,
      name: product.name,
      price: product.price,
      size: str(raw?.size, 10),
      color: str(raw?.color, 30),
      fabric: str(raw?.fabric, 30),
    })
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price, 0)
  // Same rule as before (no shipping on a ₱0 cart); test-only carts also ship free.
  const testOnly = lines.every((l) => TEST_PRODUCTS.some((t) => t.sku === l.sku))
  const shipping = subtotal > 0 && !testOnly ? SHIPPING_FEE : 0

  let voucher: Voucher | null = null
  let discount = 0
  const code = typeof rawCode === 'string' ? rawCode.trim() : ''
  if (code) {
    const found = findVoucher(code)
    if (!found) return { ok: false, status: 400, error: 'That voucher code is not valid.' }
    if (isExpired(found)) return { ok: false, status: 400, error: 'That voucher code has expired.' }
    if (!(await hasUsesLeft(found))) {
      return { ok: false, status: 400, error: 'That voucher code has already been used.' }
    }
    voucher = found
    discount = Math.min(found.amount, subtotal + shipping)
  }

  const total = Math.max(0, subtotal + shipping - discount)
  return { ok: true, quote: { lines, subtotal, shipping, discount, total, voucher } }
}
