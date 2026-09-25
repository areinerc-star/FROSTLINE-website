'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface AboutUsModalProps {
  isOpen: boolean
  onClose: () => void
}

const ASSETS = {
  imgHero: '/images/about-us_imgHero.jpg',
  imgLeft: '/images/about-us-imgLeft.jpg',
  videoAboutUs: '/videos/about-us-vid.mp4',
  captionLeft: 'PHILIPPINES // 2026',
  captionRight: 'FROSTLINE OFFICIAL',
  logoMark: '/FROSTLINEwhiteLOGOonly.png',
  statementParagraph:
    "Born from the relentless chase of the personal record, rooted in faith, discipline, and the quiet hours before sunrise. For us, athletic apparel isn't just gear—it's a commitment to show up, trust the process, and walk your own path.",
  ourStory:
    "Sergio Tabornal started his journey at Far Eastern University FEU, facing a major turning point when an injury challenged his path. But every setback has a purpose, every hurdle a redirection. With a scholarship and a new chapter at Jose Rizal University JRU, that resilience turned into a championship run at NCAA Season 100. Even when paths change and chapters close under unexpected circumstances, there is no bitterness—only the steady belief that it is all part of a larger plan. The hardships we face don't define us; they reveal our capacity for growth, continued learning, and deeper meaning. It speaks to something deeply human: we are built through the grind, guided by faith, and shaped by every step of the journey.",
  headline: 'CRAFTED FOR DREAMERS.\nBUILT FOR BELIEVERS.',
}

type ModalPhase = 'curtain-open' | 'unlocked'

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

  // Handle open sequence: curtain wipe (0-0.7s) -> opens directly to Hero (targetoutcome.png)
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

      // 0.0s - 0.7s: Curtain wipe top-to-bottom
      // 0.7s+: Open directly to target Hero outcome (targetoutcome.png)
      const t1 = setTimeout(() => {
        setPhase('unlocked')
      }, 700)

      const tFocus = setTimeout(() => {
        closeBtnRef.current?.focus()
      }, 400)

      timerRefs.current = [t1, tFocus]

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
        {/* HERO SECTION CONTAINER (Directly reveals target outcome targetoutcome.png) */}
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
                {/* Left Column: Headline (CRAFTED FOR DREAMERS. BUILT FOR BELIEVERS.) */}
                <div
                  style={{
                    position: 'absolute',
                    left: '8.5vw',
                    top: '52vh',
                    transform: 'translateY(-50%)',
                    maxWidth: '38vw',
                    animation:
                      phase === 'hero-intro'
                        ? 'heroRiseIn 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        : 'none',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-headline, "Antonio", "Anton", sans-serif)',
                      fontSize: 'clamp(1.3vw, 1.6vw, 2.5rem)',
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

                {/* Right Column: [ OUR STORY ] Paragraph Block */}
                <div
                  style={{
                    position: 'absolute',
                    left: '49.8vw',
                    top: '52vh',
                    transform: 'translateY(-50%)',
                    maxWidth: '41.2vw',
                    animation:
                      phase === 'hero-intro'
                        ? 'heroRiseIn 600ms cubic-bezier(0.16, 1, 0.3, 1) 80ms forwards'
                        : 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-headline, "Antonio", "Anton", sans-serif)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.75rem',
                    }}
                  >
                    [ OUR STORY ]
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-body, "Times New Roman", serif)',
                      fontSize: 'clamp(11px, 0.8vw, 13px)',
                      lineHeight: 1.65,
                      color: 'rgba(255, 255, 255, 0.92)',
                      margin: 0,
                    }}
                  >
                    {ASSETS.ourStory}
                  </p>
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
                minHeight: '100vh',
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

                {/* Right Column: About Us Video */}
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'sticky',
                      top: '2rem',
                      width: '41.3vw',
                      overflow: 'hidden',
                      borderRadius: '2px',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                      backgroundColor: '#000000',
                    }}
                  >
                    <video
                      src={ASSETS.videoAboutUs}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '80vh',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
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
      </div>

      <style jsx global>{`
        @keyframes statementFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes statementFadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes heroRiseIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
