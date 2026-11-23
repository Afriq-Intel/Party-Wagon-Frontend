import { RequireOperationsAuth } from "@/components/auth/RequireAuth";
import { OperationsShell } from "@/components/operations/OperationsShell";
import { PartnerApplicationsProvider } from "@/lib/operations/partner-applications-context";

/**
 * Workspace chrome for authenticated Operations pages.
 * Partner application mock state lives here so sidebar badges and
 * Manage Partners pages share the same live counts after review actions.
 */
export default function OperationsWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireOperationsAuth>
      <PartnerApplicationsProvider>
        <OperationsShell>{children}</OperationsShell>
      </PartnerApplicationsProvider>
    </RequireOperationsAuth>
  );
}
