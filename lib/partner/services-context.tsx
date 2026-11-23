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
import { useAuth } from "@/lib/auth/auth-context";
import {
  findPartnerAccountByEmail,
  getPartnerCapability,
} from "@/lib/auth/partner-mock-store";
import {
  clonePartnerService,
  createMockPartnerServices,
  PARTNER_SERVICES_STORAGE_KEY,
} from "@/lib/data/partner-services";
import type {
  PartnerService,
  PartnerServiceEditInput,
  PartnerServiceStatus,
} from "@/types/partner-services";

type PartnerServicesContextValue = {
  partnerId: string | null;
  services: PartnerService[];
  ready: boolean;
  getService: (serviceId: string) => PartnerService | undefined;
  createService: (input: PartnerServiceEditInput) => PartnerService | null;
  updateService: (
    serviceId: string,
    input: PartnerServiceEditInput,
  ) => PartnerService | null;
  updateServiceStatus: (
    serviceId: string,
    status: PartnerServiceStatus,
  ) => PartnerService | null;
};

const PartnerServicesContext =
  createContext<PartnerServicesContextValue | null>(null);

type PersistedServicesState = {
  version: 1;
  byPartnerId: Record<string, PartnerService[]>;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function readPersistedState(): PersistedServicesState | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(PARTNER_SERVICES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedServicesState;
    if (!parsed || parsed.version !== 1 || !parsed.byPartnerId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writePersistedState(state: PersistedServicesState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PARTNER_SERVICES_STORAGE_KEY, JSON.stringify(state));
}

function createServiceId(): string {
  return `svc-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function buildServiceFromInput(
  partnerId: string,
  input: PartnerServiceEditInput,
  existing?: PartnerService,
): PartnerService {
  const id = existing?.id ?? createServiceId();
  const packages = input.packages.map((pkg, index) => ({
    ...pkg,
    id:
      pkg.id.startsWith("temp-") || pkg.id.startsWith("new-") || !pkg.id
        ? `${id}-pkg-${index + 1}`
        : pkg.id,
    name: pkg.name.trim(),
    pricingUnit: pkg.pricingUnit.trim() || input.pricingUnit,
    description: pkg.description?.trim() || undefined,
  }));

  return {
    id,
    partnerId,
    name: input.name.trim(),
    category: input.category,
    description: input.description.trim(),
    image: input.image,
    priceGhs: input.priceGhs,
    pricingUnit: input.pricingUnit.trim() || "event",
    duration: input.duration.trim(),
    status: input.status,
    availability: input.availability,
    availabilityNotes: input.availabilityNotes.trim(),
    packages,
    updatedAt: new Date().toISOString(),
  };
}

function seedForPartner(partnerId: string): PartnerService[] {
  return createMockPartnerServices()
    .filter((service) => service.partnerId === partnerId)
    .map(clonePartnerService);
}

export function PartnerServicesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const partner = user ? findPartnerAccountByEmail(user.email) : undefined;
  const capability = partner
    ? getPartnerCapability(partner.partnerId)
    : null;
  const partnerId =
    partner && capability === "service_provider" ? partner.partnerId : null;

  const [services, setServices] = useState<PartnerService[]>([]);
  const [ready, setReady] = useState(false);
  /** Partner id the in-memory list currently belongs to (avoids cross-partner writes). */
  const [hydratedPartnerId, setHydratedPartnerId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!partnerId) {
      setServices([]);
      setHydratedPartnerId(null);
      setReady(true);
      return;
    }

    setReady(false);
    const persisted = readPersistedState();
    const stored = persisted?.byPartnerId[partnerId];
    if (stored && Array.isArray(stored) && stored.length > 0) {
      setServices(stored.map(clonePartnerService));
    } else {
      setServices(seedForPartner(partnerId));
    }
    setHydratedPartnerId(partnerId);
    setReady(true);
  }, [partnerId]);

  useEffect(() => {
    if (!ready || !partnerId || hydratedPartnerId !== partnerId) return;
    const persisted = readPersistedState() ?? { version: 1, byPartnerId: {} };
    writePersistedState({
      version: 1,
      byPartnerId: {
        ...persisted.byPartnerId,
        [partnerId]: services.map(clonePartnerService),
      },
    });
  }, [partnerId, hydratedPartnerId, ready, services]);

  const getService = useCallback(
    (serviceId: string) =>
      services.find((service) => service.id === serviceId),
    [services],
  );

  const createService = useCallback(
    (input: PartnerServiceEditInput) => {
      if (!partnerId) return null;
      const created = buildServiceFromInput(partnerId, input);
      setServices((current) => [created, ...current]);
      return created;
    },
    [partnerId],
  );

  const updateService = useCallback(
    (serviceId: string, input: PartnerServiceEditInput) => {
      if (!partnerId) return null;
      const existing = services.find((service) => service.id === serviceId);
      if (!existing || existing.partnerId !== partnerId) return null;

      const updated = buildServiceFromInput(partnerId, input, existing);
      setServices((current) =>
        current.map((service) =>
          service.id === serviceId ? updated : service,
        ),
      );
      return updated;
    },
    [partnerId, services],
  );

  const updateServiceStatus = useCallback(
    (serviceId: string, status: PartnerServiceStatus) => {
      let updated: PartnerService | null = null;
      setServices((current) =>
        current.map((service) => {
          if (service.id !== serviceId) return service;
          if (partnerId && service.partnerId !== partnerId) return service;
          updated = {
            ...clonePartnerService(service),
            status,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }),
      );
      return updated;
    },
    [partnerId],
  );

  const value = useMemo(
    () => ({
      partnerId,
      services,
      ready,
      getService,
      createService,
      updateService,
      updateServiceStatus,
    }),
    [
      partnerId,
      services,
      ready,
      getService,
      createService,
      updateService,
      updateServiceStatus,
    ],
  );

  return (
    <PartnerServicesContext.Provider value={value}>
      {children}
    </PartnerServicesContext.Provider>
  );
}

export function usePartnerServices() {
  const context = useContext(PartnerServicesContext);
  if (!context) {
    throw new Error(
      "usePartnerServices must be used within PartnerServicesProvider",
    );
  }
  return context;
}
