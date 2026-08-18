const PARTNERS = [
  {
    title: 'Fairways to Africa',
    description:
      'Bespoke golf travel. Like our clients, we are golfers — young-at-heart, seeking unique experiences whilst playing the sport we love around the world.',
    delay: 0,
  },
  {
    title: 'StartWell Foundation',
    description:
      'A passionate team making a measurable difference in the fight against malnutrition — designing, producing, and delivering nutrient-rich meals to vulnerable communities.',
    delay: 1,
  },
  {
    title: '242',
    description:
      "The world moves fast, but we believe there's something powerful about slowing down. A moment to connect, made with care: coffee & connections.",
    delay: 2,
  },
  {
    title: 'Running Late Club',
    description:
      'A community where Everyday Athletes can find a place to belong. We cater to all paces and levels, providing the accountability and inspiration to reach your goals.',
    delay: 3,
  },
]

export function GivingBack() {
  return (
    <section className="giving" aria-label="Giving back">
      <div className="giving__intro reveal">
        <h2>Giving Back</h2>
        <p>
          We never set out to be just a golf brand. Odd Ritual is as much about culture as it is about
          the game — and part of that is showing up for the communities we belong to. From day one, we've
          believed in using the platform we're building to give back: supporting local initiatives,
          collaborating with purpose-led partners, and investing in the kind of change that outlives a
          single round of golf.
        </p>
        <span className="giving__tag">Our Greater Community</span>
      </div>

      <div className="partners">
        {PARTNERS.map((partner) => (
          <article
            key={partner.title}
            className="partner reveal"
            data-delay={partner.delay}
          >
            <span className="partner__visit">Visit Website</span>
            <h4>{partner.title}</h4>
            <p>{partner.description}</p>
            <a
              href="#"
              className="partner__arrow"
              aria-label={`Visit ${partner.title}`}
            >
              →
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
