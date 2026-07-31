import { CLINIC } from '../data'
import { useCall } from '../callStore'
import { useReveal } from '../hooks'
import Icon from './Icon'
import LeadForm from './LeadForm'

const ASSURANCES = [
  { icon: 'ClipboardCheck', text: 'Scalp analysis before any treatment is recommended' },
  { icon: 'BadgeCheck', text: 'Consultation with a certified trichologist' },
  { icon: 'Lock', text: 'Your details are never shared or sold' },
]

export default function Booking() {
  const ref = useReveal()
  const { requestCall } = useCall()

  return (
    <section className="section booking" id="book" ref={ref}>
      <div className="shell booking__inner">
        <div className="booking__aside reveal">
          <span className="eyebrow">
            <Icon name="CalendarCheck" size={13} />
            Appointments
          </span>
          <h2>
            Book a Consultation in <span className="gold-text">Chennai</span>
          </h2>
          <p className="booking__sub">
            Tell us where you&apos;d like to be seen — our team will call you back within 30 minutes.
          </p>

          <ul className="booking__list">
            {ASSURANCES.map((item) => (
              <li key={item.text}>
                <span className="booking__list-ic">
                  <Icon name={item.icon} size={16} />
                </span>
                {item.text}
              </li>
            ))}
          </ul>

          <div className="booking__call">
            <p>Prefer to talk right away?</p>
            <button type="button" className="btn btn--outline" onClick={() => requestCall()}>
              <Icon name="PhoneCall" size={17} />
              Speak to a Specialist
            </button>
            <small className="booking__call-num">{CLINIC.phoneDisplay}</small>
          </div>
        </div>

        <div className="booking__card reveal" style={{ '--delay': '110ms' }}>
          <div className="booking__card-top">
            <h3>Request a callback</h3>
            <span className="booking__badge">
              <span className="booking__pulse" aria-hidden="true" />
              Replies in 30 min
            </span>
          </div>
          <LeadForm idPrefix="lead" />
        </div>
      </div>
    </section>
  )
}
