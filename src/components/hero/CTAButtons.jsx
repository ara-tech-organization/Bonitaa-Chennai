import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, PhoneCall } from 'lucide-react'

/**
 * Magnetic button: the element leans toward the cursor while it is inside,
 * and springs home on exit. Pointer-driven, so touch is unaffected.
 */
function Magnetic({ children, className, onClick, strength = 0.32, ...rest }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const x = useSpring(mx, { stiffness: 260, damping: 20, mass: 0.6 })
  const y = useSpring(my, { stiffness: 260, damping: 20, mass: 0.6 })
  // Inner label travels slightly further for a layered, non-rigid feel.
  const lx = useTransform(x, (v) => v * 0.42)
  const ly = useTransform(y, (v) => v * 0.42)

  const onMove = (e) => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      onClick={onClick}
      style={{ x, y }}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      <motion.span className="mbtn__inner" style={{ x: lx, y: ly }}>
        {children}
      </motion.span>
    </motion.button>
  )
}

export default function CTAButtons({ onCall, onBook }) {
  return (
    <div className="hero__ctas">
      <Magnetic className="mbtn mbtn--solid" onClick={onCall}>
        <span className="mbtn__icon mbtn__icon--lead">
          <PhoneCall size={16} strokeWidth={1.7} />
        </span>
        <span className="mbtn__label">Speak to a Specialist</span>
      </Magnetic>

      <Magnetic className="mbtn mbtn--glass" onClick={onBook} strength={0.24}>
        <span className="mbtn__label">Book a Consultation</span>
        <span className="mbtn__icon">
          <ArrowUpRight size={17} strokeWidth={1.7} />
        </span>
      </Magnetic>
    </div>
  )
}
