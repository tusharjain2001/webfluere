import { motion, useReducedMotion } from 'framer-motion'
import { ease } from '@/lib/motion'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

// Static fallback (reduced motion). Each service is one pass of the scraper: the plate is rocked black,
// then scraped back toward plate-brown, and the last is burnished to silver.
const services = [
  { title: 'Websites', body: 'Landing pages and business sites that make you look established from the first second.', rock: 0.9 },
  { title: 'Responsive design', body: 'Built to match your Figma or PSD on every phone, tablet and desktop.', rock: 0.76 },
  { title: 'Apps', body: 'Web apps and e-commerce storefronts in React and Next.js that customers pick up straight away.', rock: 0.6 },
  { title: 'SEO foundations', body: 'Clean structure, fast pages and a solid setup, built so people can find you.', rock: 0.42 },
  { title: 'Smooth UX', body: 'Fast, clear and free of friction for the people using what we build.', rock: 0 },
]

export function Services() {
  const reduce = useReducedMotion()

  return (
    <section id="services" aria-labelledby="services-title" className="border-t border-smoke/50">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <h2 id="services-title" className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.03em]">
          What we build for you.
        </h2>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-pewter">
          Five services, one team, and {site.claim} so far.
        </p>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-[2px] border border-smoke/60 bg-smoke/60 md:grid-cols-5">
          {services.map((service, i) => {
            const lit = service.rock === 0
            return (
              <li
                key={service.title}
                className={cn(
                  'relative flex min-h-[10rem] flex-col justify-end p-6 md:min-h-[18rem] md:p-7',
                  lit ? 'burnished text-plate' : 'bg-plate-brown text-silver',
                )}
              >
                {!lit && (
                  <>
                    <span aria-hidden className="absolute inset-0 bg-plate" style={{ opacity: service.rock }} />
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-60"
                      style={{ backgroundImage: 'url(/material/burr.png)', backgroundSize: '256px 256px' }}
                    />
                  </>
                )}
                {!lit && !reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 bg-plate"
                    initial={{ opacity: 1 }}
                    whileInView={{ opacity: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1.2, ease, delay: i * 0.16 }}
                  />
                )}
                <h3 className="relative text-xl font-semibold tracking-[-0.02em] md:text-2xl">{service.title}</h3>
                <p className={cn('relative mt-3 text-[15px] leading-relaxed', lit ? 'text-plate/80' : 'text-silver/80')}>
                  {service.body}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
