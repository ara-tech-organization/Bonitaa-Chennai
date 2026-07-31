import { useCallback, useEffect, useRef, useState } from 'react'
import { RESULTS } from '../data'
import { scrollToBooking } from '../callStore'
import { useReveal } from '../hooks'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import Icon from './Icon'

const TOTAL = RESULTS.length
const PANEL_ID = 'rr-panel'
const STACKED = '(max-width: 1080px)'

/** 0 → "01". The case index is set in display numerals, so it needs the zero. */
const pad = (n) => String(n + 1).padStart(2, '0')

/**
 * A curated case viewer rather than a conveyor of cards.
 *
 * The print moves rather than duplicating: on desktop it sits beside the index
 * as its own column; stacked, the very same element is rendered inside the open
 * card, so tapping a case opens its photograph in place. One instance either
 * way — a CSS-hidden second copy would download every image twice and put two
 * elements on the page carrying the same id.
 *
 * The open card also runs a timing bar; when it finishes it hands over to the
 * next case. Hovering or focusing the stage pauses that, so reading a case is
 * never interrupted.
 */
export default function Results() {
  const ref = useReveal()
  const reduced = usePrefersReducedMotion()
  const stageRef = useRef(null)
  const rowsRef = useRef([])

  const [active, setActive] = useState(0)
  /* Autoplay only runs when the stage is both on screen and unattended. */
  const [onScreen, setOnScreen] = useState(false)
  const [held, setHeld] = useState(false)
  /* Drives where the print is rendered, so it has to be state rather than a
     media query read at paint time. Seeded from the query itself so the first
     render already places the print correctly — starting false and correcting
     in an effect would mount it beside the list and immediately move it. */
  const [stacked, setStacked] = useState(() => window.matchMedia(STACKED).matches)

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

  useEffect(() => {
    const mq = window.matchMedia(STACKED)
    const onChange = (e) => setStacked(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /** Wrapping index change with no side effects — the autoplay path. */
  const step = useCallback((next) => setActive((next + TOTAL) % TOTAL), [])

  /** The user path: same change, plus moving focus to the row that opened. */
  const go = useCallback(
    (next, focus) => {
      const i = (next + TOTAL) % TOTAL
      step(i)
      if (focus) rowsRef.current[i]?.focus()
    },
    [step],
  )

  const onKeyDown = (event) => {
    const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (dir) {
      event.preventDefault()
      go(active + dir, true)
      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      go(event.key === 'Home' ? 0 : TOTAL - 1, true)
    }
  }

  const current = RESULTS[active]

  /* Built once and placed in one of two spots. Every case stays mounted and
     stacked so a change is a cross-fade with no layout shift and no second
     download when a case comes back around. */
  const viewer = (
    <div className="rr__viewer">
      <div className="rr__plate" id={PANEL_ID}>
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
  )

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
          className={`rr__stage reveal${stacked ? ' is-stacked' : ''}`}
          ref={stageRef}
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          {!stacked && viewer}

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

            {/* A disclosure set, not a tablist: stacked, the panel lives inside
                the open card, and a tabpanel nested in its own tablist would be
                a broken relationship. `aria-expanded` describes both layouts
                honestly. */}
            <ul className="rr__list" aria-label="Patient cases" onKeyDown={onKeyDown}>
              {RESULTS.map((item, i) => {
                const on = i === active
                return (
                  <li key={item.src} className={on ? 'is-on' : undefined}>
                    <button
                      type="button"
                      id={`rr-row-${i}`}
                      className={`rr__row${on ? ' is-on' : ''}`}
                      aria-expanded={on}
                      aria-controls={PANEL_ID}
                      ref={(node) => {
                        rowsRef.current[i] = node
                      }}
                      onClick={() => step(i)}
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

                            {/* Mounted on the open row only, so it restarts from
                                zero on every change of case. With motion off it
                                is never mounted at all — the index becomes a
                                plain manual picker. */}
                            {on && !reduced && (
                              <span className="rr__meter" aria-hidden="true">
                                <i
                                  data-run={onScreen && !held ? 'true' : 'false'}
                                  onAnimationEnd={() => step(active + 1)}
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

                    {/* Outside the button, inside the card — a photograph is not
                        part of the control that opened it. */}
                    {stacked && on && <div className="rr__inline">{viewer}</div>}
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
