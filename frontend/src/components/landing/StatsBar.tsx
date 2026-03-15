const stats = [
  { value: '5K+', label: 'Active Learners' },
  { value: '50+', label: 'Expert Courses' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '12+', label: 'Categories' },
]

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 bg-[#571244] sm:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`py-5 text-center transition-colors hover:bg-white/5 ${
            i % 2 === 0 ? 'border-r border-white/10 sm:border-r' : 'sm:border-r'
          } ${i < 2 ? 'border-b border-white/10 sm:border-b-0' : ''} ${
            i === stats.length - 1 ? 'sm:border-r-0' : ''
          }`}
        >
          <p className="text-2xl font-bold text-white">{s.value}</p>
          <p className="mt-0.5 text-xs text-white/55">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
