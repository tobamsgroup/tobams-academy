export const NOTIFICATION_PREFERENCE_FIELDS = [
  'registrationSetupEmail',
  'enrollmentConfirmationEmail',
  'enrollmentConfirmationInApp',
  'courseUpdatesEmail',
  'courseUpdatesInApp',
  'assessmentRemindersEmail',
  'assessmentRemindersInApp',
  'progressTrackingEmail',
  'progressTrackingInApp',
  'certificationAlertsEmail',
  'certificationAlertsInApp',
  'engagementPromptsEmail',
  'engagementPromptsInApp',
] as const

export type NotificationPreferenceField = (typeof NOTIFICATION_PREFERENCE_FIELDS)[number]

export type NotificationPreferences = Record<NotificationPreferenceField, boolean>

export const NOTIFICATION_ITEMS = [
  {
    label: 'Registration & Setup',
    description: 'Alerts for updates or new features in school-specific tools.',
    channels: [{ label: 'Email', field: 'registrationSetupEmail' }],
  },
  {
    label: 'Enrollment Confirmation',
    description: 'Alerts when course enrollment is successful or rejected.',
    channels: [
      { label: 'Email', field: 'enrollmentConfirmationEmail' },
      { label: 'Web app pop-ups', field: 'enrollmentConfirmationInApp' },
    ],
  },
  {
    label: 'Course Updates',
    description: 'Notifications for new modules, lessons, or announcements.',
    channels: [
      { label: 'Email', field: 'courseUpdatesEmail' },
      { label: 'In app', field: 'courseUpdatesInApp' },
    ],
  },
  {
    label: 'Assessment Reminders',
    description: 'Alerts for upcoming assignment deadlines or overdue tasks.',
    channels: [{ label: 'In app', field: 'assessmentRemindersInApp' }],
  },
  {
    label: 'Progress Tracking',
    description: "Milestone notifications (e.g., You've completed 50% of the course!).",
    channels: [{ label: 'In app', field: 'progressTrackingInApp' }],
  },
  {
    label: 'Certification Alerts',
    description: 'Notifications for available certifications or requirements yet to be completed.',
    channels: [
      { label: 'Email', field: 'certificationAlertsEmail' },
      { label: 'In app', field: 'certificationAlertsInApp' },
    ],
  },
  {
    label: 'Engagement Prompts',
    description: 'Reminders to return to your courses and continue learning.',
    channels: [
      { label: 'Email', field: 'engagementPromptsEmail' },
      { label: 'In app', field: 'engagementPromptsInApp' },
    ],
  },
] as const satisfies ReadonlyArray<{
  label: string
  description: string
  channels: ReadonlyArray<{ label: string; field: NotificationPreferenceField }>
}>

export function toPreferencePayload(
  record: Record<string, unknown>,
): NotificationPreferences {
  const payload = {} as NotificationPreferences
  for (const field of NOTIFICATION_PREFERENCE_FIELDS) {
    payload[field] = record[field] === true
  }
  return payload
}

export function defaultNotificationPreferences(): NotificationPreferences {
  return toPreferencePayload(
    Object.fromEntries(NOTIFICATION_PREFERENCE_FIELDS.map((field) => [field, true])),
  )
}
