"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { WorkspaceShell } from "@/components/auth/WorkspaceShell";

export default function StoreDashboardPage() {
  return (
    <RequireAuth allowedRoles={["store_staff"]}>
      <div className="min-h-full bg-[#f6f2f5]">
        <WorkspaceShell
          workspaceLabel="Store Workspace"
          title="Dashboard"
          description="Store staff workspace shell is ready. Fulfilment and inventory tools will land here next."
        />
      </div>
    </RequireAuth>
  );
}
