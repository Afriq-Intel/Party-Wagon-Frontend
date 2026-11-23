"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { OperationsNavIconGlyph } from "@/components/operations/OperationsNavIcons";
import {
  IMPLEMENTED_OPERATIONS_ROUTES,
  OPERATIONS_NAV,
  isOperationsRouteActive,
  type OperationsNavChild,
  type OperationsNavItem,
} from "@/lib/operations/nav";
import { usePartnerApplications } from "@/lib/operations/partner-applications-context";

type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const SIDEBAR_WIDTH_CLASS = "w-[272px]";

function resolveNavChildBadge(
  child: OperationsNavChild,
  pendingPartnerApplications: number,
): number | undefined {
  if (child.badgeSource === "partner-applications-pending") {
    return pendingPartnerApplications > 0
      ? pendingPartnerApplications
      : undefined;
  }
  return typeof child.badge === "number" ? child.badge : undefined;
}

function NavItem({
  item,
  onNavigate,
}: {
  item: OperationsNavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { pendingCount } = usePartnerApplications();
  const hasChildren = Boolean(item.children?.length);
  const childActive = item.children?.some((child) =>
    isOperationsRouteActive(pathname, child.href),
  );
  const selfActive = isOperationsRouteActive(pathname, item.href);
  const active = selfActive || Boolean(childActive);
  const [manualExpand, setManualExpand] = useState<boolean | null>(null);
  const expanded =
    manualExpand ?? (active || item.id === "orders" || item.id === "partners");

  const implemented = IMPLEMENTED_OPERATIONS_ROUTES.has(item.href);

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => setManualExpand(!expanded)}
          aria-expanded={expanded}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-outfit text-[13px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${
            active && !childActive
              ? "bg-midnight-party text-white"
              : "text-midnight-party/85 hover:bg-white/55"
          }`}
        >
          <OperationsNavIconGlyph name={item.icon} />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          <ChevronDown
            size={16}
            className={`shrink-0 transition ${expanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {expanded ? (
          <ul className="ml-4 space-y-1 border-l border-midnight-party/10 pl-3">
            {item.children?.map((child) => {
              const childIsActive = isOperationsRouteActive(pathname, child.href);
              const childImplemented = IMPLEMENTED_OPERATIONS_ROUTES.has(
                child.href,
              );
              const badge = resolveNavChildBadge(child, pendingCount);
              const className = `flex items-center justify-between gap-2 rounded-lg px-3 py-2 font-outfit text-[12.5px] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${
                childIsActive
                  ? "bg-midnight-party text-white"
                  : "text-midnight-party/75 hover:bg-white/55"
              }`;

              const content = (
                <>
                  <span className="min-w-0 truncate">{child.label}</span>
                  {typeof badge === "number" ? (
                    <span
                      className={`inline-flex min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        childIsActive
                          ? "bg-white text-midnight-party"
                          : "bg-radiant-rose text-white"
                      }`}
                    >
                      {badge}
                    </span>
                  ) : null}
                </>
              );

              return (
                <li key={child.id}>
                  {childImplemented ? (
                    <Link
                      href={child.href}
                      onClick={onNavigate}
                      className={className}
                    >
                      {content}
                    </Link>
                  ) : (
                    <span
                      className={`${className} cursor-default opacity-70`}
                      title="Coming soon"
                      aria-disabled="true"
                    >
                      {content}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  }

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
        <OperationsNavIconGlyph name={item.icon} />
        <span className="min-w-0 truncate">{item.label}</span>
      </span>
    );
  }

  return (
    <Link href={item.href} onClick={onNavigate} className={className}>
      <OperationsNavIconGlyph name={item.icon} />
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
  return (
    <>
      <div className="relative flex shrink-0 items-center justify-center bg-midnight-party px-5 py-5">
        <Link
          href="/operations/dashboard"
          onClick={onNavigate}
          aria-label="Party Wagon Operations dashboard home"
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

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
        <p className="mb-3 px-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.18em] text-midnight-party/45">
          Operations Workspace
        </p>
        <nav className="space-y-1">
          {OPERATIONS_NAV.map((item) => (
            <NavItem key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>
    </>
  );
}

function DesktopSidebar() {
  return (
    <aside
      className={`hidden min-h-screen ${SIDEBAR_WIDTH_CLASS} shrink-0 flex-col self-stretch overflow-hidden border-r border-midnight-party/5 bg-offwhite lg:flex`}
      aria-label="Operations navigation"
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
        aria-label="Operations navigation"
        aria-hidden={!open}
      >
        <SidebarChrome onNavigate={onClose} showClose />
      </aside>
    </div>
  );
}

export const OperationsSidebar = {
  Desktop: DesktopSidebar,
  Mobile: MobileSidebar,
};
