import { useEffect, useRef, useState } from 'react'
import { CLINIC } from '../data'
import { useCall } from '../callStore'
import { useScrollLock } from '../hooks'
import Icon from './Icon'

const AUTO_DIAL_MS = 1500

/**
 * Brief confirmation shown before the dialer opens, so the patient always sees
 * which clinic is being called. Auto-proceeds after ~1.5s, or immediately on tap.
 * Mounted only while a call is pending — countdown state resets on unmount.
 */
function CallDialog({ branch, onCancel }) {
  const [progress, setProgress] = useState(0)
  const dialed = useRef(false)

  useScrollLock(true)

  /* The countdown's own hand-off — the button below is a real link and lets the
     browser do the navigating, so this is only for the auto-dial. */
  const dial = () => {
    if (dialed.current) return
    dialed.current = true
    window.location.href = CLINIC.phoneHref
    onCancel()
  }

  /* Tapping the button: the anchor's own `tel:` href opens the dialer, so the
     default is left alone — this only stops the countdown firing a second
     navigation behind it and closes the card. */
  const onDialClick = () => {
    dialed.current = true
    onCancel()
  }

  const dialRef = useRef(dial)
  dialRef.current = dial

  useEffect(() => {
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const pct = Math.min(1, (now - start) / AUTO_DIAL_MS)
      setProgress(pct)
      if (pct < 1) frame = requestAnimationFrame(tick)
      else dialRef.current()
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const target = branch ? `${branch}, Chennai` : 'Chennai'

  return (
    <div className="overlay is-open" onClick={onCancel}>
      <div
        className="call"
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="call__close" aria-label="Cancel" onClick={onCancel}>
          <Icon name="X" size={18} />
        </button>

        <span className="call__pulse">
          <Icon name="PhoneCall" size={26} />
        </span>

        <p className="call__eyebrow">Calling</p>
        <h3 id="call-title">
          {CLINIC.name}
          <span className="call__branch">{target}</span>
        </h3>
        <p className="call__number">{CLINIC.phoneDisplay}</p>

        <a className="btn btn--gold btn--block" href={CLINIC.phoneHref} onClick={onDialClick}>
          <Icon name="Phone" size={17} />
          Call Now
        </a>

        <div className="call__track" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </div>
  )
}

export default function CallModal() {
  const { isCalling, pendingBranch, cancelCall } = useCall()
  if (!isCalling) return null
  return <CallDialog branch={pendingBranch} onCancel={cancelCall} />
}
