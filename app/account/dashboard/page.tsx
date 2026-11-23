"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { WorkspaceShell } from "@/components/auth/WorkspaceShell";

export default function CustomerDashboardPage() {
  return (
    <RequireAuth allowedRoles={["customer"]}>
      <div className="min-h-full bg-[#f6f2f5]">
        <WorkspaceShell
          workspaceLabel="Customer Account"
          title="Dashboard"
          description="Your customer dashboard shell is ready. Orders, party plans, and account tools will land here next."
        />
      </div>
    </RequireAuth>
  );
}
