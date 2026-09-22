import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { mapRange } from '@/lib/motion'
import { concepts } from '@/lib/site'

/** The concept ring's captions. The 3D stage turns plate `i` to the front at progress i / (n - 1). */
export function WorkRing() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section ref={ref} id="work" data-chapter="work" aria-labelledby="work-title" className="relative h-[520vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[14%] bg-linear-to-t from-plate/90 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-between px-5 pt-24 pb-12 md:px-10 md:pt-28 md:pb-14">
          <div className="max-w-[34rem]">
            <h2 id="work-title" className="text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em]">
              Six concepts, <span className="text-sky">made from scratch.</span>
            </h2>
            <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-pewter">
              Original websites and apps we designed from a blank page to show our range. These are our own concepts.
            </p>
          </div>
          <ul className="grid">
            {concepts.map((concept, i) => (
              <ConceptCaption key={concept.slug} name={concept.name} kind={concept.kind} index={i} progress={scrollYProgress} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function ConceptCaption({
  name,
  kind,
  index,
  progress,
}: {
  name: string
  kind: string
  index: number
  progress: MotionValue<number>
}) {
  const distance = (v: number) => v * (concepts.length - 1) - index
  const opacity = useTransform(progress, (v) => mapRange(Math.abs(distance(v)), [0.16, 0.48], [1, 0]))
  const y = useTransform(progress, (v) => distance(v) * -28)
  return (
    <motion.li style={{ opacity, y }} className="[grid-area:1/1]">
      <h3 className="text-[clamp(1.75rem,3.2vw,3rem)] leading-none font-semibold tracking-[-0.03em]">{name}</h3>
      <p className="mt-3 font-roman text-[13px] font-medium tracking-[0.18em] text-pewter uppercase">{kind}, <span className="text-sky">concept</span></p>
    </motion.li>
  )
}
