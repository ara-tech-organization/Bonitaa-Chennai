import logo from '../assets/Logo.png'
import { CLINIC } from '../data'
import { scrollToBooking, useCall } from '../callStore'
import { useReveal } from '../hooks'
import Icon from './Icon'

const TRUST = ['4.8★ Google Rating', '15+ Years of Excellence', '35+ Branches Across Tamil Nadu']

const STATS = [
  { icon: 'Star', value: '4.8 / 5', label: 'Google Rated' },
  { icon: 'Users', value: '10,000+', label: 'Patients Treated' },
  { icon: 'ShieldCheck', value: '18+', label: 'FDA-Cleared Treatments' },
]

export default function Hero() {
  const ref = useReveal()
  const { requestCall } = useCall()

  return (
    <section className="hero" id="top" ref={ref}>
      {/* Decorative 3D backdrop: gold rings tilted in real perspective, turning
          slowly around the centred content. Pure CSS — no video asset. */}
      <div className="stage" aria-hidden="true">
        <div className="stage__glow" />
        <div className="stage__rings">
          <span className="ring ring--1" />
          <span className="ring ring--2" />
          <span className="ring ring--3" />
          <span className="ring ring--4" />
        </div>
      </div>

      <div className="shell hero__inner">
        <div className="hero__mark reveal">
          <span className="hero__mark-sheen" aria-hidden="true" />
          <span className="hero__mark-scan" aria-hidden="true" />
          <img src={logo} alt="" width="150" height="37" />
        </div>

        <span className="eyebrow reveal" style={{ '--delay': '60ms' }}>
          <Icon name="Sparkles" size={13} />
          Chennai&apos;s Hair &amp; Scalp Specialists
        </span>

        <h1 className="reveal" style={{ '--delay': '110ms' }}>
          Chennai&apos;s Trusted <span className="gold-text">Hair Fall Treatment</span> Clinic
        </h1>

        <p className="hero__sub reveal" style={{ '--delay': '170ms' }}>
          Expert Hair Specialists in Chennai
          <span className="hero__dot" />
          4.8★ Google Rated
          <span className="hero__dot" />
          15+ Years of Proven Results
        </p>

        <p className="hero__body reveal" style={{ '--delay': '220ms' }}>
          Hair fall, thinning, or bald patches don&apos;t have to be permanent. Get a treatment plan
          designed around your scalp, your hair type, and your goals — from experienced hair
          specialists across Chennai.
        </p>

        <div className="hero__cta reveal" style={{ '--delay': '280ms' }}>
          <button type="button" className="btn btn--gold btn--lg" onClick={() => requestCall()}>
            <Icon name="PhoneCall" size={18} />
            Speak to a Specialist
          </button>
          <button type="button" className="btn btn--outline btn--lg" onClick={scrollToBooking}>
            Book a Consultation
            <Icon name="ArrowRight" size={18} className="arrow" />
          </button>
        </div>

        <ul className="hero__trust reveal" style={{ '--delay': '330ms' }}>
          {TRUST.map((item) => (
            <li key={item}>
              <Icon name="Check" size={14} />
              {item}
            </li>
          ))}
        </ul>

        <div className="hero__stats">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="hstat reveal" style={{ '--delay': `${380 + i * 90}ms` }}>
              <span className="hstat__ic">
                <Icon name={stat.icon} size={18} />
              </span>
              <span className="hstat__text">
                <strong>{stat.value}</strong>
                <small>{stat.label}</small>
              </span>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="hero__phone-strip" onClick={() => requestCall()}>
        <Icon name="Phone" size={15} />
        Prefer to talk now? {CLINIC.phoneDisplay}
      </button>
    </section>
  )
}
