'use client'

import { useEffect, useState } from 'react'

const SLIDES = [
  '/images/hero.png',
  '/images/editorial-detail.png',
  '/images/editorial-course.png',
]

interface HeroProps {
  onShopNowClick?: (e: React.MouseEvent) => void
}

export function Hero({ onShopNowClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero" aria-label="Featured collection">
      <div className="hero__slides" id="heroSlides">
        {SLIDES.map((src, index) => (
          <div
            key={src}
            className={`hero__slide ${index === currentSlide ? 'is-active' : ''}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>

      <div className="hero__index" id="heroIndex" role="tablist" aria-label="Hero slides">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            className={index === currentSlide ? 'is-active' : ''}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Slide ${index + 1}`}
          >
            {String(index + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      <div className="hero__scroll" aria-hidden="true" suppressHydrationWarning>
        Scroll <span suppressHydrationWarning />
      </div>

      <div className="hero__caption">
        <a className="hero__cta" href="#products" onClick={onShopNowClick}>
          <span>Shop Now</span>
          <span>Shop Now</span>
        </a>
        <h1 className="hero__headline">Wear Your Confidence</h1>
      </div>
    </section>
  )
}
