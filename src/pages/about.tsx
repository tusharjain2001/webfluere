import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, MotionConfig, useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { ArrowUpRight, ChatsCircle, Code, GithubLogo, LinkedinLogo, SealCheck, type Icon } from '@phosphor-icons/react'
import { ProjectDialogProvider } from '@/components/project/project-dialog'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/sections/footer'
import { Nav } from '@/components/sections/nav'
import { ease } from '@/lib/motion'
import { isPlaceholder, partners, site, type Partner } from '@/lib/site'

const rise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
}

const facts = [
  { value: '2', label: 'Partners, both developers' },
  { value: '2 yrs', label: 'Experience each' },
  { value: '20+', label: 'Projects shipped' },
  { value: '5.0', label: 'On every completed Upwork job' },
]

const principles = [
  {
    icon: ChatsCircle,
    title: 'You talk to the builders',
    body: 'No account managers in between. Your questions go straight to the two people writing your code.',
  },
  {
    icon: Code,
    title: 'Designed and built by one team',
    body: 'We design it and we build it, so what you approve is what ships.',
  },
  {
    icon: SealCheck,
    title: 'Proven on real client work',
    body: 'Top Rated on Upwork, 100% Job Success, and five stars on every job we have finished there.',
    link: { href: site.upworkUrl, label: 'See the Upwork profile' },
  },
]

