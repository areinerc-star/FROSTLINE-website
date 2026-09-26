'use client'

import { useState } from 'react'
import { OrderRecord } from './account-modal'

export interface AdminOrderRecord extends OrderRecord {
  customerName: string
  customerEmail: string
  address: string
  city: string
  referenceNumber?: string
  receiptName?: string
}

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
  orders: AdminOrderRecord[]
  onUpdateOrderStatus: (orderId: string, newStatus: OrderRecord['status'], note?: string) => void
}

export function AdminDashboard({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
}: AdminDashboardProps) {
  const [emailNotification, setEmailNotification] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  if (!isOpen) return null

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Payment Pending' as any).length

  const handleStatusChange = (order: AdminOrderRecord, nextStatus: OrderRecord['status']) => {
    onUpdateOrderStatus(order.id, nextStatus)

    // Trigger simulated email notification popover
    setEmailNotification(
      `📧 EMAIL SENT to ${order.customerEmail}:\n\n"Subject: Order #${order.id} Status Update\nDear ${order.customerName}, your Frostline order status has been updated to: ${nextStatus.toUpperCase()}."`
    )

    setTimeout(() => {
      setEmailNotification(null)
    }, 4500)
  }

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true
    return o.status === filterStatus
  })

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Toast Email Alert */}
      {emailNotification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 500,
            background: '#111827',
            color: '#10B981',
            border: '1px solid #10B981',
            padding: '1rem 1.25rem',
            borderRadius: '6px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            maxWidth: '380px',
            whiteSpace: 'pre-line',
            fontSize: '0.8rem',
            fontWeight: 600,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {emailNotification}
        </div>
      )}

      <div
        style={{
          background: '#0F172A',
          color: '#F8FAFC',
          width: 'min(920px, 95vw)',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '8px',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            fontSize: '1.6rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94A3B8',
          }}
          aria-label="Close admin dashboard"
        >
          &times;
        </button>

        {/* Dashboard Header */}
        <div style={{ borderBottom: '1px solid #334155', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#38BDF8', fontWeight: 700 }}>
            FROSTLINE MERCHANT ADMIN CONTROL
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.2rem' }}>
            Transactions & Payment Verification Dashboard
          </h2>
        </div>

        {/* Analytics Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={cardStyle}>
            <div style={cardLabelStyle}>Total Orders</div>
            <div style={cardValueStyle}>{orders.length}</div>
          </div>
          <div style={cardStyle}>
            <div style={cardLabelStyle}>Total Revenue</div>
            <div style={{ ...cardValueStyle, color: '#34D399' }}>₱{totalRevenue.toLocaleString()}</div>
          </div>
          <div style={cardStyle}>
            <div style={cardLabelStyle}>Pending Verification</div>
            <div style={{ ...cardValueStyle, color: '#FBBF24' }}>{pendingCount}</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Customer Transactions ({filteredOrders.length})</h3>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['all', 'Processing', 'Preparing Shipment', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  border: '1px solid #334155',
                  background: filterStatus === st ? '#38BDF8' : '#1E293B',
                  color: filterStatus === st ? '#0F172A' : '#94A3B8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table / List */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B', border: '1px dashed #334155', borderRadius: '6px' }}>
              No transactions matching filter. When customers place an order, it will appear here instantly!
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '1.25rem',
                  display: 'grid',
                  gap: '0.85rem',
                }}
              >
                {/* Order Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC' }}>
                      Order #{ord.id}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginLeft: '0.75rem' }}>
                      {ord.date}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background:
                          ord.status === 'Delivered'
                            ? '#064E3B'
                            : ord.status === 'Preparing Shipment'
                            ? '#1E3A8A'
                            : '#78350F',
                        color:
                          ord.status === 'Delivered'
                            ? '#34D399'
                            : ord.status === 'Preparing Shipment'
                            ? '#60A5FA'
                            : '#FBBF24',
                      }}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>

                {/* Customer Details & Payment Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: '#0F172A', padding: '0.85rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ color: '#64748B', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>Customer</div>
                    <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{ord.customerName || 'Guest Customer'}</div>
                    <div style={{ color: '#94A3B8' }}>{ord.customerEmail || 'No email provided'}</div>
                    <div style={{ color: '#94A3B8', marginTop: '0.2rem' }}>{ord.address}, {ord.city}</div>
                  </div>

                  <div>
                    <div style={{ color: '#64748B', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>Payment Method</div>
                    <div style={{ fontWeight: 600, color: '#38BDF8' }}>{ord.paymentMethod}</div>
                    {ord.referenceNumber && (
                      <div style={{ color: '#F8FAFC', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                        Ref #: {ord.referenceNumber}
                      </div>
                    )}
                    {ord.receiptName && (
                      <div style={{ color: '#34D399', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                        Attached Proof: {ord.receiptName}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#64748B', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>Total Amount</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34D399' }}>₱{ord.total.toLocaleString()}</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{ord.items.length} item(s)</div>
                  </div>
                </div>

                {/* Status Advancement & Accept Action Bar */}
                <div style={{ borderTop: '1px solid #334155', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    Advance Status & Trigger Customer Email:
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleStatusChange(ord, 'Processing')}
                      disabled={ord.status === 'Processing'}
                      style={actionBtnStyle(ord.status === 'Processing')}
                    >
                      1. Payment Verified
                    </button>
                    <button
                      onClick={() => handleStatusChange(ord, 'Preparing Shipment')}
                      disabled={ord.status === 'Preparing Shipment'}
                      style={actionBtnStyle(ord.status === 'Preparing Shipment')}
                    >
                      2. Preparing Order
                    </button>
                    <button
                      onClick={() => handleStatusChange(ord, 'Delivered')}
                      disabled={ord.status === 'Delivered'}
                      style={actionBtnStyle(ord.status === 'Delivered')}
                    >
                      3. Shipped & Arrived
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#1E293B',
  border: '1px solid #334155',
  padding: '1rem',
  borderRadius: '6px',
}

const cardLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#94A3B8',
  fontWeight: 600,
}

const cardValueStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  marginTop: '0.2rem',
  color: '#F8FAFC',
}

const actionBtnStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '0.4rem 0.75rem',
  borderRadius: '4px',
  border: isActive ? '1px solid #38BDF8' : '1px solid #334155',
  background: isActive ? '#38BDF8' : '#0F172A',
  color: isActive ? '#0F172A' : '#F8FAFC',
  fontSize: '0.72rem',
  fontWeight: 700,
  cursor: isActive ? 'default' : 'pointer',
  opacity: isActive ? 0.7 : 1,
})
