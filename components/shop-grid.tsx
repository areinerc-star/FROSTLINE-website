'use client'

import { useState, useRef, useEffect } from 'react'
import { Product, formatPrice } from '@/lib/products'
import { FROSTLINE_PRODUCTS, findCatalogProduct } from '@/lib/catalog'
import { ProductModal, SIZE_CHARTS, PRODUCT_SIZE_CHART } from './product-modal'
import { Footer } from './footer'

export interface GridProduct extends Product {
  flatImg: string
  lifestyleImg: string
  detailImages?: string[]
  colors?: string[]
  breakoutImg?: string
}

// Built from the FROSTLINE catalog (lib/catalog.ts) — edit products there, not here.
export const GRID_PRODUCTS: GridProduct[] = FROSTLINE_PRODUCTS.map((p, index) => {
  const firstColor = Object.values(p.colorVariations)[0]
  return {
    id: index,
    name: p.name,
    sku: p.sku,
    price: p.price,
    img: p.flatImg,
    flatImg: p.flatImg,
    lifestyleImg: p.lifestyleImg,
    detailImages: firstColor ? firstColor.modelPhotos : [],
    colors: Object.keys(p.colorVariations),
  }
})

// Hover panel: swatch fill for each existing color name (PR PROJECT "Red" is its magenta)
const SWATCH_HEX: Record<string, string> = {
  Red: '#C8102E',
  Teal: '#0F4C55',
  Black: '#121212',
  White: '#FFFFFF',
  Blue: '#1F4FB4',
}

function getSwatchHex(sku: string, color: string): string {
  if (sku.startsWith('FRL-PJ') && color === 'Red') return '#D81B60'
  return SWATCH_HEX[color] || '#CCCCCC'
}

// Sizes shown on the card: the item's size chart when it has one, otherwise its catalog sizes
function getTileSizes(product: GridProduct): string[] {
  const chartKey = PRODUCT_SIZE_CHART[product.sku]
  if (chartKey && SIZE_CHARTS[chartKey]) return SIZE_CHARTS[chartKey].sizes
  return findCatalogProduct(product)?.sizes || []
}

interface ShopGridProps {
  onAddToCart: (product: Product) => void
  onClose?: () => void
  cartCount?: number
  onOpenCart?: () => void
}

export function ShopGrid({ onAddToCart, onClose, cartCount = 0, onOpenCart }: ShopGridProps) {
  const [hoveredTileId, setHoveredTileId] = useState<number | null>(null)
  // Touch screens (no hover): first tap reveals colors + sizes, second tap opens the product
  const [revealedTileId, setRevealedTileId] = useState<number | null>(null)
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
    const noHover = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
    if (noHover && revealedTileId !== product.id) {
      setRevealedTileId(product.id)
      return
    }
    setRevealedTileId(null)
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
            COLLECTION 01 & 02 / FROSTLINE © 2026 ({GRID_PRODUCTS.length})
          </span>
        </div>

        {/* 3-Column Responsive Product Grid */}
        <div className="shop-grid">
          {GRID_PRODUCTS.map((product) => {
            const isHovered = hoveredTileId === product.id
            const p = parallaxMap[product.id] || { x: 0, y: 0 }
            const labelPos = labelPosMap[product.id] || { x: 0, y: 0 }
            const tileColors = product.colors || []
            const tileSizes = getTileSizes(product)
            const isRevealed = revealedTileId === product.id

            return (
              <div
                key={product.id}
                className={`shop-tile ${isHovered ? 'is-hovered' : ''} ${isRevealed ? 'is-revealed' : ''}`}
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

                  {/* Hover / On-Model Photo (Position 1: Front Hero / Position 2: Three-Quarter Angle) */}
                  <img
                    src={product.lifestyleImg || (product.detailImages && product.detailImages[0]) || (product.detailImages && product.detailImages[1]) || product.flatImg}
                    alt={`${product.name} lifestyle`}
                    className="shop-tile__lifestyle-img"
                    loading="lazy"
                    style={{
                      transform: isHovered
                        ? `scale(1.02) translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0)`
                        : 'scale(1.00) translate3d(0, 0, 0)',
                    }}
                  />

                  {/* Hover Panel: available colors + sizes */}
                  {(tileColors.length > 0 || tileSizes.length > 0) && (
                    <div className="shop-tile__options">
                      {tileColors.length > 0 && (
                        <div className="shop-tile__swatches" aria-label="Available colors">
                          {tileColors.map((color) => (
                            <span
                              key={color}
                              className="shop-tile__swatch"
                              title={color}
                              aria-label={color}
                              style={{ backgroundColor: getSwatchHex(product.sku, color) }}
                            />
                          ))}
                        </div>
                      )}
                      {tileSizes.length > 0 && (
                        <div className="shop-tile__sizes" aria-label="Available sizes">
                          {tileSizes.map((size) => (
                            <span key={size} className="shop-tile__size">
                              {size}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

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
            object-fit: contain;
            padding: 1.25rem;
            background: #ffffff;
            opacity: 1;
            transform: scale(1);
            transition: opacity 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform, opacity;
          }

          /* Lifestyle photo (crossfades in on hover) */
          .shop-tile__lifestyle-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.4, 0, 0.2, 1);
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

          /* Hover Panel: colors + sizes (overlays the image, no layout shift) */
          .shop-tile__options {
            position: absolute;
            top: 1.25rem;
            left: 1.25rem;
            right: 1.25rem;
            z-index: 6;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            pointer-events: none;
            opacity: 0;
            transform: translateY(-4px);
            transition: opacity 200ms ease-out, transform 200ms ease-out;
          }

          .shop-tile:hover .shop-tile__options,
          .shop-tile.is-hovered .shop-tile__options,
          .shop-tile.is-revealed .shop-tile__options {
            opacity: 1;
            transform: translateY(0);
          }

          .shop-tile__swatches,
          .shop-tile__sizes {
            display: flex;
            flex-wrap: wrap;
            gap: 0.35rem;
            background: #ffffff;
            padding: 0.4rem 0.5rem;
            box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          }

          .shop-tile__swatch {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 1px solid var(--hairline);
            display: block;
          }

          .shop-tile__size {
            color: #111111;
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            line-height: 1;
            padding: 0.15rem 0.3rem;
            border: 1px solid var(--hairline);
          }

          @media (prefers-reduced-motion: reduce) {
            .shop-tile__options {
              transition: none;
              transform: none;
            }
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
