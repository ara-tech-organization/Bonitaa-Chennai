import { useState } from 'react'
import { BRANCHES, CALL_TIMES } from '../data'
import { normalizePhone, submitLead, validatePhone } from '../submitLead'
import Icon from './Icon'

const EMPTY = { name: '', phone: '', branch: '', time: '' }

/**
 * The one enquiry form on the page. `variant="compact"` drops the call-time
 * field for the exit popup; `idPrefix` keeps input ids unique between instances.
 */
export default function LeadForm({ variant = 'full', idPrefix = 'lead', submitLabel = 'Book Your Slot' }) {
  const compact = variant === 'compact'
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const field = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    setErrors((err) => (err[key] ? { ...err, [key]: undefined } : err))
  }

  const validate = () => {
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Please enter your name'
    if (!validatePhone(values.phone)) next.phone = 'Enter a valid 10-digit mobile number'
    if (!values.branch) next.branch = 'Please choose a branch'
    if (!compact && !values.time) next.time = 'Pick a time that suits you'
    return next
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      await submitLead({
        ...values,
        phone: normalizePhone(values.phone),
        source: compact ? 'callback-invite' : 'booking-section',
      })
      setStatus('done')
      setValues(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="form__done" role="status">
        <span className="form__done-ring">
          <Icon name="CheckCircle2" size={30} />
        </span>
        <h3>Request received</h3>
        <p>
          Our team will call you back within 30 minutes during clinic hours. Keep your phone handy.
        </p>
        <button type="button" className="form__again" onClick={() => setStatus('idle')}>
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form className={`form${compact ? ' form--compact' : ''}`} onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <label className="field" htmlFor={`${idPrefix}-name`}>
          <span className="field__label">Name</span>
          <span className="field__wrap">
            <Icon name="User" size={17} />
            <input
              id={`${idPrefix}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={values.name}
              onChange={field('name')}
              aria-invalid={Boolean(errors.name)}
            />
          </span>
          {errors.name && <span className="field__error">{errors.name}</span>}
        </label>

        <label className="field" htmlFor={`${idPrefix}-phone`}>
          <span className="field__label">Phone Number</span>
          <span className="field__wrap">
            <Icon name="Phone" size={17} />
            <span className="field__prefix" aria-hidden="true">
              +91
            </span>
            {/* maxLength is roomy so a pasted "+91 93637 00199" isn't silently
                truncated into a different-but-valid-looking number. */}
            <input
              id={`${idPrefix}-phone`}
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={16}
              placeholder="Mobile number"
              value={values.phone}
              onChange={field('phone')}
              aria-invalid={Boolean(errors.phone)}
            />
          </span>
          {errors.phone && <span className="field__error">{errors.phone}</span>}
        </label>
      </div>

      <label className="field" htmlFor={`${idPrefix}-branch`}>
        <span className="field__label">Select Branch</span>
        <span className="field__wrap field__wrap--select">
          <Icon name="MapPin" size={17} />
          <select
            id={`${idPrefix}-branch`}
            name="branch"
            value={values.branch}
            onChange={field('branch')}
            aria-invalid={Boolean(errors.branch)}
          >
            <option value="">Choose your nearest clinic</option>
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}, Chennai
              </option>
            ))}
          </select>
          <Icon name="ChevronDown" size={17} className="field__caret" />
        </span>
        {errors.branch && <span className="field__error">{errors.branch}</span>}
      </label>

      {!compact && (
        <fieldset className="field field--choice">
          <legend className="field__label">
            <Icon name="Clock" size={15} />
            Preferred Time to Call
          </legend>
          <div className="chips">
            {CALL_TIMES.map((t) => (
              <label key={t} className={`chip${values.time === t ? ' is-on' : ''}`}>
                <input
                  type="radio"
                  name={`${idPrefix}-time`}
                  value={t}
                  checked={values.time === t}
                  onChange={field('time')}
                />
                {t}
              </label>
            ))}
          </div>
          {errors.time && <span className="field__error">{errors.time}</span>}
        </fieldset>
      )}

      <p className="form__note">
        <Icon name="Lock" size={14} />
        Your information stays 100% confidential. No spam calls, ever.
      </p>

      <button type="submit" className="btn btn--gold btn--block btn--lg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : submitLabel}
        {status !== 'sending' && <Icon name="ArrowRight" size={18} className="arrow" />}
      </button>

      {status === 'error' && (
        <p className="form__error-banner" role="alert">
          Something went wrong. Please call us directly and we&apos;ll book you in.
        </p>
      )}
    </form>
  )
}
