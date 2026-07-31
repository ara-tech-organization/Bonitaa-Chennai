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
 * Two genuinely different compositions rather than one squeezed to fit.
 *
 * Desktop is a curated case viewer: one print held large beside an index of the
 * six, the open row running a timing bar that hands over to the next case.
 *
 * Below 1080px that becomes a swipeable slider — one case per screen, driven by
 * the thumb. An index of six rows plus a photograph is a lot of vertical travel
 * on a phone, and a list is a poor way to browse pictures when a swipe is the
 * natural gesture. The slider is a real scroll container with scroll-snap, so
 * swiping, momentum and keyboard scrolling are the browser's own.
 */
export default function Results() {
  const ref = useReveal()
  const reduced = usePrefersReducedMotion()
  const stageRef = useRef(null)
  const rowsRef = useRef([])
  const trackRef = useRef(null)
  const frame = useRef(0)

  const [active, setActive] = useState(0)
  /* Autoplay only runs when the stage is both on screen and unattended. */
  const [onScreen, setOnScreen] = useState(false)
  const [held, setHeld] = useState(false)
  /* Drives which composition renders, so it has to be state. Seeded from the
     query itself — starting false would build the desktop layout first and
     immediately tear it down. */
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

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  /** Wrapping index change with no side effects — the autoplay path. */
  const step = useCallback((next) => setActive((next + TOTAL) % TOTAL), [])

  /** One slide's worth of travel, measured off the DOM rather than assumed. */
  const slideWidth = () => {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (!card) return 0
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    return card.getBoundingClientRect().width + gap
  }

  /** Moves the slider; `active` follows from the scroll handler, not from here. */
  const slideTo = useCallback((next) => {
    const track = trackRef.current
    if (!track) return
    const i = (next + TOTAL) % TOTAL
    track.scrollTo({ left: i * slideWidth(), behavior: reduced ? 'auto' : 'smooth' })
  }, [reduced])

  /* The scroll position is the source of truth while swiping — reading it back
     is what keeps the counter and dots honest mid-gesture. */
  const onTrackScroll = () => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current
      const w = slideWidth()
      if (!track || !w) return
      const i = Math.round(track.scrollLeft / w)
      setActive(Math.max(0, Math.min(TOTAL - 1, i)))
    })
  }

  /** The user path on desktop: change case, and move focus to its row. */
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
  const move = stacked ? slideTo : go

  const counter = (
    <div className="rr__bar">
      <p className="rr__count">
        <span className="rr__count-now">{pad(active)}</span>
        <span className="rr__count-all">/ {pad(TOTAL - 1)}</span>
      </p>

      <div className="rr__nav">
        <button
          type="button"
          className="rr__step"
          onClick={() => move(active - 1)}
          aria-label="Previous case"
        >
          <Icon name="ArrowRight" size={16} />
        </button>
        <button
          type="button"
          className="rr__step"
          onClick={() => move(active + 1)}
          aria-label="Next case"
        >
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>
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

        {/* Deliberately not a `.reveal`. That class parks an element at
            opacity 0 until an IntersectionObserver adds `.is-in`, which is
            fine for a heading but not for the section's entire content: any
            miss — a direct jump to #results, a lazy mount that lands already
            past the threshold — leaves the whole section blank with no way to
            recover. The head and foot still animate; the cases just show. */}
        <div
          className={`rr__stage${stacked ? ' is-slider' : ''}`}
          ref={stageRef}
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          {stacked ? (
            <div className="rr__slider">
              {counter}

              <ul
                className="rr__track"
                ref={trackRef}
                onScroll={onTrackScroll}
                aria-label="Patient cases"
              >
                {RESULTS.map((item, i) => (
                  <li className="rr__slide" key={item.src} aria-current={i === active || undefined}>
                    <div className="rr__plate">
                      {/* Its own class, not `.rr__shot.is-on` — a slide holds
                          one image outright, where `.rr__shot` is built for
                          the desktop stack where five of six are hidden. */}
                      <img
                        className="rr__slide-img"
                        src={item.src}
                        alt={`${item.caption} — ${item.treatment} result at our Chennai clinic`}
                        /* Only the first slide is on screen at rest; the others
                           arrive as the track is swiped. */
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      <span className="rr__stamp" aria-hidden="true">
                        Before <i>/</i> After
                      </span>
                    </div>

                    <p className="rr__slide-cap">
                      <span className="rr__row-treat">{item.treatment}</span>
                      <strong>{item.caption}</strong>
                    </p>
                  </li>
                ))}
              </ul>

              <div className="rr__dots">
                {RESULTS.map((item, i) => (
                  <button
                    key={item.src}
                    type="button"
                    className={`rr__dot${i === active ? ' is-on' : ''}`}
                    aria-label={`Case ${pad(i)}: ${item.treatment}`}
                    aria-current={i === active || undefined}
                    onClick={() => slideTo(i)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="rr__viewer">
                {/* Every case stays mounted and stacked, so a change is a
                    cross-fade with no layout shift and no second download when
                    a case comes back around. */}
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

              <div className="rr__index">
                {counter}

                {/* A disclosure set, not a tablist — `aria-expanded` describes
                    the one open case honestly. */}
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

                            {/* 0fr → 1fr, so the outcome unfolds instead of
                                popping. */}
                            <span className="rr__row-open">
                              <span className="rr__row-inner">
                                <span className="rr__row-cap">{item.caption}</span>

                                {/* Mounted on the open row only, so it restarts
                                    from zero on every change of case. With
                                    motion off it is never mounted at all. */}
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
                      </li>
                    )
                  })}
                </ul>
              </div>
            </>
          )}
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

      {/* Announced separately — the print itself is a photograph swap, and the
          caption is what actually changes for a screen reader. */}
      <span className="sr-only" aria-live="polite">
        Case {pad(active)} of {pad(TOTAL - 1)}: {current.caption}, {current.treatment}
      </span>
    </section>
  )
}
