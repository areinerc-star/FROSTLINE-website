'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface AboutUsModalProps {
  isOpen: boolean
  onClose: () => void
}

const CONTENT = {
  statementLabel: '[ABOUT FROSTLINE]',
  statementParagraph:
    'Born from the relentless chase of the personal record, rooted in faith, discipline, and purpose. For us, athletic apparel isn’t just gear—it’s a commitment to show up, trust the process, and wear your confidence.',
  headline: 'CRAFTED FOR DREAMERS.\nBUILT FOR BELIEVERS.',
  logoLockup: '/FROSTLINEwhiteLOGOonly.png',
  captionLeft: 'PHILIPPINES // 2026',
  captionCenter: 'ATHLETIC DIVISION',
  captionRight: 'FROSTLINE OFFICIAL',
  imgHero: '/images/hero-1.jpg',
  imgLeft: '/images/pilipinas-3.png',
  imgRight: [
    '/images/hero-2.jpg',
    '/images/hero-3.jpg',
    '/images/singlet-1.png',
    '/images/tshirt-1.png',
  ],
  iconMonogram: '/FROSTLINEwhiteLOGOonly.png',
}

export function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [curtainActive, setCurtainActive] = useState(false)
  const [statementVisible, setStatementVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  // Handle curtain entrance & exit
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      setCurtainActive(true)
      setIsClosing(false)

      // Statement phase 0.6s -> 1.4s
      const timer1 = setTimeout(() => {
        setStatementVisible(true)
      }, 600)

      const timer2 = setTimeout(() => {
        setStatementVisible(false)
      }, 2000)

      // Focus close button for accessibility
      setTimeout(() => {
        closeBtnRef.current?.focus()
      }, 300)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    } else {
      document.body.style.overflow = ''
      setCurtainActive(false)
      setStatementVisible(false)
      setScrollProgress(0)
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
      setCurtainActive(false)
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }, 500)
  }, [onClose])

  // Keydown event listener for Esc key & focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  // Scroll scrubbing observer
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const totalScroll = scrollHeight - clientHeight
    if (totalScroll > 0) {
      const progress = Math.min(Math.max(scrollTop / totalScroll, 0), 1)
      setScrollProgress(progress)
    }
  }

  if (!isOpen && !isClosing) return null

  // Calculate active right image step (0 to 3) based on scroll progress
  const activeImageIndex = Math.min(
    Math.floor(scrollProgress * CONTENT.imgRight.length * 1.5),
    CONTENT.imgRight.length - 1
  )

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="About Us Modal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Wipe Curtain Transition Layer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 550,
          backgroundColor: '#000000',
          clipPath: isClosing
            ? 'inset(0 0 100% 0)'
            : curtainActive
            ? 'inset(0 0 0 0)'
            : 'inset(0 0 100% 0)',
          transition: 'clip-path 500ms cubic-bezier(0.87, 0, 0.13, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* Top-Right Micro-Type Close Button */}
      <button
        ref={closeBtnRef}
        onClick={handleClose}
        aria-label="Close About Us Modal"
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '2rem',
          zIndex: 600,
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          padding: '0.4rem 0.85rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          borderRadius: '2px',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
        }}
      >
        CLOSE ✕
      </button>

      {/* Scrollable Container for Native & Scrubbed Motion */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 520,
          color: '#FFFFFF',
          background: '#000000',
          scrollBehavior: 'smooth',
        }}
      >
        {/* PHASE 2 & 3: STATEMENT & HERO REVEAL CONTAINER */}
        <div
          style={{
            minHeight: '180vh',
            position: 'relative',
            background: '#000000',
          }}
        >
          {/* Phase 2: Statement Label & Paragraph Overlay */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              opacity: statementVisible ? 1 : Math.max(0, 1 - scrollProgress * 5),
              transition: 'opacity 500ms ease',
              zIndex: 10,
              padding: '0 6.5vw',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
                width: '100%',
                maxWidth: '1200px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {CONTENT.statementLabel}
              </div>
              <div
                style={{
                  fontSize: '11.5px',
                  lineHeight: '1.65',
                  color: '#FFFFFF',
                  maxWidth: '380px',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                }}
              >
                {CONTENT.statementParagraph}
              </div>
            </div>
          </div>

          {/* Phase 3: Hero Lockup, Headline & Peeking Photo */}
          <div
            style={{
              position: 'relative',
              paddingTop: '20vh',
              paddingBottom: '10vh',
              paddingLeft: '6.5vw',
              paddingRight: '6.5vw',
            }}
          >
            {/* Split layout: Logo Lockup Left, Headline Right */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 40vw) 1fr',
                gap: '4vw',
                alignItems: 'start',
                marginBottom: '6vh',
              }}
            >
              {/* Left Column: Logo Lockup */}
              <div style={{ marginTop: '52vh' }}>
                <img
                  src={CONTENT.logoLockup}
                  alt="Frostline Mark"
                  style={{ width: '80px', height: 'auto', objectFit: 'contain' }}
                />
              </div>

              {/* Right Column: Bold Headline & Ghost Copy */}
              <div style={{ marginLeft: '0.5vw' }}>
                <h2
                  style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    lineHeight: '1.15',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    margin: 0,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {CONTENT.headline}
                </h2>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.25)',
                    marginTop: '0.75rem',
                    maxWidth: '340px',
                    lineHeight: '1.5',
                  }}
                >
                  {CONTENT.statementParagraph}
                </p>
              </div>
            </div>

            {/* Peeking Hero Photo (23% height initially, expands full-bleed on scroll) */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: `${23 + scrollProgress * 77}vh`,
                minHeight: '220px',
                overflow: 'hidden',
                borderRadius: '2px',
                transition: 'height 100ms ease-out',
              }}
            >
              <img
                src={CONTENT.imgHero}
                alt="Frostline Hero"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Phase 4: Three Micro-Captions on Vertical Midline */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 2rem',
                  fontSize: '8.5px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                  zIndex: 5,
                }}
              >
                <span>{CONTENT.captionLeft}</span>
                <span>{CONTENT.captionCenter}</span>
                <span>{CONTENT.captionRight}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PHASE 5: WHITE GRID SECTION */}
        <div
          style={{
            position: 'relative',
            background: '#FFFFFF',
            color: '#000000',
            minHeight: '200vh',
            paddingTop: '6rem',
            paddingBottom: '8rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '6.5vw',
              paddingLeft: '6.5vw',
              paddingRight: '6.5vw',
              position: 'relative',
            }}
          >
            {/* Left Column: Grayscale Square Image (Pinned / Sticky) */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'sticky',
                  top: '4rem',
                  width: '100%',
                  maxWidth: '42vw',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  borderRadius: '2px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <img
                  src={CONTENT.imgLeft}
                  alt="Frostline Product Detail"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%)',
                  }}
                />
              </div>
            </div>

            {/* Right Column: Landscape Images (3:2) Swapping with Bottom Clipping */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6rem',
                maxWidth: '42vw',
                width: '100%',
              }}
            >
              {CONTENT.imgRight.map((imgSrc, index) => {
                const isCurrent = index === activeImageIndex
                return (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '3 / 2',
                      overflow: 'hidden',
                      borderRadius: '2px',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                      transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                      clipPath: isCurrent
                        ? 'inset(0 0 0 0)'
                        : index < activeImageIndex
                        ? 'inset(0 0 75% 0)'
                        : 'inset(0 0 0 0)',
                      opacity: isCurrent ? 1 : index < activeImageIndex ? 0.4 : 0.8,
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`Frostline Editorial ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Icon Sequence Pinned near Bottom Seam */}
          <div
            style={{
              position: 'sticky',
              bottom: '2.5rem',
              left: '48.5vw',
              transform: 'translateX(-50%)',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#000000',
              padding: '0.6rem 1.2rem',
              borderRadius: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              transition: 'all 400ms ease',
            }}
          >
            {scrollProgress < 0.65 ? (
              // Icon 1: 4-Point Sparkle SVG
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M2 12h20M6 6l12 12M6 18L18 6" />
              </svg>
            ) : scrollProgress < 0.85 ? (
              // Icon 2: Mascot Silhouette Rising
              <div
                style={{
                  transform: 'translateY(0)',
                  transition: 'transform 300ms ease',
                }}
              >
                <img
                  src={CONTENT.logoLockup}
                  alt="Frostline Silhouette"
                  style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                />
              </div>
            ) : (
              // Icon 3: Pinned Monogram
              <img
                src={CONTENT.iconMonogram}
                alt="Frostline Monogram"
                style={{ width: '22px', height: '22px', objectFit: 'contain' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
