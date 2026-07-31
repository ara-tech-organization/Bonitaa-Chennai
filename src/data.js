import result1 from './assets/WhatsApp Image 2026-07-08 at 12.10.35 PM.jpeg'
import result2 from './assets/WhatsApp Image 2026-07-08 at 12.10.40 PM.jpeg'
import result3 from './assets/WhatsApp Image 2026-07-08 at 12.10.40 PM (1).jpeg'
import result4 from './assets/WhatsApp Image 2026-07-08 at 12.10.40 PM (2).jpeg'
import result5 from './assets/WhatsApp Image 2026-07-08 at 12.10.41 PM.jpeg'
import result6 from './assets/WhatsApp Image 2026-07-08 at 12.10.41 PM (1).jpeg'

export const CLINIC = {
  name: 'Bonitaa Skin and Hair Care',
  shortName: 'Bonitaa',
  phoneDisplay: '+91 93637 00199',
  phoneHref: 'tel:+919363700199',
}

/* Addresses are stored as lines so each renders as its own block — no manual
   pre-line breaks fighting the column width. */
export const BRANCHES = [
  {
    id: 'mylapore',
    name: 'Mylapore',
    lines: ['First Floor, Door No: 200/1', 'Royapettah High Road', 'Chennai - 600004'],
    maps: 'https://share.google/oYqVRzkKhSDivvPR1',
    embed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.351566109934!2d80.26182997985208!3d13.044365354474216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52674e6b7792f7%3A0xadf16dbc82f16cd0!2sBonitaa%20Skin%20and%20Hair%20Care!5e1!3m2!1sen!2sin!4v1785471746913!5m2!1sen!2sin',
  },
  {
    id: 'velachery',
    name: 'Velachery',
    lines: ['No. 16, Bharathi Nagar Bus Stop', 'Tharamani', 'Chennai - 600113'],
    maps: 'https://share.google/zlr3Tn6Ttaz4KIgbQ',
    embed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.353715672163!2d80.22940837984476!3d12.981110254679605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d322d5c006f%3A0xde5c097bc87e2ce9!2sBonitaa%20Skin%20and%20Hair%20Care!5e1!3m2!1sen!2sin!4v1785471781803!5m2!1sen!2sin',
  },
]

/* Trust metrics — the only place branch count is stated as a number */
export const TRUST_STATS = [
  { icon: 'CalendarCheck', value: '15+', label: 'Years of Excellence' },
  { icon: 'ShieldCheck', value: '18+', label: 'FDA-Cleared Treatments' },
  { icon: 'Users', value: '10,000+', label: 'Patients Treated' },
  { icon: 'Star', value: '4.8', label: 'Google Rating' },
  { icon: 'MapPin', value: '35+', label: 'Branches Across Tamil Nadu' },
]

export const SERVICES = [
  {
    icon: 'Stethoscope',
    title: 'Hair Fall Treatment',
    copy: 'Get to the root of ongoing hair fall with a scalp-first diagnostic approach.',
  },
  {
    icon: 'Sprout',
    title: 'Hair Transplant',
    copy: 'A permanent, natural-looking solution for baldness and receding hairlines.',
  },
  {
    icon: 'TestTubes',
    title: 'PRP / GFC Therapy',
    copy: "Stimulate natural hair growth using your body's own growth factors.",
  },
  {
    icon: 'Syringe',
    title: 'Mesotherapy',
    copy: 'Strengthen thinning hair and improve scalp health with a quick, non-invasive procedure.',
  },
  {
    icon: 'Droplets',
    title: 'Dandruff & Scalp Treatment',
    copy: 'Clear flakes and irritation for a healthier scalp environment.',
  },
  {
    icon: 'UserRound',
    title: 'Beard Transplant',
    copy: 'Achieve fuller, well-shaped facial hair with lasting results.',
  },
]

export const WHY_US = [
  {
    icon: 'BadgeCheck',
    title: 'Certified Trichologists',
    copy: 'Every treatment plan is designed and reviewed by qualified specialists.',
  },
  {
    icon: 'ShieldCheck',
    title: 'FDA-Approved Treatments',
    copy: '18+ modern hair restoration options backed by research.',
  },
  {
    icon: 'ClipboardList',
    title: 'Personalised Plans',
    copy: 'No generic packages — every plan is built around your scalp and hair type.',
  },
  {
    icon: 'Star',
    title: '4.8★ Rated Clinic',
    copy: 'Part of a trusted network with 35+ clinics across Tamil Nadu.',
  },
]

export const RESULTS = [
  { src: result1, caption: 'Crown density restored', treatment: 'Hair Fall Treatment' },
  { src: result2, caption: 'Hairline and mid-scalp regrowth', treatment: 'Hair GFC Therapy' },
  { src: result3, caption: 'Receding hairline rebuilt', treatment: 'Hair Transplant' },
  { src: result4, caption: 'Thinning crown filled in', treatment: 'PRP / GFC Therapy' },
  { src: result5, caption: 'Visible density at the crown', treatment: 'Hair Fall Treatment' },
  { src: result6, caption: 'Widening parting corrected', treatment: 'Mesotherapy' },
]

export const REVIEWS = [
  {
    name: 'Dillip Maharana',
    treatment: 'GFC Treatment',
    text: 'I visited this clinic for GFC treatment and had a good overall experience. The doctor explained the treatment in detail and answered all my questions clearly. The staff were also very polite, supportive, and professional throughout the process. I felt comfortable and well taken care of.',
  },
  {
    name: 'Prakash Sekar',
    treatment: 'Hair GFC — 3 Sessions',
    text: 'Completed 3 Hair GFC sessions and the treatment process was smooth and professional. Noticed reduced hair fall and improved hair quality after the sessions. Friendly doctors and staff, good guidance, and excellent patient care.',
  },
  {
    name: 'Seerin',
    treatment: 'Q-Switch & Facial',
    text: 'I visited Bonitaa for a Q-switch treatment and a facial, and the experience was amazing! The ambience is super clean, calm and very welcoming. The staff are really polite, friendly and professional — they explain every step clearly and make you feel very comfortable throughout the process.',
  },
  {
    name: 'Rajan Gomes',
    treatment: 'Hydra Facial',
    text: 'I had a Hydra Facial at Bonitaa Skin and Hair Care and the experience was excellent. My skin felt deeply cleansed, hydrated, and instantly brighter after the session. The procedure was gentle and relaxing, and everything was explained clearly. The clinic maintains good hygiene and professionalism.',
  },
]

export const FAQS = [
  {
    q: 'Is hair transplant a permanent solution?',
    a: 'Yes — transplanted hair follicles are resistant to hair loss and typically grow naturally for a lifetime.',
  },
  {
    q: 'How soon will I see results from hair fall treatment?',
    a: 'Most patients start noticing visible improvement within 3 to 4 months, depending on the treatment and severity.',
  },
  {
    q: 'What happens during the first consultation?',
    a: 'Our specialist examines your scalp and hair condition, discusses your history and concerns, and recommends a treatment plan suited to you.',
  },
  {
    q: 'Are your treatments safe?',
    a: 'Yes — all treatments used at our clinic are FDA-approved and performed by certified professionals.',
  },
  {
    q: 'Do you have more than one clinic in Chennai?',
    a: "Yes — we're part of a network of 35+ clinics across Tamil Nadu, with locations in Mylapore and Velachery here in Chennai. Call us and we'll point you to the one nearest you.",
  },
]
