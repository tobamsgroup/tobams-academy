"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import { ICONS } from "@/assets/icons";
import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationCardProps, NotificationFilterKey } from "@/types/notifications";

function formatTimeAgo(iso: string): string {
  const created = new Date(iso).getTime();
  if (Number.isNaN(created)) return "";
  const diff = Math.max(0, Date.now() - created);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week}w`;
  return new Date(iso).toLocaleDateString();
}

export default function NotificationsDashboard() {
  const { notifications, isLoading, error, markAllRead, deleteMany } = useNotifications();

  const [filter, setFilter] = useState<NotificationFilterKey>("unread");
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState<"none" | "marking" | "deleting">("none");
  const filterRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const filterLabel =
    filter === "all" ? "All" : filter === "unread" ? "Unread" : "Read";

  const visible = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === "unread") return !n.isRead;
      if (filter === "read") return n.isRead;
      return true;
    });
  }, [filter, notifications]);

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

  const handleMarkAllRead = async () => {
    setMenuOpen(false);
    setBusy("marking");
    try {
      await markAllRead();
    } catch (e) {
      console.error("Failed to mark all as read", e);
    } finally {
      setBusy("none");
    }
  };

  const handleDeleteVisible = async () => {
    setMenuOpen(false);
    const ids = visible.map((n) => n.id);
    if (ids.length === 0) return;
    setBusy("deleting");
    try {
      await deleteMany(ids);
    } catch (e) {
      console.error("Failed to delete notifications", e);
    } finally {
      setBusy("none");
    }
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
            disabled={busy !== "none"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D3D2D366] bg-white text-[#474348] transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 md:h-11 md:w-11"
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
                  onClick={handleMarkAllRead}
                >
                  Mark all as read
                  <ICONS.Check />
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="w-full px-4 py-3 text-left text-sm text-[#221D23] hover:bg-gray-50"
                  onClick={handleDeleteVisible}
                >
                  Delete {visible.length > 0 ? `(${visible.length})` : ""}
                </button>
              </li>
            </ul>
          ) : null}
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {isLoading ? (
          <li className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-14 text-center text-sm text-[#6C686C]">
            Loading notifications…
          </li>
        ) : error ? (
          <li className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-14 text-center text-sm text-[#EF4353]">
            Could not load notifications. Please refresh and try again.
          </li>
        ) : visible.length === 0 ? (
          <li className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-14 text-center text-sm text-[#6C686C]">
            No notifications in this view.
          </li>
        ) : (
          visible.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onDelete={() => deleteMany([n.id]).catch(console.error)}
            />
          ))
        )}
      </ul>
    </div>
  );
}

function NotificationCard({ notification, onDelete }: NotificationCardProps) {
  return (
    <li className="rounded-xl border border-[#D3D2D333] bg-white p-4 md:p-[25px]">
      <div className="flex gap-3">
        <div className="flex shrink-0 flex-col pt-0.5">
          <span
            className={`mt-1.5 inline-block h-2 w-2 rounded-full ${
              notification.isRead ? "bg-[#D3D2D3]" : "bg-[#303869]"
            }`}
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 gap-x-4">
            <h2 className="text-base font-semibold text-[#221D23] md:text-lg">{notification.title}</h2>
            <div className="flex shrink-0 items-center gap-3">
              <time className="text-[#474348]" dateTime={notification.createdAt}>
                {formatTimeAgo(notification.createdAt)}
              </time>
              <button
                type="button"
                onClick={onDelete}
                aria-label="Delete notification"
                className="text-xs text-[#6C686C] hover:text-[#EF4353] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          <p className="mt-2 leading-relaxed text-[#474348]">{notification.message}</p>
        </div>
      </div>
    </li>
  );
}
