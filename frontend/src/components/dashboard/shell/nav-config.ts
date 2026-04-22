import type { ComponentType } from 'react'
import { ICONS } from '@/assets/icons'

export type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  /** If true, show chevron (dropdown placeholder — wire later) */
  hasChildren?: boolean
}

export const primaryNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: ICONS.Dashboard },
  { href: '/dashboard/courses', label: 'Courses', icon: ICONS.DashboardCourses, hasChildren: true },
  { href: '/dashboard/payment', label: 'Payment', icon: ICONS.DashboardPayment },
  { href: '/dashboard/learning-progress', label: 'Learning Progress', icon: ICONS.DashboardLearning },
]

export const secondaryNav: NavItem[] = [
  { href: '/dashboard/settings', label: 'Settings', icon: ICONS.DashboardSettings },
  { href: '/dashboard/support', label: 'Support', icon: ICONS.DashboardSupport, hasChildren: true },
]
