// Server-side order records (KV store). Read and updated by /admin through /api/admin/orders.

import { randomInt, timingSafeEqual } from 'crypto'
import { kv } from './kv'
import type { QuoteLine } from './pricing'

export type OrderStatus = 'Processing' | 'Preparing Shipment' | 'Delivered'

export interface StoredOrder {
  id: string
  createdAt: number
  date: string
  customerName: string
  customerEmail: string
  address: string
  city: string
  postalCode: string
  paymentMethod: string
  referenceNumber?: string
  items: QuoteLine[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  voucherCode?: string
  paymentVerified: boolean // true once you verify the payment in /admin (or the total was ₱0)
  status: OrderStatus
}

const ORDER_INDEX = 'orders'

export async function newOrderId(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const id = 'FRL-' + randomInt(100000, 1000000)
    if ((await kv(['SET', `order:${id}:lock`, '1', 'NX'])) === 'OK') return id
  }
  throw new Error('Could not create an order ID')
}

export async function saveOrder(order: StoredOrder): Promise<void> {
  await kv(['SET', `order:${order.id}`, JSON.stringify(order)])
  await kv(['ZADD', ORDER_INDEX, order.createdAt, order.id])
}

export async function getOrder(id: string): Promise<StoredOrder | null> {
  const raw = await kv<string | null>(['GET', `order:${id}`])
  return raw ? (JSON.parse(raw) as StoredOrder) : null
}

export async function listOrders(limit = 200): Promise<StoredOrder[]> {
  const ids = await kv<string[]>(['ZREVRANGE', ORDER_INDEX, 0, limit - 1])
  if (!ids || ids.length === 0) return []
  const rows = await kv<(string | null)[]>(['MGET', ...ids.map((id) => `order:${id}`)])
  return rows.filter(Boolean).map((r) => JSON.parse(r as string) as StoredOrder)
}

// /admin sends the password in the x-admin-password header; it is checked against ADMIN_PASSWORD.
export function isAdmin(req: Request): boolean {
  const expected = Buffer.from(process.env.ADMIN_PASSWORD || '')
  const given = Buffer.from(req.headers.get('x-admin-password') || '')
  if (expected.length === 0 || given.length !== expected.length) return false
  return timingSafeEqual(given, expected)
}
