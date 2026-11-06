// FROSTLINE voucher codes — SERVER ONLY. Validated in API routes, never in browser code.
// Usage is counted in the KV store (lib/server/kv.ts):
//   voucher:<CODE>:used    number of orders that used the code (counted only once an order is paid)
//   voucher:<CODE>:usedby  set of order IDs that used it (so the same order is never counted twice)
//   voucher:<CODE>:holds   orders that applied it and are waiting for payment (released after 48 hours)

import { kvScript, mem, type KvArg } from './kv'

export interface Voucher {
  code: string
  amount: number // pesos off the order total (items + shipping); the total never goes below ₱0
  expiresAt: string | null // ISO time in Asia/Manila (+08:00); null = no expiry
  maxUses: number
  isTest?: boolean
}

// Codes are stored EXACTLY as issued. Matching ignores letter case and spaces before/after.
export const VOUCHERS: Voucher[] = [
  { code: 'FL500-4SV9-6VAP', amount: 500, expiresAt: '2026-12-31T23:59:59.999+08:00', maxUses: 1 },
  { code: 'FL500-4YBU-Z4TR', amount: 500, expiresAt: '2026-12-31T23:59:59.999+08:00', maxUses: 1 },
  { code: 'FL500-BZ5D-FKK8', amount: 500, expiresAt: '2026-12-31T23:59:59.999+08:00', maxUses: 1 },
  { code: 'FL500-QDJJ-NA9C', amount: 500, expiresAt: '2026-12-31T23:59:59.999+08:00', maxUses: 1 },
  { code: 'FL500-YWH3-4CPK', amount: 500, expiresAt: '2026-12-31T23:59:59.999+08:00', maxUses: 1 },
  // TEST CODE — for checking the payment flow. Remove before launch.
  { code: 'TEST500', amount: 500, expiresAt: null, maxUses: 5, isTest: true },
]

export const HOLD_MS = 48 * 60 * 60 * 1000

export const normalizeCode = (raw: unknown) => (typeof raw === 'string' ? raw.trim().toUpperCase() : '')

export function findVoucher(raw: unknown): Voucher | undefined {
  const code = normalizeCode(raw)
  return code ? VOUCHERS.find((v) => v.code.toUpperCase() === code) : undefined
}

export const isExpired = (v: Voucher, now = Date.now()) => v.expiresAt !== null && now > Date.parse(v.expiresAt)

const keys = (code: string) => [`voucher:${code}:used`, `voucher:${code}:usedby`, `voucher:${code}:holds`]

// ---- atomic scripts (Redis Lua) + the same logic for the local in-memory store ----

// Can this order use the code? 1 = yes, 0 = no uses left.
const CHECK = `
redis.call('ZREMRANGEBYSCORE', KEYS[3], '-inf', ARGV[1])
if ARGV[3] ~= '' and redis.call('ZSCORE', KEYS[3], ARGV[3]) then return 1 end
local used = tonumber(redis.call('GET', KEYS[1]) or '0')
if used + redis.call('ZCARD', KEYS[3]) >= tonumber(ARGV[2]) then return 0 end
return 1`

// Hold the code for an order that is waiting for payment. 1 = held, 0 = no uses left.
const HOLD = `
redis.call('ZREMRANGEBYSCORE', KEYS[3], '-inf', ARGV[1])
if redis.call('ZSCORE', KEYS[3], ARGV[3]) then return 1 end
local used = tonumber(redis.call('GET', KEYS[1]) or '0')
if used + redis.call('ZCARD', KEYS[3]) >= tonumber(ARGV[2]) then return 0 end
redis.call('ZADD', KEYS[3], ARGV[4], ARGV[3])
return 1`

// Mark the code used by a PAID order. 1 = counted (or already counted), 0 = no uses left.
const CONSUME = `
if redis.call('SISMEMBER', KEYS[2], ARGV[3]) == 1 then return 1 end
redis.call('ZREMRANGEBYSCORE', KEYS[3], '-inf', ARGV[1])
local held = redis.call('ZREM', KEYS[3], ARGV[3])
local used = tonumber(redis.call('GET', KEYS[1]) or '0')
if held == 0 and used + redis.call('ZCARD', KEYS[3]) >= tonumber(ARGV[2]) then return 0 end
redis.call('INCR', KEYS[1])
redis.call('SADD', KEYS[2], ARGV[3])
return 1`

type MemState = { used: number; usedby: Set<string>; holds: Map<string, number> }
function memState(code: string): MemState {
  const k = `voucher:${code}`
  if (!mem.has(k)) mem.set(k, { used: 0, usedby: new Set(), holds: new Map() } as MemState)
  return mem.get(k) as MemState
}
function memRun(kind: 'check' | 'hold' | 'consume') {
  return (k: string[], a: KvArg[]) => {
    const s = memState(k[0].split(':')[1])
    const [now, max, orderId, until] = [Number(a[0]), Number(a[1]), String(a[2]), Number(a[3])]
    for (const [id, exp] of s.holds) if (exp <= now) s.holds.delete(id)
    if (kind === 'consume') {
      if (s.usedby.has(orderId)) return 1
      const held = s.holds.delete(orderId)
      if (!held && s.used + s.holds.size >= max) return 0
      s.used += 1
      s.usedby.add(orderId)
      return 1
    }
    if (orderId && s.holds.has(orderId)) return 1
    if (s.used + s.holds.size >= max) return 0
    if (kind === 'hold') s.holds.set(orderId, until)
    return 1
  }
}

export async function hasUsesLeft(v: Voucher): Promise<boolean> {
  return (await kvScript(CHECK, keys(v.code), [Date.now(), v.maxUses, '', 0], memRun('check'))) === 1
}

export async function holdVoucher(v: Voucher, orderId: string): Promise<boolean> {
  const now = Date.now()
  return (await kvScript(HOLD, keys(v.code), [now, v.maxUses, orderId, now + HOLD_MS], memRun('hold'))) === 1
}

export async function consumeVoucher(v: Voucher, orderId: string): Promise<boolean> {
  return (await kvScript(CONSUME, keys(v.code), [Date.now(), v.maxUses, orderId, 0], memRun('consume'))) === 1
}
