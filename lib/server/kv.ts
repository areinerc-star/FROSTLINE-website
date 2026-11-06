// Server-only key/value store (Upstash Redis over its REST API — plain fetch, no extra package).
// Vercel → Storage → Upstash Redis adds KV_REST_API_URL + KV_REST_API_TOKEN to the project.
// Never import this file from a 'use client' component.

const REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
const REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''

export type KvArg = string | number

// Local development without a store: an in-memory stand-in so checkout can be tested.
// It is NEVER used in production — production without a store reports "not configured".
const useMemory = !REST_URL && process.env.NODE_ENV !== 'production'

export const kvConfigured = () => Boolean((REST_URL && REST_TOKEN) || useMemory)

export async function kv<T = unknown>(cmd: KvArg[]): Promise<T> {
  if (useMemory) return memory(cmd) as T
  if (!REST_URL || !REST_TOKEN) throw new Error('KV store is not configured')
  const res = await fetch(REST_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd.map(String)),
    cache: 'no-store',
  })
  const data = (await res.json()) as { result?: T; error?: string }
  if (!res.ok || data.error) throw new Error(`KV error: ${data.error || res.status}`)
  return data.result as T
}

// Runs a Lua script atomically on the store (used so two customers can't take the same code).
// `local` is the same logic in JS for the in-memory development store.
export async function kvScript(
  script: string,
  keys: string[],
  args: KvArg[],
  local: (keys: string[], args: KvArg[]) => number
): Promise<number> {
  if (useMemory) return local(keys, args)
  return Number(await kv<number>(['EVAL', script, keys.length, ...keys, ...args]))
}

// ---------------- in-memory development store ----------------
const g = globalThis as unknown as { __frlMem?: Map<string, unknown> }
export const mem: Map<string, unknown> = g.__frlMem ?? (g.__frlMem = new Map())

function memory(cmd: KvArg[]): unknown {
  const [op, key, ...rest] = cmd.map(String)
  switch (op.toUpperCase()) {
    case 'GET':
      return (mem.get(key) as string | undefined) ?? null
    case 'SET': {
      if (rest.includes('NX') && mem.has(key)) return null
      mem.set(key, rest[0])
      return 'OK'
    }
    case 'ZADD': {
      const z = (mem.get(key) as Map<string, number>) ?? new Map<string, number>()
      z.set(rest[1], Number(rest[0]))
      mem.set(key, z)
      return 1
    }
    case 'ZREVRANGE': {
      const z = (mem.get(key) as Map<string, number>) ?? new Map<string, number>()
      return [...z.entries()].sort((a, b) => b[1] - a[1]).map(([m]) => m).slice(Number(rest[0]), Number(rest[1]) + 1)
    }
    case 'MGET':
      return [key, ...rest].map((k) => (mem.get(k) as string | undefined) ?? null)
    default:
      throw new Error(`memory store: unsupported command ${op}`)
  }
}
