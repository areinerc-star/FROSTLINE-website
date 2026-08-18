'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Product, formatPrice } from '@/lib/products'
import { ProductModal } from './product-modal'
import { GridProduct } from './shop-grid'

export interface CarouselProduct {
  id: number
  name: string
  sku: string
  price: number
  flatImg: string
  lifestyleImg: string
}

export const FEATURED_ITEMS: CarouselProduct[] = [
  {
    id: 0,
    name: 'The Caddie Jacket [Navy]',
    sku: 'OR_CAD_N',
    price: 3200,
    flatImg: '/images/product-jacket.png',
    lifestyleImg: '/images/hero.png',
  },
  {
    id: 1,
    name: 'ORGC Traditions Crewneck',
    sku: 'OR_CRW_B',
    price: 2100,
    flatImg: '/images/product-crewneck.png',
    lifestyleImg: '/images/editorial-detail.png',
  },
  {
    id: 2,
    name: '1990s Heritage Polo',
    sku: 'OR-HGP_B',
    price: 1850,
    flatImg: '/images/product-polo.png',
    lifestyleImg: '/images/editorial-course.png',
  },
  {
    id: 3,
    name: 'Pleated Daily Trouser',
    sku: 'OR_TRO_K',
    price: 1800,
    flatImg: '/images/product-trouser.png',
    lifestyleImg: '/images/hero.png',
  },
  {
    id: 4,
    name: 'Reflections T-Shirt [Black]',
    sku: 'OR_RFL_B',
    price: 1000,
    flatImg: '/images/product-tee.png',
    lifestyleImg: '/images/editorial-detail.png',
  },
  {
    id: 5,
    name: 'Heritage Rope Cap [Olive]',
    sku: 'OR-SC_OG',
    price: 750,
    flatImg: '/images/product-cap.png',
    lifestyleImg: '/images/editorial-course.png',
  },
  {
    id: 6,
    name: 'OR Monogram T-Shirt',
    sku: 'OR_ORMT_B',
    price: 1000,
    flatImg: '/images/product-monogram-tee.png',
    lifestyleImg: '/images/hero.png',
  },
  {
    id: 7,
    name: 'Odd Ritual Classic Polo',
    sku: 'OR-CGP_B',
    price: 850,
    flatImg: '/images/product-classic-polo.png',
    lifestyleImg: '/images/editorial-detail.png',
  },
]

// Duplicate list for infinite marquee looping
const DISPLAY_ITEMS = [...FEATURED_ITEMS, ...FEATURED_ITEMS]

interface FeaturedCarouselProps {
  onAddToCart: (product: Product) => void
}

