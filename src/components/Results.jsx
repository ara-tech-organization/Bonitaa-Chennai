import { useCallback, useEffect, useRef, useState } from 'react'
import { RESULTS } from '../data'
import { scrollToBooking } from '../callStore'
import { useReveal } from '../hooks'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import Icon from './Icon'

const TOTAL = RESULTS.length
const PANEL_ID = 'rr-panel'

/** 0 → "01". The case index is set in serif numerals, so it needs the zero. */
const pad = (n) => String(n + 1).padStart(2, '0')

/**
 * A curated case viewer rather than a conveyor of cards: one photograph held
 * large, with the six cases listed beside it as an index. The active row opens
 * to show its outcome and runs a timing bar; when that bar finishes it hands
 * over to the next case. Hovering or focusing the stage pauses the bar, so
 * reading a case never gets interrupted.
 */
export default function Results() {
  const ref = useReveal()
  const reduced = usePrefersReducedMotion()
  const stageRef = useRef(null)
  const tabsRef = useRef([])

  const [active, setActive] = useState(0)
  /* Autoplay only runs when the stage is both on screen and unattended. */
  const [onScreen, setOnScreen] = useState(false)
  const [held, setHeld] = useState(false)

  useEffect(() => {
    const el = stageRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setOnScreen(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.3,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const go = useCallback((next, focus) => {
    const i = (next + TOTAL) % TOTAL
    setActive(i)
    if (focus) tabsRef.current[i]?.focus()
  }, [])

  /* Roving arrow keys across the index, per the tablist pattern. */
  const onKeyDown = (event) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (step) {
      event.preventDefault()
      go(active + step, true)
      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      go(event.key === 'Home' ? 0 : TOTAL - 1, true)
    }
  }

  const current = RESULTS[active]

  return (
    <section className="section section--cream rr" id="results" ref={ref}>
      <div className="shell">
        <div className="results__head rr__head reveal">
          <div>
            <span className="eyebrow">
              <Icon name="Sparkles" size={13} />
              Real Results
            </span>
            <h2>
              Real Hair Transformations, <span className="gold-text">Real Chennai Patients</span>
            </h2>
            <p>Verified results from our Chennai clinic — not stock photos.</p>
          </div>

          <div className="rr__seal">
            <span className="rr__seal-mark" aria-hidden="true">
              <Icon name="BadgeCheck" size={19} />
            </span>
            <span className="rr__seal-copy">
              <strong>{TOTAL} documented cases</strong>
              <small>Photographed in-clinic · shared with consent</small>
            </span>
          </div>
        </div>

        <div
          className="rr__stage reveal"
          ref={stageRef}
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          <div className="rr__viewer">
            <div
              className="rr__plate"
              id={PANEL_ID}
              role="tabpanel"
              aria-labelledby={`rr-tab-${active}`}
            >
              {RESULTS.map((item, i) => (
                <img
                  key={item.src}
                  className={`rr__shot${i === active ? ' is-on' : ''}`}
                  src={item.src}
                  alt={`${item.caption} — ${item.treatment} result at our Chennai clinic`}
                  aria-hidden={i === active ? undefined : true}
                  loading="lazy"
                  decoding="async"
                />
              ))}

              <span className="rr__stamp" aria-hidden="true">
                Before <i>/</i> After
              </span>
            </div>

            <span className="rr__edge rr__edge--tl" aria-hidden="true" />
            <span className="rr__edge rr__edge--br" aria-hidden="true" />
          </div>

          <div className="rr__index">
            <div className="rr__bar">
              <p className="rr__count">
                <span className="rr__count-now">{pad(active)}</span>
                <span className="rr__count-all">/ {pad(TOTAL - 1)}</span>
              </p>

              <div className="rr__nav">
                <button
                  type="button"
                  className="rr__step"
                  onClick={() => go(active - 1)}
                  aria-label="Previous case"
                >
                  <Icon name="ArrowRight" size={16} />
                </button>
                <button
                  type="button"
                  className="rr__step"
                  onClick={() => go(active + 1)}
                  aria-label="Next case"
                >
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>
            </div>

            <ul
              className="rr__list"
              role="tablist"
              aria-orientation="vertical"
              aria-label="Patient cases"
              onKeyDown={onKeyDown}
            >
              {RESULTS.map((item, i) => {
                const on = i === active
                return (
                  <li key={item.src}>
                    <button
                      type="button"
                      id={`rr-tab-${i}`}
                      className={`rr__row${on ? ' is-on' : ''}`}
                      role="tab"
                      aria-selected={on}
                      aria-controls={PANEL_ID}
                      tabIndex={on ? 0 : -1}
                      ref={(node) => {
                        tabsRef.current[i] = node
                      }}
                      onClick={() => setActive(i)}
                    >
                      <span className="rr__row-no" aria-hidden="true">
                        {pad(i)}
                      </span>

                      <span className="rr__row-body">
                        <span className="rr__row-treat">{item.treatment}</span>

                        {/* 0fr → 1fr, so the outcome unfolds instead of popping. */}
                        <span className="rr__row-open">
                          <span className="rr__row-inner">
                            <span className="rr__row-cap">{item.caption}</span>

                            {/* Mounted on the active row only, so it restarts
                                from zero on every change of case. With motion
                                off it is never mounted at all — the index
                                becomes a plain manual picker. */}
                            {on && !reduced && (
                              <span className="rr__meter" aria-hidden="true">
                                <i
                                  data-run={onScreen && !held ? 'true' : 'false'}
                                  onAnimationEnd={() => go(active + 1)}
                                />
                              </span>
                            )}
                          </span>
                        </span>
                      </span>

                      <span className="rr__row-go" aria-hidden="true">
                        <Icon name="ArrowUpRight" size={15} />
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="rr__foot reveal">
          <p className="rr__note">
            <Icon name="ShieldCheck" size={15} />
            Photographs of consenting patients. Results differ from person to person depending on
            scalp condition, hair type, and treatment stage.
          </p>

          <button type="button" className="btn btn--gold btn--lg" onClick={scrollToBooking}>
            Book a Consultation
            <Icon name="ArrowRight" size={18} className="arrow" />
          </button>
        </div>

        <span className="section-end" aria-hidden="true" />
      </div>

      {/* Announced separately — the plate itself is a photograph swap, and the
          caption is what actually changes for a screen reader. */}
      <span className="sr-only" aria-live="polite">
        Case {pad(active)} of {pad(TOTAL - 1)}: {current.caption}, {current.treatment}
      </span>
    </section>
  )
}
