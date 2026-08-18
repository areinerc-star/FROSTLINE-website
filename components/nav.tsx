'use client'

import { useEffect, useState } from 'react'

interface NavProps {
  cartCount: number
  onOpenCart: () => void
  onShopNowClick?: (e: React.MouseEvent) => void
}

export function Nav({ cartCount, onOpenCart, onShopNowClick }: NavProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > window.innerHeight * 0.6)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`nav ${isScrolled ? 'is-scrolled' : ''}`} id="nav">
      <a className="nav__logo" href="#top" aria-label="Frostline home" style={{ display: 'flex', alignItems: 'center', height: '44px' }}>
        <img
          src="/FROSTLINE_Website_Logo_black.png"
          alt="FROSTLINE Logo"
          className="nav__logo-img"
          style={{ height: '44px', maxHeight: '44px', minHeight: '44px', width: 'auto', objectFit: 'contain', display: 'block' }}
        />
      </a>
      <nav className="nav__right" aria-label="Primary">
        <a className="nav__link nav__shop" href="#products" onClick={onShopNowClick}>
          Shop Now
        </a>
        <button
          className="nav__link"
          id="cartToggle"
          aria-haspopup="dialog"
          onClick={onOpenCart}
        >
          Cart<span className="cart-count" id="cartCount">({cartCount})</span>
        </button>
      </nav>
    </header>
  )
}

