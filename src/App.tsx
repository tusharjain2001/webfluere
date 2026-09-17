import { lazy, Suspense, useEffect } from 'react'
import { MotionConfig, useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { ClientProof } from '@/components/sections/client-proof'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/sections/footer'
import { Hero } from '@/components/sections/hero'
import { Nav } from '@/components/sections/nav'
import { Services } from '@/components/sections/services'
import { ServicesScroll } from '@/components/sections/services-scroll'
import { Statement } from '@/components/sections/statement'
import { Story } from '@/components/sections/story'
import { Work } from '@/components/sections/work'
import { WorkRing } from '@/components/sections/work-ring'
import { measureChapters } from '@/lib/scroll-chapters'

// three.js + R3F are heavy; load them after first paint so the headline never waits on WebGL.
const StoryCanvas = lazy(() => import('@/components/three/story-scene').then((m) => ({ default: m.StoryCanvas })))

export default function App() {
  const reduce = !!useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 })
    return () => lenis.destroy()
  }, [reduce])

  useEffect(() => {
    measureChapters()
    const observer = new ResizeObserver(() => measureChapters())
    observer.observe(document.body)
    window.addEventListener('resize', measureChapters)
    document.fonts?.ready.then(measureChapters)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measureChapters)
    }
  }, [reduce])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[2px] focus:bg-silver focus:px-4 focus:py-2 focus:text-plate"
      >
        Skip to content
      </a>
      <Nav />
      {/* Logo-blue light behind the 3D stage; it sits under the canvas so it never tints the devices. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(42%_48%_at_72%_52%,rgba(30,111,230,0.2),transparent_70%)] max-md:bg-[radial-gradient(75%_32%_at_50%_26%,rgba(30,111,230,0.22),transparent_70%)]"
      />
      {!reduce && (
        <Suspense fallback={null}>
          <StoryCanvas mode="fixed" />
        </Suspense>
      )}
      <main id="main" className="relative z-10">
        <Hero withScene={reduce} />
        {reduce ? (
          <>
            <Statement />
            <Services />
            <Work />
          </>
        ) : (
          <>
            <Story />
            <ServicesScroll />
            <WorkRing />
          </>
        )}
        <ClientProof />
        <Contact />
      </main>
      <Footer />
      {/* Rocked-burr stipple: a fixed, pointer-free raster tile so it never repaints with scrolling content. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.1]"
        style={{ backgroundImage: 'url(/material/burr.png)', backgroundSize: '256px 256px' }}
      />
    </MotionConfig>
  )
}
