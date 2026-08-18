'use client'

import { useEffect } from 'react'
import { Product, formatPrice } from '@/lib/products'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart: Product[]
  onCheckout: () => void
}

export function CartDrawer({ isOpen, onClose, cart, onCheckout }: CartDrawerProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const total = cart.reduce((sum, p) => sum + p.price, 0)

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'is-open' : ''}`}
        id="drawerOverlay"
        onClick={onClose}
      />
      <aside
        className={`drawer ${isOpen ? 'is-open' : ''}`}
        id="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="drawer__head">
          <h3>Cart</h3>
          <button
            className="close-btn"
            id="drawerClose"
            aria-label="Close cart"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="drawer__items" id="drawerItems">
          {cart.length === 0 ? (
            <p className="drawer__empty">Your cart is empty.</p>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="drawer__item">
                <span>{item.name}</span>
                <span>{formatPrice(item.price)}</span>
              </div>
            ))
          )}
        </div>
        <div className="drawer__foot">
          <div className="drawer__total">
            <span>Total</span>
            <span id="drawerTotal">{formatPrice(total)}</span>
          </div>
          <button
            className="drawer__checkout"
            disabled={cart.length === 0}
            onClick={() => {
              if (cart.length > 0) {
                onCheckout()
              }
            }}
            style={{ opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            Checkout
          </button>
        </div>
      </aside>
    </>
  )
}

