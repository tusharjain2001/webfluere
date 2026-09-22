import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, SealCheck, Star } from '@phosphor-icons/react'
import { Magnetic } from '@/components/ui/magnetic'
import { StartProjectButton } from '@/components/project/project-dialog'
import { ease } from '@/lib/motion'
import { testimonials } from '@/lib/site'
import { cn } from '@/lib/utils'

const StoryCanvas = lazy(() => import('@/components/three/story-scene').then((m) => ({ default: m.StoryCanvas })))

/** The first viewport. The 3D stage is page-wide by default; `withScene` keeps a static copy inside the hero. */
export function Hero({ withScene = false }: { withScene?: boolean }) {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      {withScene && (
        <Suspense fallback={null}>
          <StoryCanvas mode="hero" />
        </Suspense>
      )}
      {/* On tall screens the devices sit above the copy; this keeps the text readable over them. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[68%] bg-linear-to-t from-plate via-plate/90 to-transparent md:hidden" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-start px-5 pt-[36vh] pb-10 md:justify-center md:px-10 md:pt-24 md:pb-24">
        <div className="max-w-[44rem]">
          <motion.a
            href="#proof"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            className="mb-5 inline-flex md:mb-6 items-center gap-2 rounded-full border border-sky/30 bg-royal/15 py-1.5 pr-3.5 pl-2 text-sm text-silver backdrop-blur-sm transition-colors duration-200 hover:border-sky/60"
          >
            <SealCheck weight="fill" aria-hidden className="size-5 text-sky" />
            <span>
              <span className="font-semibold">Top Rated</span> on Upwork
            </span>
            <span aria-hidden className="text-smoke">|</span>
            <span>
              <span className="font-semibold">100%</span> Job Success
            </span>
          </motion.a>
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0.25, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, ease }}
            className="text-[clamp(2.75rem,4.6vw,4.5rem)] leading-none font-semibold tracking-[-0.035em] text-balance text-silver"
          >
            Designed and built by the <span className="text-sky">same hands.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.25 }}
            className="mt-6 max-w-[42ch] text-lg leading-relaxed text-pewter"
          >
            Landing pages, business websites and web apps, designed and built in React and Next.js. Bring a Figma file,
            a PSD or just an idea.
          </motion.p>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.4 }}
            className="mt-10"
          >
            <Magnetic>
              <StartProjectButton>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </StartProjectButton>
            </Magnetic>
          </motion.div>
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.55 }}
            className="mt-8 flex max-w-[30rem] divide-x md:mt-10 divide-smoke/70"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-1 flex-col px-4 first:pl-0 md:px-6">
                <dt className="order-2 mt-1.5 text-[13px] leading-snug text-pewter md:text-sm">{stat.label}</dt>
                <dd className="order-1 flex items-center gap-1.5 text-[1.75rem] leading-none font-semibold tracking-[-0.03em] text-silver md:text-4xl">
                  {stat.value}
                  {stat.star && <Star weight="fill" aria-hidden className="size-5 text-sky md:size-6" />}
                </dd>
              </div>
            ))}
          </motion.dl>
          <ReviewCard className="mt-8 md:hidden" />
        </div>
      </div>

      <div className="absolute right-10 bottom-8 hidden w-[21rem] md:block">
        <ReviewCard />
        <p className="mt-3 text-right font-roman text-[12px] font-medium tracking-[0.18em] text-pewter uppercase">
          On screen: <span className="text-sky">Marrow</span>, a concept
        </p>
      </div>
    </section>
  )
}

const heroStats = [
  { value: '5.0', label: 'Upwork rating', star: true },
  { value: '8/8', label: 'Five-star jobs' },
  { value: '20+', label: 'Projects shipped' },
]

/**
 * Real Upwork reviews, one at a time. All quotes share one grid cell so the card never changes height.
 * It rotates every 7s, pauses on hover or focus, and stays on the first quote under reduced motion.
 */
function ReviewCard({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduce || paused) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 7000)
    return () => window.clearInterval(id)
  }, [reduce, paused])

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease, delay: 0.8 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-label="Client reviews from Upwork"
      className={cn('rounded-[3px] border border-smoke/70 bg-plate/90 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-sm', className)}
    >
      <div className="flex items-center justify-between">
        <span role="img" aria-label="Rated 5 out of 5" className="flex gap-0.5 text-sky">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} weight="fill" aria-hidden className="size-4" />
          ))}
        </span>
        <div className="flex gap-1.5">
          {testimonials.map((t, i) => (
            <button
              key={t.project}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show review ${i + 1} of ${testimonials.length}`}
              aria-pressed={i === index}
              className="grid size-6 place-items-center"
            >
              <span className={cn('h-1.5 rounded-full transition-all duration-300', i === index ? 'w-5 bg-sky' : 'w-1.5 bg-smoke')} />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 grid">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.project}
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 0.35, ease, delay: i === index ? 0.35 : 0 }}
            aria-hidden={i !== index}
            className="[grid-area:1/1]"
          >
            <blockquote className="text-[15px] leading-normal text-silver">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-3 text-[13px] text-pewter">
              Upwork client · {t.project} · {t.date}
            </figcaption>
          </motion.div>
        ))}
      </div>
      <a
        href="#proof"
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-sky underline decoration-sky/40 underline-offset-4 hover:decoration-sky"
      >
        See all reviews and numbers
        <ArrowDown aria-hidden className="size-3.5" />
      </a>
    </motion.figure>
  )
}
