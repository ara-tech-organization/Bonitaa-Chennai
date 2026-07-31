import { useState } from 'react'
import { FAQS } from '../data'
import { useCall } from '../callStore'
import { useReveal } from '../hooks'
import Icon from './Icon'

export default function Faq() {
  const ref = useReveal()
  const [open, setOpen] = useState(0)
  const { requestCall } = useCall()

  return (
    <section className="section section--cream faq" id="faq" ref={ref}>
      <div className="shell faq__inner">
        <div className="section-head reveal">
          <span className="eyebrow">
            <Icon name="MessageCircleQuestion" size={13} />
            FAQ
          </span>
          <h2>Frequently Asked Questions</h2>
          <div className="rule" />
        </div>

        <div className="faq__list">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className={`qa reveal${isOpen ? ' is-open' : ''}`} style={{ '--delay': `${i * 60}ms` }}>
                <button
                  type="button"
                  className="qa__q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className="qa__icon" aria-hidden="true">
                    <Icon name="ChevronDown" size={18} />
                  </span>
                </button>
                {/* Kept mounted so the open/close height can animate; `inert` keeps
                    collapsed answers out of the a11y tree and tab order. */}
                <div className="qa__panel" id={`faq-panel-${i}`} role="region" inert={!isOpen}>
                  <p>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="faq__cta reveal">
          <p>Still have questions?</p>
          <button type="button" className="btn btn--outline btn--lg" onClick={() => requestCall()}>
            <Icon name="PhoneCall" size={18} />
            Call the Clinic Directly
          </button>
        </div>
      </div>
    </section>
  )
}
