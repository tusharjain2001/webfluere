import { clamp01 } from '@/lib/motion'

type Range = { top: number; height: number }
const ranges = new Map<string, Range>()

/** Measures every `[data-chapter]` section. Call on load, resize, and whenever layout changes. */
export function measureChapters() {
  document.querySelectorAll<HTMLElement>('[data-chapter]').forEach((el) => {
    const rect = el.getBoundingClientRect()
    ranges.set(el.dataset.chapter!, { top: rect.top + window.scrollY, height: el.offsetHeight })
  })
}

/**
 * Unclamped progress through a pinned chapter: 0 when its top reaches the viewport top,
 * 1 when its bottom reaches the viewport bottom (the sticky span). Negative before, above 1 after.
 * Read inside a render loop, never from a scroll listener.
 */
export function chapterRaw(id: string) {
  const range = ranges.get(id)
  if (!range) return 0
  const span = Math.max(1, range.height - window.innerHeight)
  return (window.scrollY - range.top) / span
}

export const chapterProgress = (id: string) => clamp01(chapterRaw(id))

/** 0 to 1 while the chapter scrolls up into view (its top travelling from viewport bottom to top). */
export function chapterEnter(id: string) {
  const range = ranges.get(id)
  if (!range) return 0
  return clamp01((window.scrollY - (range.top - window.innerHeight)) / window.innerHeight)
}

/** 0 to 1 while the chapter scrolls away after its pinned span ends. */
export function chapterExit(id: string) {
  const range = ranges.get(id)
  if (!range) return 0
  return clamp01((window.scrollY - (range.top + range.height - window.innerHeight)) / window.innerHeight)
}
