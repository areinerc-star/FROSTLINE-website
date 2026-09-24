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
  const [statementOpacity, setStatementOpacity] = useState(0)
  const [heroRevealed, setHeroRevealed] = useState(false)
  const [isScrollUnlocked, setIsScrollUnlocked] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [closeWipeActive, setCloseWipeActive] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const modalRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)
  const timerRefs = useRef<NodeJS.Timeout[]>([])

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t))
    timerRefs.current = []
  }

  // Absolute Timeline Execution with Forced Reflow for Curtain Paint
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      setIsClosing(false)
      setCloseWipeActive(false)
      setStatementOpacity(0)
      setHeroRevealed(false)
      setIsScrollUnlocked(false)
      setScrollProgress(0)

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }

      clearAllTimers()

      // 1. Force Browser Reflow on Curtain for Frame-Step Wipe Painting
      if (curtainRef.current) {
        curtainRef.current.style.transition = 'none'
        curtainRef.current.style.clipPath = 'inset(0 0 100% 0)'
        // Force synchronous layout reflow
        void curtainRef.current.offsetHeight
        curtainRef.current.style.transition = 'clip-path 700ms cubic-bezier(0.76, 0, 0.24, 1)'
        curtainRef.current.style.clipPath = 'inset(0 0 0 0)'
      }

      // 2. ABSOLUTE TIMELINE (Fixed Offsets):
      // 0.0s - 0.70s: Curtain top-to-bottom wipe
      // 0.75s - 1.05s: Statement fades in
      // 1.05s - 1.75s: Statement holds visible
      // 1.75s - 2.15s: Statement fades out
      // 2.15s - 2.90s: Hero reveal (Logo & headline fade + 12px rise, photo 17% peek)
      // 2.90s: Unlock modal scrolling
      // 4.00s: Safety fallback (forces hero state & scroll unlock if stalled)

      const tStatementIn = setTimeout(() => {
        setStatementOpacity(1)
      }, 750)

      const tStatementOut = setTimeout(() => {
        setStatementOpacity(0)
      }, 1750)

      const tHeroReveal = setTimeout(() => {
        setHeroRevealed(true)
      }, 2150)

      const tUnlockScroll = setTimeout(() => {
        setIsScrollUnlocked(true)
      }, 2900)

      // 3. FAIL-OPEN SAFETY TIMER at 4.0s
      const tSafetyFallback = setTimeout(() => {
        if (!isScrollUnlocked) {
          console.warn('AboutUsModal: Fallback safety triggered at 4.0s')
          setStatementOpacity(0)
          setHeroRevealed(true)
          setIsScrollUnlocked(true)
        }
      }, 4000)

      const tFocus = setTimeout(() => {
        closeBtnRef.current?.focus()
      }, 400)

      timerRefs.current = [tStatementIn, tStatementOut, tHeroReveal, tUnlockScroll, tSafetyFallback, tFocus]

      return () => clearAllTimers()
    } else {
      document.body.style.overflow = ''
      setIsClosing(false)
      setCloseWipeActive(false)
      setStatementOpacity(0)
      setHeroRevealed(false)
      setIsScrollUnlocked(false)
      setScrollProgress(0)
    }
  }, [isOpen])

  // Dedicated Upward Reverse Close Handler (0.5s)
  const handleClose = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)
    setCloseWipeActive(true)

    clearAllTimers()

    const tClose = setTimeout(() => {
      onClose()
      setIsClosing(false)
      setCloseWipeActive(false)
      setHeroRevealed(false)
      setIsScrollUnlocked(false)
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }, 500)

    timerRefs.current.push(tClose)
  }, [isClosing, onClose])

  // Esc Key & Focus Trap
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

  // Scroll Progress Tracking
  const handleScroll = () => {
    if (!isScrollUnlocked || !scrollContainerRef.current) return
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
      style={{
        position: 'fixed',
        inset: 0,
        // zIndex 90 stays directly below header (.nav has zIndex 100 in globals.css)
        zIndex: 90,
        background: 'transparent',
      }}
    >
      {/* 50% DIMMED BACKDROP LAYER OVER HOME PAGE */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 91,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          pointerEvents: 'none',
        }}
      />

      {/* 1. TOP-TO-BOTTOM BLACK CURTAIN WIPE LAYER (Forced Paint Reflow) */}
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

      {/* REVERSE CLOSE CURTAIN WIPE LAYER (Upward 0.5s) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 96,
          backgroundColor: '#000000',
          transform: closeWipeActive ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 500ms cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* FIXED CLOSE PILL BUTTON */}
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
            ? '1px solid rgba(0, 0, 0, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '2px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 300ms ease',
        }}
      >
        ABOUT US | CLOSE ×
      </button>

      {/* MAIN MODAL SCROLL CONTAINER */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflowY: isScrollUnlocked && !isClosing ? 'auto' : 'hidden',
          overflowX: 'hidden',
          zIndex: 92,
          color: '#FFFFFF',
          background: '#000000',
        }}
      >
        {/* STATEMENT BLOCK OVERLAY: Starts at ~49.8vw to 91vw on SAME ROW */}
        <div
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
            opacity: statementOpacity,
            transition: 'opacity 400ms ease-in-out',
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

        {/* HERO REVEAL & MAIN CONTENT CONTAINER */}
        <div
          style={{
            position: 'relative',
            opacity: heroRevealed ? 1 : 0,
            transition: 'opacity 500ms ease-out',
          }}
        >
          {/* HERO BLACK ZONE (83vh tall) + PHOTO PEEK (17vh tall) */}
          <div
            style={{
              position: 'relative',
              background: '#000000',
            }}
          >
            {/* Black Zone 83vh */}
            <div
              style={{
                position: 'relative',
                height: '83vh',
              }}
            >
              {/* Left: Frostline Mark & Label (~8.5vw left, ~55vh vertical center) */}
              <div
                style={{
                  position: 'absolute',
                  left: '8.5vw',
                  top: '55vh',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  animation: heroRevealed
                    ? 'riseIn 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    : 'none',
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
                style={{
                  position: 'absolute',
                  left: '49.8vw',
                  top: '52vh',
                  transform: 'translateY(-50%)',
                  width: '41.2vw',
                  maxWidth: '41.2vw',
                  animation: heroRevealed
                    ? 'riseIn 700ms cubic-bezier(0.16, 1, 0.3, 1) 80ms forwards'
                    : 'none',
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
      </div>

      <style jsx global>{`
        @keyframes riseIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