export function FeaturedCarousel({ onAddToCart }: FeaturedCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeTileId, setActiveTileId] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<GridProduct | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollPosRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)

  // Continuous unstoppable auto-scroll loop
  const updateScroll = useCallback(() => {
    if (trackRef.current) {
      scrollPosRef.current += 0.75

      const halfWidth = trackRef.current.scrollWidth / 2
      if (halfWidth > 0 && scrollPosRef.current >= halfWidth) {
        scrollPosRef.current -= halfWidth
      }

      trackRef.current.style.transform = `translate3d(-${scrollPosRef.current}px, 0, 0)`
    }
    animFrameRef.current = requestAnimationFrame(updateScroll)
  }, [])

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(updateScroll)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [updateScroll])

  // Parallax and cursor follow state per tile index
  const [parallaxMap, setParallaxMap] = useState<{ [index: number]: { x: number; y: number } }>({})
  const [labelPosMap, setLabelPosMap] = useState<{ [index: number]: { x: number; y: number } }>({})
  const targetPosRef = useRef<{ [index: number]: { x: number; y: number } }>({})
  const currentPosRef = useRef<{ [index: number]: { x: number; y: number } }>({})
  const mouseRawPosRef = useRef<{ [index: number]: { x: number; y: number } }>({})
  const labelCurrentPosRef = useRef<{ [index: number]: { x: number; y: number } }>({})

  useEffect(() => {
    let loopAnimId: number

    const interactionLoop = () => {
      let changed = false
      const newParallaxMap: { [index: number]: { x: number; y: number } } = {}
      const newLabelMap: { [index: number]: { x: number; y: number } } = {}

      DISPLAY_ITEMS.forEach((_, index) => {
        // Image Parallax lerp
        const pTarget = targetPosRef.current[index] || { x: 0, y: 0 }
        const pCurrent = currentPosRef.current[index] || { x: 0, y: 0 }
        const pdx = (pTarget.x - pCurrent.x) * 0.15
        const pdy = (pTarget.y - pCurrent.y) * 0.15
        const pNextX = pCurrent.x + pdx
        const pNextY = pCurrent.y + pdy
        currentPosRef.current[index] = { x: pNextX, y: pNextY }
        newParallaxMap[index] = { x: pNextX, y: pNextY }

        // Cursor follow label lerp
        const rawMouse = mouseRawPosRef.current[index] || { x: 0, y: 0 }
        const labelTargetX = rawMouse.x + 16
        const labelTargetY = rawMouse.y + 16
        const labelCurrent = labelCurrentPosRef.current[index] || { x: 0, y: 0 }
        const ldx = (labelTargetX - labelCurrent.x) * 0.2
        const ldy = (labelTargetY - labelCurrent.y) * 0.2
        const lNextX = labelCurrent.x + ldx
        const lNextY = labelCurrent.y + ldy
        labelCurrentPosRef.current[index] = { x: lNextX, y: lNextY }
        newLabelMap[index] = { x: lNextX, y: lNextY }

        if (
          Math.abs(pdx) > 0.01 ||
          Math.abs(pdy) > 0.01 ||
          Math.abs(ldx) > 0.01 ||
          Math.abs(ldy) > 0.01
        ) {
          changed = true
        }
      })

      if (changed) {
        setParallaxMap({ ...newParallaxMap })
        setLabelPosMap({ ...newLabelMap })
      }
      loopAnimId = requestAnimationFrame(interactionLoop)
    }

    loopAnimId = requestAnimationFrame(interactionLoop)
    return () => cancelAnimationFrame(loopAnimId)
  }, [])

  const handleMouseMoveTile = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    mouseRawPosRef.current[index] = { x: mouseX, y: mouseY }

    const normX = mouseX / rect.width - 0.5
    const normY = mouseY / rect.height - 0.5
    targetPosRef.current[index] = {
      x: normX * 48,
      y: normY * 48,
    }
  }

  const handleMouseEnterTile = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    mouseRawPosRef.current[index] = { x: mouseX, y: mouseY }
    labelCurrentPosRef.current[index] = { x: mouseX + 16, y: mouseY + 16 }
    setActiveTileId(index)
  }

  const handleMouseLeaveTile = (index: number) => {
    setActiveTileId(null)
    targetPosRef.current[index] = { x: 0, y: 0 }
  }

  const handleTileClick = (item: CarouselProduct) => {
    setActiveTileId(null)
    const gridItem: GridProduct = {
      ...item,
      img: item.flatImg,
    }
    setSelectedProduct(gridItem)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setActiveTileId(null)
    setTimeout(() => {
      setSelectedProduct(null)
    }, 650)
  }

  return (
    <>
      <section className="featured-section" id="products">
        <div className="featured-section__header">
          <p className="u-eyebrow">( FEATURED PRODUCTS )</p>
        </div>

        <div className="featured-carousel-container">
          <div ref={trackRef} className="featured-carousel-track">
            {DISPLAY_ITEMS.map((item, index) => {
              const uniqueKey = `${item.id}-${index}`
              const isHoveredOrActive = activeTileId === index
              const p = parallaxMap[index] || { x: 0, y: 0 }
              const labelPos = labelPosMap[index] || { x: 0, y: 0 }

              return (
                <div
                  key={uniqueKey}
                  className={`product-tile ${isHoveredOrActive ? 'is-active' : ''}`}
                  onMouseEnter={(e) => handleMouseEnterTile(e, index)}
                  onMouseMove={(e) => handleMouseMoveTile(e, index)}
                  onMouseLeave={() => handleMouseLeaveTile(index)}
                  onClick={() => handleTileClick(item)}
                >
                  <div className="product-tile__media">
                    {/* Flat product shot (default) */}
                    <img
                      src={item.flatImg}
                      alt={item.name}
                      className="product-tile__flat-img"
                      loading="lazy"
                    />

                    {/* Lifestyle / on-model photo (crossfades on hover + RAF parallax) */}
                    <img
                      src={item.lifestyleImg}
                      alt={`${item.name} lifestyle`}
                      className="product-tile__lifestyle-img"
                      loading="lazy"
                      style={{
                        transform: isHoveredOrActive
                          ? `scale(1.15) translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0)`
                          : 'scale(1.05) translate3d(0, 0, 0)',
                      }}
                    />

                    {/* Fixed SKU Overlay on Bottom-Left */}
                    <div className="product-tile__sku-overlay">
                      <span>({item.sku})</span>
                    </div>

                    {/* Floating Cursor-Follow '‹ VIEW PRODUCT ›' Tag */}
                    <div
                      className={`product-tile__floating-view-label ${isHoveredOrActive ? 'is-visible' : ''}`}
                      style={{
                        transform: `translate3d(${labelPos.x.toFixed(2)}px, ${labelPos.y.toFixed(2)}px, 0)`,
                      }}
                    >
                      ‹ VIEW PRODUCT ›
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <style jsx>{`
          .featured-section {
            padding: clamp(3rem, 6vw, 6rem) 0;
            background: var(--bg);
            overflow: hidden;
          }

          .featured-section__header {
            text-align: center;
            margin-bottom: 2.5rem;
            padding-inline: var(--gutter);
          }

          .featured-carousel-container {
            width: 100%;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            cursor: pointer;
          }

          .featured-carousel-container::-webkit-scrollbar {
            display: none;
          }

          .featured-carousel-track {
            display: flex;
            gap: clamp(1.25rem, 2.5vw, 2.25rem);
            width: max-content;
            will-change: transform;
            padding-inline: var(--gutter);
          }

          .product-tile {
            flex: 0 0 clamp(340px, 36vw, 480px);
            display: flex;
            flex-direction: column;
            user-select: none;
          }

          .product-tile__media {
            position: relative;
            aspect-ratio: 3 / 4;
            background: #eaeaea;
            border: 1px solid var(--hairline);
            overflow: hidden;
            cursor: pointer;
          }

          .product-tile__flat-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 1;
            transition: opacity 350ms ease-in-out;
          }

          .product-tile__lifestyle-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 350ms ease-in-out, transform 300ms ease-out;
            will-change: transform, opacity;
          }

          .product-tile:hover .product-tile__flat-img,
          .product-tile.is-active .product-tile__flat-img {
            opacity: 0;
          }

          .product-tile:hover .product-tile__lifestyle-img,
          .product-tile.is-active .product-tile__lifestyle-img {
            opacity: 1;
          }

          /* Fixed SKU Overlay on Bottom-Left */
          .product-tile__sku-overlay {
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

          .product-tile:hover .product-tile__sku-overlay,
          .product-tile.is-active .product-tile__sku-overlay {
            opacity: 1;
          }

          /* Floating Cursor-Follow Tag for ‹ VIEW PRODUCT › */
          .product-tile__floating-view-label {
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.85);
            color: #ffffff;
            padding: 0.4rem 0.85rem;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 250ms ease-in-out;
            z-index: 10;
            will-change: transform, opacity;
            border-radius: 2px;
            backdrop-filter: blur(4px);
          }

          .product-tile__floating-view-label.is-visible {
            opacity: 1;
          }
        `}</style>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={onAddToCart}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    </>
  )
}
