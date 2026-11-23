"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  DASHBOARD_NOTIFICATIONS,
  MOCK_OPS_AVATAR,
} from "@/lib/data/operations-dashboard";
import { OPERATIONS_NAV } from "@/lib/operations/nav";

type OperationsTopBarProps = {
  onMenuClick: () => void;
};

function breadcrumbLabel(pathname: string): string {
  if (pathname === "/operations/dashboard") return "Dashboard";

  for (const item of OPERATIONS_NAV) {
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      const child = item.children?.find(
        (entry) =>
          pathname === entry.href || pathname.startsWith(`${entry.href}/`),
      );
      return child?.label ?? item.label;
    }
  }

  return "Workspace";
}

export function OperationsTopBar({ onMenuClick }: OperationsTopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const notificationsId = useId();
  const profileId = useId();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName =
    user?.profile?.preferred_name ||
    [user?.profile?.first_name, user?.profile?.last_name]
      .filter(Boolean)
      .join(" ") ||
    user?.email ||
    "Operations user";

  const roleLabel =
    user?.role === "ops_staff" ? "Operations Lead" : (user?.role ?? "Staff");

  const initials =
    [user?.profile?.first_name, user?.profile?.last_name]
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => String(part)[0]?.toUpperCase() ?? "")
      .join("") ||
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    setProfileOpen(false);
    await logout();
    router.replace("/account");
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/5 bg-[#fbf8fa]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-midnight-party/10 bg-white p-2 text-midnight-party transition hover:border-radiant-rose/40 hover:text-radiant-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <p className="truncate font-outfit text-[12px] text-midnight-party/50 sm:text-[13px]">
          Operations{" "}
          <span className="text-midnight-party/30" aria-hidden="true">
            /
          </span>{" "}
          <span className="text-midnight-party/75">
            {breadcrumbLabel(pathname)}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={notificationsOpen}
            aria-controls={notificationsId}
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            className="relative rounded-full border border-midnight-party/10 bg-white p-2 text-midnight-party transition hover:border-radiant-rose/40 hover:text-radiant-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-radiant-rose ring-2 ring-white" />
          </button>

          {notificationsOpen ? (
            <div
              id={notificationsId}
              role="menu"
              className="absolute right-0 mt-2 w-[280px] overflow-hidden rounded-xl border border-black/8 bg-white shadow-[0_16px_40px_rgba(51,16,56,0.12)] sm:w-[320px]"
            >
              <div className="border-b border-black/5 px-4 py-3">
                <p className="font-outfit text-sm font-semibold text-midnight-party">
                  Notifications
                </p>
              </div>
              <ul className="max-h-72 overflow-y-auto py-1">
                {DASHBOARD_NOTIFICATIONS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full flex-col gap-0.5 px-4 py-3 text-left transition hover:bg-offwhite/50"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <span className="font-outfit text-[13px] font-medium text-midnight-party">
                        {item.title}
                      </span>
                      <span className="font-outfit text-[11px] text-midnight-party/45">
                        {item.timeAgo}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            aria-controls={profileId}
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 rounded-full border border-midnight-party/10 bg-white py-1 pl-1 pr-2.5 transition hover:border-radiant-rose/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:pr-3"
          >
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-midnight-party">
              <Image
                src={MOCK_OPS_AVATAR}
                alt=""
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
              <span className="sr-only">{initials || "PW"}</span>
            </span>
            <span className="hidden text-left sm:block">
              <span className="block font-outfit text-[13px] font-semibold leading-tight text-midnight-party">
                {displayName}
              </span>
              <span className="block font-outfit text-[11px] leading-tight text-midnight-party/50">
                {roleLabel}
              </span>
            </span>
          </button>

          {profileOpen ? (
            <div
              id={profileId}
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-black/8 bg-white shadow-[0_16px_40px_rgba(51,16,56,0.12)]"
            >
              <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-midnight-party">
                  <Image
                    src={MOCK_OPS_AVATAR}
                    alt=""
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <p className="font-outfit text-sm font-semibold text-midnight-party">
                    {displayName}
                  </p>
                  <p className="truncate font-outfit text-[11px] text-midnight-party/50">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  void handleLogout();
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left font-outfit text-[13px] font-medium text-midnight-party transition hover:bg-radiant-rose/8 hover:text-radiant-rose"
              >
                <LogOut size={15} aria-hidden="true" />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
