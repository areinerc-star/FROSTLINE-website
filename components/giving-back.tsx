import Image from 'next/image'

export function GivingBack() {
  return (
    <section className="giving" aria-label="Giving back">
      <div className="giving__intro reveal">
        <h2>Giving Back</h2>
        <p>
          Frostline was never just about gear. It's about who's wearing it — the runners chasing a PR before the sun's even up, the ones who show up when it's hard, the community holding each other accountable one mile at a time. That's why we stand behind PR Project. Not as a sponsor watching from the sidelines. As part of the run.
        </p>
        <span className="giving__tag">Our Community</span>
      </div>

      <div className="partner-card-wrapper reveal" style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <div className="partner-card">
          <div className="partner-card__mark-wrap">
            <Image
              src="/b_w_PR-PROJECT-Logo_transparent.png"
              alt="PR Project logo"
              width={100}
              height={100}
              className="partner-card__mark"
              style={{ width: 'auto', height: 'auto', maxHeight: '72px', objectFit: 'contain' }}
            />
          </div>
          <div className="partner-card__body">
            <h4>PR Project</h4>
            <p>
              A run club built on personal records and personal growth. Every mile logged, every PR earned, every runner welcomed — this is where the Frostline community trains, races, and keeps each other honest.
            </p>
          </div>
          <a
            href="https://pr-project-community-website-br96.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="partner-card__link"
          >
            Visit Website ↗
          </a>
        </div>
      </div>
    </section>
  )
}

