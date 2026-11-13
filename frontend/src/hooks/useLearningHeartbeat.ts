import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

const TICK_MS = 30_000

/**
 * Reports time actually spent on a lesson: counts only while the tab is visible, sends a
 * heartbeat every 30s, and flushes the remainder when the lesson changes or the page closes.
 */
export function useLearningHeartbeat(lessonId: string | undefined, enabled = true) {
  const { data: session } = useSession()
  const token = session?.accessToken
  const visibleSince = useRef<number | null>(null)
  const pendingMs = useRef(0)

  useEffect(() => {
    if (!enabled || !lessonId || !token) return

    const url = `${process.env.NEXT_PUBLIC_API_URL}/learning-activity`

    const accumulate = () => {
      if (visibleSince.current !== null) {
        pendingMs.current += Date.now() - visibleSince.current
        visibleSince.current = document.visibilityState === 'visible' ? Date.now() : null
      }
    }

    const send = (keepalive = false) => {
      accumulate()
      const seconds = Math.floor(pendingMs.current / 1000)
      if (seconds < 1) return
      pendingMs.current -= seconds * 1000
      void fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lessonId, seconds }),
        keepalive,
      }).catch(() => {
        // Best effort: a dropped heartbeat only loses a few seconds of tracked time.
      })
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        visibleSince.current = Date.now()
      } else {
        send(true)
        visibleSince.current = null
      }
    }

    visibleSince.current = document.visibilityState === 'visible' ? Date.now() : null
    pendingMs.current = 0
    const interval = window.setInterval(() => send(), TICK_MS)
    const onPageHide = () => send(true)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onPageHide)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onPageHide)
      send(true) // lesson changed or player closed
      visibleSince.current = null
    }
  }, [lessonId, token, enabled])
}
