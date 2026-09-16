import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'

/** Pulls its child gently toward a mouse pointer. Touch and reduced-motion users get a static element. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const spring = { stiffness: 220, damping: 16, mass: 0.4 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
