"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { PartnerNavIconGlyph } from "@/components/partner/PartnerNavIcons";
import { useAuth } from "@/lib/auth/auth-context";
import {
  findPartnerAccountByEmail,
  getPartnerCapability,
} from "@/lib/auth/partner-mock-store";
import {
  getPartnerNav,
  getPartnerWorkspaceLabel,
  IMPLEMENTED_PARTNER_ROUTES,
  isPartnerRouteActive,
  isPartnerWorkspaceCapability,
  type PartnerNavItem,
} from "@/lib/partner/nav";

type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const SIDEBAR_WIDTH_CLASS = "w-[272px]";

function NavItem({
  item,
  onNavigate,
}: {
  item: PartnerNavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isPartnerRouteActive(pathname, item.href);
  const implemented = IMPLEMENTED_PARTNER_ROUTES.has(item.href);

  const className = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-outfit text-[13px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${
    active
      ? "bg-midnight-party text-white shadow-[0_8px_18px_rgba(51,16,56,0.18)]"
      : "text-midnight-party/85 hover:bg-white/55"
  }`;

  if (!implemented) {
    return (
      <span
        className={`${className} cursor-default opacity-70`}
        title="Coming soon"
        aria-disabled="true"
      >
        <PartnerNavIconGlyph name={item.icon} />
        <span className="min-w-0 truncate">{item.label}</span>
      </span>
    );
  }

  return (
    <Link href={item.href} onClick={onNavigate} className={className}>
      <PartnerNavIconGlyph name={item.icon} />
      <span className="min-w-0 truncate">{item.label}</span>
    </Link>
  );
}

function SidebarChrome({
  onNavigate,
  showClose,
}: {
  onNavigate?: () => void;
  showClose?: boolean;
}) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const partner = user ? findPartnerAccountByEmail(user.email) : undefined;
  const capability = partner
    ? getPartnerCapability(partner.partnerId)
    : null;
  const supported = isPartnerWorkspaceCapability(capability);
  const navItems = supported ? getPartnerNav(capability) : [];
  const workspaceLabel = supported
    ? getPartnerWorkspaceLabel(capability)
    : "Partner Workspace";

  async function handleLogout() {
    onNavigate?.();
    await logout();
    router.replace("/account");
  }

  return (
    <>
      <div className="relative flex shrink-0 items-center justify-center bg-midnight-party px-5 py-5">
        <Link
          href="/partner/dashboard"
          onClick={onNavigate}
          aria-label="Party Wagon Partner dashboard home"
          className="inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Image
            src="/assets/brand/logo-white.svg"
            alt="Party Wagon"
            width={148}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
        {showClose ? (
          <button
            type="button"
            onClick={onNavigate}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
          <p className="mb-3 px-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.18em] text-midnight-party/45">
            {workspaceLabel}
          </p>
          <nav className="space-y-1" aria-label="Partner navigation">
            {navItems.map((item) => (
              <NavItem key={item.id} item={item} onNavigate={onNavigate} />
            ))}
          </nav>
        </div>

        <div className="shrink-0 border-t border-midnight-party/10 px-3 py-4">
          <button
            type="button"
            onClick={() => {
              void handleLogout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-outfit text-[13px] font-medium text-midnight-party/85 transition hover:bg-white/55 hover:text-radiant-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

function DesktopSidebar() {
  return (
    <aside
      className={`hidden min-h-screen ${SIDEBAR_WIDTH_CLASS} shrink-0 flex-col self-stretch overflow-hidden border-r border-midnight-party/5 bg-offwhite lg:flex`}
      aria-label="Partner navigation"
    >
      <SidebarChrome />
    </aside>
  );
}

function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  return (
    <div className="lg:hidden">
      <div
        className={`fixed inset-0 z-40 bg-midnight-party/35 transition ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex ${SIDEBAR_WIDTH_CLASS} max-w-[85vw] flex-col border-r border-midnight-party/5 bg-offwhite shadow-[8px_0_28px_rgba(51,16,56,0.12)] transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Partner navigation"
        aria-hidden={!open}
      >
        <SidebarChrome onNavigate={onClose} showClose />
      </aside>
    </div>
  );
}

export const PartnerSidebar = {
  Desktop: DesktopSidebar,
  Mobile: MobileSidebar,
};
