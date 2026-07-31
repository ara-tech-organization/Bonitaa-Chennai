import { motion } from 'framer-motion'
import { scrollToBooking, useCall } from '../../callStore'
import BeforeAfter from './BeforeAfter'
import CTAButtons from './CTAButtons'
import { EYEBROW, HEADLINE, LEDE, SUBHEAD } from './heroContent'
import './hero.css'

const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  const { requestCall } = useCall()

  /* No scroll-linked motion here. The words each animate in once on load and
     then hold — nothing in this section moves as the page scrolls. */
  return (
    <section className="hero" id="top">
      {/* The hero's picture is the before/after frame in the second column —
          there is no full-bleed artwork behind it, just the dark ground and
          two blurred gold blooms drawn in CSS. */}
      <div className="hero__grid">
        {/* Copy sits in the white space the artwork already reserves. */}
        <div className="hero__copy">
          <motion.span
            className="hero__eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            {EYEBROW}
          </motion.span>

          <h1 className="hero__title">
            {HEADLINE.map((line, li) => (
              <span className="hero__line" key={li}>
                <motion.span
                  className="hero__line-inner"
                  initial={{ opacity: 0, y: '0.45em', filter: 'blur(11px)' }}
                  animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
                  transition={{ duration: 0.95, delay: 0.18 + li * 0.11, ease }}
                >
                  {line.map((word) => (
                    <span className={`hero__word${word.accent ? ' is-accent' : ''}`} key={word.t}>
                      {word.t}
                    </span>
                  ))}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52, ease }}
          >
            {/* Dividers are drawn in CSS on adjacent siblings, so a wrapped
                line never begins with an orphaned separator. */}
            {SUBHEAD.map((part) => (
              <span className="hero__sub-item" key={part}>
                {part}
              </span>
            ))}
          </motion.p>

          <motion.p
            className="hero__lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease }}
          >
            {LEDE}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.74, ease }}
          >
            {/* "Speak to a Specialist" leads, per the brief. It routes through
                the call confirmation modal, which then opens the tel: link. */}
            <CTAButtons onCall={() => requestCall()} onBook={scrollToBooking} />
          </motion.div>
        </div>

        <motion.div
          className="hero__showcase"
          initial={{ opacity: 0, x: 38 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
        >
          <BeforeAfter />
        </motion.div>
      </div>
    </section>
  )
}
