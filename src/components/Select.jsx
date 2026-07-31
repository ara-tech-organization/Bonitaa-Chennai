import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

/* How long consecutive keystrokes count as one type-ahead word. */
const TYPE_WINDOW = 700

/**
 * Custom dropdown replacing a native `<select>`, so the field can carry the
 * page's own frame, gold focus ring and panel motion — none of which a native
 * option list will accept from CSS.
 *
 * Built on the combobox/listbox pattern: focus stays on the trigger the whole
 * time and the highlighted option is pointed at with `aria-activedescendant`,
 * which is what lets arrow keys, Home/End, Escape and type-ahead all behave the
 * way a real select does. The panel stays mounted so it can animate both ways,
 * and is marked `inert` while closed so nothing inside it is focusable or
 * announced.
 */
export default function Select({
  id,
  label,
  icon,
  placeholder,
  options,
  value,
  onChange,
  error,
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])
  const typed = useRef({ term: '', at: 0 })

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  const labelId = `${id}-label`
  const listId = `${id}-list`
  const optionId = (i) => `${id}-opt-${i}`

  const openAt = (index) => {
    setActiveIndex(index)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    setActiveIndex(-1)
  }

  const commit = (index) => {
    const option = options[index]
    if (option) onChange(option.value)
    close()
    triggerRef.current?.focus()
  }

  /* Pointer-down rather than click: a click outside would otherwise land on
     whatever is underneath only after the panel had already swallowed it. */
  useEffect(() => {
    if (!open) return

    const onDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close()
    }

    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  /* Keeps the highlighted row in view when the list is longer than the panel. */
  useEffect(() => {
    if (open && activeIndex >= 0) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, activeIndex])

  const move = (step) => {
    const from = activeIndex >= 0 ? activeIndex : selectedIndex
    /* Wraps, so holding ArrowDown at the end returns to the top. */
    setActiveIndex((from + step + options.length) % options.length)
  }

  const typeAhead = (key) => {
    const now = Date.now()
    const term = (now - typed.current.at < TYPE_WINDOW ? typed.current.term : '') + key.toLowerCase()
    typed.current = { term, at: now }

    const match = options.findIndex((o) => o.label.toLowerCase().startsWith(term))
    if (match < 0) return

    if (open) setActiveIndex(match)
    else openAt(match)
  }

  const onKeyDown = (event) => {
    const { key } = event

    if (key === 'Escape') {
      if (open) {
        event.preventDefault()
        close()
      }
      return
    }

    /* Tab closes but does not swallow — focus should carry on to the next
       field rather than being trapped behind an open panel. */
    if (key === 'Tab') {
      if (open) close()
      return
    }

    if (!open) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault()
        openAt(selectedIndex >= 0 ? selectedIndex : 0)
        return
      }
    } else {
      if (key === 'Enter' || key === ' ') {
        event.preventDefault()
        commit(activeIndex)
        return
      }
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault()
        move(key === 'ArrowDown' ? 1 : -1)
        return
      }
      if (key === 'Home' || key === 'End') {
        event.preventDefault()
        setActiveIndex(key === 'Home' ? 0 : options.length - 1)
        return
      }
    }

    if (key.length === 1 && key.trim()) typeAhead(key)
  }

  return (
    <div className="field" ref={rootRef}>
      <span className="field__label" id={labelId}>
        {label}
      </span>

      <div className={`sel${open ? ' is-open' : ''}`}>
        <button
          type="button"
          id={id}
          ref={triggerRef}
          className="sel__trigger field__wrap field__wrap--select"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${labelId} ${id}`}
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-invalid={Boolean(error)}
          onKeyDown={onKeyDown}
          onClick={() => (open ? close() : openAt(selectedIndex >= 0 ? selectedIndex : 0))}
        >
          {icon && <Icon name={icon} size={17} />}
          <span className={`sel__value${selected ? '' : ' is-placeholder'}`}>
            {selected ? selected.label : placeholder}
          </span>
          <Icon name="ChevronDown" size={17} className="field__caret sel__caret" />
        </button>

        <div className="sel__panel" inert={!open}>
          <ul className="sel__list" id={listId} role="listbox" aria-labelledby={labelId}>
            {options.map((option, i) => {
              const isSelected = option.value === value
              return (
                /* `role="option"` sits on the <li> itself: a listbox has to own
                   its options directly, and an untyped <li> in between breaks
                   that relationship. */
                <li
                  key={option.value}
                  id={optionId(i)}
                  ref={(node) => {
                    optionRefs.current[i] = node
                  }}
                  role="option"
                  aria-selected={isSelected}
                  className={`sel__option${i === activeIndex ? ' is-active' : ''}${
                    isSelected ? ' is-selected' : ''
                  }`}
                  /* Highlight follows the pointer, so mouse and keyboard drive
                     the same single highlight rather than two competing ones. */
                  onPointerMove={() => setActiveIndex(i)}
                  onClick={() => commit(i)}
                >
                  <span className="sel__option-text">{option.label}</span>
                  <Icon name="Check" size={16} className="sel__tick" />
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {error && <span className="field__error">{error}</span>}
    </div>
  )
}
