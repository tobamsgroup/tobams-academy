"use client";

import { useState } from "react";

const NOTIFICATION_ITEMS = [
  {
    label: "Registration & Setup",
    description: "Alerts for updates or new features in school-specific tools.",
    channels: ["Email"],
  },
  {
    label: "Enrollment Confirmation",
    description: "Alerts when course enrollment is successful or rejected.",
    channels: ["Email", "Web app pop-ups"],
  },
  {
    label: "Course Updates",
    description: "Notifications for new modules, lessons, or announcements.",
    channels: ["Email", "In app"],
  },
  {
    label: "Assessment Reminders",
    description: "Alerts for upcoming assignment deadlines or overdue tasks.",
    channels: ["In app"],
  },
  {
    label: "Progress Tracking",
    description: "Milestone notifications (e.g., You've completed 50% of the course!).",
    channels: ["In app"],
  },
  {
    label: "Certification Alerts",
    description: "Notifications for available certifications or requirements yet to be completed.",
    channels: ["Email", "In app"],
  },
  {
    label: "Engagement Prompts",
    description: "Reminders to return to your courses and continue learning.",
    channels: ["Email", "In app"],
  },
] as const;

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-[#A3A3A3] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function NotificationsSettings() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [channelState, setChannelState] = useState<Record<string, boolean>>({});

  const toggleOpen = (index: number) => setOpenIndex((prev) => (prev === index ? null : index));
  const toggleChannel = (key: string) => {
    setChannelState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h2 className="mb-4 text-[18px] font-semibold text-[#262626] md:text-[20px]">Notifications Preferences</h2>
      <div className="rounded-[12px] border border-[#D3D2D366] bg-white p-6">
        {NOTIFICATION_ITEMS.map((item, index) => (
          <div key={item.label}>
            <button
              type="button"
              onClick={() => toggleOpen(index)}
              className="flex w-full items-center justify-between pb-4 text-left transition-colors hover:bg-gray-50"
            >
              <span className="text-lg font-medium text-heading">{item.label}</span>
              <ChevronIcon open={openIndex === index} />
            </button>

            {openIndex !== index && <div className="mb-6 border-b border-[#D3D2D366]" />}

            {openIndex === index && (
              <div className="mb-6 border-b border-[#D3D2D366] px-1 py-4">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                  <p className="max-w-[600px] text-base text-[#6C686C]">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-6 text-base text-heading">
                    {item.channels.map((channel) => {
                      const key = `${item.label}-${channel}`;
                      return (
                        <label key={channel} className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!channelState[key]}
                            onChange={() => toggleChannel(key)}
                            className="h-5 w-5 rounded border border-[#BABABA] accent-[#1e2d5a]"
                          />
                          {channel}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
