'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

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
  const [prevSlide, setPrevSlide] = useState<number | null>(null)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isAnimating, setIsAnimating] = useState(false)
  const animTimerRef = useRef<NodeJS.Timeout | null>(null)

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
    <section className="hero" aria-label="Featured collection">
      <div className="hero__slides" id="heroSlides">
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

      <div className="hero__index" id="heroIndex" role="tablist" aria-label="Hero slides">
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
