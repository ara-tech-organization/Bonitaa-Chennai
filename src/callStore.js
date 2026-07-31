import { createContext, useContext } from 'react'
import { scrollToSection } from './hooks/useSmoothScroll'

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
  /* The form card, falling back to the section. Stacked on mobile the section
     opens with the assurances copy, so targeting #book landed the visitor on
     content with the form still a screen below — a Book button has to arrive
     at the thing it names. */
  const target = document.getElementById('book-form') ?? document.getElementById('book')
  if (!target) return

  /* Re-aiming matters most here: every Book button on the page is below the
     booking section, so the journey up passes lazy sections that may still be
     placeholders. */
  scrollToSection(target, -100)

  window.setTimeout(() => {
    document.getElementById('lead-name')?.focus({ preventScroll: true })
  }, 900)
}
