import { BurnishImage } from '@/components/ui/burnish-image'
import { concepts } from '@/lib/site'
import { cn } from '@/lib/utils'

// Asymmetric pairs across a 12-column plate: wide and narrow alternate so no row repeats the last.
const spans = ['md:col-span-8', 'md:col-span-4', 'md:col-span-5', 'md:col-span-7', 'md:col-span-4', 'md:col-span-8']

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="border-t border-smoke/50">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <h2 id="work-title" className="max-w-[18ch] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.03em]">
          Six concepts, made from scratch.
        </h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-pewter">
          Original websites and apps we designed to show our range. They are concepts, not client projects.
        </p>

        <div className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-12 md:gap-y-16">
          {concepts.map((concept, i) => (
            <article key={concept.slug} className={cn('flex flex-col gap-4 md:h-[clamp(22rem,34vw,36rem)]', spans[i])}>
              <BurnishImage
                src={`/work/${concept.slug}.webp`}
                alt={concept.alt}
                className="aspect-[16/10] w-full md:aspect-auto md:min-h-0 md:flex-1"
                imageClassName={cn(concept.phone && 'object-contain py-5 md:py-8', concept.focus)}
              />
              <div className="flex items-baseline justify-between gap-6 border-t border-smoke/60 pt-4">
                <h3 className="text-lg font-medium tracking-[-0.01em]">{concept.name}</h3>
                <p className="text-right font-roman text-[13px] font-medium tracking-[0.18em] text-pewter uppercase">{concept.kind}, concept</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
