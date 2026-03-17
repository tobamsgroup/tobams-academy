'use client'

interface Props {
  label: string
  active?: boolean
  onClick: () => void
}

export function CategoryPill({ label, active = false, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
        active
          ? 'border-[#571244] bg-[#571244] text-white'
          : 'border-slate-200 text-slate-500 hover:border-[#571244] hover:text-[#571244]'
      }`}
    >
      {label}
    </button>
  )
}
