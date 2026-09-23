export function Statement() {
  return (
    <section className="statement" aria-label="About Frostline" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Scaling Translucent Brand Mark Watermark behind text */}
      <div
        className="statement__watermark reveal"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'clamp(320px, 55vw, 650px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <img
          src="/FROSTLINEwhiteLOGOonly.png"
          alt=""
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
        />
      </div>

      <div className="reveal" style={{ position: 'relative', zIndex: 2 }}>
        <img
          src="/FROSTLINEwhiteLOGOonly.png"
          alt="FROSTLINE Mark"
          className="statement__mark-img"
          style={{
            width: '100px',
            maxHeight: '100px',
            objectFit: 'contain',
            display: 'block',
            marginBottom: '1.5rem',
          }}
        />
      </div>
      <h2 className="statement__text reveal" data-delay="1" style={{ position: 'relative', zIndex: 2 }}>
        Crafted for dreamers, built for believers. Born from the relentless chase of the personal record, rooted in a vision of faith, discipline, and purpose expressed through what we wear. For us, it's about showing up when it's hard, trusting the process, and wearing your confidence every single mile along the way.
      </h2>
    </section>
  )
}
