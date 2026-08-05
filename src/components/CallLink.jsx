import { CLINIC } from '../data'
import { useCall } from '../callStore'

/**
 * Every call CTA on the page.
 *
 * Renders a real `tel:` anchor rather than a button: the number is then visible
 * in the status bar on hover, long-pressable on a phone, copyable from the
 * context menu, and still dials if the JS never runs — none of which a
 * `<button onClick>` can offer.
 *
 * A plain left click is still intercepted and routed through the confirmation
 * modal, which shows the clinic being dialled and then opens this same href.
 * Modified clicks (new tab, middle click) are left to the browser.
 *
 * `branch` is passed straight to `requestCall`, so a branch-specific CTA names
 * its clinic in the modal.
 */
export default function CallLink({ branch, onClick, children, ...rest }) {
  const { requestCall } = useCall()

  const handleClick = (event) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return

    event.preventDefault()
    requestCall(branch)
  }

  return (
    <a href={CLINIC.phoneHref} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
