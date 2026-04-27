export type PageMeta = {
  title: string
  subtitle?: string
}

const titles: Record<string, PageMeta> = {
  '/dashboard': { title: 'Dashboard' },
  '/dashboard/courses': { title: 'Courses' },
  '/dashboard/courses/explore': { title: 'Explore Courses' },
  '/dashboard/payment': { title: 'Payment' },
  '/dashboard/learning-progress': {
    title: 'Learning Progress',
    subtitle: "Here's how you're progressing in your courses. Keep learning, you're doing great!",
  },
  '/dashboard/profile': { title: 'Profile' },
  '/dashboard/settings': { title: 'Settings' },
  '/dashboard/support': { title: 'Support' },
}

export function getDashboardMeta(pathname: string): PageMeta {
  if (titles[pathname]) return titles[pathname]
  // Dynamic sub-routes: show parent section title
  if (pathname.startsWith('/dashboard/learning-progress/')) {
    return { title: 'Learning Progress' }
  }
  if (pathname.startsWith('/dashboard/courses/')) {
    return { title: 'Courses' }
  }
  return { title: 'Dashboard' }
}

/** Convenience helper — backwards-compat for callers that only need the title */
export function getDashboardTitle(pathname: string): string {
  return getDashboardMeta(pathname).title
}
