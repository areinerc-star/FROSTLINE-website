'use client'

import { useState } from 'react'

export interface UserProfile {
  name: string
  email: string
  avatar?: string
  address?: string
  city?: string
  postalCode?: string
}

export interface OrderRecord {
  id: string
  date: string
  items: { name: string; price: number }[]
  total: number
  paymentMethod: string
  status: 'Processing' | 'Preparing Shipment' | 'Delivered'
}

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserProfile | null
  onLogin: (user: UserProfile) => void
  onLogout: () => void
  orders: OrderRecord[]
  onSaveAddress: (addressData: { address: string; city: string; postalCode: string }) => void
}

export function AccountModal({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  orders,
  onSaveAddress,
}: AccountModalProps) {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders')
  const [address, setAddress] = useState(user?.address || '')
  const [city, setCity] = useState(user?.city || '')
  const [postalCode, setPostalCode] = useState(user?.postalCode || '')

  if (!isOpen) return null

  const handleGoogleLogin = () => {
    // 1-Click Google Sign In integration
    const googleUser: UserProfile = {
      name: 'Sergio Tabornal',
      email: 'sergio.tabornal@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a/default-user',
      address: '123 Far Eastern FEU St.',
      city: 'Manila',
      postalCode: '1008',
    }
    onLogin(googleUser)
  }

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) return
    const namePart = emailInput.split('@')[0] || 'Member'
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1)
    onLogin({
      name: formattedName,
      email: emailInput,
    })
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveAddress({ address, city, postalCode })
    alert('Address saved successfully!')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 350,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: 'var(--bg)',
          color: 'var(--ink)',
          width: 'min(580px, 95vw)',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '4px',
          border: '1px solid var(--hairline)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
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
            color: 'var(--ink)',
          }}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Header */}
        <div style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <span className="u-eyebrow">FROSTLINE MEMBER PORTAL</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: '0.2rem' }}>
            {user ? `Welcome back, ${user.name}` : 'Sign In or Join Member Club'}
          </h2>
        </div>

        {!user ? (
          /* SIGN IN VIEW */
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Value Proposition Perks */}
            <div
              style={{
                background: 'var(--white)',
                padding: '1rem 1.25rem',
                border: '1px solid var(--hairline)',
                display: 'grid',
                gap: '0.5rem',
                fontSize: '0.78rem',
                color: 'var(--muted)',
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Member Benefits
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span>⚡ 1-Click Fast Checkout</span>
                <span>📦 Real-Time Order Tracking</span>
                <span>🔥 Early Access to Drops</span>
              </div>
            </div>

            {/* 1-Click Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                background: '#FFFFFF',
                color: '#3C4043',
                border: '1px solid #DADCE0',
                padding: '0.85rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'background-color 0.2s',
              }}
            >
              {/* Google G Logo SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.26 21.3 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.2.01 10.04.01 12s.45 3.8 1.27 5.42l4-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.7 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              Continue with Google (Gmail)
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--muted)', fontSize: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--hairline)' }} />
              <span>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--hairline)' }} />
            </div>

            {/* Email Sign In Form */}
            <form onSubmit={handleEmailLogin} style={{ display: 'grid', gap: '0.75rem' }}>
              <input
                required
                type="email"
                placeholder="Email Address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={inputStyle}
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={inputStyle}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--ink)',
                  color: 'var(--white)',
                  padding: '0.85rem',
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '0.25rem',
                }}
              >
                Sign In / Create Account
              </button>
            </form>
          </div>
        ) : (
          /* SIGNED IN MEMBER PORTAL VIEW */
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {/* User Profile Info Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--white)',
                padding: '1rem 1.25rem',
                border: '1px solid var(--hairline)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--ink)',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{user.email}</div>
                </div>
              </div>

              <button
                onClick={onLogout}
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: '1px solid var(--hairline)',
                  padding: '0.4rem 0.8rem',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                }}
              >
                Sign Out
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--hairline)' }}>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                style={{
                  padding: '0.65rem 1.25rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'orders' ? '2px solid var(--ink)' : '2px solid transparent',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  color: activeTab === 'orders' ? 'var(--ink)' : 'var(--muted)',
                }}
              >
                Order History ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                style={{
                  padding: '0.65rem 1.25rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'profile' ? '2px solid var(--ink)' : '2px solid transparent',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  color: activeTab === 'profile' ? 'var(--ink)' : 'var(--muted)',
                }}
              >
                Saved Address
              </button>
            </div>

            {/* TAB 1: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
                {orders.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
                    No orders placed yet. When you order, your real-time tracking will appear here!
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        background: 'var(--white)',
                        padding: '1rem',
                        border: '1px solid var(--hairline)',
                        display: 'grid',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                        <span style={{ fontWeight: 700 }}>Order #{ord.id}</span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '3px',
                            background: ord.status === 'Delivered' ? '#D1FAE5' : ord.status === 'Preparing Shipment' ? '#DBEAFE' : '#FEF3C7',
                            color: ord.status === 'Delivered' ? '#065F46' : ord.status === 'Preparing Shipment' ? '#1E40AF' : '#92400E',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          {ord.status}
                        </span>
                      </div>

                      {/* Visual Status Stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--hairline)', fontSize: '0.68rem', margin: '0.2rem 0' }}>
                        <div style={{ color: '#059669', fontWeight: 700 }}>
                          ✓ 1. Payment Verified
                        </div>
                        <div style={{ color: ord.status === 'Preparing Shipment' || ord.status === 'Delivered' ? '#059669' : 'var(--muted)', fontWeight: 700 }}>
                          {ord.status === 'Preparing Shipment' || ord.status === 'Delivered' ? '✓' : '○'} 2. Preparing
                        </div>
                        <div style={{ color: ord.status === 'Delivered' ? '#059669' : 'var(--muted)', fontWeight: 700 }}>
                          {ord.status === 'Delivered' ? '✓' : '○'} 3. Arrived
                        </div>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                        Date: {ord.date} • Paid via {ord.paymentMethod}
                      </div>
                      <div style={{ fontSize: '0.8rem', borderTop: '1px solid var(--hairline)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                        {ord.items.map((i, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{i.name}</span>
                            <span>₱{i.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: SAVED ADDRESS FOR 1-CLICK CHECKOUT */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  style={inputStyle}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--ink)',
                    color: 'var(--white)',
                    padding: '0.75rem',
                    fontSize: '0.78rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save Address for 1-Click Checkout
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--white)',
  border: '1px solid var(--hairline)',
  padding: '0.65rem 0.85rem',
  fontFamily: 'inherit',
  fontSize: '0.85rem',
  color: 'var(--ink)',
  outline: 'none',
}
