'use client'

import { useState, useRef } from 'react'
import { AboutUsModal } from './about-us-modal'

export function Editorial() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  const toggleStory = () => {
    setIsAboutModalOpen(true)
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
              {isAboutModalOpen ? 'CLOSE ✕' : 'READ MORE →'}
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

      <AboutUsModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </section>
  )
}
