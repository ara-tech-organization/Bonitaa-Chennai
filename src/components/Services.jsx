import { SERVICES } from '../data'
import { useCall } from '../callStore'
import { useReveal } from '../hooks'
import Icon from './Icon'

export default function Services() {
  const ref = useReveal()
  const { requestCall } = useCall()

  return (
    <section className="section services" id="treatments" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="eyebrow">
            <Icon name="Sparkles" size={13} />
            Our Treatments
          </span>
          <h2>
            Hair Treatments We Offer in <span className="gold-text">Chennai</span>
          </h2>
          <p>Six proven solutions, matched to your specific hair concern.</p>
          <div className="rule" />
        </div>

        <div className="services__grid">
          {SERVICES.map((service, i) => (
            <article
              key={service.title}
              className="svc reveal"
              style={{ '--delay': `${i * 95}ms` }}
            >
              <span className="svc__ic">
                <Icon name={service.icon} size={23} />
              </span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <span className="svc__glow" aria-hidden="true" />
            </article>
          ))}
        </div>

        <div className="services__cta reveal">
          <div>
            <strong>Not sure which treatment you need?</strong>
            <span>Our specialist will tell you after a scalp assessment — no guesswork.</span>
          </div>
          <button type="button" className="btn btn--gold" onClick={() => requestCall()}>
            <Icon name="PhoneCall" size={17} />
            Ask Our Specialist
          </button>
        </div>
      </div>
    </section>
  )
}
