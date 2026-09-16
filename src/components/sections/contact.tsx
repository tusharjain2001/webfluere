import { ArrowUpRight } from '@phosphor-icons/react'
import { Magnetic } from '@/components/ui/magnetic'
import { PlateButton } from '@/components/ui/plate-button'
import { site } from '@/lib/site'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="close-title" className="relative border-t border-smoke/50 bg-plate">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-28 text-center md:px-10 md:py-44">
        <h2 id="close-title" className="max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-none font-semibold tracking-[-0.035em] text-balance">
          You bring the idea. We&rsquo;ll build the rest.
        </h2>
        <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-pewter">
          Send us a DM on Instagram with the word BUILD and tell us what you&rsquo;re working on. {site.claim}, and yours
          could be next.
        </p>
        <div className="mt-10">
          <Magnetic>
            <PlateButton href={site.instagramUrl} aria-label={site.ctaLabel}>
              DM &ldquo;BUILD&rdquo;
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </PlateButton>
          </Magnetic>
        </div>
        <p className="mt-6 text-sm text-pewter">
          Instagram <span className="text-silver">{site.instagramHandle}</span>
        </p>
      </div>
    </section>
  )
}
