'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

const SLIDES = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
]

interface HeroProps {
  onShopNowClick?: (e: React.MouseEvent) => void
}

export function Hero({ onShopNowClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState<number | null>(null)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isAnimating, setIsAnimating] = useState(false)
  const [parallaxY, setParallaxY] = useState(0)
  const animTimerRef = useRef<NodeJS.Timeout | null>(null)
  const heroRef = useRef<HTMLElement>(null)

  // Scroll handler for 1.35x foreground parallax rate over pinned background
  useEffect(() => {
    let handleScroll: () => void

    if (typeof window !== 'undefined') {
      handleScroll = () => {
        if (!heroRef.current) return
        const scrollY = window.scrollY
        const heroHeight = heroRef.current.offsetHeight
        if (scrollY <= heroHeight) {
          // Foreground moves faster (1.35x rate) while pinned background stays anchored
          setParallaxY(scrollY * 0.35)
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (targetIndex === currentSlide || isAnimating) return

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReduced) {
        setCurrentSlide(targetIndex)
        return
      }

      const isNext =
        targetIndex > currentSlide ||
        (currentSlide === SLIDES.length - 1 && targetIndex === 0)

      setPrevSlide(currentSlide)
      setDirection(isNext ? 'next' : 'prev')
      setCurrentSlide(targetIndex)
      setIsAnimating(true)

      if (animTimerRef.current) clearTimeout(animTimerRef.current)
      animTimerRef.current = setTimeout(() => {
        setIsAnimating(false)
        setPrevSlide(null)
      }, 650)
    },
    [currentSlide, isAnimating]
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % SLIDES.length
        const prefersReduced =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (!prefersReduced) {
          setPrevSlide(prev)
          setDirection('next')
          setIsAnimating(true)
          if (animTimerRef.current) clearTimeout(animTimerRef.current)
          animTimerRef.current = setTimeout(() => {
            setIsAnimating(false)
            setPrevSlide(null)
          }, 650)
        }
        return next
      })
    }, 5000)

    return () => {
      clearInterval(timer)
      if (animTimerRef.current) clearTimeout(animTimerRef.current)
    }
  }, [])

  return (
    <section ref={heroRef} className="hero" aria-label="Featured collection" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Background slide viewport covering 100% of hero */}
      <div
        className="hero__slides"
        id="heroSlides"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        {/* Render outgoing slide if animating */}
        {isAnimating && prevSlide !== null && (
          <div
            key={`outgoing-${prevSlide}-${currentSlide}`}
            className={`hero__slide ${direction === 'next' ? 'slide-out-to-top' : 'slide-out-to-bottom'}`}
            style={{ backgroundImage: `url('${SLIDES[prevSlide]}')`, zIndex: 1 }}
          />
        )}

        {/* Render active slide */}
        <div
          key={`active-${currentSlide}-${isAnimating ? 'anim' : 'idle'}`}
          className={`hero__slide ${
            isAnimating
              ? direction === 'next'
                ? 'slide-in-from-bottom'
                : 'slide-in-from-top'
              : 'slide-active'
          }`}
          style={{ backgroundImage: `url('${SLIDES[currentSlide]}')`, zIndex: 2 }}
        />
      </div>

      <div className="hero__index" id="heroIndex" role="tablist" aria-label="Hero slides" style={{ zIndex: 3 }}>
        {SLIDES.map((_, index) => (
          <button
            key={index}
            className={index === currentSlide ? 'is-active' : ''}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
          >
            {String(index + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      {/* Continuous Rotating Scroll Indicator Badge */}
      <div className="hero__scroll" aria-hidden="true" suppressHydrationWarning style={{ zIndex: 3 }}>
        <div className="scroll-indicator-badge">
          <img
            src="/FROSTLINEwhiteLOGOonly.png"
            alt=""
            style={{ width: '22px', height: '22px', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Foreground caption layer overlayed inside the hero photo frame */}
      <div
        className="hero__caption"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          transform: `translate3d(0, -${parallaxY}px, 0)`,
          willChange: 'transform',
        }}
      >
        <a className="hero__cta" href="#products" onClick={onShopNowClick}>
          <span>Shop Now</span>
          <span>Shop Now</span>
        </a>
        <h1 className="hero__headline">Wear Your Confidence</h1>
      </div>
    </section>
  )
}
