'use client'

import { Check, X } from 'lucide-react'
import { PASSWORD_RULES } from '@/lib/password-rules'
import { cn } from '@/lib/utils'

/** Live checklist of password requirements; each turns green as it's met. */
export function PasswordRequirements({ password, className }: { password: string; className?: string }) {
  const started = password.length > 0
  return (
    <ul className={cn('mt-2 space-y-1 text-xs font-medium', className)} aria-live="polite">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password)
        return (
          <li
            key={rule.id}
            className={cn(
              'flex items-center gap-1.5',
              met ? 'text-[#099137]' : started ? 'text-secondary' : 'text-[#6C686C]',
            )}
          >
            {met ? <Check className="h-3.5 w-3.5" aria-hidden /> : <X className="h-3.5 w-3.5" aria-hidden />}
            <span>{rule.label}</span>
            <span className="sr-only">{met ? '(met)' : '(not met)'}</span>
          </li>
        )
      })}
    </ul>
  )
}
