import { Suspense, useEffect, useRef, useState } from 'react'

/**
 * Defers a below-the-fold section until it approaches the viewport.
 *
 * React.lazy on its own only splits the chunk — it still fetches the moment the
 * component renders. The observer is what actually keeps that chunk off the
 * first load; `rootMargin` starts the fetch a screen and a half early so the
 * section is always mounted before it can be scrolled into view.
 *
 * `anchorId` matters: the header nav links to #treatments, #faq and friends,
 * and those ids live on the real sections. While a section is still a
 * placeholder the id sits on the placeholder instead, so an anchor click always
 * has somewhere to land. Only ever one of the two is rendered, so the id is
 * never duplicated.
 */
export default function LazySection({ children, anchorId, minHeight = 560 }) {
  const ref = useRef(null)
  /* Browsers without IntersectionObserver start mounted — decided during
     initialisation rather than in the effect, since a synchronous setState
     there would cost every section an extra render pass. */
  const [mounted, setMounted] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  )

  useEffect(() => {
    const el = ref.current
    if (!el || mounted) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
          observer.disconnect()
        }
      },
      { rootMargin: '900px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted])

  /* Reserving the height keeps the scrollbar honest, so the page does not jump
     as each section swaps in. */
  const placeholder = <div className="lazy-ph" style={{ minHeight }} aria-hidden="true" />

  if (!mounted) {
    return (
      <div ref={ref} id={anchorId}>
        {placeholder}
      </div>
    )
  }

  return (
    <div ref={ref}>
      <Suspense fallback={placeholder}>{children}</Suspense>
    </div>
  )
}
