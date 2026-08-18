export function Statement() {
  return (
    <section className="statement" aria-label="About Odd Ritual">
      <div className="reveal">
        <svg
          className="statement__mark"
          viewBox="0 0 100 100"
          role="img"
          aria-label="Odd Ritual mark"
        >
          <circle cx="34" cy="30" r="14" fill="none" stroke="var(--ink)" strokeWidth="4" />
          <circle cx="66" cy="30" r="14" fill="none" stroke="var(--ink)" strokeWidth="4" />
          <circle cx="34" cy="30" r="4" fill="var(--ink)" />
          <circle cx="66" cy="30" r="4" fill="var(--ink)" />
          <path
            d="M30 48 Q50 92 70 48"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M50 52 L50 78"
            stroke="var(--ink)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h2 className="statement__text reveal" data-delay="1">
        Born from a shared love of the game, rooted in a vision of authenticity and creativity
        expressed through what we wear. For us, it's about the good times, on and off the course,
        self-expression, and an appreciation for the cultural overlaps we get to experience along the way.
      </h2>
    </section>
  )
}
