import { scrollToBooking, useCall } from '../callStore'
import Icon from './Icon'

/**
 * Sticky mobile action bar.
 *
 * Present from the first frame rather than sliding in past a 520px scroll
 * threshold: on a phone this is the page's primary pair of actions, and gating
 * it left the top of the page — the part every visitor sees — with no visible
 * way to call or book. Shown only below 760px, where the header has collapsed
 * to a burger and no longer carries either action.
 */
export default function ActionBar() {
  const { requestCall } = useCall()

  return (
    <div className="action-bar">
      <button
        type="button"
        className="action-bar__btn action-bar__btn--call"
        onClick={() => requestCall()}
      >
        <Icon name="Phone" size={18} />
        Call Now
      </button>

      <button
        type="button"
        className="action-bar__btn action-bar__btn--book"
        onClick={scrollToBooking}
      >
        Book an Appointment
      </button>
    </div>
  )
}
