import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icon'

const DAY_HEADS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/* How far ahead the clinic takes bookings. Beyond this the calendar simply
   stops rather than offering dates nobody can honour. */
const WINDOW_DAYS = 60

/** Local-midnight key — `toISOString` would shift the day across UTC. */
const key = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const sameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()

/** "12 March 2026" from a YYYY-MM-DD key, without re-parsing into a Date. */
const pretty = (k) => {
  const [y, m, d] = k.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

/**
 * Preferred appointment date — a field that opens a calendar, matching the
 * text inputs above it rather than sitting in the form as a permanent grid.
 *
 * Selection is passed up as a `YYYY-MM-DD` string, which is unambiguous in a
 * CRM in a way that a rendered date never is. Only the booking section renders
 * this; the exit popup runs the compact variant, which has no date field.
 */
export default function DatePicker({ id, label, placeholder, value, onChange, error }) {
  const [open, setOpen] = useState(false)
  /* Set when the panel would run past the bottom of the viewport, which is the
     norm for this field — it is the last one in the form. */
  const [flip, setFlip] = useState(false)

  const rootRef = useRef(null)
  const triggerRef = useRef(null)

  /* Today is read once per mount. The form is never open across a midnight
     boundary long enough for the drift to matter, and recomputing it on every
     render would make the whole grid unstable. */
  const today = useMemo(() => startOfDay(new Date()), [])
  const lastDay = useMemo(() => addDays(today, WINDOW_DAYS), [today])

  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const labelId = `${id}-label`
  const panelId = `${id}-panel`

  /* Six rows of seven, always — a grid that changes height as you page between
     months would make the panel jump under the cursor. */
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const firstCell = addDays(first, -first.getDay())
    return Array.from({ length: 42 }, (_, i) => addDays(firstCell, i))
  }, [month])

  const canGoBack = month > new Date(today.getFullYear(), today.getMonth(), 1)
  const canGoNext = month < new Date(lastDay.getFullYear(), lastDay.getMonth(), 1)

  const close = () => setOpen(false)

  const toggle = () => {
    if (open) {
      close()
      return
    }
    /* Roughly the panel's own height. Measuring the real element would mean
       rendering it first, and the number only has to decide a direction. */
    const box = triggerRef.current?.getBoundingClientRect()
    setFlip(Boolean(box && window.innerHeight - box.bottom < 380 && box.top > 380))
    /* Always reopen on the selected date's month, not wherever paging last
       left off — otherwise the panel reopens showing an unrelated month. */
    if (value) {
      const [y, m] = value.split('-').map(Number)
      setMonth(new Date(y, m - 1, 1))
    }
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return

    const onDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close()
    }
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      close()
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const commit = (k) => {
    onChange(k)
    close()
    triggerRef.current?.focus()
  }

  return (
    <div className="field" ref={rootRef}>
      <span className="field__label" id={labelId}>
        <Icon name="CalendarCheck" size={15} />
        {label}
      </span>

      <div className={`pick cal-pick${open ? ' is-open' : ''}${flip ? ' is-up' : ''}`}>
        <button
          type="button"
          id={id}
          ref={triggerRef}
          className="pick__trigger field__wrap field__wrap--select"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={panelId}
          aria-labelledby={`${labelId} ${id}`}
          aria-invalid={Boolean(error)}
          onClick={toggle}
        >
          <span className={`pick__value${value ? '' : ' is-placeholder'}`}>
            {value ? pretty(value) : placeholder}
          </span>
          {/* Calendar glyph on the right, where a native date input puts it —
              the whole field opens the panel, so the icon is the affordance
              rather than a separate control. */}
          <span className="cal__open" aria-hidden="true">
            <Icon name="CalendarCheck" size={16} />
          </span>
        </button>

        <div className="pop cal__pop" id={panelId} role="dialog" aria-label={label} inert={!open}>
          <div className="cal__head">
            <button
              type="button"
              className="cal__nav"
              onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              disabled={!canGoBack}
              aria-label="Previous month"
            >
              <Icon name="ArrowRight" size={15} />
            </button>

            {/* Announced on change, so paging months is not silent for anyone
                driving this from the keyboard. */}
            <strong className="cal__month" aria-live="polite">
              {MONTHS[month.getMonth()]} {month.getFullYear()}
            </strong>

            <button
              type="button"
              className="cal__nav"
              onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              disabled={!canGoNext}
              aria-label="Next month"
            >
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>

          <div className="cal__heads" aria-hidden="true">
            {DAY_HEADS.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          <div className="cal__grid">
            {cells.map((date) => {
              const k = key(date)
              const outside = !sameMonth(date, month)
              const disabled = date < today || date > lastDay

              return (
                <button
                  key={k}
                  type="button"
                  className={`cal__day${k === value ? ' is-on' : ''}${
                    outside ? ' is-outside' : ''
                  }${k === key(today) ? ' is-today' : ''}`}
                  disabled={disabled}
                  aria-pressed={k === value}
                  aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
                  onClick={() => commit(k)}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <p className="cal__foot">
            <Icon name="Clock" size={14} />
            <span>We confirm the exact time by phone.</span>
          </p>
        </div>
      </div>

      {error && <span className="field__error">{error}</span>}
    </div>
  )
}
