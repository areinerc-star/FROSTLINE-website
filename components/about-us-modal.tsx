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

type ModalPhase = 'curtain-open' | 'statement' | 'hero-intro' | 'unlocked'

export function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  const [phase, setPhase] = useState<ModalPhase>('curtain-open')
  const [isClosing, setIsClosing] = useState(false)
  const [closeWipeActive, setCloseWipeActive] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const modalRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)
  const timerRefs = useRef<NodeJS.Timeout[]>([])

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t))
    timerRefs.current = []
  }

  // Handle open sequence
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      setIsClosing(false)
      setCloseWipeActive(false)
      setScrollProgress(0)
      setPhase('curtain-open')

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }

      clearAllTimers()

      // Timeline:
      // 0.0s - 0.7s: Curtain wipe top-to-bottom
      // 0.7s - 2.2s: Statement phase
      // 2.2s - 3.0s: Hero reveal phase
      // 3.0s+: Unlocked for scrolling

      const t1 = setTimeout(() => {
        setPhase('statement')
      }, 700)

      const t2 = setTimeout(() => {
        setPhase('hero-intro')
      }, 2200)

      const t3 = setTimeout(() => {
        setPhase('unlocked')
      }, 3000)

      const tFocus = setTimeout(() => {
        closeBtnRef.current?.focus()
      }, 400)

      timerRefs.current = [t1, t2, t3, tFocus]

      return () => clearAllTimers()
    } else {
      document.body.style.overflow = ''
      setPhase('curtain-open')
      setIsClosing(false)
      setCloseWipeActive(false)
      setScrollProgress(0)
    }
  }, [isOpen])

  // Dedicated reverse close handler
  const handleClose = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)
    setCloseWipeActive(true)

    clearAllTimers()

    const tClose = setTimeout(() => {
      onClose()
      setIsClosing(false)
      setCloseWipeActive(false)
      setPhase('curtain-open')
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }, 500)

    timerRefs.current.push(tClose)
  }, [isClosing, onClose])

  // Esc key & focus trap
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

  // Scroll handler (only active when phase is 'unlocked')
  const handleScroll = () => {
    if (phase !== 'unlocked' || !scrollContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const totalScroll = scrollHeight - clientHeight
    if (totalScroll > 0) {
      const progress = Math.min(Math.max(scrollTop / totalScroll, 0), 1)
      setScrollProgress(progress)
    }
  }

  if (!isOpen && !isClosing) return null

  const isScrollable = phase === 'unlocked' && !isClosing
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
        // zIndex 90 places modal directly below header (.nav has zIndex 100 in globals.css)
        zIndex: 90,
        backgroundColor: '#000000',
      }}
    >
      {/* 1. OPENING TOP-TO-BOTTOM CURTAIN WIPE LAYER (z-index 95) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 95,
          backgroundColor: '#000000',
          clipPath:
            phase === 'curtain-open'
              ? 'inset(0 0 0 0)'
              : 'inset(0 0 100% 0)',
          transition: 'clip-path 700ms cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. CLOSING BOTTOM-TO-TOP CURTAIN WIPE LAYER (z-index 96) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 96,
          backgroundColor: '#000000',
          transform: closeWipeActive ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 500ms cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* FIXED CLOSE PILL BUTTON (z-index 99) */}
      <button
        ref={closeBtnRef}
        onClick={handleClose}
        aria-label="Close About Us Modal"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          left: '1.25rem',
          zIndex: 99,
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

      {/* MODAL MAIN CONTENT & SCROLL CONTAINER (z-index 92) */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflowY: isScrollable ? 'auto' : 'hidden',
          overflowX: 'hidden',
          zIndex: 92,
          color: '#FFFFFF',
          background: '#000000',
        }}
      >
        {/* STATEMENT PHASE SCREEN (Visible during 'statement' phase) */}
        {phase === 'statement' && (
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
              zIndex: 93,
              animation: 'statementFadeIn 600ms ease forwards',
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
        )}

        {/* HERO REVEAL & MAIN SCROLL CONTENT (Visible during 'hero-intro' & 'unlocked') */}
        {(phase === 'hero-intro' || phase === 'unlocked') && (
          <>
            {/* HERO SECTION CONTAINER */}
            <div
              style={{
                position: 'relative',
                background: '#000000',
              }}
            >
              {/* Black Zone (83vh) */}
              <div
                style={{
                  position: 'relative',
                  height: '83vh',
                }}
              >
                {/* Left: Frostline Mark & Label */}
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

                {/* Right: Headline & Ghost Text */}
                <div
                  style={{
                    position: 'absolute',
                    left: '49.8vw',
                    top: '52vh',
                    transform: 'translateY(-50%)',
                    maxWidth: '41.2vw',
                  }}
                >
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

              {/* FULL-BLEED PHOTO SECTION (Fully visible photo, no intertwining or overlapping veils) */}
              <div
                style={{
                  position: 'relative',
                  width: '100vw',
                  minHeight: '100vh',
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000000',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={ASSETS.imgHero}
                  alt="Frostline Hero Athlete"
                  style={{
                    width: '100vw',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 25%',
                    display: 'block',
                  }}
                />

                {/* Micro-Captions on Vertical Midline (44vh) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '44vh',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 4vw',
                    fontFamily: 'var(--font-body, "Times New Roman", serif)',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
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

            {/* WHITE GRID SECTION - POSITIONED CLEANLY BELOW THE HERO PHOTO */}
            <div
              style={{
                position: 'relative',
                background: '#FFFFFF',
                color: '#000000',
                minHeight: '220vh',
                paddingTop: '6rem',
                paddingBottom: '8rem',
                zIndex: 1,
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
                {/* Left Column: Grayscale Square Image (Pinned) */}
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

                {/* Right Column: Landscape Images with Clipping */}
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

              {/* Inverted Black Frostline Chevron Mark (Static placement below content) */}
              <div
                style={{
                  position: 'relative',
                  marginTop: '6rem',
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
                    height: '60px',
                    objectFit: 'contain',
                    filter: 'brightness(0)',
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes statementFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
