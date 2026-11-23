"use client";

import { Suspense, useState, type ReactNode } from "react";
import { OperationsSidebar } from "@/components/operations/OperationsSidebar";
import { OperationsTopBar } from "@/components/operations/OperationsTopBar";

type OperationsShellProps = {
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
 * Two-region workspace layout:
 * - Desktop: sidebar is an in-flow flex column (reserves width; never overlays).
 * - Mobile/tablet: sidebar is a separate off-canvas drawer outside the flex row.
 *
 * Sidebar/top bar use `usePathname()`, so they are streamed behind Suspense
 * to keep product detail routes prerender-friendly.
 */
export function OperationsShell({ children }: OperationsShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-[#f6f2f5] text-midnight-party">
      <div className="flex min-h-screen w-full flex-1 items-stretch">
        <Suspense fallback={<DesktopSidebarFallback />}>
          <OperationsSidebar.Desktop />
        </Suspense>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Suspense fallback={<TopBarFallback />}>
            <OperationsTopBar onMenuClick={() => setSidebarOpen(true)} />
          </Suspense>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <OperationsSidebar.Mobile
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </Suspense>
    </div>
  );
}
