import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * App-level smooth scrolling. A module-level handle lets non-React callers
 * (scrollToBooking, the sticky bar) route through Lenis instead of fighting it
 * with a second native smooth-scroll animation.
 */
let instance = null

export function getLenis() {
  return instance
}

/** Scrolls to an element or offset, falling back to native when Lenis is off. */
export function smoothScrollTo(target, options = {}) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.15, ...options })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.15,
      // Long, soft tail — the "luxury easing" feel, not a spring.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch beats an emulated one.
      syncTouch: false,
      anchors: { offset: -90 },
    })

    instance = lenis
    // Lenis drives scroll itself; CSS smooth-behaviour would double-animate.
    document.documentElement.classList.add('lenis-on')

    let frame = 0
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      instance = null
      document.documentElement.classList.remove('lenis-on')
    }
  }, [enabled])
}
