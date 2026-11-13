import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

type StoredQuizSession = { startedAt: number; answers: Record<string, string> }

const CHANGE_EVENT = 'tga-quiz-change'

function storageKey(userId: string, quizId: string) {
  return `tga-quiz:${userId}:${quizId}`
}

// Cache parsed values per key so useSyncExternalStore gets a stable snapshot.
const cache = new Map<string, { raw: string | null; value: StoredQuizSession | null }>()

function read(key: string): StoredQuizSession | null {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(key)
  } catch {
    return null
  }
  const cached = cache.get(key)
  if (cached && cached.raw === raw) return cached.value
  let value: StoredQuizSession | null = null
  try {
    const parsed = raw ? (JSON.parse(raw) as StoredQuizSession) : null
    if (parsed && typeof parsed.startedAt === 'number') {
      value = { startedAt: parsed.startedAt, answers: parsed.answers ?? {} }
    }
  } catch {
    value = null
  }
  cache.set(key, { raw, value })
  return value
}

function write(key: string, value: StoredQuizSession | null) {
  try {
    if (value) window.localStorage.setItem(key, JSON.stringify(value))
    else window.localStorage.removeItem(key)
  } catch {
    // storage unavailable: the quiz still works, it just won't survive a reload
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

/**
 * An in-progress quiz attempt: when it started and the answers so far, saved in the browser so
 * a reload or tab switch resumes it. The countdown is derived from the start time (wall clock),
 * so it keeps running while the tab is hidden or the screen is off.
 */
export function useQuizSession(userId: string | undefined, quizId: string | undefined, timeLimitMinutes: number) {
  const key = userId && quizId ? storageKey(userId, quizId) : null
  const session = useSyncExternalStore(
    subscribe,
    () => (key ? read(key) : null),
    () => null,
  )
  const [now, setNow] = useState(0)

  // Tick while running; resync immediately when the learner comes back to the tab.
  useEffect(() => {
    if (!session) return
    const tick = () => setNow(Date.now())
    const first = window.setTimeout(tick, 0)
    const interval = window.setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    window.addEventListener('focus', tick)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', tick)
      window.removeEventListener('focus', tick)
    }
  }, [session])

  const start = useCallback(() => {
    if (key) write(key, { startedAt: Date.now(), answers: {} })
  }, [key])

  const setAnswer = useCallback(
    (questionId: string, optionId: string) => {
      if (!key) return
      const current = read(key)
      if (current) write(key, { ...current, answers: { ...current.answers, [questionId]: optionId } })
    },
    [key],
  )

  const clear = useCallback(() => {
    if (key) write(key, null)
  }, [key])

  const hasLimit = timeLimitMinutes > 0
  const limitMs = timeLimitMinutes * 60_000
  const remainingMs =
    session && hasLimit && now > 0
      ? Math.min(limitMs, Math.max(0, session.startedAt + limitMs - now))
      : null

  return {
    isActive: session !== null,
    answers: session?.answers ?? {},
    /** Milliseconds left, or null when the quiz has no time limit (or the clock hasn't ticked yet). */
    remainingMs,
    isExpired: remainingMs === 0,
    start,
    setAnswer,
    clear,
  }
}

/** "24:05" (or "1:02:05" for over an hour). */
export function formatCountdown(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  return `${h > 0 ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`
}
