export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-[#571244]">
            Tobams<span className="text-[#EF4353]">.</span>Academy
          </span>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-[#571244]/5">
          {children}
        </div>
      </div>
    </div>
  )
}
