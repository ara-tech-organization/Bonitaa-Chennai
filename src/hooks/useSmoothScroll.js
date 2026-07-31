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
  /* Native path. `scroll-padding-top` on <html> supplies the header offset
     here, so the numeric `offset` option is Lenis-only by design. */
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* Matches `scroll-padding-top` — the fixed header must not cover the heading
   of whatever section was just jumped to. */
const ANCHOR_OFFSET = -90

/**
 * Scrolls to a section and keeps re-aiming until the page settles.
 *
 * Every section below the fold is lazy: while it is still a placeholder it
 * stands at a reserved height, and it swaps to real content the moment the
 * scroll brings it within a screen and a half. So a long jump — Treatments to
 * FAQ, say — passes two or three sections that each change height *while the
 * animation is already in flight*, and a single `scrollTo` computed at click
 * time lands well short of the heading it named.
 *
 * Re-issuing the scroll whenever the target actually moves is what makes a nav
 * link land on its own section. The corrections are deliberately short — this
 * is an adjustment, not a second journey — and stop after ~1.5s, by which time
 * everything in the path has mounted.
 */
export function scrollToSection(target, offset = ANCHOR_OFFSET) {
  if (!target) return

  smoothScrollTo(target, { offset })

  const topOf = () => target.getBoundingClientRect().top + window.scrollY
  let last = topOf()
  let ticks = 0

  const timer = window.setInterval(() => {
    const now = topOf()
    /* A few pixels of drift is sub-pixel layout noise, not a mounted section. */
    if (Math.abs(now - last) > 4) {
      last = now
      smoothScrollTo(target, { offset, duration: 0.45 })
    }
    if (++ticks >= 9) window.clearInterval(timer)
  }, 170)
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
      /* Anchor handling is ours, below — Lenis's own would write the fragment
         to the address bar, and this is a single page where "#treatments" in
         the URL is noise rather than a location worth linking to. */
      anchors: false,
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

/**
 * Keeps the address bar free of fragments. This is one page — "#treatments" in
 * the URL is noise, not a location anyone would want to link to.
 *
 * One delegated handler covers every in-page link, present and future. It
 * scrolls and then stops: because the default action never runs, the browser
 * never writes the fragment. Deliberately independent of `useSmoothScroll`,
 * which is switched off under reduced motion — the URL should stay clean
 * whether or not momentum scrolling is running.
 */
export function useCleanAnchors() {
  useEffect(() => {
    const onClick = (event) => {
      /* Modified clicks and anything but the primary button belong to the
         browser: open-in-new-tab on a same-page link should still work. */
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = event.target.closest?.('a[href^="#"]')
      if (!link) return

      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return

      const target = document.querySelector(hash)
      if (!target) return

      event.preventDefault()

      /* The page's own top, not the top of the hero element — the hero begins
         under the fixed header, so offsetting it would leave a gap above. */
      if (hash === '#top') smoothScrollTo(0)
      else scrollToSection(target)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  /* A fragment can still arrive from outside — a shared or bookmarked link.
     The browser has already jumped to the section by this point, so rewriting
     the URL only cleans it up; it does not move the page. */
  useEffect(() => {
    if (!window.location.hash) return
    const { pathname, search } = window.location
    window.history.replaceState(null, '', pathname + search)
  }, [])
}
