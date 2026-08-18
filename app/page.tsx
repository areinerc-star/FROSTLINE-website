'use client'

import { useState } from 'react'
import { Nav } from '@/components/nav'
import { Hero } from '@/components/hero'
import { Statement } from '@/components/statement'
import { FeaturedCarousel } from '@/components/featured-carousel'
import { ShopGrid } from '@/components/shop-grid'
import { Editorial } from '@/components/editorial'
import { GivingBack } from '@/components/giving-back'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutModal } from '@/components/checkout-modal'
import { ScrollObserver } from '@/components/scroll-observer'
import { Product } from '@/lib/products'

export default function Page() {
  const [cart, setCart] = useState<Product[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isCurtainOpen, setIsCurtainOpen] = useState(false)

  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product])
    setIsDrawerOpen(true)
  }

  const handleOpenCheckout = () => {
    setIsDrawerOpen(false)
    setIsCheckoutOpen(true)
  }

  const handlePaymentSuccess = () => {
    setCart([])
  }

  const handleShopNowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsCurtainOpen(true)
  }

  return (
    <>
      <Nav
        cartCount={cart.length}
        onOpenCart={() => setIsDrawerOpen(true)}
        onShopNowClick={handleShopNowClick}
      />
      <main id="top">
        <Hero onShopNowClick={handleShopNowClick} />
        <Statement />
        <FeaturedCarousel onAddToCart={handleAddToCart} />
        <Editorial />
        <GivingBack />
      </main>
      <Footer />
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        cart={cart}
        onCheckout={handleOpenCheckout}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onSuccess={handlePaymentSuccess}
      />
      <ScrollObserver />

      {/* Dim overlay over hero page */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 140,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          opacity: isCurtainOpen ? 1 : 0,
          pointerEvents: isCurtainOpen ? 'auto' : 'none',
          transition: 'opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={() => setIsCurtainOpen(false)}
      />

      {/* Destination product collection sliding vertically from top translateY(-100%) -> translateY(0) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 150,
          backgroundColor: '#FFFFFF',
          transform: isCurtainOpen ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: isCurtainOpen ? 'auto' : 'none',
          transition: 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}
      >
        <ShopGrid
          onAddToCart={handleAddToCart}
          onClose={() => setIsCurtainOpen(false)}
        />
      </div>
    </>
  )
}



