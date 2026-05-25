export type NotificationBodyPart =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

export type DashboardNotification = {
  id: string;
  title: string;
  timeAgo: string;
  body: NotificationBodyPart[];
};

export const SAMPLE_NOTIFICATIONS: DashboardNotification[] = [
  {
    id: "1",
    title: "Registration Successful!",
    timeAgo: "2h",
    body: [
      {
        type: "text",
        value:
          "Welcome aboard! Your student account has been successfully created. You can now explore courses, track your progress, and access your learning dashboard.",
      },
    ],
  },
  {
    id: "2",
    title: "Enrollment Confirmed in Communication Etiquette",
    timeAgo: "1h",
    body: [
      {
        type: "text",
        value:
          "Your enrollment in Communication Etiquette has been confirmed. You can start learning right away. ",
      },
      { type: "link", label: "View details here", href: "/dashboard/courses" },
      { type: "text", value: "." },
    ],
  },
  {
    id: "3",
    title: "Enrollment Unsuccessful in Basics of Leadership",
    timeAgo: "5h",
    body: [
      {
        type: "text",
        value:
          "We couldn't complete your enrollment in Basics of Leadership. Please try again or contact support.",
      },
    ],
  },
  {
    id: "4",
    title: "New Module Available on the Think Leadership Series",
    timeAgo: "2h",
    body: [
      {
        type: "text",
        value: "A new module has been published to the Think Leadership Series. ",
      },
      { type: "link", label: "Learn more about this update.", href: "/dashboard/courses" },
    ],
  },
  {
    id: "5",
    title: "Upcoming Assignment Due in Basics of Leadership Course",
    timeAgo: "1h",
    body: [
      {
        type: "text",
        value:
          "Reminder: you have an assignment due soon in Basics of Leadership — due on July 20, 2025.",
      },
    ],
  },
  {
    id: "6",
    title: "You are Halfway Through the Think Leadership Course",
    timeAgo: "2h",
    body: [
      {
        type: "text",
        value:
          "Great progress! You've completed 50% of the Think Leadership course. Keep going!",
      },
    ],
  },
  {
    id: "7",
    title: "Certificate Available in Communication Etiquette",
    timeAgo: "4h",
    body: [
      {
        type: "text",
        value:
          "Congratulations — your certificate for Communication Etiquette is ready. Download it from your dashboard.",
      },
    ],
  },
  {
    id: "8",
    title: "Communication Etiquette Quiz Time!",
    timeAgo: "3h",
    body: [
      {
        type: "text",
        value: "It's time for your quiz in Communication Etiquette. ",
      },
      { type: "link", label: "Learn more about this update", href: "/dashboard/courses" },
    ],
  },
];
