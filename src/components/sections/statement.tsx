import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { mapRange } from '@/lib/motion'

const TEXT = 'A slow, broken or hard-to-find website quietly costs you trust and customers.'

export function Statement() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = TEXT.split(' ')

  return (
    <section aria-labelledby="problem-title" className="border-t border-smoke/50">
      <div ref={ref} className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-44">
        <h2 id="problem-title" className="max-w-[20ch] text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.05] font-medium tracking-[-0.03em]">
          {words.map((word, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={!!reduce}>
              {word}
            </Word>
          ))}
        </h2>
        <p className="mt-10 max-w-[46ch] text-lg leading-relaxed text-pewter md:ml-[33%]">
          We design it and we build it, so the site you sign off is the site that ships. No hand-off between a design
          studio and a separate developer.
        </p>
      </div>
    </section>
  )
}

/** Each word is burnished from the dark as the statement scrolls through the viewport. */
function Word({
  children,
  progress,
  range,
  still,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  still: boolean
}) {
  const opacity = useTransform(progress, (v) => mapRange(v, range, [0.15, 1]))
  return (
    <motion.span style={still ? undefined : { opacity }} className="mr-[0.24em] inline-block">
      {children}
    </motion.span>
  )
}
