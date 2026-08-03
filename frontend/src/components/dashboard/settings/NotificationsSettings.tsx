"use client";

import { useState } from "react";
import { NOTIFICATION_ITEMS, type NotificationPreferenceField } from "@/lib/notification-preferences";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";

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
  const { preferences, isLoading, error, updateError, updatePreference } = useNotificationPreferences();
  const [savingField, setSavingField] = useState<string | null>(null);

  const toggleOpen = (index: number) => setOpenIndex((prev) => (prev === index ? null : index));

  const toggleChannel = async (field: NotificationPreferenceField, checked: boolean) => {
    setSavingField(field);
    try {
      await updatePreference(field, checked);
    } catch {
      // updateError is set in the hook
    } finally {
      setSavingField(null);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-[18px] font-semibold text-[#262626] md:text-[20px]">Notifications Preferences</h2>

      {error ? (
        <div className="mb-4 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">
          Unable to load notification preferences. Please try again.
        </div>
      ) : null}
      {updateError ? (
        <div className="mb-4 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{updateError}</div>
      ) : null}

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
                      const checked = preferences?.[channel.field] === true;
                      const disabled = isLoading || savingField === channel.field;

                      return (
                        <label key={channel.field} className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={(event) => void toggleChannel(channel.field, event.target.checked)}
                            className="h-5 w-5 rounded border border-[#BABABA] accent-[#1e2d5a] disabled:opacity-60"
                          />
                          {channel.label}
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
