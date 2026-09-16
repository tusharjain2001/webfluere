import { BurnishImage } from '@/components/ui/burnish-image'
import { clientProjects, testimonials } from '@/lib/site'

/**
 * Real client work and quotes. Renders only when src/lib/site.ts holds real, permitted material;
 * while empty it ships nothing and shows a note in development only.
 */
export function ClientProof() {
  if (clientProjects.length === 0 && testimonials.length === 0) {
    if (!import.meta.env.DEV) return null
    return (
      <section aria-label="Client proof placeholder, development only" className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10">
        <p className="rounded-[2px] border border-dashed border-smoke p-6 text-sm leading-relaxed text-pewter">
          Development note: real client projects and testimonials appear here once they are added to{' '}
          <code className="text-silver">src/lib/site.ts</code>. Nothing renders in production until then.
        </p>
      </section>
    )
  }

  return (
    <section aria-labelledby="clients-title" className="relative border-t border-smoke/50 bg-plate">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <h2 id="clients-title" className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.03em]">
          Shipped for real clients.
        </h2>

        {clientProjects.length > 0 && (
          <ul className="mt-14 grid gap-10 md:grid-cols-2">
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

        {testimonials.length > 0 && (
          <ul className="mt-16 grid gap-12 md:grid-cols-2">
            {testimonials.map((t) => (
              <li key={t.name}>
                <figure>
                  <blockquote className="text-2xl leading-snug font-medium tracking-[-0.02em] text-silver">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 font-roman text-[13px] font-medium tracking-[0.18em] text-pewter uppercase">
                    {t.name}, {t.role}
                    {t.company ? `, ${t.company}` : ''}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
