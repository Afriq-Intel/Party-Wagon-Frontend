import { RequirePartnerDashboardAuth } from "@/components/auth/RequireAuth";
import { PartnerShell } from "@/components/partner/PartnerShell";

/**
 * Authenticated Partner workspace chrome.
 * Change-password stays outside this group so it is not wrapped in the shell.
 */
export default function PartnerWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequirePartnerDashboardAuth>
      <PartnerShell>{children}</PartnerShell>
    </RequirePartnerDashboardAuth>
  );
}
