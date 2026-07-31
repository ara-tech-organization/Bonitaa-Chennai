import { createContext, useContext } from 'react'

export const CallContext = createContext(null)

export function useCall() {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error('useCall must be used inside <CallProvider>')
  return ctx
}

/** Smooth-scrolls to the booking form and focuses the first field. */
export function scrollToBooking() {
  const target = document.getElementById('book')
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.setTimeout(() => {
    document.getElementById('lead-name')?.focus({ preventScroll: true })
  }, 700)
}
