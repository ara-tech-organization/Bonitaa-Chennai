import { TRUST_STATS } from '../data'
import { useReveal } from '../hooks'
import Icon from './Icon'

export default function TrustBar() {
  const ref = useReveal()

  return (
    <section className="trust" aria-label="Clinic credentials" ref={ref}>
      <div className="shell">
        <ul className="trust__grid">
          {TRUST_STATS.map((stat, i) => (
            <li key={stat.label} className="trust__item reveal" style={{ '--delay': `${i * 95}ms` }}>
              <span className="trust__ic">
                <Icon name={stat.icon} size={19} />
              </span>
              <strong className="trust__value">{stat.value}</strong>
              <span className="trust__label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
