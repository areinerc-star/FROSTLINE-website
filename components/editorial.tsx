export function Editorial() {
  return (
    <section className="editorial" aria-label="Our products">
      <div className="section-label reveal">
        <p className="u-eyebrow">Our Products</p>
        <p className="u-eyebrow">Our Community</p>
      </div>
      <div className="editorial__grid">
        <div className="tile reveal">
          <img
            src="/images/editorial-detail.png"
            alt="Detail of a signet ring resting on a corduroy jacket"
            loading="lazy"
          />
          <span className="tile__label">The Details</span>
        </div>
        <div className="tile reveal" data-delay="1">
          <img
            src="/images/editorial-course.png"
            alt="Golf course green at dusk with a flag pin"
            loading="lazy"
          />
          <span className="tile__label">On The Course</span>
        </div>
        <div className="tile reveal" data-delay="2">
          <img
            src="/images/hero.png"
            alt="Two men in Odd Ritual apparel in a studio setting"
            loading="lazy"
          />
          <span className="tile__label">Off The Course</span>
        </div>
      </div>
    </section>
  )
}
