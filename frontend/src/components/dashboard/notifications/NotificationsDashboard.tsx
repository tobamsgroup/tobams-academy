"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, MoreVertical } from "lucide-react";
import {
  SAMPLE_NOTIFICATIONS,
  type DashboardNotification,
} from "./notifications-data";
import { ICONS } from "@/assets/icons";

type FilterKey = "all" | "unread" | "read";

function isUnread(id: string, readIds: Set<string>) {
  return !readIds.has(id);
}

export default function NotificationsDashboard() {
  const [filter, setFilter] = useState<FilterKey>("unread");
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const filterRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const filterLabel =
    filter === "all" ? "All" : filter === "unread" ? "Unread" : "Read";

  const visible = useMemo(() => {
    return SAMPLE_NOTIFICATIONS.filter((n) => {
      const unread = isUnread(n.id, readIds);
      if (filter === "unread") return unread;
      if (filter === "read") return !unread;
      return true;
    });
  }, [filter, readIds]);

  useEffect(() => {
    if (!filterOpen && !menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (filterOpen && filterRef.current && !filterRef.current.contains(t)) setFilterOpen(false);
      if (menuOpen && menuRef.current && !menuRef.current.contains(t)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [filterOpen, menuOpen]);

  const markAllRead = () => {
    setReadIds(new Set(SAMPLE_NOTIFICATIONS.map((n) => n.id)));
    setMenuOpen(false);
  };

  const deleteMultiple = () => {
    setReadIds(new Set());
    setMenuOpen(false);
  };

  return (
    <div className="">
      <div className="mb-[52px] flex items-center justify-between gap-4 md:bg-white rounded-[12px] md:border md:border-[#D3D2D333] md:py-8 md:px-6 w-full">
        <div ref={filterRef} className="relative ">
          <button
            type="button"
            aria-expanded={filterOpen}
            aria-haspopup="listbox"
            onClick={() => setFilterOpen((o) => !o)}
            className="inline-flex min-w-[7.5rem] items-center justify-between gap-2 rounded-lg border border-[#D3D2D366] bg-white px-5 py-4 text-[#221D23] outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {filterLabel}
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gray-600 transition-transform ${filterOpen ? "rotate-180" : ""}`}
              strokeWidth={2}
              aria-hidden
            />
          </button>
          {filterOpen ? (
            <ul
              role="listbox"
              className="absolute left-0 z-40 mt-2 min-w-full overflow-hidden rounded-xl border border-[#E5E7EB] bg-white py-1"
            >
              {(
                [
                  { key: "all" as const, label: "All" },
                  { key: "unread" as const, label: "Unread" },
                  { key: "read" as const, label: "Read" },
                ] as const
              ).map((opt) => (
                <li key={opt.key} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={filter === opt.key}
                    className={`w-full px-4 py-3 text-left text-sm ${
                      filter === opt.key ? "bg-[#F8F9FB] font-medium text-[#303869]" : "text-[#221D23]"
                    } hover:bg-gray-50`}
                    onClick={() => {
                      setFilter(opt.key);
                      setFilterOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Notification options"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D3D2D366] bg-white text-[#474348] transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 md:h-11 md:w-11"
          >
            <MoreVertical className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
          {menuOpen ? (
            <ul
              role="menu"
              className="absolute right-0 z-40 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white py-1"
            >
              <li role="presentation">
                <button
                  type="button"
                  role="menuitem"
                  className="w-full px-4 py-3 text-left text-sm text-[#221D23] hover:bg-gray-50 flex items-center gap-2"
                  onClick={markAllRead}
                >
                  Mark all as read
                  <ICONS.Check />
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="w-full px-4 py-3 text-left text-sm text-[#221D23] hover:bg-gray-50"
                  onClick={deleteMultiple}
                >
                  Delete multiple
                </button>
              </li>
            </ul>
          ) : null}
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {visible.length === 0 ? (
          <li className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-14 text-center text-sm text-[#6C686C]">
            No notifications in this view.
          </li>
        ) : (
          visible.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              unread={isUnread(n.id, readIds)}
              onToggleRead={(read) => {
                setReadIds((prev) => {
                  const next = new Set(prev);
                  if (read) next.add(n.id);
                  else next.delete(n.id);
                  return next;
                });
              }}
            />
          ))
        )}
      </ul>
    </div>
  );
}

function NotificationCard({
  notification,
  unread,
  onToggleRead,
}: {
  notification: DashboardNotification;
  unread: boolean;
  onToggleRead: (read: boolean) => void;
}) {
  return (
    <li className="rounded-xl border border-[#D3D2D333] bg-white p-4 md:p-[25px]">
      <div className="flex gap-3">
        <div className="flex shrink-0 flex-col pt-0.5">
          <input
            type="checkbox"
            checked={!unread}
            onChange={(e) => onToggleRead(e.target.checked)}
            className="h-4 w-4 shrink-0 cursor-pointer rounded border-[1.5px] border-[#C4C4C4] text-[#303869] accent-[#1671D9] focus:ring-2 focus:ring-[#1671D9]/30 focus:ring-offset-0"
            aria-label={unread ? "Mark as read" : "Mark as unread"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 gap-x-4">
            <h2 className="text-base font-semibold text-[#221D23] md:text-lg">{notification.title}</h2>
            <time className="shrink-0 text-[#474348]" dateTime={notification.timeAgo}>
              {notification.timeAgo}
            </time>
          </div>
          <p className="mt-2 leading-relaxed text-[#474348]">
            {notification.body.map((part, i) =>
              part.type === "text" ? (
                <span key={i}>{part.value}</span>
              ) : (
                <Link
                  key={i}
                  href={part.href}
                  className="font-medium text-[#303869] underline-offset-2 hover:underline"
                >
                  {part.label}
                </Link>
              )
            )}
          </p>
        </div>
      </div>
    </li>
  );
}
