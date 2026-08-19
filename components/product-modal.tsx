'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { GridProduct, GRID_PRODUCTS } from './shop-grid'
import { Product, formatPrice } from '@/lib/products'

interface ProductModalProps {
  product: GridProduct | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
  onSelectProduct?: (product: GridProduct) => void
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onSelectProduct,
}: ProductModalProps) {
  // -------------------------------------------------------------
  // ALL REACT HOOKS DECLARED UNCONDITIONALLY AT THE VERY TOP LEVEL
  // -------------------------------------------------------------

  // 1. State hooks
  const [selectedSize, setSelectedSize] = useState('M')
  const [activeAccordion, setActiveAccordion] = useState<'details' | 'care' | null>('details')
  const [mounted, setMounted] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next')
  const [isSlideAnimating, setIsSlideAnimating] = useState(false)
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null)
  const [activeProduct, setActiveProduct] = useState<GridProduct | null>(product)

  // 2. Ref hooks
  const containerRef = useRef<HTMLDivElement>(null)

  // 3. Effect hooks

  // SSR safety mount effect
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll and reset modal container scrollTop on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (containerRef.current) {
        containerRef.current.scrollTop = 0
      }
    } else {
      document.body.style.overflow = ''
      setLightboxIndex(null)
      setIsSlideAnimating(false)
      setOutgoingIndex(null)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, product])

  // Sync active product when product prop updates
  useEffect(() => {
    if (product) {
      setActiveProduct(product)
      if (containerRef.current) {
        containerRef.current.scrollTop = 0
      }
    }
  }, [product])

  // Derived values for image lists
  const currentProduct = activeProduct
  const heroImage = currentProduct ? (currentProduct.lifestyleImg || currentProduct.flatImg) : ''
  const detailGridImages = currentProduct
    ? [
        currentProduct.flatImg,
        currentProduct.lifestyleImg,
        '/images/editorial-detail.png',
        '/images/editorial-course.png',
      ]
    : []
  const breakoutImage = '/images/editorial-course.png'
  const allImages = [
    heroImage,
    ...detailGridImages,
    breakoutImage,
  ]

  const handleLightboxNext = () => {
    if (lightboxIndex === null || isSlideAnimating || allImages.length === 0) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const nextIdx = (lightboxIndex + 1) % allImages.length

    if (prefersReduced) {
      setLightboxIndex(nextIdx)
      return
    }

    setOutgoingIndex(lightboxIndex)
    setSlideDirection('next')
    setIsSlideAnimating(true)
    setLightboxIndex(nextIdx)

    setTimeout(() => {
      setOutgoingIndex(null)
      setIsSlideAnimating(false)
    }, 650)
  }

  const handleLightboxPrev = () => {
    if (lightboxIndex === null || isSlideAnimating || allImages.length === 0) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const prevIdx = (lightboxIndex - 1 + allImages.length) % allImages.length

    if (prefersReduced) {
      setLightboxIndex(prevIdx)
      return
    }

    setOutgoingIndex(lightboxIndex)
    setSlideDirection('prev')
    setIsSlideAnimating(true)
    setLightboxIndex(prevIdx)

    setTimeout(() => {
      setOutgoingIndex(null)
      setIsSlideAnimating(false)
    }, 650)
  }

  // Handle keyboard events (Escape to close, Arrow keys for vertical slide navigation)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') {
        setLightboxIndex(null)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleLightboxNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handleLightboxPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, isSlideAnimating, allImages.length])

  // -------------------------------------------------------------
  // ALL HOOKS ARE UNCONDITIONALLY EXECUTED BEFORE ANY RETURN!
  // -------------------------------------------------------------

  if (!mounted) return null
  if (!activeProduct) return null

  const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
  const recommendations = GRID_PRODUCTS.filter((p) => p.id !== activeProduct.id).slice(0, 3)

  const handleAdd = () => {
    onAddToCart(activeProduct)
    onClose()
  }

  const isVisible = isOpen && product !== null

  const modalJSX = (
    <>
      {/* Dim backdrop overlay */}
      <div
        className="product-modal-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99990,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
          visibility: isVisible ? 'visible' : 'hidden',
          transition: 'opacity 650ms cubic-bezier(0.22, 1, 0.36, 1), visibility 650ms step-end',
        }}
      />

      {/* Slide-UP modal container portalled directly to document.body */}
      <div
        ref={containerRef}
        className="product-modal-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          backgroundColor: '#FFFFFF',
          color: '#111111',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          pointerEvents: isVisible ? 'auto' : 'none',
          visibility: isVisible ? 'visible' : 'hidden',
          transition: 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), visibility 650ms step-end',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top sticky header bar with FROSTLINE Logo */}
        <div className="product-modal-topbar">
          <a
            href="#top"
            className="nav__logo"
            aria-label="Frostline home"
            onClick={(e) => {
              e.preventDefault()
              onClose()
            }}
            style={{ display: 'flex', alignItems: 'center', height: '44px' }}
          >
            <img
              src="/FROSTLINE_Website_Logo_black.png"
              alt="FROSTLINE Logo"
              className="nav__logo-img"
              style={{
                height: '44px',
                maxHeight: '44px',
                minHeight: '44px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'none',
              }}
            />
          </a>
          <button
            onClick={onClose}
            className="product-modal-close-btn"
            aria-label="Close product details"
          >
            CLOSE ✕
          </button>
        </div>

        {/* Modal Main Scroll Viewport */}
        <div className="product-modal-body">
          {/* SECTION 1 & 2: 2-Column Split (Left: Hero Image + 2-Column Detail Grid, Right: Sticky Info Panel) */}
          <div className="product-modal-split">
            {/* Left Column (58% width): Hero Image + 2-Column Detail Grid */}
            <div className="product-modal-left-col">
              {/* Hero product image (click opens full-bleed lightbox index 0) */}
              <div
                className="product-modal-hero-wrap"
                onClick={() => setLightboxIndex(0)}
                style={{ cursor: 'pointer' }}
                title="Click to view full image lightbox"
              >
                <img src={heroImage} alt={activeProduct.name} className="product-modal-hero-img" />
              </div>

              {/* 2-column image grid of detail photos flowing on scroll (click opens lightbox) */}
              <div className="product-modal-detail-grid">
                {detailGridImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="product-modal-grid-cell"
                    onClick={() => setLightboxIndex(idx + 1)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view full image lightbox"
                  >
                    <img src={src} alt={`${activeProduct.name} detail ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (42% width): Sticky Pinned Info Panel */}
            <div className="product-modal-right-col">
              <div className="product-modal-sticky-panel">
                <div className="product-modal-info-header">
                  <h1 className="product-modal-title">{activeProduct.name}</h1>
                  <span className="product-modal-price">{formatPrice(activeProduct.price)}</span>
                </div>
                <span className="product-modal-sku">({activeProduct.sku})</span>

                <p className="product-modal-desc">
                  Crafted from heavyweight organic cotton with a refined vintage silhouette. Designed with heritage craftsmanship and tailored for effortless style on and off the course.
                </p>

                <div className="product-modal-divider" />

                {/* Collapsed Accordions */}
                <div className="product-modal-accordions">
                  <div className="accordion-item">
                    <button
                      className="accordion-header"
                      onClick={() => setActiveAccordion(activeAccordion === 'details' ? null : 'details')}
                    >
                      <span>GARMENT DETAILS</span>
                      <span className="accordion-icon">{activeAccordion === 'details' ? '−' : '+'}</span>
                    </button>
                    {activeAccordion === 'details' && (
                      <div className="accordion-body">
                        <ul>
                          <li>100% Premium Heavyweight Organic Cotton (400gsm)</li>
                          <li>Custom tonal embroidery on left chest</li>
                          <li>Reinforced ribbed collar & cuffs for longevity</li>
                          <li>Designed & ethically produced in South Africa</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="accordion-item">
                    <button
                      className="accordion-header"
                      onClick={() => setActiveAccordion(activeAccordion === 'care' ? null : 'care')}
                    >
                      <span>WASH CARE</span>
                      <span className="accordion-icon">{activeAccordion === 'care' ? '−' : '+'}</span>
                    </button>
                    {activeAccordion === 'care' && (
                      <div className="accordion-body">
                        <ul>
                          <li>Machine wash cold inside out (30°C max)</li>
                          <li>Do not bleach or tumble dry</li>
                          <li>Cool iron on reverse side, avoiding embroidery</li>
                          <li>Hang dry in shade to preserve garment color</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="product-modal-spacer" />

                {/* Size Selector + Add to Cart pinned near bottom of right panel */}
                <div className="product-modal-buy-section">
                  <div className="product-modal-size-row">
                    <span className="product-modal-size-label">SIZE:</span>
                    <div className="product-modal-sizes">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          className={`size-btn ${selectedSize === size ? 'is-selected' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="product-modal-add-btn" onClick={handleAdd}>
                    ADD TO CART — {formatPrice(activeProduct.price)}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Full-Width Breakout Image (click opens lightbox) */}
          <div
            className="product-modal-breakout-section"
            onClick={() => setLightboxIndex(allImages.length - 1)}
            style={{ cursor: 'pointer' }}
            title="Click to view full image lightbox"
          >
            <img src={breakoutImage} alt={`${activeProduct.name} lifestyle breakout`} className="product-modal-breakout-img" />
          </div>

          {/* SECTION 4: "COMPLETE THE LOOK" 3-Column Recommendations */}
          <div className="product-modal-complete-look">
            <div className="complete-look-header">
              <span className="u-eyebrow">( RECOMMENDATIONS )</span>
              <h3 className="complete-look-title">COMPLETE THE LOOK</h3>
            </div>

            <div className="complete-look-grid">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="complete-look-tile"
                  onClick={() => {
                    if (onSelectProduct) onSelectProduct(rec)
                  }}
                >
                  <div className="complete-look-img-wrap">
                    <img src={rec.flatImg} alt={rec.name} className="complete-look-flat-img" />
                    <img src={rec.lifestyleImg} alt={`${rec.name} lifestyle`} className="complete-look-lifestyle-img" />
                    <div className="complete-look-sku-overlay">
                      <span>({rec.sku})</span>
                    </div>
                    <div className="complete-look-view-tag">
                      ‹ VIEW PRODUCT ›
                    </div>
                  </div>
                  <div className="complete-look-info">
                    <span className="complete-look-name">{rec.name}</span>
                    <span className="complete-look-price">{formatPrice(rec.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Viewport Full-Bleed Lightbox Viewport matching IDEALREFERENCE.mp4 */}
      {lightboxIndex !== null && (
        <div
          className="modal-lightbox-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            backgroundColor: '#000000',
            color: '#FFFFFF',
            overflow: 'hidden',
          }}
        >
          {/* Top sticky header bar visually overlapping the sliding image track */}
          <div
            className="product-modal-topbar"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderBottom: 'none',
              minHeight: '60px',
              padding: '1rem var(--gutter)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <a
              href="#top"
              className="nav__logo"
              aria-label="Frostline home"
              onClick={(e) => {
                e.preventDefault()
                setLightboxIndex(null)
                onClose()
              }}
              style={{ display: 'flex', alignItems: 'center', height: '44px' }}
            >
              <img
                src="/FROSTLINE_Website_Logo_black.png"
                alt="FROSTLINE Logo"
                className="nav__logo-img"
                style={{
                  height: '44px',
                  maxHeight: '44px',
                  minHeight: '44px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </a>
            <button
              onClick={() => setLightboxIndex(null)}
              className="product-modal-close-btn"
              aria-label="Close lightbox"
              style={{
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                background: 'rgba(0, 0, 0, 0.25)',
              }}
            >
              CLOSE ✕
            </button>
          </div>

          {/* Main Full-Bleed Image Viewport with Directional Vertical Slide Transition */}
          <div
            className="lightbox-main-viewport"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden',
              backgroundColor: '#0a0a0a',
            }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Outgoing Image sliding out (UP on next, DOWN on prev) */}
            {isSlideAnimating && outgoingIndex !== null && (
              <img
                key={`outgoing-${outgoingIndex}`}
                src={allImages[outgoingIndex]}
                alt="Outgoing slide"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  zIndex: 1,
                  animation: `${slideDirection === 'next' ? 'lightboxSlideOutUp' : 'lightboxSlideOutDown'} 650ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                }}
              />
            )}

            {/* Incoming / Active Image sliding in (UP from bottom on next, DOWN from top on prev) */}
            <img
              key={`active-${lightboxIndex}`}
              src={allImages[lightboxIndex]}
              alt={`${activeProduct.name} lightbox view ${lightboxIndex + 1}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                zIndex: 2,
                animation: isSlideAnimating
                  ? `${slideDirection === 'next' ? 'lightboxSlideInUp' : 'lightboxSlideInDown'} 650ms cubic-bezier(0.22, 1, 0.36, 1) forwards`
                  : 'none',
              }}
            />

            {/* Center PREV / NEXT Nav Buttons */}
            <div
              className="lightbox-nav-controls"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                transform: 'translateY(-50%)',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 var(--gutter)',
                pointerEvents: 'none',
                zIndex: 20,
              }}
            >
              <button
                onClick={handleLightboxPrev}
                style={{
                  pointerEvents: 'auto',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#111111',
                  border: '1px solid var(--hairline)',
                  padding: '0.65rem 1.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                }}
              >
                ‹ PREV
              </button>
              <button
                onClick={handleLightboxNext}
                style={{
                  pointerEvents: 'auto',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#111111',
                  border: '1px solid var(--hairline)',
                  padding: '0.65rem 1.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                }}
              >
                NEXT ›
              </button>
            </div>

            {/* Bottom-Right Numbered Counter (e.g. 01 / 06) */}
            <div
              className="lightbox-counter"
              style={{
                position: 'absolute',
                bottom: '2rem',
                right: 'var(--gutter)',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#111111',
                padding: '0.45rem 1rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                border: '1px solid var(--hairline)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                zIndex: 20,
              }}
            >
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes lightboxSlideOutUp {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100%);
          }
        }

        @keyframes lightboxSlideOutDown {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }

        @keyframes lightboxSlideInUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes lightboxSlideInDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .product-modal-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem var(--gutter);
          border-bottom: 1px solid var(--hairline);
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 30;
          min-height: 60px;
        }

        .product-modal-close-btn {
          background: none;
          border: 1px solid var(--hairline);
          padding: 0.45rem 1.1rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .product-modal-close-btn:hover {
          background: #111111;
          color: #ffffff;
        }

        .product-modal-body {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* SECTION 1 & 2: Split 2-Column Layout */
        .product-modal-split {
          display: grid;
          grid-template-columns: 58% 42%;
          align-items: start;
          width: 100%;
        }

        @media (max-width: 768px) {
          .product-modal-split {
            grid-template-columns: 1fr;
          }
        }

        /* Left Column: Hero Image + 2-Column Grid */
        .product-modal-left-col {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .product-modal-hero-wrap {
          width: 100%;
          height: calc(100vh - 60px);
          max-height: calc(100vh - 60px);
          background: #f4f4f4;
          overflow: hidden;
        }

        .product-modal-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .product-modal-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          background: var(--hairline);
        }

        @media (max-width: 550px) {
          .product-modal-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        .product-modal-grid-cell {
          aspect-ratio: 3 / 4;
          background: #f4f4f4;
          overflow: hidden;
        }

        .product-modal-grid-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Right Column: Sticky Pinned Info Panel */
        .product-modal-right-col {
          width: 100%;
          height: 100%;
        }

        .product-modal-sticky-panel {
          position: sticky;
          top: 60px;
          padding: clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 3rem);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #ffffff;
        }

        @media (max-width: 768px) {
          .product-modal-sticky-panel {
            position: relative;
            top: 0;
            padding: 2.5rem var(--gutter);
          }
        }

        .product-modal-info-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
        }

        .product-modal-title {
          font-size: clamp(1.5rem, 2.2vw, 2.1rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #111111;
        }

        .product-modal-price {
          font-size: 1.25rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          color: #111111;
          white-space: nowrap;
        }

        .product-modal-sku {
          font-size: 0.75rem;
          color: var(--muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .product-modal-desc {
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--muted);
        }

        .product-modal-divider {
          height: 1px;
          background: var(--hairline);
          margin: 0.25rem 0;
        }

        .product-modal-accordions {
          display: flex;
          flex-direction: column;
        }

        .accordion-item {
          border-bottom: 1px solid var(--hairline);
        }

        .accordion-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9rem 0;
          background: none;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          color: #111111;
        }

        .accordion-icon {
          font-size: 1.1rem;
          font-weight: 400;
        }

        .accordion-body {
          padding-bottom: 1.25rem;
          padding-left: 1rem;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--muted);
        }

        .accordion-body ul {
          margin: 0;
          padding-left: 1rem;
        }

        .accordion-body li {
          margin-bottom: 0.4rem;
        }

        .product-modal-spacer {
          flex: 1;
          min-height: 1rem;
        }

        .product-modal-buy-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--hairline);
        }

        .product-modal-size-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .product-modal-size-label {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #111111;
        }

        .product-modal-sizes {
          display: flex;
          gap: 0.5rem;
        }

        .size-btn {
          width: 44px;
          height: 44px;
          border: 1px solid var(--hairline);
          background: #ffffff;
          color: #111111;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .size-btn.is-selected,
        .size-btn:hover {
          background: #111111;
          color: #ffffff;
          border-color: #111111;
        }

        .product-modal-add-btn {
          width: 100%;
          padding: 1.1rem;
          background: #111111;
          color: #ffffff;
          border: none;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .product-modal-add-btn:hover {
          opacity: 0.88;
        }

        /* SECTION 3: Full-Width Breakout Image */
        .product-modal-breakout-section {
          width: 100%;
          min-height: 80vh;
          background: #f4f4f4;
          overflow: hidden;
        }

        .product-modal-breakout-img {
          width: 100%;
          height: 100%;
          min-height: 80vh;
          object-fit: cover;
          display: block;
        }

        /* SECTION 4: COMPLETE THE LOOK Recommendations */
        .product-modal-complete-look {
          border-top: 1px solid var(--hairline);
          padding: clamp(3.5rem, 6vw, 6rem) var(--gutter);
          background: #ffffff;
        }

        .complete-look-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .complete-look-title {
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin-top: 0.25rem;
        }

        .complete-look-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.25rem, 2.5vw, 2.25rem);
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 950px) {
          .complete-look-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .complete-look-grid {
            grid-template-columns: 1fr;
          }
        }

        .complete-look-tile {
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .complete-look-img-wrap {
          position: relative;
          aspect-ratio: 3 / 4;
          background: #eaeaea;
          border: 1px solid var(--hairline);
          overflow: hidden;
        }

        .complete-look-flat-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 1;
          transition: opacity 350ms ease;
        }

        .complete-look-lifestyle-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 350ms ease, transform 350ms ease;
          transform: scale(1.04);
        }

        .complete-look-tile:hover .complete-look-flat-img {
          opacity: 0;
        }

        .complete-look-tile:hover .complete-look-lifestyle-img {
          opacity: 1;
          transform: scale(1);
        }

        .complete-look-sku-overlay {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 350ms ease;
          z-index: 5;
        }

        .complete-look-tile:hover .complete-look-sku-overlay {
          opacity: 1;
        }

        .complete-look-view-tag {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 350ms ease;
          z-index: 5;
        }

        .complete-look-tile:hover .complete-look-view-tag {
          opacity: 1;
        }

        .complete-look-info {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: 0.75rem;
          font-size: 0.85rem;
        }

        .complete-look-name {
          font-weight: 700;
          text-transform: uppercase;
        }

        .complete-look-price {
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </>
  )

  return createPortal(modalJSX, document.body)
}
