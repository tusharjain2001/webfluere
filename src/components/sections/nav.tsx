import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Logo } from '@/components/ui/logo'
import { StartProjectButton } from '@/components/project/project-dialog'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/** `home` is false on other pages, where section links point back to the landing page. */
export function Nav({ home = true }: { home?: boolean }) {
  const base = home ? '' : '/'
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
        <a href={home ? '#top' : '/'} aria-label="Webfluere, back to top" className="text-lg font-semibold tracking-[-0.02em] text-silver">
          <Logo />
        </a>
        <div className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 text-sm text-pewter md:flex">
            <li>
              <a href={`${base}#proof`} className="transition-colors duration-200 hover:text-silver">
                Reviews
              </a>
            </li>
            <li>
              <a href={`${base}#work`} className="transition-colors duration-200 hover:text-silver">
                Work
              </a>
            </li>
            <li>
              <a href={`${base}#services`} className="transition-colors duration-200 hover:text-silver">
                Services
              </a>
            </li>
            <li>
              <a href="/about/" aria-current={home ? undefined : 'page'} className="transition-colors duration-200 hover:text-silver aria-[current=page]:text-silver">
                About
              </a>
            </li>
          </ul>
          <StartProjectButton size="sm" />
        </div>
      </nav>
    </motion.header>
  )
}
