import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { mapRange } from '@/lib/motion'
import { site } from '@/lib/site'

// One pinned step per service; the 3D stage stages each one in the same order (story-scene.tsx).
const services = [
  { title: 'Websites', body: 'Landing pages and business sites that make you look established from the first second.' },
  { title: 'Responsive design', body: 'Built to match your Figma or PSD on every phone, tablet and desktop.' },
  { title: 'Apps', body: 'Web apps and e-commerce storefronts in React and Next.js that customers pick up straight away.' },
  { title: 'SEO foundations', body: 'Clean structure, fast pages and a solid setup, built so people can find you.' },
  { title: 'Smooth UX', body: 'Fast, clear and free of friction for the people using what we build.' },
]

/** How lit service `i` is at progress `v`: fully on during its own step. */
function weight(v: number, i: number) {
  const x = v * services.length - i
  const on = i === 0 ? 1 : mapRange(x, [-0.12, 0.02], [0, 1])
  const offv = i === services.length - 1 ? 1 : mapRange(x, [0.9, 1.04], [1, 0])
  return on * offv
}

export function ServicesScroll() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section ref={ref} id="services" data-chapter="services" aria-labelledby="services-title" className="relative h-[520vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[60%] bg-linear-to-t from-plate via-plate/85 to-transparent md:hidden" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-12 md:justify-center md:px-10 md:pb-0">
          <div className="md:max-w-[36%]">
            <h2 id="services-title" className="text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.03em]">
              What we build for you.
            </h2>
            <p className="mt-3 text-pewter">Five services from one team, and {site.claim} so far.</p>
            <ol className="mt-7 md:mt-12">
              {services.map((service, i) => (
                <ServiceTitle key={service.title} title={service.title} index={i} progress={scrollYProgress} />
              ))}
            </ol>
            <div className="mt-5 grid min-h-[3.5rem] md:mt-8">
              {services.map((service, i) => (
                <ServiceBody key={service.title} body={service.body} index={i} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceTitle({ title, index, progress }: { title: string; index: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, (v) => 0.3 + 0.7 * weight(v, index))
  const x = useTransform(progress, (v) => weight(v, index) * 10)
  const lit = useTransform(progress, (v) => weight(v, index))
  const color = useTransform(lit, [0, 1], ['#e6ecf5', '#5ca6ff'])
  return (
    <motion.li style={{ opacity, x, color }} className="py-1 text-xl font-semibold tracking-[-0.02em] md:py-1.5 md:text-3xl">
      {title}
    </motion.li>
  )
}

function ServiceBody({ body, index, progress }: { body: string; index: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, (v) => weight(v, index))
  return (
    <motion.p style={{ opacity }} className="[grid-area:1/1] max-w-[40ch] leading-relaxed text-pewter md:text-lg">
      {body}
    </motion.p>
  )
}
