import { cn } from '@/lib/utils'

/** Webfluere mark (the two-tone blue ribbon) with the wordmark beside it. */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <img src="/brand/logo-mark.png" alt="" width={384} height={355} className={cn('h-7 w-auto', markClassName)} />
      <span>Webfluere</span>
    </span>
  )
}
