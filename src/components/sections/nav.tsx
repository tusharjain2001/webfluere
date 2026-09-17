import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Logo } from '@/components/ui/logo'
import { PlateButton } from '@/components/ui/plate-button'
import { ease } from '@/lib/motion'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setHidden(y > previous && y > 320)
    setScrolled(y > 24)
  })

  return (
    <motion.header
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ duration: 0.45, ease }}
      onFocus={() => setHidden(false)}
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-500',
        scrolled ? 'border-smoke/60 bg-plate/85 backdrop-blur-md' : 'border-transparent',
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 md:px-10">
        <a href="#top" aria-label="Webfluere, back to top" className="text-lg font-semibold tracking-[-0.02em] text-silver">
          <Logo />
        </a>
        <div className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 text-sm text-pewter md:flex">
            <li>
              <a href="#work" className="transition-colors duration-200 hover:text-silver">
                Work
              </a>
            </li>
            <li>
              <a href="#services" className="transition-colors duration-200 hover:text-silver">
                Services
              </a>
            </li>
          </ul>
          <PlateButton href={site.instagramUrl} size="sm" aria-label={site.ctaLabel}>
            DM &ldquo;BUILD&rdquo;
          </PlateButton>
        </div>
      </nav>
    </motion.header>
  )
}
