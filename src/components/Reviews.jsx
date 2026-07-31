import { REVIEWS } from '../data'
import { scrollToBooking } from '../callStore'
import { useReveal } from '../hooks'
import Icon from './Icon'

function Stars({ size = 15 }) {
  return (
    <div className="stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="Star" size={size} fill="currentColor" />
      ))}
    </div>
  )
}

export default function Reviews() {
  const ref = useReveal()

  return (
    <section className="section reviews" id="reviews" ref={ref}>
      <div className="shell reviews__inner">
        <aside className="reviews__aside reveal">
          <span className="eyebrow">
            <Icon name="Star" size={13} />
            Google Reviews
          </span>

          <h2>
            What Our <span className="gold-text">Chennai Patients</span> Say
          </h2>

          <div className="score">
            <strong className="score__value">4.8</strong>
            <div className="score__meta">
              <Stars size={17} />
              <small>Rated across Google reviews</small>
            </div>
          </div>

          <p className="reviews__intro">
            Unedited reviews from patients treated at Bonitaa Skin and Hair Care.
          </p>

          <button type="button" className="btn btn--gold" onClick={scrollToBooking}>
            Book Your Consultation Today
            <Icon name="ArrowRight" size={18} className="arrow" />
          </button>
        </aside>

        <ol className="reviews__list">
          {REVIEWS.map((review, i) => (
            <li key={review.name} className="rev reveal" style={{ '--delay': `${i * 110}ms` }}>
              <div className="rev__head">
                <span className="rev__avatar" aria-hidden="true">
                  {review.name.charAt(0)}
                </span>
                <span className="rev__who">
                  <strong>{review.name}</strong>
                  <small>{review.treatment}</small>
                </span>
                <span className="rev__badge">
                  <Icon name="BadgeCheck" size={14} />
                  Google
                </span>
              </div>

              <Stars />

              <p className="rev__text">{review.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
