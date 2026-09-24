'use client'

import { useState, useRef } from 'react'
import { AboutUsModal } from './about-us-modal'

export function Editorial() {
  const [isStoryExpanded, setIsStoryExpanded] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const storyRef = useRef<HTMLDivElement>(null)

  const toggleStory = () => {
    setIsAboutModalOpen(true)
    setIsStoryExpanded((prev) => {
      const nextState = !prev
      if (nextState) {
        setTimeout(() => {
          if (storyRef.current) {
            storyRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }, 150)
      }
      return nextState
    })
  }

  return (
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

        {/* Tile 2: BEHIND FROSTLINE (with video-exact overlay tags) */}
        <div
          className="tile reveal"
          data-delay="1"
          style={{ cursor: 'pointer' }}
          onClick={toggleStory}
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
              ABOUT US
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
                transition: 'all 0.2s ease',
              }}
            >
              {isStoryExpanded ? 'CLOSE ✕' : 'READ MORE →'}
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

      {/* BEHIND FROSTLINE IN-PAGE SLIDE-DOWN EXPANDABLE STORY BANNER (Video Exact Replication) */}
      <div
        ref={storyRef}
        style={{
          maxHeight: isStoryExpanded ? '1000px' : '0px',
          opacity: isStoryExpanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          marginTop: isStoryExpanded ? '2rem' : '0px',
          background: '#050505',
          border: isStoryExpanded ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3.5rem)',
            transform: isStoryExpanded ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'start',
          }}
        >
          {/* Column 1: Logo Mark & Icon */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <img
              src="/FROSTLINEwhiteLOGOonly.png"
              alt="FROSTLINE Mark"
              style={{ width: '90px', height: 'auto', objectFit: 'contain' }}
            />
            <p
              style={{
                fontFamily: 'var(--font-headline, "Antonio", sans-serif)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
              }}
            >
              BEHIND FROSTLINE
            </p>
          </div>

          {/* Column 2: Main Headline Statement */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-headline, "Antonio", "Anton", sans-serif)',
                fontSize: 'clamp(1.6rem, 3.2vw, 2.75rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                lineHeight: 1.15,
                color: '#FFFFFF',
              }}
            >
              CRAFTED FOR DREAMERS.<br />BUILT FOR BELIEVERS.
            </h3>
          </div>

          {/* Column 3: Narrative & Signature Closer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-body, "Times New Roman", serif)',
                fontSize: '1.1rem',
                lineHeight: 1.65,
                color: '#D0D0D0',
                margin: 0,
              }}
            >
              Born from the relentless chase of the personal record, rooted in faith, discipline, and the quiet hours before sunrise. For us, athletic apparel isn't just gear—it's a commitment to show up, trust the process, and walk your own path.
            </p>
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                paddingTop: '1rem',
                marginTop: '0.5rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-headline, "Antonio", sans-serif)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                WEAR YOUR CONFIDENCE.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AboutUsModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </section>
  )
}
