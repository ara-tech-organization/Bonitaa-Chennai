/**
 * Single exit point for every enquiry on the page (booking section + exit popup).
 *
 * INTEGRATION: point LEAD_ENDPOINT at the clinic's CRM / Google Sheet webhook /
 * mail handler. Until it is set, submissions resolve locally so the UI stays
 * testable — no lead is stored anywhere.
 */
const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? ''

export async function submitLead(lead) {
  const payload = {
    ...lead,
    page: 'chennai-hair-landing',
    submittedAt: new Date().toISOString(),
  }

  if (!LEAD_ENDPOINT) {
    if (import.meta.env.DEV) {
      console.info('[lead] no VITE_LEAD_ENDPOINT configured — payload:', payload)
    }
    await new Promise((resolve) => setTimeout(resolve, 700))
    return { ok: true, delivered: false }
  }

  const res = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(`Lead submission failed (${res.status})`)
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
