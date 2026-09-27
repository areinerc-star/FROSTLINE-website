'use client'

import { useEffect, useState } from 'react'
import { AdminDashboard, AdminOrderRecord } from '@/components/admin-dashboard'
import { OrderRecord } from '@/components/account-modal'
import Link from 'next/link'

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrderRecord[]>([])

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('frostline_orders')
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderRecord['status']) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      localStorage.setItem('frostline_orders', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', color: '#FFFFFF', padding: '2rem 1.5rem', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.85, transition: 'opacity 0.2s' }}>
          <span style={{ color: '#FF2E00' }}>←</span> RETURN TO FROSTLINE STORE
        </Link>
        <span style={{ fontSize: '0.7rem', color: '#888888', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>FROSTLINE MERCHANT PORTAL</span>
      </div>

      <AdminDashboard
        isOpen={true}
        onClose={() => {
          if (typeof window !== 'undefined') window.location.href = '/'
        }}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </div>
  )
}
