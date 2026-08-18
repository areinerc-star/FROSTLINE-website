'use client'

import { useState, useRef, useEffect } from 'react'
import { PRODUCTS, Product, formatPrice } from '@/lib/products'
import { ProductModal } from './product-modal'
import { Footer } from './footer'

export interface GridProduct extends Product {
  flatImg: string
  lifestyleImg: string
}

export const GRID_PRODUCTS: GridProduct[] = [
  {
    id: 0,
    name: 'The Caddie Jacket [Navy]',
    sku: 'OR_CAD_N',
    price: 3200,
    img: '/images/product-jacket.png',
    flatImg: '/images/product-jacket.png',
    lifestyleImg: '/images/hero.png',
  },
  {
    id: 1,
    name: 'ORGC Traditions Crewneck',
    sku: 'OR_CRW_B',
    price: 2100,
    img: '/images/product-crewneck.png',
    flatImg: '/images/product-crewneck.png',
    lifestyleImg: '/images/editorial-detail.png',
  },
  {
    id: 2,
    name: '1990s Heritage Polo',
    sku: 'OR-HGP_B',
    price: 1850,
    img: '/images/product-polo.png',
    flatImg: '/images/product-polo.png',
    lifestyleImg: '/images/editorial-course.png',
  },
  {
    id: 3,
    name: 'Pleated Daily Trouser',
    sku: 'OR_TRO_K',
    price: 1800,
    img: '/images/product-trouser.png',
    flatImg: '/images/product-trouser.png',
    lifestyleImg: '/images/hero.png',
  },
  {
    id: 4,
    name: 'Reflections T-Shirt [Black]',
    sku: 'OR_RFL_B',
    price: 1000,
    img: '/images/product-tee.png',
    flatImg: '/images/product-tee.png',
    lifestyleImg: '/images/editorial-detail.png',
  },
  {
    id: 5,
    name: 'Heritage Rope Cap [Olive]',
    sku: 'OR-SC_OG',
    price: 750,
    img: '/images/product-cap.png',
    flatImg: '/images/product-cap.png',
    lifestyleImg: '/images/editorial-course.png',
  },
  {
    id: 6,
    name: 'OR Monogram T-Shirt',
    sku: 'OR_ORMT_B',
    price: 1000,
    img: '/images/product-monogram-tee.png',
    flatImg: '/images/product-monogram-tee.png',
    lifestyleImg: '/images/hero.png',
  },
  {
    id: 7,
    name: 'Odd Ritual Classic Polo',
    sku: 'OR-CGP_B',
    price: 850,
    img: '/images/product-classic-polo.png',
    flatImg: '/images/product-classic-polo.png',
    lifestyleImg: '/images/editorial-detail.png',
  },
]

interface ShopGridProps {
  onAddToCart: (product: Product) => void
  onClose?: () => void
  cartCount?: number
  onOpenCart?: () => void
}

