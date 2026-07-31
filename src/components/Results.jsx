import { RESULTS } from '../data'
import { scrollToBooking } from '../callStore'
import { useReveal } from '../hooks'
import Icon from './Icon'

/* Two passes of the same six. The track slides exactly one pass and restarts,
   so 06 is followed by 01 with no visible seam — an endless 1→6→1→6 loop. */
const LOOP = [...RESULTS, ...RESULTS]

export default function Results() {
  const ref = useReveal()

  return (
    <section className="section section--cream results" id="results" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="eyebrow">
            <Icon name="Sparkles" size={13} />
            Real Results
          </span>
          <h2>
            Real Hair Transformations, <span className="gold-text">Real Chennai Patients</span>
          </h2>
          <p>Verified results from our Chennai clinic — not stock photos.</p>
          <div className="rule" />
        </div>
      </div>

      <div className="marquee reveal" role="region" aria-label="Patient before and after results">
        <div className="marquee__track">
          {LOOP.map((item, i) => {
            const isClone = i >= RESULTS.length
            return (
              <figure
                key={`${item.src}-${i}`}
                className="rcard"
                /* The second pass is decorative duplication — hide it from
                   assistive tech so each result is announced once. */
                aria-hidden={isClone || undefined}
              >
                <div className="rcard__frame">
                  <div className="rcard__media">
                    <img
                      src={item.src}
                      alt={
                        isClone
                          ? ''
                          : `${item.caption} — ${item.treatment} result at our Chennai clinic`
                      }
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                <figcaption className="rcard__foot">
                  <span className="rcard__treatment">{item.treatment}</span>
                  <span className="rcard__caption">{item.caption}</span>
                  <span className="rcard__underline" aria-hidden="true" />
                </figcaption>
              </figure>
            )
          })}
        </div>

        <span className="marquee__fade marquee__fade--l" aria-hidden="true" />
        <span className="marquee__fade marquee__fade--r" aria-hidden="true" />
      </div>

      <div className="shell">
        <div className="rail__foot reveal">
          <p className="rail__note">
            Photographs of consenting patients. Results differ from person to person depending on
            scalp condition, hair type, and treatment stage.
          </p>

          <button type="button" className="btn btn--gold btn--lg" onClick={scrollToBooking}>
            Book a Consultation
            <Icon name="ArrowRight" size={18} className="arrow" />
          </button>

          <span className="section-end" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
