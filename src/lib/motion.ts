export const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Clamped linear map. Use it through `useTransform(value, (v) => mapRange(...))` for scroll-linked
 * styles: the function form is computed on the main thread, so values hold before/after the range
 * (range-form opacity can be offloaded to a scroll timeline that drops its fill outside the range).
 */
export const mapRange = (v: number, [a, b]: [number, number], [from, to]: [number, number]) =>
  from + (to - from) * clamp01((v - a) / (b - a))