export function ShopGrid({ onAddToCart, onClose, cartCount = 0, onOpenCart }: ShopGridProps) {
  const [hoveredTileId, setHoveredTileId] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<GridProduct | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // RAF parallax cursor tracking state per tile
  const [parallaxMap, setParallaxMap] = useState<{ [id: number]: { x: number; y: number } }>({})
  const targetPosRef = useRef<{ [id: number]: { x: number; y: number } }>({})
  const currentPosRef = useRef<{ [id: number]: { x: number; y: number } }>({})

  // Floating cursor-follow label lerp state per tile
  const [labelPosMap, setLabelPosMap] = useState<{ [id: number]: { x: number; y: number } }>({})
  const mouseRawPosRef = useRef<{ [id: number]: { x: number; y: number } }>({})
  const labelLerpPosRef = useRef<{ [id: number]: { x: number; y: number } }>({})

  // Continuous RAF animation loop for both parallax and cursor-follow label lerp
  useEffect(() => {
    let animId: number

    const updateLoop = () => {
      const newParallax: { [id: number]: { x: number; y: number } } = {}
      const newLabelPos: { [id: number]: { x: number; y: number } } = {}

      GRID_PRODUCTS.forEach((p) => {
        const id = p.id

        // 1. Image Parallax Lerp (factor 0.1)
        const targetP = targetPosRef.current[id] || { x: 0, y: 0 }
        const currentP = currentPosRef.current[id] || { x: 0, y: 0 }
        const nextPx = currentP.x + (targetP.x - currentP.x) * 0.1
        const nextPy = currentP.y + (targetP.y - currentP.y) * 0.1
        currentPosRef.current[id] = { x: nextPx, y: nextPy }
        newParallax[id] = { x: nextPx, y: nextPy }

        // 2. Cursor Follow Label Lerp (factor 0.2, target = mouse + 16px)
        const mouseRaw = mouseRawPosRef.current[id] || { x: 0, y: 0 }
        const currentLabel = labelLerpPosRef.current[id] || { x: mouseRaw.x + 16, y: mouseRaw.y + 16 }
        const targetLx = mouseRaw.x + 16
        const targetLy = mouseRaw.y + 16
        const nextLx = currentLabel.x + (targetLx - currentLabel.x) * 0.2
        const nextLy = currentLabel.y + (targetLy - currentLabel.y) * 0.2
        labelLerpPosRef.current[id] = { x: nextLx, y: nextLy }
        newLabelPos[id] = { x: nextLx, y: nextLy }
      })

      setParallaxMap(newParallax)
      setLabelPosMap(newLabelPos)
      animId = requestAnimationFrame(updateLoop)
    }

    animId = requestAnimationFrame(updateLoop)
    return () => cancelAnimationFrame(animId)
  }, [])

  const handleMouseMoveTile = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Raw mouse coords for cursor-follow label
    mouseRawPosRef.current[id] = { x: mouseX, y: mouseY }

    // Normalized mouse coords for image parallax
    const normX = mouseX / rect.width - 0.5
    const normY = mouseY / rect.height - 0.5
    targetPosRef.current[id] = {
      x: normX * 48,
      y: normY * 48,
    }
  }

  const handleMouseEnterTile = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    setHoveredTileId(id)
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    mouseRawPosRef.current[id] = { x: mouseX, y: mouseY }
    labelLerpPosRef.current[id] = { x: mouseX + 16, y: mouseY + 16 }
  }

  const handleMouseLeaveTile = (id: number) => {
    setHoveredTileId(null)
    targetPosRef.current[id] = { x: 0, y: 0 }
  }

  const handleTileClick = (product: GridProduct) => {
    setHoveredTileId(null)
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setHoveredTileId(null)
    setTimeout(() => {
      setSelectedProduct(null)
    }, 650)
  }

  return (
    <>
      <div className="shop-grid-container">
        {/* Top Header Bar: Full-size FROSTLINE Logo + Right Nav Links */}
        <div className="shop-grid-topbar">
          <a
            href="#top"
            className="nav__logo"
            aria-label="Frostline home"
            onClick={(e) => {
              e.preventDefault()
              if (onClose) onClose()
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

          <div className="shop-grid-nav-right">
            <span className="shop-grid-nav-link is-active">SHOP NOW</span>
            {onOpenCart && (
              <button className="shop-grid-nav-link" onClick={onOpenCart}>
                CART ({cartCount})
              </button>
            )}
            {onClose && (
              <button onClick={onClose} className="shop-grid-close-btn" aria-label="Close Shop">
                CLOSE ✕
              </button>
            )}
          </div>
        </div>

        {/* Sub-Header Row: ALL PRODUCTS (left) & COLLECTION 01 & 02 / ORGC © 2026 (38) (right) */}
        <div className="shop-grid-subhead">
          <h1 className="shop-grid-subhead__title">ALL PRODUCTS</h1>
          <span className="shop-grid-subhead__meta">
            COLLECTION 01 & 02 / ORGC © 2026 (38)
          </span>
        </div>

        {/* 3-Column Responsive Product Grid */}
        <div className="shop-grid">
          {GRID_PRODUCTS.map((product) => {
            const isHovered = hoveredTileId === product.id
            const p = parallaxMap[product.id] || { x: 0, y: 0 }
            const labelPos = labelPosMap[product.id] || { x: 0, y: 0 }

            return (
              <div
                key={product.id}
                className={`shop-tile ${isHovered ? 'is-hovered' : ''}`}
                onMouseEnter={(e) => handleMouseEnterTile(e, product.id)}
                onMouseMove={(e) => handleMouseMoveTile(e, product.id)}
                onMouseLeave={() => handleMouseLeaveTile(product.id)}
                onClick={() => handleTileClick(product)}
              >
                {/* Image Container with Crossfading Flat + Lifestyle Shots */}
                <div className="shop-tile__image-wrapper">
                  {/* Flat Product Shot (default) */}
                  <img
                    src={product.flatImg}
                    alt={product.name}
                    className="shop-tile__flat-img"
                    loading="lazy"
                  />

                  {/* Lifestyle / On-Model Photo with RAF Parallax Panning */}
                  <img
                    src={product.lifestyleImg}
                    alt={`${product.name} lifestyle`}
                    className="shop-tile__lifestyle-img"
                    loading="lazy"
                    style={{
                      transform: isHovered
                        ? `scale(1.15) translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0)`
                        : 'scale(1.05) translate3d(0, 0, 0)',
                    }}
                  />

                  {/* Fixed SKU Overlay on Bottom-Left */}
                  <div className="shop-tile__sku-overlay">
                    <span>({product.sku})</span>
                  </div>

                  {/* Floating Cursor-Follow '‹ VIEW PRODUCT ›' Tag */}
                  <div
                    className={`shop-tile__floating-view-label ${isHovered ? 'is-visible' : ''}`}
                    style={{
                      transform: `translate3d(${labelPos.x.toFixed(2)}px, ${labelPos.y.toFixed(2)}px, 0)`,
                    }}
                  >
                    ‹ VIEW PRODUCT ›
                  </div>
                </div>

                {/* Always Visible Info Bar Directly Below Image */}
                <div className="shop-tile__info-bar">
                  <span className="shop-tile__name">{product.name}</span>
                  <span className="shop-tile__price">{formatPrice(product.price)}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer unambiguously placed at the very end of the ShopGrid scroll flow */}
        <Footer />

        <style jsx>{`
          .shop-grid-container {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            padding: 1.5rem var(--gutter) 0;
            background: #ffffff;
            color: #111111;
          }

          .shop-grid-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 1.25rem;
            border-bottom: 1px solid var(--hairline);
          }

          .shop-grid-nav-right {
            display: flex;
            align-items: center;
            gap: clamp(1rem, 2vw, 2rem);
          }

          .shop-grid-nav-link {
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #111111;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
          }

          .shop-grid-close-btn {
            background: none;
            border: 1px solid var(--hairline);
            padding: 0.45rem 1.1rem;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            color: #111111;
            transition: background-color 0.2s ease, color 0.2s ease;
          }

          .shop-grid-close-btn:hover {
            background: #111111;
            color: #ffffff;
          }

          /* Sub-Header Row */
          .shop-grid-subhead {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            padding: 1.5rem 0 1.25rem;
            border-bottom: 1px solid var(--hairline);
            margin-bottom: 2.5rem;
          }

          .shop-grid-subhead__title {
            font-size: clamp(1.1rem, 2.2vw, 1.6rem);
            font-weight: 800;
            letter-spacing: -0.02em;
            text-transform: uppercase;
            color: #111111;
          }

          .shop-grid-subhead__meta {
            font-size: 0.78rem;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--muted);
          }

          /* 3-Column Responsive Grid */
          .shop-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: clamp(1.25rem, 2.5vw, 2.25rem);
            margin-bottom: 5rem;
          }

          @media (max-width: 950px) {
            .shop-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 600px) {
            .shop-grid {
              grid-template-columns: 1fr;
            }
          }

          .shop-tile {
            display: flex;
            flex-direction: column;
            cursor: pointer;
            user-select: none;
          }

          .shop-tile__image-wrapper {
            position: relative;
            aspect-ratio: 3 / 4;
            background: #eaeaea;
            border: 1px solid var(--hairline);
            overflow: hidden;
          }

          /* Flat product shot (default visible) */
          .shop-tile__flat-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 1;
            transition: opacity 350ms ease-in-out;
          }

          /* Lifestyle photo (crossfades in on hover) */
          .shop-tile__lifestyle-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 350ms ease-in-out, transform 300ms ease-out;
            will-change: transform, opacity;
          }

          .shop-tile:hover .shop-tile__flat-img,
          .shop-tile.is-hovered .shop-tile__flat-img {
            opacity: 0;
          }

          .shop-tile:hover .shop-tile__lifestyle-img,
          .shop-tile.is-hovered .shop-tile__lifestyle-img {
            opacity: 1;
          }

          /* Fixed SKU Overlay on Bottom-Left */
          .shop-tile__sku-overlay {
            position: absolute;
            bottom: 1.25rem;
            left: 1.25rem;
            color: #ffffff;
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            opacity: 0;
            transition: opacity 350ms ease-in-out;
            z-index: 5;
            pointer-events: none;
          }

          .shop-tile:hover .shop-tile__sku-overlay,
          .shop-tile.is-hovered .shop-tile__sku-overlay {
            opacity: 1;
          }

          /* Floating Cursor-Follow Tag for ‹ VIEW PRODUCT › */
          .shop-tile__floating-view-label {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            pointer-events: none;
            background: #ffffff;
            color: #111111;
            padding: 0.4rem 0.85rem;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            opacity: 0;
            transition: opacity 250ms ease-in-out;
            white-space: nowrap;
            box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          }

          .shop-tile__floating-view-label.is-visible {
            opacity: 1;
          }

          /* Always Visible Info Bar Directly Below Image */
          .shop-tile__info-bar {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            padding-top: 0.85rem;
            font-size: 0.85rem;
            color: #111111;
          }

          .shop-tile__name {
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            color: #111111;
          }

          .shop-tile__price {
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            color: #111111;
          }
        `}</style>

        {/* Product Detail Modal portalled overlay (fixed inset:0 z-index:310) */}
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={onAddToCart}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      </div>
    </>
  )
}
