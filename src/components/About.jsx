import logo from '../assets/Logo.png'
import { scrollToBooking } from '../callStore'
import { useReveal } from '../hooks'
import Icon from './Icon'

const PILLARS = [
  { icon: 'Microscope', title: 'Scalp & hair analysis first', copy: 'Never a one-size-fits-all fix.' },
  { icon: 'ShieldCheck', title: 'FDA-approved treatments', copy: 'Backed by modern restoration tech.' },
]

/* Taken from the clinic's own description of the first consultation. */
const CONSULT = [
  'Your scalp and hair condition examined',
  'Your history and concerns discussed',
  'A treatment plan recommended for you',
]

export default function About() {
  const ref = useReveal()

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="shell about__inner">
        <div className="about__media reveal">
          <div className="about__panel">
            <img className="about__panel-mark" src={logo} alt="" width="150" height="37" loading="lazy" />

            <h3 className="about__panel-title">What your first consultation includes</h3>

            <ul className="about__panel-list">
              {CONSULT.map((item, i) => (
                <li key={item} style={{ '--i': i }}>
                  <span className="about__panel-check">
                    <Icon name="Check" size={14} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="about__panel-note">
              <Icon name="Lock" size={14} />
              No treatment is recommended before your scalp is examined.
            </p>
          </div>

          <div className="about__stat">
            <strong>15</strong>
            <span>
              Years of
              <br />
              trichology care
            </span>
          </div>
        </div>

        <div className="about__copy">
          <span className="eyebrow reveal">
            <Icon name="Sparkles" size={13} />
            About Our Chennai Clinic
          </span>

          <h2 className="reveal" style={{ '--delay': '60ms' }}>
            Expert Hair Care, <span className="gold-text">Rooted in Chennai</span>
          </h2>

          <p className="about__sub reveal" style={{ '--delay': '110ms' }}>
            Personalised, Trichology-Led Treatment Plans
          </p>

          <p className="reveal" style={{ '--delay': '160ms' }}>
            Every treatment at our Chennai clinic starts with a proper scalp and hair analysis — not a
            one-size-fits-all fix. Our certified trichologists study the root cause behind your hair
            fall, thinning, or baldness, then build a plan around it using FDA-approved treatments and
            modern hair restoration technology.
          </p>

          <p className="reveal" style={{ '--delay': '200ms' }}>
            Backed by a network of clinics across Tamil Nadu, our approach hasn&apos;t changed in 15
            years: <strong className="about__em">treat the cause, not just the symptom.</strong>
          </p>

          <ul className="about__pillars reveal" style={{ '--delay': '250ms' }}>
            {PILLARS.map((p) => (
              <li key={p.title}>
                <span className="about__pillar-ic">
                  <Icon name={p.icon} size={18} />
                </span>
                <div>
                  <strong>{p.title}</strong>
                  <small>{p.copy}</small>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn btn--outline reveal"
            style={{ '--delay': '300ms' }}
            onClick={scrollToBooking}
          >
            Check If This Suits You
            <Icon name="ArrowRight" size={18} className="arrow" />
          </button>
        </div>
      </div>
    </section>
  )
}
