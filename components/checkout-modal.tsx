'use client'

import { useState } from 'react'
import { Product, formatPrice } from '@/lib/products'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cart: Product[]
  onSuccess: () => void
}

export function CheckoutModal({ isOpen, onClose, cart, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eft'>('card')
  const [selectedBank, setSelectedBank] = useState<string>('Capitec')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })
  const [orderId, setOrderId] = useState<string>('')

  if (!isOpen) return null

  const subtotal = cart.reduce((sum, p) => sum + p.price, 0)
  const shipping = subtotal > 0 ? 150 : 0
  const total = subtotal + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('processing')
    setTimeout(() => {
      const generatedId = 'ORGC-' + Math.floor(100000 + Math.random() * 900000)
      setOrderId(generatedId)
      setStep('success')
    }, 2000)
  }

  const handleFinish = () => {
    setStep('checkout')
    onSuccess()
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'processing') onClose()
      }}
    >
      <div
        style={{
          background: 'var(--bg)',
          color: 'var(--ink)',
          width: 'min(640px, 95vw)',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '4px',
          border: '1px solid var(--hairline)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--hairline)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <span className="u-eyebrow">Odd Ritual Golf Club</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: '0.2rem' }}>
              {step === 'success' ? 'Order Confirmed' : 'Checkout'}
            </h2>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              style={{
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
          )}
        </div>

        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '3px solid var(--hairline)',
                borderTopColor: 'var(--blue)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Processing Payment...</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Securing transaction with payment gateway
            </p>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'var(--blue)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1.5rem',
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Thank You For Your Order
            </h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
              Order Reference: <strong style={{ color: 'var(--ink)' }}>#{orderId}</strong>
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '420px', marginInline: 'auto' }}>
              We have sent a confirmation email to <strong>{formData.email || 'your email'}</strong>. Your gear will be prepared and shipped within 2-3 business days.
            </p>

            <div
              style={{
                margin: '2rem 0',
                padding: '1.25rem',
                background: 'var(--white)',
                border: '1px solid var(--hairline)',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <span>Paid via {paymentMethod === 'card' ? 'Credit Card' : `Instant EFT (${selectedBank})`}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                Shipping to: {formData.address || 'Standard Delivery Address'}, {formData.city}
              </div>
            </div>

            <button
              onClick={handleFinish}
              style={{
                background: 'var(--ink)',
                color: 'var(--white)',
                padding: '0.9rem 2.5rem',
                fontSize: '0.8rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}

        {step === 'checkout' && (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Order Summary Summary Box */}
            <div
              style={{
                background: 'var(--white)',
                padding: '1rem 1.25rem',
                border: '1px solid var(--hairline)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                }}
              >
                <span>Items ({cart.length})</span>
                <span>Subtotal: {formatPrice(subtotal)}</span>
              </div>
              <div
                style={{
                  maxHeight: '120px',
                  overflowY: 'auto',
                  borderTop: '1px solid var(--hairline)',
                  paddingTop: '0.5rem',
                  fontSize: '0.78rem',
                  display: 'grid',
                  gap: '0.4rem',
                }}
              >
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'uppercase' }}>{item.name}</span>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--hairline)',
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                <span>Total (incl. R150 shipping)</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--muted)' }}>
                1. Shipping Address
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <input
                  required
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  required
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ ...inputStyle, gridColumn: 'span 2' }}
                />
                <input
                  required
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  required
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--muted)' }}>
                2. Payment Method
              </h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: paymentMethod === 'card' ? 'var(--ink)' : 'transparent',
                    color: paymentMethod === 'card' ? 'var(--white)' : 'var(--ink)',
                    border: '1px solid var(--ink)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Credit / Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('eft')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: paymentMethod === 'eft' ? 'var(--ink)' : 'transparent',
                    color: paymentMethod === 'eft' ? 'var(--white)' : 'var(--ink)',
                    border: '1px solid var(--ink)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Instant EFT
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '2fr 1fr 1fr' }}>
                  <input
                    required
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number (4532 ...)"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength={19}
                    style={{ ...inputStyle, gridColumn: 'span 3' }}
                  />
                  <input
                    required
                    type="text"
                    name="cardExpiry"
                    placeholder="MM / YY"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    maxLength={5}
                    style={inputStyle}
                  />
                  <input
                    required
                    type="text"
                    name="cardCvc"
                    placeholder="CVC"
                    value={formData.cardCvc}
                    onChange={handleChange}
                    maxLength={4}
                    style={{ ...inputStyle, gridColumn: 'span 2' }}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>
                    Select South African Bank:
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    style={{
                      ...inputStyle,
                      width: '100%',
                      appearance: 'auto',
                    }}
                  >
                    <option value="Capitec">Capitec Bank</option>
                    <option value="FNB">First National Bank (FNB)</option>
                    <option value="Standard Bank">Standard Bank</option>
                    <option value="Absa">Absa Bank</option>
                    <option value="Nedbank">Nedbank</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'var(--ink)',
                color: 'var(--white)',
                padding: '1rem',
                fontSize: '0.8rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                marginTop: '0.5rem',
              }}
            >
              Pay {formatPrice(total)}
            </button>
          </form>
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
