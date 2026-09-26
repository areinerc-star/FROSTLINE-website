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
    <div style={{ background: '#090D16', minHeight: '100vh', color: '#FFFFFF', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#38BDF8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
          ← Back to FROSTLINE Website
        </Link>
        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>FROSTLINE Merchant Portal</span>
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
