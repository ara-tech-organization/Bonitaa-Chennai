import { BRANCHES, CLINIC } from '../data'
import { useReveal } from '../hooks'
import Icon from './Icon'

export default function Locations() {
  const ref = useReveal()

  return (
    <section className="section locations" id="locations" ref={ref}>
      <div className="shell">
        <div className="locations__grid">
          {BRANCHES.map((branch, i) => (
            <article
              key={branch.id}
              className="loc-card reveal"
              style={{ '--delay': `${i * 90}ms` }}
            >
              <div className="loc-card__map">
                <iframe
                  src={branch.embed}
                  title={`${CLINIC.name} — ${branch.name} on Google Maps`}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              <div className="loc-card__body">
                <h3>
                  <Icon name="MapPin" size={17} />
                  {branch.name}
                </h3>
                <address>
                  {branch.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
                <a
                  className="loc-card__link"
                  href={branch.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="Navigation" size={14} />
                  Get Directions
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
