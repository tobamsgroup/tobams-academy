const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/courses': 'Courses',
  '/dashboard/payment': 'Payment',
  '/dashboard/learning-progress': 'Learning Progress',
  '/dashboard/settings': 'Settings',
  '/dashboard/support': 'Support',
}

export function getDashboardTitle(pathname: string): string {
  return titles[pathname] ?? 'Dashboard'
}
