"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import NotificationsSettings from "@/components/dashboard/settings/NotificationsSettings";
import SecuritySettings from "@/components/dashboard/settings/SecuritySettings";

export default function SettingsSection() {
  const tabs = ["notifications", "security"] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("notifications");
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeTabLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  return (
    <div className="rounded-xl">
      <div className="relative mb-6 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-lg border border-[#D3D2D366] bg-white px-4 py-3 text-left font-medium text-[#221D23]"
          aria-haspopup="listbox"
          aria-expanded={mobileOpen}
        >
          <span>{activeTabLabel}</span>
          <ChevronDown className={`h-5 w-5 text-[#221D23] transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
        </button>

        {mobileOpen ? (
          <div
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-lg border border-[#D3D2D366] bg-white shadow-lg"
            role="listbox"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="option"
                aria-selected={activeTab === tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileOpen(false);
                }}
                className="w-full px-4 py-3 text-left font-medium text-[#221D23] transition-colors hover:bg-gray-50"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mb-6 hidden gap-2 md:flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg border px-6 py-3 font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-[#1e2d5a] bg-primary text-white"
                : "border-[#D3D2D366] bg-white text-[#221D23] hover:bg-gray-50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "notifications" ? <NotificationsSettings /> : <SecuritySettings />}
    </div>
  );
}
