'use client'

import { useEffect, useState } from 'react'
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
import { AccountModal, UserProfile, OrderRecord } from '@/components/account-modal'
import { AdminDashboard, AdminOrderRecord } from '@/components/admin-dashboard'
import { ScrollObserver } from '@/components/scroll-observer'
import { Product } from '@/lib/products'

export default function Page() {
  const [cart, setCart] = useState<Product[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isCurtainOpen, setIsCurtainOpen] = useState(false)

  // Account & Order tracking state
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<AdminOrderRecord[]>([])

  // Load saved user session & order history from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('frostline_user')
      if (savedUser) setUser(JSON.parse(savedUser))

      const savedOrders = localStorage.getItem('frostline_orders')
      if (savedOrders) setOrders(JSON.parse(savedOrders))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser)
    localStorage.setItem('frostline_user', JSON.stringify(newUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('frostline_user')
  }

  const handleSaveAddress = (addressData: { address: string; city: string; postalCode: string }) => {
    if (!user) return
    const updatedUser = { ...user, ...addressData }
    setUser(updatedUser)
    localStorage.setItem('frostline_user', JSON.stringify(updatedUser))
  }

  const handleRecordOrder = (newOrder: OrderRecord) => {
    const adminRecord: AdminOrderRecord = {
      ...newOrder,
      customerName: user?.name || 'Customer',
      customerEmail: user?.email || 'customer@gmail.com',
      address: user?.address || 'Delivery Address',
      city: user?.city || 'Manila',
    }

    setOrders((prev) => {
      const updated = [adminRecord, ...prev]
      localStorage.setItem('frostline_orders', JSON.stringify(updated))
      return updated
    })
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderRecord['status']) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      localStorage.setItem('frostline_orders', JSON.stringify(updated))
      return updated
    })
  }

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
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
      />
      <main id="top">
        <Hero onShopNowClick={handleShopNowClick} />
        <Statement />
        <FeaturedCarousel onAddToCart={handleAddToCart} />
        <Editorial />
        <GivingBack />
      </main>
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
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
        user={user}
        onRecordOrder={handleRecordOrder}
        onOpenAccount={() => setIsAccountOpen(true)}
      />
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        orders={orders}
        onSaveAddress={handleSaveAddress}
      />
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
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



