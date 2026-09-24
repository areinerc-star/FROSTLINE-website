'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface AboutUsModalProps {
  isOpen: boolean
  onClose: () => void
}

const ASSETS = {
  imgHero: '/images/hero-1.jpg',
  imgLeft: '/images/pilipinas-3.png',
  imgRight: [
    '/images/hero-2.jpg',
    '/images/hero-3.jpg',
    '/images/singlet-1.png',
    '/images/tshirt-1.png',
  ],
  captionLeft: 'PHILIPPINES // 2026',
  captionRight: 'FROSTLINE OFFICIAL',
  logoMark: '/FROSTLINEwhiteLOGOonly.png',
  statementParagraph:
    "Born from the relentless chase of the personal record, rooted in faith, discipline, and the quiet hours before sunrise. For us, athletic apparel isn't just gear—it's a commitment to show up, trust the process, and walk your own path.",
  headline: 'CRAFTED FOR DREAMERS.\nBUILT FOR BELIEVERS.',
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

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      setCurtainActive(true)
      setIsClosing(false)

      // Statement phase 0.7s -> 1.5s
      const timer1 = setTimeout(() => {
        setStatementVisible(true)
      }, 700)

      const timer2 = setTimeout(() => {
        setStatementVisible(false)
      }, 2200)

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

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([-1])'
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

  const activeImageIndex = Math.min(
    Math.floor(scrollProgress * ASSETS.imgRight.length * 1.5),
    ASSETS.imgRight.length - 1
  )

  const isWhiteSectionActive = scrollProgress > 0.55

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="About Us Modal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* 1. CURTAIN WIPE TRANSITION LAYER (cubic-bezier(0.76, 0, 0.24, 1)) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 450,
          backgroundColor: '#000000',
          clipPath: isClosing
            ? 'inset(0 0 100% 0)'
            : curtainActive
            ? 'inset(0 0 0 0)'
            : 'inset(0 0 100% 0)',
          transition: 'clip-path 700ms cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* MODAL CLOSE PILL (Bottom-Left fixed pill, adapts border over white section) */}
      <button
        ref={closeBtnRef}
        onClick={handleClose}
        aria-label="Close About Us Modal"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          left: '1.25rem',
          zIndex: 600,
          background: isWhiteSectionActive ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          color: '#FFFFFF',
          padding: '0.4rem 0.85rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          border: isWhiteSectionActive
            ? '1px solid rgba(255, 255, 255, 0.4)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '2px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 300ms ease',
        }}
      >
        ABOUT US | CLOSE ×
      </button>

      {/* SCROLLABLE CONTAINER FOR NATIVE & SCRUBBED MOTION */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 420,
          color: '#FFFFFF',
          background: '#000000',
        }}
      >
        {/* 2. STATEMENT PHASE (0.7s - 1.5s) */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '9vw',
            pointerEvents: 'none',
            opacity: statementVisible ? 1 : Math.max(0, 1 - scrollProgress * 6),
            transition: 'opacity 500ms ease',
            zIndex: 440,
          }}
        >
          <div style={{ maxWidth: '420px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <span
              style={{
                fontFamily: 'var(--font-headline, "Antonio", sans-serif)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.5)',
                whiteSpace: 'nowrap',
              }}
            >
              [ BEHIND FROSTLINE ]
            </span>
            <p
              style={{
                fontFamily: 'var(--font-body, "Times New Roman", serif)',
                fontSize: '11.5px',
                lineHeight: 1.65,
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              {ASSETS.statementParagraph}
            </p>
          </div>
        </div>

        {/* 3. HERO REVEAL SECTION (Black Zone 76% + Peeking Photo 24%) */}
        <div
          style={{
            minHeight: '170vh',
            position: 'relative',
            background: '#000000',
          }}
        >
          {/* Top 76% Black Zone with Left Mark & Right Headline */}
          <div
            style={{
              position: 'relative',
              height: '76vh',
              paddingTop: '12vh',
            }}
          >
            {/* Left: Frostline Mark & BEHIND FROSTLINE label */}
            <div
              style={{
                position: 'absolute',
                left: '8.5vw',
                top: '55vh',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              <img
                src={ASSETS.logoMark}
                alt="Frostline Mark"
                style={{ width: '85px', height: 'auto', objectFit: 'contain' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-headline, "Antonio", sans-serif)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                }}
              >
                BEHIND FROSTLINE
              </span>
            </div>

            {/* Headline & Ghost Paragraph */}
            <div
              style={{
                position: 'absolute',
                left: '49.8vw',
                top: '52vh',
                transform: 'translateY(-50%)',
                maxWidth: '41.2vw',
              }}
            >
              {/* Ghost text background */}
              <p
                style={{
                  position: 'absolute',
                  inset: 0,
                  fontFamily: 'var(--font-body, "Times New Roman", serif)',
                  fontSize: '9px',
                  lineHeight: '1.5',
                  color: 'rgba(255, 255, 255, 0.09)',
                  pointerEvents: 'none',
                  margin: 0,
                  whiteSpace: 'normal',
                  zIndex: 1,
                }}
              >
                {ASSETS.statementParagraph} {ASSETS.statementParagraph}
              </p>

              {/* Bold 2-Line Headline */}
              <h2
                style={{
                  position: 'relative',
                  zIndex: 2,
                  fontFamily: 'var(--font-headline, "Antonio", "Anton", sans-serif)',
                  fontSize: 'clamp(1.2vw, 1.4vw, 2.2rem)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  lineHeight: 1.15,
                  color: '#FFFFFF',
                  margin: 0,
                  whiteSpace: 'pre-line',
                }}
              >
                {ASSETS.headline}
              </h2>
            </div>
          </div>

          {/* 4. FULL-BLEED PHOTO (Peeks bottom 24%, expands to 100vh on scroll) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: `${24 + scrollProgress * 76}vh`,
              minHeight: '220px',
              overflow: 'hidden',
              transition: 'height 100ms ease-out',
            }}
          >
            <img
              src={ASSETS.imgHero}
              alt="Frostline Hero"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Three Micro-Captions on Vertical Midline (~44vh) */}
            <div
              style={{
                position: 'absolute',
                top: '44vh',
                left: 0,
                right: 0,
                display: 'flex',
                justify: 'space-between',
                padding: '0 4vw',
                fontFamily: 'var(--font-body, "Times New Roman", serif)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                textShadow: '0 2px 6px rgba(0,0,0,0.7)',
                zIndex: 10,
              }}
            >
              <span>{ASSETS.captionLeft}</span>
              <span>WEAR YOUR CONFIDENCE.</span>
              <span>{ASSETS.captionRight}</span>
            </div>
          </div>
        </div>

        {/* 5. WHITE GRID SECTION */}
        <div
          style={{
            position: 'relative',
            background: '#FFFFFF',
            color: '#000000',
            minHeight: '220vh',
            paddingTop: '6rem',
            paddingBottom: '8rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '41.3vw 41.3vw',
              columnGap: '0.4vw',
              paddingLeft: '8.3vw',
              paddingRight: '8.8vw',
              position: 'relative',
            }}
          >
            {/* Left Column (8.3vw to 49.5vw): Grayscale Square Image (Pinned to Top) */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'sticky',
                  top: '2rem',
                  width: '41.3vw',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  borderRadius: '2px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                <img
                  src={ASSETS.imgLeft}
                  alt="Frostline Detail"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%)',
                  }}
                />
              </div>
            </div>

            {/* Right Column (49.9vw to 91.2vw): Landscape 3:2 Images with Bottom Clipping */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6rem',
                width: '41.3vw',
              }}
            >
              {ASSETS.imgRight.map((imgSrc, index) => {
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
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
                      transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                      clipPath: isCurrent
                        ? 'inset(0 0 0 0)'
                        : index < activeImageIndex
                        ? 'inset(0 0 75% 0)'
                        : 'inset(0 0 0 0)',
                      opacity: isCurrent ? 1 : index < activeImageIndex ? 0.35 : 0.85,
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`Frostline Feature ${index + 1}`}
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

          {/* ICON: Inverted Black Frostline Chevron Mark on Seam (~49.5vw) */}
          <div
            style={{
              position: 'sticky',
              bottom: '3vh',
              left: '49.5vw',
              width: '200px',
              height: '9vh',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transform: `translateY(${Math.max(0, (1 - scrollProgress * 1.8) * 100)}px)`,
              transition: 'transform 300ms ease-out',
            }}
          >
            <img
              src={ASSETS.logoMark}
              alt="Frostline Chevron Mark"
              style={{
                width: 'auto',
                height: '100%',
                maxHeight: '9vh',
                objectFit: 'contain',
                filter: 'brightness(0)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
