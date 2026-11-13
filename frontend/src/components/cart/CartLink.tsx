'use client'

import Link from 'next/link'
import { ICONS } from '@/assets/icons'
import { useCart } from '@/hooks/useCart'

/** Cart icon with an item-count badge. */
export function CartLink({ className = '' }: { className?: string }) {
  const { count } = useCart()
  return (
    <Link
      href="/cart"
      className={`relative transition-colors hover:text-primary ${className}`}
      aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? 'course' : 'courses'}` : 'Cart'}
    >
      <ICONS.Cart width={24} height={24} />
      {count > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[11px] font-semibold leading-none text-white">
          {count > 9 ? '9+' : count}
        </span>
      ) : null}
    </Link>
  )
}
