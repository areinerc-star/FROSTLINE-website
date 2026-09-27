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
  const pendingCount = orders.filter((o) => o.status === 'Processing' || o.status === ('Payment Pending' as any)).length

  const handleStatusChange = (order: AdminOrderRecord, nextStatus: OrderRecord['status']) => {
    onUpdateOrderStatus(order.id, nextStatus)

    // Trigger simulated email notification popover
    setEmailNotification(
      `📧 EMAIL SENT to ${order.customerEmail}:\n\n"Subject: Order #${order.id} Status Update\nDear ${order.customerName}, your FROSTLINE order status has been updated to: ${nextStatus.toUpperCase()}."`
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
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'inherit',
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
            top: '24px',
            right: '24px',
            zIndex: 500,
            background: '#111111',
            color: '#FFFFFF',
            border: '1px solid #FF2E00',
            padding: '1.2rem 1.5rem',
            borderRadius: '4px',
            boxShadow: '0 12px 32px rgba(255, 46, 0, 0.25)',
            maxWidth: '400px',
            whiteSpace: 'pre-line',
            fontSize: '0.82rem',
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          {emailNotification}
        </div>
      )}

      <div
        style={{
          background: '#0A0A0A',
          color: '#FFFFFF',
          width: 'min(960px, 95vw)',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '4px',
          border: '1px solid #262626',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8)',
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
            color: '#888888',
            transition: 'color 0.2s',
          }}
          aria-label="Close admin dashboard"
        >
          &times;
        </button>

        {/* Dashboard Header */}
        <div style={{ borderBottom: '1px solid #262626', paddingBottom: '1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src="/FROSTLINEwhiteLOGOonly.png"
            alt="Frostline Icon"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FF2E00', fontWeight: 800 }}>
              FROSTLINE MERCHANT ADMIN CONTROL
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.01em', textTransform: 'uppercase', marginTop: '0.15rem', color: '#FFFFFF' }}>
              TRANSACTIONS & PAYMENT VERIFICATION
            </h2>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={cardStyle}>
            <div style={cardLabelStyle}>TOTAL ORDERS</div>
            <div style={cardValueStyle}>{orders.length}</div>
          </div>
          <div style={cardStyle}>
            <div style={cardLabelStyle}>TOTAL REVENUE</div>
            <div style={{ ...cardValueStyle, color: '#FFFFFF' }}>₱{totalRevenue.toLocaleString()}</div>
          </div>
          <div style={cardStyle}>
            <div style={cardLabelStyle}>PENDING VERIFICATION</div>
            <div style={{ ...cardValueStyle, color: '#FF2E00' }}>{pendingCount}</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            CUSTOMER TRANSACTIONS ({filteredOrders.length})
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'Processing', label: 'Pending Payment' },
              { id: 'Preparing Shipment', label: 'Preparing' },
              { id: 'Delivered', label: 'Delivered' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '2px',
                  border: filterStatus === st.id ? '1px solid #FFFFFF' : '1px solid #262626',
                  background: filterStatus === st.id ? '#FFFFFF' : '#141414',
                  color: filterStatus === st.id ? '#000000' : '#888888',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table / List */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#666666', border: '1px dashed #262626', borderRadius: '4px', fontSize: '0.85rem' }}>
              No transactions found under this filter. When customers place an order, it will appear here in real time!
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  background: '#141414',
                  border: '1px solid #262626',
                  borderRadius: '4px',
                  padding: '1.35rem',
                  display: 'grid',
                  gap: '1rem',
                }}
              >
                {/* Order Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.04em', color: '#FFFFFF' }}>
                      ORDER #{ord.id}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#888888', marginLeft: '0.75rem' }}>
                      {ord.date}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '2px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background:
                          ord.status === 'Delivered'
                            ? '#FFFFFF'
                            : ord.status === 'Preparing Shipment'
                            ? '#1E3A8A'
                            : '#FF2E00',
                        color:
                          ord.status === 'Delivered'
                            ? '#000000'
                            : ord.status === 'Preparing Shipment'
                            ? '#FFFFFF'
                            : '#FFFFFF',
                      }}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>

                {/* Customer Details & Payment Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', background: '#0A0A0A', padding: '1rem', borderRadius: '4px', border: '1px solid #1F1F1F', fontSize: '0.82rem' }}>
                  <div>
                    <div style={{ color: '#666666', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.2rem' }}>Customer</div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{ord.customerName || 'Guest Customer'}</div>
                    <div style={{ color: '#AAAAAA', fontSize: '0.78rem' }}>{ord.customerEmail || 'No email provided'}</div>
                    <div style={{ color: '#888888', marginTop: '0.2rem', fontSize: '0.75rem' }}>{ord.address}, {ord.city}</div>
                  </div>

                  <div>
                    <div style={{ color: '#666666', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.2rem' }}>Payment Method</div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{ord.paymentMethod}</div>
                    {ord.referenceNumber && (
                      <div style={{ color: '#FF2E00', fontFamily: 'monospace', fontWeight: 700, marginTop: '0.2rem', fontSize: '0.8rem' }}>
                        Ref #: {ord.referenceNumber}
                      </div>
                    )}
                    {ord.receiptName && (
                      <div style={{ color: '#AAAAAA', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                        Attached Proof: {ord.receiptName}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#666666', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.2rem' }}>Total Amount</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>₱{ord.total.toLocaleString()}</div>
                    <div style={{ color: '#888888', fontSize: '0.75rem' }}>{ord.items.length} item(s)</div>
                  </div>
                </div>

                {/* Status Advancement & Accept Action Bar */}
                <div style={{ borderTop: '1px solid #262626', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#888888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Update Status & Send Customer Email Alert:
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleStatusChange(ord, 'Processing')}
                      style={actionBtnStyle(ord.status === 'Processing')}
                    >
                      1. Accept & Verify Payment
                    </button>
                    <button
                      onClick={() => handleStatusChange(ord, 'Preparing Shipment')}
                      style={actionBtnStyle(ord.status === 'Preparing Shipment')}
                    >
                      2. Mark Preparing
                    </button>
                    <button
                      onClick={() => handleStatusChange(ord, 'Delivered')}
                      style={actionBtnStyle(ord.status === 'Delivered')}
                    >
                      3. Mark Shipped & Arrived
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
  background: '#141414',
  border: '1px solid #262626',
  padding: '1.25rem',
  borderRadius: '4px',
}

const cardLabelStyle: React.CSSProperties = {
  fontSize: '0.68rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#888888',
  fontWeight: 800,
}

const cardValueStyle: React.CSSProperties = {
  fontSize: '1.6rem',
  fontWeight: 900,
  marginTop: '0.25rem',
  color: '#FFFFFF',
  letterSpacing: '-0.02em',
}

const actionBtnStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '0.5rem 0.9rem',
  borderRadius: '2px',
  border: isActive ? '1px solid #FF2E00' : '1px solid #333333',
  background: isActive ? '#FF2E00' : '#0A0A0A',
  color: '#FFFFFF',
  fontSize: '0.72rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.2s',
})
