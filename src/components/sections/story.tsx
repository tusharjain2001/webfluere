import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { mapRange } from '@/lib/motion'

// Progress ranges line up with the laptop's exploded view in the 3D stage (story-scene.tsx).
const steps = [
  { title: 'Sketch', body: 'The structure of every page, planned before anything is styled.', range: [0.3, 0.42] },
  { title: 'Design', body: 'How it looks and feels, shaped with you until you approve it.', range: [0.42, 0.54] },
  { title: 'Build', body: 'The same team turns the approved design into a fast, working site.', range: [0.54, 0.68] },
] as const

/** 1 inside [a, b], easing in and out over `edge` at either end. */
const fade = (v: number, a: number, b: number, edge = 0.04) =>
  mapRange(v, [a - edge, a], [0, 1]) * mapRange(v, [b - edge, b], [1, 0])

export function Story() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const problem = useTransform(scrollYProgress, (v) => fade(v, 0, 0.26))
  const problemY = useTransform(scrollYProgress, (v) => mapRange(v, [0.18, 0.26], [0, -40]))
  const process = useTransform(scrollYProgress, (v) => fade(v, 0.3, 0.68))
  const promise = useTransform(scrollYProgress, (v) => fade(v, 0.72, 1.04))
  const promiseY = useTransform(scrollYProgress, (v) => mapRange(v, [0.68, 0.72], [40, 0]))

  return (
    <section ref={ref} data-chapter="story" aria-labelledby="story-title" className="relative h-[300vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[58%] bg-linear-to-t from-plate via-plate/85 to-transparent md:hidden" />
        <div className="relative mx-auto flex h-full max-w-[1400px] items-end px-5 pb-14 md:items-center md:px-10 md:pb-0">
          <div className="grid w-full md:max-w-[36%]">
            <motion.div style={{ opacity: problem, y: problemY }} className="[grid-area:1/1] self-end md:self-center">
              <h2 id="story-title" className="text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
                A slow, broken or hard-to-find website quietly costs you trust and customers.
              </h2>
            </motion.div>

            <motion.div style={{ opacity: process }} className="[grid-area:1/1] self-end md:self-center">
              <p className="text-lg text-pewter">One team, start to finish.</p>
              <ol className="mt-6 space-y-5 md:space-y-7">
                {steps.map((step) => (
                  <Step key={step.title} title={step.title} body={step.body} range={step.range} progress={scrollYProgress} />
                ))}
              </ol>
            </motion.div>

            <motion.div style={{ opacity: promise, y: promiseY }} className="[grid-area:1/1] self-end md:self-center">
              <h3 className="text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
                What you approve is what <span className="text-sky">ships.</span>
              </h3>
              <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-pewter">
                We design it and we build it. No hand-off between a design studio and a separate developer.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Step({
  title,
  body,
  range,
  progress,
}: {
  title: string
  body: string
  range: readonly [number, number]
  progress: MotionValue<number>
}) {
  const lit = useTransform(progress, (v) => 0.3 + 0.7 * fade(v, range[0], range[1], 0.03))
  return (
    <motion.li style={{ opacity: lit }}>
      <h3 className="text-2xl font-semibold tracking-[-0.02em] text-sky md:text-3xl">{title}</h3>
      <p className="mt-1.5 max-w-[38ch] leading-relaxed text-pewter">{body}</p>
    </motion.li>
  )
}
