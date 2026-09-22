import { motion } from 'framer-motion'
import { ArrowUpRight, SealCheck, Star } from '@phosphor-icons/react'
import { BurnishImage } from '@/components/ui/burnish-image'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { clientProjects, endorsements, isPlaceholder, reviewShots, site, stats, testimonials } from '@/lib/site'

const rise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
}

function Stars({ className = 'size-4' }: { className?: string }) {
  return (
    <span role="img" aria-label="Rated 5 out of 5" className="flex gap-0.5 text-sky">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} weight="fill" aria-hidden className={className} />
      ))}
    </span>
  )
}

/**
 * Verified track record: the founder's Upwork numbers, client reviews and endorsed qualities.
 * Sits straight after the hero so a visitor from an ad sees the proof before the long scroll story.
 * The section is opaque, so the fixed 3D stage stays hidden behind it.
 */
export function ClientProof() {
  const upwork = !isPlaceholder(site.upworkUrl)

  return (
    <section id="proof" aria-labelledby="proof-title" className="relative border-y border-smoke/50 bg-plate">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[40rem]">
            <p className="flex items-center gap-2 font-roman text-[13px] font-medium tracking-[0.18em] text-pewter uppercase">
              <SealCheck weight="fill" aria-hidden className="size-4 text-sky" />
              Verified on Upwork
            </p>
            <h2 id="proof-title" className="mt-4 text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
              8 jobs finished on Upwork. <span className="text-sky">8&nbsp;five‑star reviews.</span>
            </h2>
          </div>
          <p className="max-w-[40ch] leading-relaxed text-pewter">
            Webfluere is led by its founder, Tushar. These are the numbers and reviews from his Upwork profile, where
            clients can only review work they paid for.
          </p>
        </div>

        <dl className="mt-14 grid grid-cols-2 border-t border-smoke/60 md:mt-20 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...rise}
              transition={{ duration: 0.9, ease, delay: i * 0.08 }}
              className="flex flex-col border-b border-smoke/60 py-7 pr-4 max-lg:odd:border-r max-lg:even:pl-5 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <dt className="order-2 mt-3 text-sm font-medium text-silver md:text-base">{stat.label}</dt>
              {/* Every value shares one box height so the labels line up; a word (Top Rated) sets smaller to fit one line. */}
              <dd
                className={cn(
                  'order-1 flex h-[clamp(2.25rem,5vw,4rem)] items-end leading-none font-semibold tracking-[-0.04em] whitespace-nowrap text-silver',
                  /\d/.test(stat.value) ? 'text-[clamp(2.25rem,5vw,4rem)]' : 'text-[clamp(1.625rem,3.4vw,3rem)]',
                )}
              >
                {stat.value}
              </dd>
              <dd className="order-3 mt-1.5 max-w-[26ch] text-sm leading-relaxed text-pewter">{stat.note}</dd>
            </motion.div>
          ))}
        </dl>

        {testimonials.length > 0 && (
          <ul className="mt-16 grid gap-5 md:mt-24 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.li
                key={t.project}
                {...rise}
                transition={{ duration: 0.9, ease, delay: i * 0.1 }}
                className="flex"
              >
                <figure className="flex w-full flex-col rounded-[2px] border border-smoke/60 bg-plate-raised/40 p-6 md:p-8">
                  <Stars />
                  <blockquote className="mt-5 flex-1 text-lg leading-snug font-medium tracking-[-0.01em] text-silver md:text-xl">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-smoke/60 pt-4 text-sm text-pewter">
                    <span className="text-silver">{t.project}</span>
                    <br />
                    Upwork client, {t.date}
                  </figcaption>
                </figure>
              </motion.li>
            ))}
          </ul>
        )}

        <div className="mt-20 md:mt-28">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h3 className="text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight font-medium tracking-[-0.03em] text-silver">
              All 8 reviews, <span className="text-sky">straight from Upwork.</span>
            </h3>
            <p className="text-sm text-pewter">Unedited screenshots. Tap one to see it full size.</p>
          </div>
          {/* Phones get one column, best quotes first. From md up, alternating shots fill two columns of near-equal height. */}
          <ul className="mt-8 flex flex-col gap-4 md:hidden">
            {reviewShots.map((shot, i) => (
              <ReviewShot key={shot.src} shot={shot} index={i} />
            ))}
          </ul>
          <div className="mt-8 hidden items-start gap-4 md:grid md:grid-cols-2">
            {[0, 1].map((column) => (
              <ul key={column} className="flex flex-col gap-4">
                {reviewShots.map((shot, i) => (i % 2 === column ? <ReviewShot key={shot.src} shot={shot} index={i} /> : null))}
              </ul>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 md:mt-16 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-pewter">What clients endorsed in their reviews</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {/* Counts of one read as weak, so only a quality several clients named shows its number. */}
              {endorsements.map((e) => (
                <li
                  key={e.label}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-sm text-silver',
                    e.count > 1 ? 'border-sky/50 bg-royal/15' : 'border-smoke/70',
                  )}
                >
                  {e.label}
                  {e.count > 1 && <span className="ml-1.5 text-sky">named by {e.count} clients</span>}
                </li>
              ))}
            </ul>
          </div>
          {upwork && (
            <a
              href={site.upworkUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-sky underline decoration-sky/40 underline-offset-4 hover:decoration-sky"
            >
              Read every review on Upwork
              <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>

        {clientProjects.length > 0 && (
          <ul className="mt-20 grid gap-10 md:grid-cols-2">
            {clientProjects.map((project) => (
              <li key={project.name} className="flex flex-col gap-4">
                <BurnishImage src={project.image} alt={project.imageAlt} className="aspect-[16/10] w-full" />
                <div className="border-t border-smoke/60 pt-4">
                  <h3 className="text-lg font-medium">
                    {project.url ? (
                      <a href={project.url} className="underline decoration-smoke hover:decoration-silver" target="_blank" rel="noreferrer">
                        {project.name}
                      </a>
                    ) : (
                      project.name
                    )}
                  </h3>
                  <p className="mt-2 max-w-[52ch] leading-relaxed text-pewter">{project.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/** One review screenshot, capped at its own pixel width because the captures are 1x. Opens full size. */
function ReviewShot({ shot, index }: { shot: (typeof reviewShots)[number]; index: number }) {
  return (
    <motion.li {...rise} transition={{ duration: 0.8, ease, delay: (index % 4) * 0.06 }}>
      <a
        href={shot.src}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden rounded-[4px] bg-white p-2 ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
      >
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
          style={{ maxWidth: shot.width }}
          className="h-auto w-full"
        />
      </a>
    </motion.li>
  )
}
