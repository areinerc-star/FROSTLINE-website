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
        {/* Tile 1: OUR PRODUCT (Routes to store #products) */}
        <a
          href="#products"
          className="tile reveal"
          style={{ cursor: 'pointer', display: 'block', textDecoration: 'none' }}
          onClick={(e) => {
            e.preventDefault()
            const el = document.getElementById('products')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <img
            src="/images/our-product_thumbnail.jpg"
            alt="Close-up detail of FROSTLINE chest embroidery and technical fabric weave"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span className="tile__label">Our Product</span>
        </a>

        {/* Tile 2: ABOUT US (Plain label, triggers About Us modal) */}
        <div
          className="tile reveal"
          data-delay="1"
          role="button"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
          onClick={toggleStory}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleStory()
            }
          }}
        >
          <img
            src="/images/about-us_thumbnail.jpg"
            alt="FROSTLINE athlete training on the track in performance singlet"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.25rem',
              zIndex: 3,
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            ABOUT US
          </span>
        </div>

        {/* Tile 3: OUR COMMUNITY (Routes to Instagram in new tab) */}
        <a
          href="https://www.instagram.com/frostline_est.2025/"
          target="_blank"
          rel="noopener noreferrer"
          className="tile reveal"
          data-delay="2"
          style={{ cursor: 'pointer', display: 'block', textDecoration: 'none' }}
        >
          <img
            src="/images/our-community_thumbnail.jpg"
            alt="FROSTLINE athletic apparel styled for daily lifestyle off the track"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span className="tile__label">Our Community</span>
        </a>
      </div>

      <AboutUsModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </section>
  )
}
