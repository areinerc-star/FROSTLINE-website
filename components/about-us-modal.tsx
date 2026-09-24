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
  logoMark: '/FROSTLINEwhiteLOGOonly.png',
  statementParagraph:
    "Born from the relentless chase of the personal record, rooted in faith, discipline, and the quiet hours before sunrise. For us, athletic apparel isn't just gear—it's a commitment to show up, trust the process, and walk your own path.",
  headline: 'CRAFTED FOR DREAMERS.\nBUILT FOR BELIEVERS.',
}

export function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  const [mounted, setMounted] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrollLocked, setIsScrollLocked] = useState(true)

  const modalRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  // Pure CSS Animation Trigger & Forced Paint Reflow
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      setIsClosing(false)
      setIsScrollLocked(true)
      setScrollProgress(0)

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }

      // Forced synchronous layout reflow for curtain paint
      if (curtainRef.current) {
        curtainRef.current.style.transition = 'none'
        curtainRef.current.style.clipPath = 'inset(0 0 100% 0)'
        void curtainRef.current.offsetHeight
        curtainRef.current.style.transition = 'clip-path 700ms cubic-bezier(0.76, 0, 0.24, 1)'
        curtainRef.current.style.clipPath = 'inset(0 0 0 0)'
      }

      setMounted(true)

      // Single auto-release scroll timer at 2.9s
      const scrollTimer = setTimeout(() => {
        setIsScrollLocked(false)
      }, 2900)

      const focusTimer = setTimeout(() => {
        closeBtnRef.current?.focus()
      }, 400)

      return () => {
        clearTimeout(scrollTimer)
        clearTimeout(focusTimer)
      }
    } else {
      document.body.style.overflow = ''
      setMounted(false)
      setIsClosing(false)
      setIsScrollLocked(false)
      setScrollProgress(0)
    }
  }, [isOpen])

  // Dedicated Upward Reverse Close Wipe (0.5s)
  const handleClose = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)

    setTimeout(() => {
      onClose()
      setIsClosing(false)
      setMounted(false)
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }, 500)
  }, [isClosing, onClose])

  // Esc key & Focus Trap
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
    if (isScrollLocked || !scrollContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const totalScroll = scrollHeight - clientHeight
    if (totalScroll > 0) {
      const progress = Math.min(Math.max(scrollTop / totalScroll, 0), 1)
      setScrollProgress(progress)
    }
  }

  if (!isOpen && !isClosing) return null

  const activeImageIndex = Math.min(
    Math.floor(scrollProgress * ASSETS.imgRight.length * 1.3),
    ASSETS.imgRight.length - 1
  )
  const isWhiteSectionActive = scrollProgress > 0.45

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="About Us Modal"
      className={mounted ? 'about-modal is-open' : 'about-modal'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100dvh',
        width: '100vw',
        zIndex: 90, // Placed directly beneath header (.nav zIndex 100 in globals.css)
        background: 'transparent',
      }}
    >
      {/* 50% DIMMED OVERLAY OVER HOME PAGE */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 91,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          pointerEvents: 'none',
        }}
      />

      {/* 0.0 - 0.7s CURTAIN WIPE LAYER */}
      <div
        ref={curtainRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 95,
          backgroundColor: '#000000',
          clipPath: 'inset(0 0 100% 0)',
          pointerEvents: 'none',
        }}
      />

      {/* REVERSE CLOSE WIPE LAYER (Upward 0.5s) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 96,
          backgroundColor: '#000000',
          transform: isClosing ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 500ms cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* ABOUT US | CLOSE × PILL BUTTON (Bottom-Left fixed with 16px+ safe margin) */}
      <button
        ref={closeBtnRef}
        onClick={handleClose}
        aria-label="Close About Us Modal"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 99,
          background: isWhiteSectionActive ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          color: '#FFFFFF',
          padding: '0.45rem 0.9rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          border: isWhiteSectionActive
            ? '1px solid rgba(0, 0, 0, 0.4)'
            : '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '2px',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
          transition: 'all 300ms ease',
        }}
      >
        ABOUT US | CLOSE ×
      </button>

      {/* MAIN SCROLL CONTAINER */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100dvh',
          overflowY: isScrollLocked ? 'hidden' : 'auto',
          overflowX: 'hidden',
          zIndex: 92,
          color: '#FFFFFF',
          background: '#000000',
        }}
      >
        {/* STATEMENT BLOCK: 0.75s -> 2.15s (Fade In, Hold, Fade Out on Same Row) */}
        <div
          className="modal-statement-block"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 94,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '49.8vw',
              right: '9vw',
              display: 'flex',
              alignItems: 'baseline',
              gap: '1.2rem',
              maxWidth: '41.2vw',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-headline, "Antonio", sans-serif)',
                fontSize: '0.72rem',
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
                fontSize: '11px',
                lineHeight: '1.6',
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              {ASSETS.statementParagraph}
            </p>
          </div>
        </div>

        {/* HERO REVEAL & MAIN CONTENT (VISIBLE BY DEFAULT - FAIL SAFE) */}
        <div className="modal-hero-wrapper" style={{ position: 'relative', background: '#000000' }}>
          {/* BLACK ZONE 83vh */}
          <div style={{ position: 'relative', height: '83vh' }}>
            {/* Left: Frostline Mark & Label (~8.5vw left, ~55vh vertical center) */}
            <div
              className="modal-logo-mark"
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

            {/* Right: Headline & Ghost Text (~49.8vw left, ~52vh vertical center) */}
            <div
              className="modal-headline-block"
              style={{
                position: 'absolute',
                left: '49.8vw',
                top: '52vh',
                transform: 'translateY(-50%)',
                width: '41.2vw',
                maxWidth: '41.2vw',
              }}
            >
              {/* Ghost text at 8-10% opacity */}
              <p
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  fontFamily: 'var(--font-body, "Times New Roman", serif)',
                  fontSize: '9px',
                  lineHeight: '1.5',
                  color: 'rgba(255, 255, 255, 0.09)',
                  pointerEvents: 'none',
                  margin: 0,
                  zIndex: 1,
                }}
              >
                {ASSETS.statementParagraph} {ASSETS.statementParagraph}
              </p>

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

          {/* FULL-BLEED PHOTO BLOCK (Peeks 17vh initially, expands 100vh on scroll with NO black spacer) */}
          <div
            style={{
              position: 'relative',
              width: '100vw',
              height: '100vh',
              minHeight: '100vh',
              overflow: 'hidden',
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

            {/* CENTER CAPTION ON PHOTO MIDLINE (~44vh) */}
            <div
              style={{
                position: 'absolute',
                top: '44vh',
                left: 0,
                right: 0,
                textAlign: 'center',
                fontFamily: 'var(--font-body, "Times New Roman", serif)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                zIndex: 10,
              }}
            >
              WEAR YOUR CONFIDENCE.
            </div>
          </div>
        </div>

        {/* WHITE GRID SECTION (Starts EXACTLY at photo's bottom edge) */}
        <div
          style={{
            position: 'relative',
            background: '#FFFFFF',
            color: '#000000',
            minHeight: '200vh',
            paddingTop: '4rem',
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
            {/* Left Column (8.3vw to 49.5vw): Grayscale Square Image (Pinned) */}
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

            {/* Right Column (49.9vw to 91.2vw): Full Opaque 3:2 Landscapes swapping in top-right slot */}
            <div
              style={{
                position: 'relative',
                width: '41.3vw',
                minHeight: '140vh',
              }}
            >
              <div
                style={{
                  position: 'sticky',
                  top: '2rem',
                  width: '41.3vw',
                  aspectRatio: '3 / 2',
                  overflow: 'hidden',
                  borderRadius: '2px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                }}
              >
                <img
                  src={ASSETS.imgRight[activeImageIndex]}
                  alt={`Frostline Feature ${activeImageIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    opacity: 1,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ICON: Centered on Seam (~49.5vw), starts ~200px wide from below, ends pinned at ~9vh tall */}
          <div
            style={{
              position: 'sticky',
              bottom: '3vh',
              left: '49.5vw',
              transform: 'translateX(-50%)',
              width: '200px',
              height: '9vh',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
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

      {/* FAIL-SAFE PURE CSS KEYFRAMES (Visible by default, animated on .is-open) */}
      <style jsx global>{`
        /* Base / Default States (Visible by default - Fail Safe) */
        .modal-statement-block {
          opacity: 0;
        }
        .modal-hero-wrapper {
          opacity: 1;
        }

        /* Intro Sequence Animations when .is-open is active */
        .about-modal.is-open .modal-statement-block {
          animation: statementSequence 1.4s ease 0.75s backwards;
        }
        .about-modal.is-open .modal-logo-mark {
          animation: heroRiseIn 700ms cubic-bezier(0.16, 1, 0.3, 1) 2.15s backwards;
        }
        .about-modal.is-open .modal-headline-block {
          animation: heroRiseIn 700ms cubic-bezier(0.16, 1, 0.3, 1) 2.23s backwards;
        }

        @keyframes statementSequence {
          0% { opacity: 0; transform: translateY(6px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }

        @keyframes heroRiseIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
