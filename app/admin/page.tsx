'use client'

import { useState } from 'react'
import { AdminDashboard, AdminOrderRecord } from '@/components/admin-dashboard'
import { OrderRecord } from '@/components/account-modal'
import Link from 'next/link'

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrderRecord[]>([])
  // Admin password (ADMIN_PASSWORD on Vercel). Kept in memory only — never saved in the browser.
  const [password, setPassword] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadOrders = async (pw: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/orders', { headers: { 'x-admin-password': pw }, cache: 'no-store' })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Could not load orders.')
        setSignedIn(false)
        return
      }
      setOrders(data.orders)
      setSignedIn(true)
    } catch {
      setError('Could not reach the server.')
    } finally {
      setLoading(false)
    }
  }

  // Any status action means you have accepted the payment, which also marks the order's voucher as used.
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderRecord['status']) => {
    setError('')
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id: orderId, status: newStatus, verifyPayment: true }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Could not update the order.')
        return
      }
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)))
    } catch {
      setError('Could not reach the server.')
    }
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', color: '#FFFFFF', padding: '2rem 1.5rem', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.85, transition: 'opacity 0.2s' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF2E00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          RETURN TO FROSTLINE STORE
        </Link>
        <span style={{ fontSize: '0.7rem', color: '#888888', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>FROSTLINE MERCHANT PORTAL</span>
      </div>

      {error && (
        <div role="alert" style={{ maxWidth: '960px', margin: '0 auto 1rem', padding: '0.85rem 1rem', border: '1px solid #FF2E00', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {!signedIn ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            loadOrders(password)
          }}
          style={{ maxWidth: '360px', margin: '4rem auto', display: 'grid', gap: '0.75rem' }}
        >
          <label htmlFor="adminPassword" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888888', fontWeight: 800 }}>
            Admin Password
          </label>
          <input
            id="adminPassword"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ background: '#141414', border: '1px solid #262626', color: '#FFFFFF', padding: '0.7rem 0.85rem', fontSize: '0.9rem' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ background: '#FFFFFF', color: '#000000', border: 'none', padding: '0.8rem', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            {loading ? 'Loading…' : 'Sign In'}
          </button>
        </form>
      ) : (
        <AdminDashboard
          isOpen={true}
          onClose={() => {
            if (typeof window !== 'undefined') window.location.href = '/'
          }}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}
    </div>
  )
}
