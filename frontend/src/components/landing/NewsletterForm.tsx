'use client'

export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full max-w-sm overflow-hidden rounded-xl border border-white/20"
    >
      <input
        type="email"
        placeholder="Enter your email..."
        className="flex-1 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none"
      />
      <button
        type="submit"
        className="flex items-center justify-center bg-[#EF4353] px-4 text-white transition-opacity hover:opacity-90"
        aria-label="Subscribe"
      >
        →
      </button>
    </form>
  )
}
