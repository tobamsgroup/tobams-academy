import { cn } from '@/lib/utils'

/** Circular avatar showing the first letter of the user's name on a brand background. */
export function InitialAvatar({ name, className }: { name: string; className?: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <span
      role="img"
      aria-label={name || 'User'}
      className={cn(
        'flex select-none items-center justify-center rounded-full bg-primary font-semibold text-white',
        className,
      )}
    >
      {initial}
    </span>
  )
}
