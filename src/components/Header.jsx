import { useEffect, useRef, useState } from 'react'
import logo from '../assets/Logo.png'
import { CLINIC } from '../data'
import { scrollToBooking, useCall } from '../callStore'
import { useActiveSection, useScrollLock, useScrolledPast } from '../hooks'
import Icon from './Icon'

const NAV = [
  { label: 'Treatments', href: '#treatments' },
  { label: 'Results', href: '#results' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
]

/* Scroll-spy walks these in page order, which differs from the nav order. */
const SECTION_IDS = ['about', 'results', 'treatments', 'reviews', 'faq']

export default function Header() {
  const stuck = useScrolledPast(24)
  const active = useActiveSection(SECTION_IDS)
  const [open, setOpen] = useState(false)
  const { requestCall } = useCall()

  const burgerRef = useRef(null)
  const closeRef = useRef(null)
  const wasOpen = useRef(false)

  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /* The drawer sits above the header, so the burger is covered the moment the
     panel opens — focus has to move to the panel's own close button, and come
     back to the burger when the panel goes away. Guarded on a previous open,
     so this never steals focus on first render. */
  useEffect(() => {
    if (open) closeRef.current?.focus()
    else if (wasOpen.current) burgerRef.current?.focus()
    wasOpen.current = open
  }, [open])

  return (
    <header className={`hdr${stuck ? ' is-stuck' : ''}`}>
      <div className="shell hdr__inner">
        <a href="#top" className="hdr__logo" aria-label={`${CLINIC.name} — home`}>
          <img src={logo} alt={CLINIC.name} width="196" height="49" />
        </a>

        <nav className="hdr__nav" aria-label="Sections">
          {NAV.map((item) => {
            const isActive = item.href === `#${active}`
            return (
              <a
                key={item.href}
                href={item.href}
                className={`hdr__link${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="hdr__actions">
          <button
            type="button"
            className="hdr__phone"
            onClick={() => requestCall()}
            aria-label={`Call the clinic on ${CLINIC.phoneDisplay}`}
          >
            <span className="hdr__phone-ring">
              <Icon name="Phone" size={15} />
            </span>
            <strong className="hdr__phone-num">{CLINIC.phoneDisplay}</strong>
          </button>

          <button type="button" className="btn btn--gold hdr__cta" onClick={scrollToBooking}>
            Book a Consultation
          </button>

          <button
            type="button"
            className="hdr__burger"
            ref={burgerRef}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            {/* Always the burger — it is covered by the panel once open, so
                switching it to an X only ever showed a control nobody could
                see. Closing belongs to the panel's own button. */}
            <Icon name="Menu" size={22} />
          </button>
        </div>
      </div>

      <div className={`drawer${open ? ' is-open' : ''}`} onClick={() => setOpen(false)}>
        <nav
          className="drawer__panel"
          id="mobile-menu"
          onClick={(e) => e.stopPropagation()}
          aria-label="Mobile menu"
        >
          <div className="drawer__top">
            <img className="drawer__logo" src={logo} alt={CLINIC.name} width="196" height="49" />
            <button
              type="button"
              ref={closeRef}
              className="drawer__close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={`drawer__link${item.href === `#${active}` ? ' is-active' : ''}`}
              style={{ '--i': i }}
              onClick={() => setOpen(false)}
            >
              {item.label}
              <Icon name="ArrowUpRight" size={17} />
            </a>
          ))}
          <button
            type="button"
            className="btn btn--gold btn--block drawer__cta"
            onClick={() => {
              setOpen(false)
              scrollToBooking()
            }}
          >
            Book a Consultation
          </button>
        </nav>
      </div>
    </header>
  )
}
