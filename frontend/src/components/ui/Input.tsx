import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#571244] focus:ring-2 focus:ring-[#571244]/20',
          error && 'border-[#EF4353] focus:border-[#EF4353] focus:ring-[#EF4353]/20',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-[#EF4353]">{error}</span>}
    </div>
  ),
)
Input.displayName = 'Input'
