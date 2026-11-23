"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getPartnerAccountsSnapshot,
  provisionPartnerAccountFromApplication,
  subscribePartnerStore,
} from "@/lib/auth/partner-mock-store";
import {
  clonePartnerApplication,
  countPendingPartnerApplications,
  countTotalPartnerApplications,
  createMockPartnerApplications,
} from "@/lib/data/operations-partner-applications";
import type {
  OperationsPartnerAccount,
  OperationsPartnerApplication,
  PartnerApplicationDecision,
  PartnerApplicationDecisionResult,
} from "@/types/operations-partners";

type PartnerApplicationsContextValue = {
  applications: OperationsPartnerApplication[];
  partners: OperationsPartnerAccount[];
  totalCount: number;
  pendingCount: number;
  partnerDirectoryCount: number;
  getApplication: (
    applicationId: string,
  ) => OperationsPartnerApplication | undefined;
  getPartner: (partnerId: string) => OperationsPartnerAccount | undefined;
  getPartnerByApplicationId: (
    applicationId: string,
  ) => OperationsPartnerAccount | undefined;
  applyDecision: (
    applicationId: string,
    decision: PartnerApplicationDecision,
  ) => PartnerApplicationDecisionResult | null;
};

const PartnerApplicationsContext =
  createContext<PartnerApplicationsContextValue | null>(null);

export function PartnerApplicationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [applications, setApplications] = useState(
    createMockPartnerApplications,
  );
  const [partners, setPartners] = useState(getPartnerAccountsSnapshot);

  useEffect(() => {
    return subscribePartnerStore(() => {
      setPartners(getPartnerAccountsSnapshot());
    });
  }, []);

  const getApplication = useCallback(
    (applicationId: string) =>
      applications.find((application) => application.id === applicationId),
    [applications],
  );

  const getPartner = useCallback(
    (partnerId: string) =>
      partners.find((partner) => partner.partnerId === partnerId),
    [partners],
  );

  const getPartnerByApplicationId = useCallback(
    (applicationId: string) =>
      partners.find((partner) => partner.applicationId === applicationId),
    [partners],
  );

  const applyDecision = useCallback(
    (
      applicationId: string,
      decision: PartnerApplicationDecision,
    ): PartnerApplicationDecisionResult | null => {
      const current = applications.find(
        (application) => application.id === applicationId,
      );
      if (!current) return null;

      const next = clonePartnerApplication(current);
      next.updatedAt = new Date().toISOString();

      let partner: OperationsPartnerAccount | null = null;
      let partnerCreated = false;

      if (decision.type === "approve") {
        next.status = "approved";
        next.rejectionReason = null;
        next.moreInfoMessage = null;

        const provisioned = provisionPartnerAccountFromApplication(next);
        partner = provisioned.partner;
        partnerCreated = provisioned.created;
        next.partnerId = provisioned.partner.partnerId;
        next.reviewNotes = provisioned.created
          ? `Partner account ${provisioned.partner.partnerId} created. Temporary credentials marked as sent securely (password not shown in Operations).`
          : `Partner account ${provisioned.partner.partnerId} already exists. Duplicate provisioning skipped.`;
      } else if (decision.type === "reject") {
        next.status = "rejected";
        next.rejectionReason = decision.reason.trim();
        next.moreInfoMessage = null;
      } else {
        next.status = "more_info_required";
        next.moreInfoMessage = decision.message.trim();
        next.rejectionReason = null;
      }

      setApplications((prev) =>
        prev.map((application) =>
          application.id === applicationId ? next : application,
        ),
      );

      return { application: next, partner, partnerCreated };
    },
    [applications],
  );

  const totalCount = useMemo(
    () => countTotalPartnerApplications(applications),
    [applications],
  );

  const pendingCount = useMemo(
    () => countPendingPartnerApplications(applications),
    [applications],
  );

  const partnerDirectoryCount = partners.length;

  const value = useMemo(
    () => ({
      applications,
      partners,
      totalCount,
      pendingCount,
      partnerDirectoryCount,
      getApplication,
      getPartner,
      getPartnerByApplicationId,
      applyDecision,
    }),
    [
      applications,
      partners,
      totalCount,
      pendingCount,
      partnerDirectoryCount,
      getApplication,
      getPartner,
      getPartnerByApplicationId,
      applyDecision,
    ],
  );

  return (
    <PartnerApplicationsContext.Provider value={value}>
      {children}
    </PartnerApplicationsContext.Provider>
  );
}

export function usePartnerApplications() {
  const context = useContext(PartnerApplicationsContext);
  if (!context) {
    throw new Error(
      "usePartnerApplications must be used within PartnerApplicationsProvider",
    );
  }
  return context;
}
