"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { WorkspaceShell } from "@/components/auth/WorkspaceShell";

export default function DriverDashboardPage() {
  return (
    <RequireAuth allowedRoles={["driver"]}>
      <div className="min-h-full bg-[#f6f2f5]">
        <WorkspaceShell
          workspaceLabel="Driver Workspace"
          title="Dashboard"
          description="Driver workspace shell is ready. Delivery assignments and route tools will land here next."
        />
      </div>
    </RequireAuth>
  );
}
