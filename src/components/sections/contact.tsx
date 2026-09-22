import { ArrowUpRight, InstagramLogo } from '@phosphor-icons/react'
import { StartProjectButton } from '@/components/project/project-dialog'
import { Magnetic } from '@/components/ui/magnetic'
import { PlateButton } from '@/components/ui/plate-button'
import { site } from '@/lib/site'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="close-title" className="relative isolate overflow-hidden border-t border-smoke/50 bg-plate">
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[80%] bg-[radial-gradient(55%_60%_at_50%_100%,rgba(30,111,230,0.28),transparent_70%)]" />
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-28 text-center md:px-10 md:py-44">
        <h2 id="close-title" className="max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-none font-semibold tracking-[-0.035em] text-balance">
          You bring the idea. <span className="text-sky">We&rsquo;ll build the rest.</span>
        </h2>
        <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-pewter">
          Tell us what you&rsquo;re working on and we&rsquo;ll reply by email. {site.claim}, every Upwork job rated five
          stars, and yours could be next.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Magnetic>
            <StartProjectButton>
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </StartProjectButton>
          </Magnetic>
          <PlateButton
            href={site.instagramUrl}
            target="_blank"
            rel="noreferrer"
            variant="hairline"
            aria-label={`Webfluere on Instagram, ${site.instagramHandle}`}
          >
            <InstagramLogo aria-hidden className="size-4 text-sky" />
            {site.instagramHandle}
          </PlateButton>
        </div>
      </div>
    </section>
  )
}
