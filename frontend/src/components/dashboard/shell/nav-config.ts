import type { ComponentType } from 'react'
import { ICONS } from '@/assets/icons'

export type NavChild = {
  href: string
  label: string
}

export type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  hasChildren?: boolean
  children?: NavChild[]
}

export const primaryNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: ICONS.Dashboard },
  {
    href: '/dashboard/courses',
    label: 'Courses',
    icon: ICONS.DashboardCourses,
    hasChildren: true,
    children: [
      { href: '/dashboard/courses', label: 'My Courses' },
      { href: '/dashboard/courses/explore', label: 'Explore Courses' },
    ],
  },
  { href: '/dashboard/payment', label: 'Payment', icon: ICONS.DashboardPayment },
  { href: '/dashboard/learning-progress', label: 'Learning Progress', icon: ICONS.DashboardLearning },
]

export const secondaryNav: NavItem[] = [
  { href: '/dashboard/profile', label: 'Profile', icon: ICONS.DashboardProfile },
  { href: '/dashboard/settings', label: 'Settings', icon: ICONS.DashboardSettings },
  { href: '/dashboard/support', label: 'Support', icon: ICONS.DashboardSupport, hasChildren: true },
]
