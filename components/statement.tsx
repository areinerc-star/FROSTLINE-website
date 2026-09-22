export function Statement() {
  return (
    <section className="statement" aria-label="About Frostline">
      <div className="reveal">
        <img
          src="/FROSTLINEwhiteLOGOonly.png"
          alt="FROSTLINE Mark"
          className="statement__mark-img"
          style={{
            width: '110px',
            maxHeight: '110px',
            objectFit: 'contain',
            display: 'block',
            marginBottom: '1.5rem',
          }}
        />
      </div>
      <div className="statement__text reveal" data-delay="1" style={{ maxWidth: '32ch' }}>
        <p
          style={{
            fontFamily: 'var(--font-headline, "Antonio", "Anton", sans-serif)',
            fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1.2,
            marginBottom: '1rem',
            color: '#FFFFFF',
          }}
        >
          CRAFTED FOR DREAMERS. BUILT FOR BELIEVERS.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body, "Times New Roman", serif)',
            fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
            lineHeight: 1.65,
            marginBottom: '1.25rem',
            color: '#D0D0D0',
            fontWeight: 400,
          }}
        >
          Born from the relentless chase of the personal record, rooted in faith, discipline, and the quiet hours before sunrise. For us, athletic apparel isn't just gear—it's a commitment to show up, trust the process, and walk your own path.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-headline, "Antonio", "Anton", sans-serif)',
            fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#FFFFFF',
            marginTop: '0.5rem',
          }}
        >
          WEAR YOUR CONFIDENCE.
        </p>
      </div>
    </section>
  )
}
