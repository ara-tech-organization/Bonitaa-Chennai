import { WHY_US } from '../data'
import { useReveal } from '../hooks'
import Icon from './Icon'

export default function WhyUs() {
  const ref = useReveal()

  return (
    <section className="section section--cream why" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="eyebrow">
            <Icon name="BadgeCheck" size={13} />
            Why Chennai Trusts Us
          </span>
          <h2>
            Why Chennai Trusts <span className="gold-text">Bonitaa</span>
          </h2>
          <div className="rule" />
        </div>

        <ul className="why__grid">
          {WHY_US.map((item, i) => (
            <li key={item.title} className="why__item reveal" style={{ '--delay': `${i * 110}ms` }}>
              <span className="why__ic">
                <Icon name={item.icon} size={22} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