export default function AboutPage() {
  const reduce = !!useReducedMotion()
  const lenis = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reduce) return
    lenis.current = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 })
    return () => {
      lenis.current?.destroy()
      lenis.current = null
    }
  }, [reduce])

  const onFormOpenChange = useCallback((open: boolean) => {
    if (open) lenis.current?.stop()
    else lenis.current?.start()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <ProjectDialogProvider onOpenChange={onFormOpenChange}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[2px] focus:bg-silver focus:px-4 focus:py-2 focus:text-plate"
        >
          Skip to content
        </a>
        <Nav home={false} />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(50%_40%_at_75%_10%,rgba(30,111,230,0.2),transparent_70%)]"
        />
        <main id="main" className="relative z-10">
          <section id="top" aria-labelledby="about-title" className="mx-auto max-w-[1400px] px-5 pt-36 pb-16 md:px-10 md:pt-44 md:pb-24">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease }}
              className="font-roman text-[13px] font-medium tracking-[0.18em] text-pewter uppercase"
            >
              About Webfluere
            </motion.p>
            <motion.h1
              id="about-title"
              initial={{ opacity: 0.25, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, ease }}
              className="mt-5 max-w-[16ch] text-[clamp(2.75rem,6vw,5.5rem)] leading-none font-semibold tracking-[-0.035em] text-balance text-silver"
            >
              Two partners. <span className="text-sky">Both of us build.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease, delay: 0.25 }}
              className="mt-7 max-w-[52ch] text-lg leading-relaxed text-pewter"
            >
              Webfluere is Tushar Jain and Manan Utsav. We are both developers, so the people you talk to are the people
              designing and building your website.
            </motion.p>

            <dl className="mt-14 grid grid-cols-2 border-t border-smoke/60 md:mt-20 lg:grid-cols-4">
              {facts.map((fact, i) => (
                <motion.div
                  key={fact.label}
                  {...rise}
                  transition={{ duration: 0.9, ease, delay: i * 0.08 }}
                  className="flex flex-col border-b border-smoke/60 py-7 pr-4 max-lg:odd:border-r max-lg:even:pl-5 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
                >
                  <dt className="order-2 mt-2.5 text-sm text-pewter md:text-base">{fact.label}</dt>
                  <dd className="order-1 text-[clamp(2.25rem,5vw,4rem)] leading-none font-semibold tracking-[-0.04em] text-silver">
                    {fact.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="partners-title" className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10 md:pb-36">
            <h2 id="partners-title" className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.03em]">
              The people behind your project.
            </h2>
            <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
              {partners.map((partner, i) => (
                <motion.li key={partner.name} {...rise} transition={{ duration: 0.9, ease, delay: i * 0.1 }}>
                  <PartnerCard partner={partner} />
                </motion.li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="how-title" className="border-t border-smoke/50 bg-plate">
            <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
              <h2 id="how-title" className="max-w-[20ch] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.03em]">
                How working with us <span className="text-sky">feels.</span>
              </h2>
              <ul className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
                {principles.map((p, i) => (
                  <motion.li key={p.title} {...rise} transition={{ duration: 0.9, ease, delay: i * 0.1 }} className="border-t border-smoke/60 pt-6">
                    <p.icon weight="duotone" aria-hidden className="size-8 text-sky" />
                    <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-silver md:text-2xl">{p.title}</h3>
                    <p className="mt-3 max-w-[38ch] leading-relaxed text-pewter">{p.body}</p>
                    {p.link && (
                      <a
                        href={p.link.href}
                        {...(p.link.href.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
                        className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sky underline decoration-sky/40 underline-offset-4 hover:decoration-sky"
                      >
                        {p.link.label}
                        <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </div>
          </section>

          <Contact />
        </main>
        <Footer />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] opacity-[0.1]"
          style={{ backgroundImage: 'url(/material/burr.png)', backgroundSize: '256px 256px' }}
        />
      </ProjectDialogProvider>
    </MotionConfig>
  )
}

/** A partner's photo, or their initials until the photo file is added to public/team/. */
function PartnerCard({ partner }: { partner: Partner }) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const bio = isPlaceholder(partner.bio) ? null : partner.bio

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[3px] border border-smoke/60 bg-plate-raised/40 sm:flex-row">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[radial-gradient(80%_80%_at_30%_20%,rgba(30,111,230,0.35),transparent_70%)] sm:aspect-auto sm:w-[42%]">
        {photoFailed ? (
          <span aria-hidden className="absolute inset-0 grid place-items-center text-6xl font-semibold tracking-[-0.04em] text-sky/80">
            {partner.initials}
          </span>
        ) : (
          <img
            src={partner.photo}
            alt={`Portrait of ${partner.name}`}
            onError={() => setPhotoFailed(true)}
            className="absolute inset-0 size-full object-cover object-[50%_22%]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-silver md:text-3xl">{partner.name}</h3>
        <p className="mt-1.5 font-roman text-[12px] font-medium tracking-[0.18em] text-sky uppercase">{partner.role}</p>
        {bio && <p className="mt-5 leading-relaxed text-pewter">{bio}</p>}
        {!bio && import.meta.env.DEV && (
          <p className="mt-5 rounded-[2px] border border-dashed border-smoke p-3 text-sm text-pewter">
            Development note: add a bio in <code className="text-silver">src/lib/site.ts</code>. It stays hidden in production until then.
          </p>
        )}
        {partner.skills.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-6">
            {partner.skills.map((skill) => (
              <li key={skill} className="rounded-full border border-smoke/70 px-3 py-1 text-[13px] text-silver">
                {skill}
              </li>
            ))}
          </ul>
        )}
        <ul className="mt-auto flex flex-wrap gap-2 pt-6">
          {(
            [
              { href: partner.linkedin, label: 'LinkedIn', Icon: LinkedinLogo },
              { href: partner.github, label: 'GitHub', Icon: GithubLogo },
              partner.upwork && { href: partner.upwork, label: 'Upwork', Icon: SealCheck },
            ].filter(Boolean) as { href: string; label: string; Icon: Icon }[]
          ).map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${partner.name} on ${label}`}
                className="inline-flex h-10 items-center gap-2 rounded-[2px] border border-smoke/70 px-3.5 text-sm text-silver transition-colors duration-200 hover:border-sky/60 hover:text-sky"
              >
                <Icon weight="fill" aria-hidden className="size-4" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
