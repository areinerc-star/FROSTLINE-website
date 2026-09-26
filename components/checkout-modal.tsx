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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'gcash'>('card')
  const [receiptName, setReceiptName] = useState<string>('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    referenceNumber: '',
  })
  const [orderId, setOrderId] = useState<string>('')

  if (!isOpen) return null

  const subtotal = cart.reduce((sum, p) => sum + p.price, 0)
  const shipping = subtotal > 0 ? 150 : 0
  const total = subtotal + shipping

  const getCardBrand = (num: string): 'VISA' | 'MASTERCARD' | null => {
    const clean = num.replace(/\D/g, '')
    if (clean.startsWith('4')) return 'VISA'
    if (/^5[1-5]/.test(clean) || /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[0-1]\d|2720)/.test(clean)) return 'MASTERCARD'
    return null
  }

  const cardBrand = getCardBrand(formData.cardNumber)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptName(e.target.files[0].name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('processing')
    setTimeout(() => {
      const generatedId = 'FRL-' + Math.floor(100000 + Math.random() * 900000)
      setOrderId(generatedId)
      setStep('success')
    }, 2000)
  }

  const handleFinish = () => {
    setStep('checkout')
    setReceiptName('')
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600 }}>
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
              Securing transaction & verifying order details
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
                <span>Paid via {paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'bank' ? 'Bank Transfer' : 'GCash'}</span>
                <span>{formatPrice(total)}</span>
              </div>
              {formData.referenceNumber && (
                <div style={{ fontSize: '0.78rem', color: 'var(--ink)', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Payment Ref No: <span style={{ fontFamily: 'monospace' }}>{formData.referenceNumber}</span>
                </div>
              )}
              {receiptName && (
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>
                  Attached Receipt: {receiptName}
                </div>
              )}
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
                <span>Total</span>
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
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    minWidth: '130px',
                    padding: '0.75rem 0.5rem',
                    background: paymentMethod === 'card' ? 'var(--ink)' : 'transparent',
                    color: paymentMethod === 'card' ? 'var(--white)' : 'var(--ink)',
                    border: '1px solid var(--ink)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Credit / Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  style={{
                    flex: 1,
                    minWidth: '130px',
                    padding: '0.75rem 0.5rem',
                    background: paymentMethod === 'bank' ? 'var(--ink)' : 'transparent',
                    color: paymentMethod === 'bank' ? 'var(--white)' : 'var(--ink)',
                    border: '1px solid var(--ink)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('gcash')}
                  style={{
                    flex: 1,
                    minWidth: '130px',
                    padding: '0.75rem 0.5rem',
                    background: paymentMethod === 'gcash' ? 'var(--ink)' : 'transparent',
                    color: paymentMethod === 'gcash' ? 'var(--white)' : 'var(--ink)',
                    border: '1px solid var(--ink)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  GCash
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '2fr 1fr 1fr' }}>
                  <div style={{ position: 'relative', gridColumn: 'span 3' }}>
                    <input
                      required={paymentMethod === 'card'}
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      maxLength={19}
                      style={{ ...inputStyle, paddingRight: cardBrand ? '95px' : '0.85rem' }}
                    />
                    {cardBrand && (
                      <span
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          padding: '3px 8px',
                          borderRadius: '3px',
                          background: cardBrand === 'VISA' ? '#1A1F71' : '#EB001B',
                          color: '#FFFFFF',
                        }}
                      >
                        {cardBrand}
                      </span>
                    )}
                  </div>
                  <input
                    required={paymentMethod === 'card'}
                    type="text"
                    name="cardExpiry"
                    placeholder="MM / YY"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    maxLength={5}
                    style={inputStyle}
                  />
                  <input
                    required={paymentMethod === 'card'}
                    type="text"
                    name="cardCvc"
                    placeholder="CVC"
                    value={formData.cardCvc}
                    onChange={handleChange}
                    maxLength={4}
                    style={{ ...inputStyle, gridColumn: 'span 2' }}
                  />
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--hairline)',
                    padding: '1.25rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.85rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Bank Transfer QR Code
                  </div>
                  <div
                    style={{
                      width: '180px',
                      height: '180px',
                      border: '2px dashed var(--hairline)',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1rem',
                      background: '#f9f9f9',
                      position: 'relative',
                    }}
                  >
                    <img
                      src="/images/bank-qr.png"
                      alt="Bank Transfer QR Code"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none'
                        const parent = e.currentTarget.parentElement
                        if (parent && !parent.querySelector('.qr-fallback')) {
                          const fallback = document.createElement('div')
                          fallback.className = 'qr-fallback'
                          fallback.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0.4rem;color:var(--muted);font-size:0.75rem;text-align:center;'
                          fallback.innerHTML = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h-3zM18 18h3v3h-3zM18 15h3v3h-3zM15 18h3v3h-3z"/></svg><span>Scan Bank QR Code</span><span style="font-size:0.65rem;opacity:0.7">(Upload /images/bank-qr.png)</span>'
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  </div>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'left' }}>
                    <input
                      type="text"
                      name="referenceNumber"
                      placeholder="Bank Reference / Transaction No."
                      value={formData.referenceNumber}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                    <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <span style={{ padding: '0.4rem 0.75rem', background: '#eeeeee', border: '1px solid var(--hairline)', borderRadius: '3px', color: 'var(--ink)' }}>
                        {receiptName ? 'Change Receipt' : 'Attach Proof of Payment (Optional)'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                      {receiptName && <span style={{ fontSize: '0.72rem', color: 'var(--ink)' }}>{receiptName}</span>}
                    </label>
                  </div>
                </div>
              )}

              {paymentMethod === 'gcash' && (
                <div
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--hairline)',
                    padding: '1.25rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.85rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#005CE6' }}>
                    GCash QR Code
                  </div>
                  <div
                    style={{
                      width: '180px',
                      height: '180px',
                      border: '2px dashed #005CE6',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1rem',
                      background: '#F0F5FF',
                      position: 'relative',
                    }}
                  >
                    <img
                      src="/images/gcash-qr.png"
                      alt="GCash QR Code"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none'
                        const parent = e.currentTarget.parentElement
                        if (parent && !parent.querySelector('.qr-fallback')) {
                          const fallback = document.createElement('div')
                          fallback.className = 'qr-fallback'
                          fallback.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0.4rem;color:#005CE6;font-size:0.75rem;text-align:center;'
                          fallback.innerHTML = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h-3zM18 18h3v3h-3zM18 15h3v3h-3zM15 18h3v3h-3z"/></svg><span>Scan GCash QR Code</span><span style="font-size:0.65rem;opacity:0.7">(Upload /images/gcash-qr.png)</span>'
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  </div>

                  <a
                    href="gcash://"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#005CE6',
                      color: '#ffffff',
                      padding: '0.5rem 1.2rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                      textDecoration: 'none',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Open GCash App directly ↗
                  </a>

                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'left' }}>
                    <input
                      type="text"
                      name="referenceNumber"
                      placeholder="GCash Reference No. (13 digits)"
                      value={formData.referenceNumber}
                      onChange={handleChange}
                      maxLength={20}
                      style={inputStyle}
                    />
                    <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <span style={{ padding: '0.4rem 0.75rem', background: '#eeeeee', border: '1px solid var(--hairline)', borderRadius: '3px', color: 'var(--ink)' }}>
                        {receiptName ? 'Change Receipt' : 'Attach Receipt Screenshot (Optional)'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                      {receiptName && <span style={{ fontSize: '0.72rem', color: 'var(--ink)' }}>{receiptName}</span>}
                    </label>
                  </div>
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
