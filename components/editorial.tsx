export function Editorial() {
  return (
    <section className="editorial" aria-label="Our products and community">
      <div className="section-label reveal">
        <p className="u-eyebrow">Our Products</p>
        <p className="u-eyebrow">Our Community</p>
      </div>
      <div className="editorial__grid">
        <div className="tile reveal">
          <img
            src="/images/pilipinas-3.png"
            alt="Close-up detail of FROSTLINE chest embroidery and technical fabric weave"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span className="tile__label">Our Product</span>
        </div>
        <div className="tile reveal" data-delay="1">
          <img
            src="/images/hero-1.jpg"
            alt="FROSTLINE athlete training on the track in performance singlet"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span className="tile__label">Behind FROSTLINE</span>
        </div>
        <div className="tile reveal" data-delay="2">
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
  )
}
