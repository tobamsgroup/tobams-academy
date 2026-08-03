export type NotificationType =
  | 'COURSE_UPDATE'
  | 'ENROLLMENT'
  | 'PAYMENT'
  | 'SYSTEM'
  | 'ANNOUNCEMENT'

export interface ApiNotification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export type NotificationFilterKey = 'all' | 'unread' | 'read'

export interface NotificationCardProps {
  notification: ApiNotification
  onDelete: () => void
}
