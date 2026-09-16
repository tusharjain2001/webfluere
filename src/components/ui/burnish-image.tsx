import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

/**
 * Work rests in the plate's tones; a mouse burnishes its real colour out of the dark where it passes.
 * Touch screens reveal the colour once the image is in view. Reduced motion shows full colour.
 */
export function BurnishImage({
  src,
  alt,
  className,
  imageClassName,
}: {
  src: string
  alt: string
  className?: string
  imageClassName?: string
}) {
  const reduce = useReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const x = useMotionValue(50)
  const y = useMotionValue(50)
  const radius = useSpring(-25, { stiffness: 90, damping: 20 })
  const mask = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, #000 ${radius}%, transparent calc(${radius}% + 22%))`

  return (
    <motion.div
      className={cn('relative overflow-hidden rounded-[2px] bg-plate-raised', className)}
      onPointerMove={(e) => {
        if (!finePointer) return
        const r = e.currentTarget.getBoundingClientRect()
        x.set(((e.clientX - r.left) / r.width) * 100)
        y.set(((e.clientY - r.top) / r.height) * 100)
      }}
      onPointerEnter={() => finePointer && radius.set(34)}
      onPointerLeave={() => finePointer && radius.set(-25)}
      onViewportEnter={() => {
        if (!finePointer) radius.set(160)
      }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn('size-full object-cover object-top brightness-[0.62] contrast-[1.08] grayscale sepia-[0.18]', imageClassName)}
      />
      <motion.img
        aria-hidden
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn('pointer-events-none absolute inset-0 size-full object-cover object-top', imageClassName)}
        style={reduce ? undefined : { maskImage: mask, WebkitMaskImage: mask }}
      />
    </motion.div>
  )
}
