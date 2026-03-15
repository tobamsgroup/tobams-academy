import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'bg-gradient-to-r from-[#571244] to-[#EF4353] text-white shadow-lg hover:shadow-[#EF4353]/40 hover:-translate-y-0.5',
      ghost: 'border-2 border-slate-200 text-slate-600 hover:border-[#571244] hover:text-[#571244]',
      danger: 'bg-[#EF4353] text-white hover:opacity-90',
    }
    return (
      <button ref={ref} className={cn(base, variants[variant], className)} disabled={disabled || loading} {...props}>
        {loading ? <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
