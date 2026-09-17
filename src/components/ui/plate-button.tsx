import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type PlateButtonProps = ComponentProps<'a'> & {
  variant?: 'burnished' | 'hairline'
  size?: 'md' | 'sm'
}

/** Controls read as plate states: burnished (lit, primary) or hairline (rocked, secondary). */
export function PlateButton({ variant = 'burnished', size = 'md', className, ...props }: PlateButtonProps) {
  return (
    <a
      className={cn(
        'group inline-flex cursor-pointer items-center justify-center gap-3 rounded-[2px] font-roman font-medium whitespace-nowrap uppercase active:translate-y-px',
        size === 'md' ? 'h-12 px-7 text-[13px] tracking-[0.22em]' : 'h-10 px-5 text-[12px] tracking-[0.18em]',
        variant === 'burnished'
          ? 'burnished text-white'
          : 'border border-smoke text-silver transition-colors duration-300 hover:border-pewter',
        className,
      )}
      {...props}
    />
  )
}
