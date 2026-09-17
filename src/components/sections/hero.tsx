import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Magnetic } from '@/components/ui/magnetic'
import { PlateButton } from '@/components/ui/plate-button'
import { ease } from '@/lib/motion'
import { site } from '@/lib/site'

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
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[50%] bg-linear-to-t from-plate via-plate/85 to-transparent md:hidden" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-start px-5 pt-[46vh] pb-10 md:justify-center md:px-10 md:pt-24 md:pb-24">
        <div className="max-w-[44rem]">
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
            Webfluere designs and builds websites and apps for founders and growing businesses. What you approve is what
            ships.
          </motion.p>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.4 }}
            className="mt-10"
          >
            <Magnetic>
              <PlateButton href={site.instagramUrl} aria-label={site.ctaLabel}>
                DM &ldquo;BUILD&rdquo;
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </PlateButton>
            </Magnetic>
          </motion.div>
          <p className="mt-8 font-roman text-[13px] font-medium tracking-[0.18em] text-pewter uppercase md:hidden">
            <span className="text-sky">Plate I</span>, Kiln &amp; Crumb, a concept
          </p>
        </div>
      </div>

      <p className="pointer-events-none absolute right-10 bottom-10 hidden text-right font-roman text-[13px] leading-[1.9] font-medium tracking-[0.18em] text-pewter uppercase md:block">
        <span className="text-sky">Plate I</span>
        <br />
        Kiln &amp; Crumb, a concept
      </p>
    </section>
  )
}
