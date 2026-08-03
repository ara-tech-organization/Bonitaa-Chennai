/**
 * Single exit point for every enquiry on the page (booking section + exit
 * popup), and therefore the one place the analytics event belongs: both forms
 * route through here, so neither can be added or changed without it.
 *
 * DELIVERY — posts to the clinic's own mail handler, which sends the notifying
 * email and forwards a row to the Google Sheet.
 *
 * Absolute, not relative. A relative path only works when the site is served
 * from the same host as the PHP, and it is not: the build is a static bundle
 * (GitHub Pages / Vercel) with no PHP behind it, so `/api/email.php` there is
 * a 404 — and so is `/api` on the dev server. Cross-origin is what the handler
 * expects anyway; it answers OPTIONS and sends `Access-Control-Allow-Origin`.
 *
 * https, not http. The endpoint was given as `http://`, but a page served over
 * https is not allowed to post to it — browsers block mixed content outright,
 * with no request ever leaving. If the host has no certificate, that has to be
 * fixed on the server; it cannot be worked around from here.
 *
 * Set VITE_LEAD_ENDPOINT to point somewhere else, or to `off` to stop delivery
 * entirely while developing — the UI still reports success.
 */
const LEAD_ENDPOINT =
  import.meta.env.VITE_LEAD_ENDPOINT || 'https://chennai.bonitaa.co.in/api/email.php'
const DELIVERY_OFF = LEAD_ENDPOINT === 'off'

/**
 * Fires `lead_form_submitted` on the GTM dataLayer.
 *
 * The array is created if it does not exist yet: GTM adopts whatever
 * `window.dataLayer` already holds when the container loads, so a push made
 * before the tag arrives is queued rather than lost. That matters here — the
 * form can be submitted from the exit popup within seconds of first paint.
 *
 * `form_source` rides along so booking-section and popup leads can be told
 * apart in GTM. It is an extra key on the event, not a replacement for it: any
 * trigger matching on the event name alone is unaffected.
 */
function trackLeadSubmitted(source) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'lead_form_submitted',
    form_source: source,
  })
}

/** Where the enquiry came from, in words the person reading the mail knows. */
const SOURCE_LABEL = {
  'booking-section': 'Booking form (page)',
  'callback-invite': 'Callback popup',
}

/**
 * Maps the form's answers onto the handler's payload.
 *
 * One key per question, and nothing else. `email`, `time`, `treatment` and
 * `message` are gone: the form asks for a phone rather than an email, because
 * the page promises a callback; the Morning/Afternoon/Evening choice became a
 * date picker; and treatment was never asked. Sending them as empty strings
 * only put blank rows in the notification and blank columns in the sheet.
 *
 * ⚠ This shape requires the updated email.php. The handler that rejects an
 * empty `time` or `treatment` will refuse every one of these as "Missing
 * required fields" — the two have to ship together.
 */
function toApiPayload(lead) {
  return {
    name: lead.name ?? '',
    phone: lead.phone ?? '',
    city: lead.city ?? '',
    branch: lead.branch ?? '',
    date: lead.date ?? '',
    source: SOURCE_LABEL[lead.source] ?? lead.source ?? 'Website Form',
  }
}

export async function submitLead(lead) {
  const payload = toApiPayload(lead)

  if (DELIVERY_OFF) {
    if (import.meta.env.DEV) {
      console.info('[lead] delivery off (VITE_LEAD_ENDPOINT=off) — payload:', payload)
    }
    await new Promise((resolve) => setTimeout(resolve, 700))
    /* Still tracked: the UI reports success and shows the thank-you state, so
       the analytics have to agree with what the visitor was told. */
    trackLeadSubmitted(lead.source)
    return { ok: true, delivered: false }
  }

  /* The visitor only ever sees "something went wrong" — deliberately, since
     none of this is theirs to fix. But a silent failure is impossible to
     diagnose from a screenshot, so the actual reason is logged. */
  const fail = (reason) => {
    console.error(`[lead] not submitted — ${reason}`, { endpoint: LEAD_ENDPOINT, payload })
    return new Error(reason)
  }

  let res
  try {
    res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (networkError) {
    /* fetch only rejects before it gets an answer at all: DNS, TLS, a blocked
       mixed-content request, or a CORS preflight the handler did not answer.
       Every one of those is a deployment problem, not a bad submission. */
    throw fail(`could not reach the handler (${networkError.message})`)
  }

  /* Deliberately before the push — a throw here skips it, so a failed
     submission never counts as a lead. */
  if (!res.ok) throw fail(`handler answered ${res.status}`)

  /* A handler that answers JSON gets read for an explicit failure; one that
     answers anything else is trusted on its status code, since PHP mail
     handlers commonly just echo a string or nothing at all. */
  const body = await res.json().catch(() => null)
  if (body && body.success === false) {
    throw fail(`handler rejected it${body.message ? ` — "${body.message}"` : ''}`)
  }

  trackLeadSubmitted(lead.source)
  return { ok: true, delivered: true }
}

/** Strips formatting and a leading 91 down to the bare 10 digits. */
function digitsOnly(raw) {
  return raw.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
}

/** Indian mobile numbers: 10 digits beginning 6–9, ignoring +91 / spaces. */
export function validatePhone(raw) {
  return /^[6-9]\d{9}$/.test(digitsOnly(raw))
}

/** E.164 form, so the CRM always receives the country code the field implies. */
export function normalizePhone(raw) {
  return `+91${digitsOnly(raw)}`
}
