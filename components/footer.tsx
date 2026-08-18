'use client'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand reveal">
          <div className="footer__logo-wrap" style={{ marginBottom: '2rem' }}>
            <img
              src="/FROSTLINEwhiteLOGOonly.png"
              alt="FROSTLINE Icon"
              className="footer__logo-img"
              style={{
                height: 'clamp(220px, 25vw, 320px)',
                maxHeight: '350px',
                width: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </div>
          <p className="footer__tagline">
            Odd Ritual Golf Club
            <br />
            A Modern Expression of Heritage
          </p>
        </div>

        <nav className="footer__links reveal" data-delay="1" aria-label="Footer">
          <div className="footer__col">
            <p className="head">Site Index</p>
            <a href="#products">Shop Now</a>
            <a href="#top">Home</a>
            <a href="#">About Us</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer__col">
            <p className="head">Social</p>
            <a href="#">Instagram</a>
          </div>
          <div className="footer__col">
            <p className="head">Get In Touch</p>
            <a href="mailto:hello@oddritualgolf.com">hello@oddritualgolf.com</a>
            <a href="tel:+27762073387">+27 76 207 33 87</a>
          </div>
          <div className="footer__col">
            <p className="head">Legal</p>
            <a href="#">Privacy Policy</a>
            <a href="#">Refunds</a>
            <a href="#">Shipping</a>
            <a href="#">Terms of Service</a>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <p>All Rights Reserved _ ORGC©2025</p>
        <a href="#">Recreation Build</a>
      </div>
    </footer>
  )
}
