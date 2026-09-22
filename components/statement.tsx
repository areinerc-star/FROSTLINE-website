export function Statement() {
  return (
    <section className="statement" aria-label="About Frostline">
      <div className="reveal">
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
      <h2 className="statement__text reveal" data-delay="1">
        Crafted for dreamers, built for believers. Born from the relentless chase of the personal record, rooted in a vision of faith, discipline, and purpose expressed through what we wear. For us, it's about showing up when it's hard, trusting the process, and wearing your confidence every single mile along the way.
      </h2>
    </section>
  )
}
