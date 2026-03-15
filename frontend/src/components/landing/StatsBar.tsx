const stats = [
  { value: '5K+', label: 'Active Learners' },
  { value: '50+', label: 'Expert Courses' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '12+', label: 'Categories' },
]

export function StatsBar() {
  return (
    <div className="flex bg-[#571244]">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex-1 py-4 text-center transition-colors hover:bg-white/5 ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}
        >
          <p className="text-2xl font-bold text-white">{s.value}</p>
          <p className="mt-0.5 text-xs text-white/55">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
