/**
 * The hero's copy, taken verbatim from the client's page content (section 1).
 *
 * NOTE ON NUMBERS — 4.8★, 15+ years and 35+ branches match the rest of the
 * site and the MedicalClinic structured data in index.html. Earlier design
 * briefs proposed different figures (4.9★, 5000+ clients, 12+ years); they
 * are not used, because a hero contradicting the page's own aggregateRating
 * is both a trust problem and an SEO one.
 */

export const EYEBROW = "Chennai's Hair & Scalp Specialists"

/* Headline split per line so each reveals on its own beat. */
export const HEADLINE = [
  [{ t: "Chennai's Trusted" }],
  [{ t: 'Hair Fall', accent: true }],
  [{ t: 'Treatment Clinic' }],
]

/* Pipe-separated credentials line under the headline. */
export const SUBHEAD = [
  'Expert Hair Specialists in Chennai',
  '4.8★ Google Rated',
  '15+ Years of Proven Results',
]

export const LEDE =
  "Hair fall, thinning, or bald patches don't have to be permanent. Get a treatment plan designed around your scalp, your hair type, and your goals — from experienced hair specialists across Chennai."

/* Small strip closing the hero. */
export const TRUST_STRIP = [
  '4.8★ Google Rating',
  '15+ Years of Excellence',
  '35+ Branches Across Tamil Nadu',
]
