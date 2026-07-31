import { scrollToBooking, useCall } from '../callStore'
import { useScrolledPast } from '../hooks'
import Icon from './Icon'

export default function ActionBar() {
  const visible = useScrolledPast(520)
  const { requestCall } = useCall()

  return (
    /* `inert` while parked off-screen so the buttons stay out of the tab order. */
    <div className={`action-bar${visible ? ' is-up' : ''}`} inert={!visible}>
      <button type="button" className="action-bar__btn action-bar__btn--call" onClick={() => requestCall()}>
        <Icon name="Phone" size={18} />
        Call
      </button>
      <button type="button" className="action-bar__btn action-bar__btn--book" onClick={scrollToBooking}>
        Book a Consultation
      </button>
    </div>
  )
}
