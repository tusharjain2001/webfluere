import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type PlateStyle = {
  variant?: 'burnished' | 'hairline'
  size?: 'md' | 'sm'
}

const plateClass = ({ variant = 'burnished', size = 'md' }: PlateStyle, className?: string) =>
  cn(
    'group inline-flex cursor-pointer items-center justify-center gap-3 rounded-[2px] font-roman font-medium whitespace-nowrap uppercase active:translate-y-px disabled:cursor-wait disabled:opacity-70',
    size === 'md' ? 'h-12 px-7 text-[13px] tracking-[0.22em]' : 'h-10 px-5 text-[12px] tracking-[0.18em]',
    variant === 'burnished'
      ? 'burnished text-white'
      : 'border border-smoke text-silver transition-colors duration-300 hover:border-pewter',
    className,
  )

/** Controls read as plate states: burnished (lit, primary) or hairline (rocked, secondary). */
export function PlateButton({ variant, size, className, ...props }: ComponentProps<'a'> & PlateStyle) {
  return <a className={plateClass({ variant, size }, className)} {...props} />
}

/** The same control as a real button, for actions that stay on the page (opening the project form, submitting). */
export function PlateAction({ variant, size, className, type = 'button', ...props }: ComponentProps<'button'> & PlateStyle) {
  return <button type={type} className={plateClass({ variant, size }, className)} {...props} />
}
