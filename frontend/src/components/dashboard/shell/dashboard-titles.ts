export type PageMeta = {
  title: string
  subtitle?: string
}

const titles: Record<string, PageMeta> = {
  '/dashboard': { title: 'Dashboard' },
  '/dashboard/courses': { title: 'My Courses', subtitle: 'Continue your learning journey' },
  '/dashboard/courses/learning': { title: 'My Courses', subtitle: 'Continue your learning journey' },
  '/dashboard/courses/explore': { title: 'Explore Courses' },
  '/dashboard/payment': { title: 'Payment History', subtitle: 'View and manage your purchases.' },
  '/dashboard/learning-progress': {
    title: 'Learning Progress',
    subtitle: "Here's how you're progressing in your courses. Keep learning, you're doing great!",
  },
  '/dashboard/profile': { title: 'Profile' },
  '/dashboard/settings': { title: 'Settings' },
  '/dashboard/support': { title: 'Support' },
  '/dashboard/notifications': { title: 'Notifications', subtitle: 'Effortless Management: Stay Informed with Real-Time Notifications.' },
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
  if (pathname.startsWith('/dashboard/payment/')) {
    return { title: 'Payment Summary' }
  }
  return { title: 'Dashboard' }
}

/** Convenience helper — backwards-compat for callers that only need the title */
export function getDashboardTitle(pathname: string): string {
  return getDashboardMeta(pathname).title
}
