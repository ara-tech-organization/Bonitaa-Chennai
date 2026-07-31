import { createContext, useContext } from 'react'
import { smoothScrollTo } from './hooks/useSmoothScroll'

export const CallContext = createContext(null)

export function useCall() {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error('useCall must be used inside <CallProvider>')
  return ctx
}

/**
 * Smooth-scrolls to the booking form and focuses the first field.
 * Routed through Lenis when it is running — a native scrollIntoView would
 * animate against Lenis's own loop and fight it.
 */
export function scrollToBooking() {
  const target = document.getElementById('book')
  if (!target) return
  smoothScrollTo(target, { offset: -80 })
  window.setTimeout(() => {
    document.getElementById('lead-name')?.focus({ preventScroll: true })
  }, 900)
}
