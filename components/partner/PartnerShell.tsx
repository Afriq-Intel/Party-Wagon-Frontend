"use client";

import { Suspense, useState, type ReactNode } from "react";
import { PartnerSidebar } from "@/components/partner/PartnerSidebar";
import { PartnerTopBar } from "@/components/partner/PartnerTopBar";

type PartnerShellProps = {
  children: ReactNode;
};

const SIDEBAR_WIDTH_CLASS = "w-[272px]";

function DesktopSidebarFallback() {
  return (
    <aside
      className={`hidden min-h-screen ${SIDEBAR_WIDTH_CLASS} shrink-0 self-stretch border-r border-midnight-party/5 bg-offwhite lg:block`}
      aria-hidden="true"
    />
  );
}

function TopBarFallback() {
  return (
    <div
      className="sticky top-0 z-30 h-[57px] border-b border-black/5 bg-[#fbf8fa]/95"
      aria-hidden="true"
    />
  );
}

/**
 * Partner workspace chrome — mirrors Operations shell structure:
 * desktop in-flow sidebar, mobile off-canvas drawer.
 */
export function PartnerShell({ children }: PartnerShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-[#f6f2f5] text-midnight-party">
      <div className="flex min-h-screen w-full flex-1 items-stretch">
        <Suspense fallback={<DesktopSidebarFallback />}>
          <PartnerSidebar.Desktop />
        </Suspense>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Suspense fallback={<TopBarFallback />}>
            <PartnerTopBar onMenuClick={() => setSidebarOpen(true)} />
          </Suspense>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <PartnerSidebar.Mobile
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </Suspense>
    </div>
  );
}
