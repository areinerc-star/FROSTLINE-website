'use client'

import { useState, useEffect } from 'react'

export function Editorial() {
  const [isStoryOpen, setIsStoryOpen] = useState(false)

  // Prevent background scroll when story modal is open
  useEffect(() => {
    if (isStoryOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isStoryOpen])

  return (
    <>
      <section className="editorial" aria-label="Our products and community">
        <div className="section-label reveal">
          <p className="u-eyebrow">Our Products</p>
          <p className="u-eyebrow">Our Community</p>
        </div>
        <div className="editorial__grid">
          {/* Tile 1: OUR PRODUCT */}
          <div
            className="tile reveal"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const el = document.getElementById('products')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <img
              src="/images/pilipinas-3.png"
              alt="Close-up detail of FROSTLINE chest embroidery and technical fabric weave"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <span className="tile__label">Our Product</span>
          </div>

          {/* Tile 2: BEHIND FROSTLINE (with overlay buttons matching inspiration video) */}
          <div
            className="tile reveal"
            data-delay="1"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsStoryOpen(true)}
          >
            <img
              src="/images/hero-1.jpg"
              alt="FROSTLINE athlete training on the track in performance singlet"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                right: '1.25rem',
                zIndex: 3,
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                }}
              >
                BEHIND FROSTLINE
              </span>
              <span
                style={{
                  background: '#FFFFFF',
                  color: '#000000',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                READ MORE <span style={{ fontSize: '0.9rem' }}>→</span>
              </span>
            </div>
          </div>

          {/* Tile 3: OUR COMMUNITY */}
          <div
            className="tile reveal"
            data-delay="2"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const el = document.getElementById('giving-back')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <img
              src="/images/hero-2.jpg"
              alt="FROSTLINE athletic apparel styled for daily lifestyle off the track"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <span className="tile__label">Our Community</span>
          </div>
        </div>
      </section>

      {/* BEHIND FROSTLINE STORY MODAL (Matching video inspiration) */}
      {isStoryOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(12px)',
            color: '#FFFFFF',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '1.5rem 2rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src="/FROSTLINEwhiteLOGOonly.png"
                alt="FROSTLINE Logo"
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-headline, "Antonio", sans-serif)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                BEHIND FROSTLINE
              </span>
            </div>
            <button
              onClick={() => setIsStoryOpen(false)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                padding: '0.5rem 1.25rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                borderRadius: '2px',
              }}
            >
              CLOSE ✕
            </button>
          </div>

          {/* Modal Story Content */}
          <div
            style={{
              flex: 1,
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              padding: 'clamp(2rem, 5vw, 4rem) 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Visual Headline & Image */}
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-headline, "Antonio", "Anton", sans-serif)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                  marginBottom: '2rem',
                  color: '#FFFFFF',
                }}
              >
                CRAFTED FOR DREAMERS.<br />BUILT FOR BELIEVERS.
              </h2>
              <div style={{ aspectRatio: '4/3', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img
                  src="/images/hero-1.jpg"
                  alt="FROSTLINE Athlete"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Right Column: Complete Story & Manifesto */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p
                style={{
                  fontFamily: 'var(--font-headline, "Antonio", sans-serif)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                }}
              >
                // THE STORY OF FROSTLINE
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body, "Times New Roman", serif)',
                  fontSize: '1.2rem',
                  lineHeight: 1.7,
                  color: '#E0E0E0',
                }}
              >
                FROSTLINE was never just about gear. It’s about who’s wearing it—the runners chasing a PR before the sun’s even up, the ones who show up when it’s hard, and the community holding each other accountable one mile at a time.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body, "Times New Roman", serif)',
                  fontSize: '1.2rem',
                  lineHeight: 1.7,
                  color: '#E0E0E0',
                }}
              >
                Rooted in faith, discipline, and personal-record culture, every singlet, speed suit, and tee is engineered to honor the grind. No shortcuts, no empty hype—just relentless focus on the path ahead.
              </p>

              <div
                style={{
                  marginTop: '1rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-headline, "Antonio", sans-serif)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#FFFFFF',
                    marginBottom: '0.5rem',
                  }}
                >
                  KEEP THE FAITH. KEEP THE GRIND. KEEP GOING.
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-headline, "Antonio", sans-serif)',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  WEAR YOUR CONFIDENCE.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
