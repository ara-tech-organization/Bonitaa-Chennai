import { useState } from 'react'
import { BRANCHES } from '../data'
import { normalizePhone, submitLead, validatePhone } from '../submitLead'
import DatePicker from './DatePicker'
import Icon from './Icon'

/* `date` is a YYYY-MM-DD string. It replaced a Morning/Afternoon/Evening
   choice — a date is a commitment the clinic can actually schedule against,
   where a time-of-day band still needed a call to pin down.

   `city` is free text and sits alongside `branch`, which they are not a
   substitute for: branch is which of the two clinics the patient will attend,
   city is where they are travelling from. Both variants collect it. */
const EMPTY = { name: '', phone: '', city: '', branch: '', date: '' }

/**
 * The one enquiry form on the page. `variant="compact"` drops the date field
 * for the exit popup; `idPrefix` keeps input ids unique between instances.
 */
export default function LeadForm({ variant = 'full', idPrefix = 'lead', submitLabel = 'Book Your Slot' }) {
  const compact = variant === 'compact'
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const set = (key, next) => {
    setValues((v) => ({ ...v, [key]: next }))
    setErrors((err) => (err[key] ? { ...err, [key]: undefined } : err))
  }

  const field = (key) => (e) => set(key, e.target.value)
  /* The custom dropdown hands back a value, not an event. */
  const pick = (key) => (next) => set(key, next)

  const validate = () => {
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Please enter your name'
    if (!validatePhone(values.phone)) next.phone = 'Enter a valid 10-digit mobile number'
    if (values.city.trim().length < 2) next.city = 'Please enter your city or area'
    if (!values.branch) next.branch = 'Please choose a branch'
    if (!compact && !values.date) next.date = 'Pick a date that suits you'
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

      <label className="field" htmlFor={`${idPrefix}-city`}>
        <span className="field__label">City / Area</span>
        <span className="field__wrap">
          <Icon name="Navigation" size={17} />
          <input
            id={`${idPrefix}-city`}
            name="city"
            type="text"
            /* Shorter prompt in the popup — three example areas overflow the
               narrower field and truncate mid-word. */
            placeholder={compact ? 'e.g. Velachery' : 'e.g. Velachery, Adyar, Tambaram'}
            autoComplete="address-level2"
            value={values.city}
            onChange={field('city')}
            aria-invalid={Boolean(errors.city)}
          />
        </span>
        {errors.city && <span className="field__error">{errors.city}</span>}
      </label>

      {/* Two clinics — a dropdown would hide both behind a click to save no
          space at all. As badges they are visible, comparable and one tap. */}
      <fieldset className="field field--choice">
        <legend className="field__label">
          <Icon name="MapPin" size={15} />
          Select Branch
        </legend>

        <div className="badges">
          {BRANCHES.map((b) => (
            <label key={b.id} className={`badge${values.branch === b.name ? ' is-on' : ''}`}>
              <input
                type="radio"
                name={`${idPrefix}-branch`}
                value={b.name}
                checked={values.branch === b.name}
                onChange={field('branch')}
                aria-invalid={Boolean(errors.branch)}
              />
              <span className="badge__tick" aria-hidden="true">
                <Icon name="Check" size={13} />
              </span>
              <span className="badge__text">
                <strong>{b.name}</strong>
                <small>Chennai</small>
              </span>
            </label>
          ))}
        </div>

        {errors.branch && <span className="field__error">{errors.branch}</span>}
      </fieldset>

      {!compact && (
        <DatePicker
          id={`${idPrefix}-date`}
          label="Preferred Appointment Date"
          placeholder="Choose a date"
          value={values.date}
          onChange={pick('date')}
          error={errors.date}
        />
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
