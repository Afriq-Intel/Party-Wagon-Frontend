/**
 * Shared mock partner account store for auth + Operations directory.
 *
 * Password secrets live in a private map / private localStorage payload and
 * must never be rendered in Operations UI. Directory snapshots remain
 * password-free.
 *
 * Account status + password mutations persist across reloads so first-login
 * password changes survive logout → login.
 */
import {
  buildPartnerAccountFromApplication,
  clonePartnerAccount,
  createMockPartnerAccounts,
} from "@/lib/data/operations-partner-accounts";
import { PARTNER_MOCK_AUTH_STORAGE_KEY } from "@/lib/auth/constants";
import type {
  OperationsPartnerAccount,
  OperationsPartnerApplication,
} from "@/types/operations-partners";
import type { AuthUser } from "@/lib/auth/types";
import type { PartnerCapability } from "@/types/partner-application";

/** Initial temporary password for newly provisioned partners (mock only). */
export const MOCK_PARTNER_TEMP_PASSWORD = "Partner123!";

const PARTNER_STORE_EVENT = "party-wagon-partner-store-change";

type PartnerSecretRecord = {
  password: string;
};

type PersistedPartnerAuthState = {
  version: 1;
  /** Account status overlays keyed by partnerId (never includes passwords). */
  statusByPartnerId: Record<
    string,
    {
      accountStatus: OperationsPartnerAccount["accountStatus"];
      updatedAt: string;
    }
  >;
  /** Auth-only secrets. Never expose via directory/snapshot APIs. */
  secretsByPartnerId: Record<string, string>;
  /** Partners provisioned after seed (full directory records, no passwords). */
  extraPartners: OperationsPartnerAccount[];
};

let partners: OperationsPartnerAccount[] = createMockPartnerAccounts();
const secrets = new Map<string, PartnerSecretRecord>();
let hydrated = false;

function seedSecrets() {
  for (const partner of partners) {
    if (!secrets.has(partner.partnerId)) {
      secrets.set(partner.partnerId, {
        password: MOCK_PARTNER_TEMP_PASSWORD,
      });
    }
  }
}

seedSecrets();

function canUseStorage() {
  return typeof window !== "undefined";
}

function readPersistedState(): PersistedPartnerAuthState | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(PARTNER_MOCK_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedPartnerAuthState;
    if (!parsed || parsed.version !== 1) return null;
    return {
      version: 1,
      statusByPartnerId: parsed.statusByPartnerId ?? {},
      secretsByPartnerId: parsed.secretsByPartnerId ?? {},
      extraPartners: Array.isArray(parsed.extraPartners)
        ? parsed.extraPartners
        : [],
    };
  } catch {
    return null;
  }
}

function writePersistedState() {
  if (!canUseStorage()) return;

  const seedIds = new Set(
    createMockPartnerAccounts().map((partner) => partner.partnerId),
  );

  const statusByPartnerId: PersistedPartnerAuthState["statusByPartnerId"] = {};
  for (const partner of partners) {
    statusByPartnerId[partner.partnerId] = {
      accountStatus: partner.accountStatus,
      updatedAt: partner.updatedAt,
    };
  }

  const secretsByPartnerId: Record<string, string> = {};
  for (const [partnerId, secret] of secrets.entries()) {
    secretsByPartnerId[partnerId] = secret.password;
  }

  const extraPartners = partners
    .filter((partner) => !seedIds.has(partner.partnerId))
    .map(clonePartnerAccount);

  const payload: PersistedPartnerAuthState = {
    version: 1,
    statusByPartnerId,
    secretsByPartnerId,
    extraPartners,
  };

  try {
    window.localStorage.setItem(
      PARTNER_MOCK_AUTH_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } catch {
    // Persistence is best-effort for mock auth only.
  }
}

/**
 * Re-apply browser-persisted password/status mutations over seed data.
 * Safe to call repeatedly; no-ops on the server.
 */
function ensureHydrated() {
  if (hydrated || !canUseStorage()) return;
  hydrated = true;

  const persisted = readPersistedState();
  if (!persisted) {
    seedSecrets();
    return;
  }

  const byId = new Map(partners.map((partner) => [partner.partnerId, partner]));

  for (const extra of persisted.extraPartners) {
    if (!byId.has(extra.partnerId)) {
      byId.set(extra.partnerId, clonePartnerAccount(extra));
    }
  }

  partners = Array.from(byId.values()).map((partner) => {
    const overlay = persisted.statusByPartnerId[partner.partnerId];
    if (!overlay) return clonePartnerAccount(partner);
    return {
      ...clonePartnerAccount(partner),
      accountStatus: overlay.accountStatus,
      updatedAt: overlay.updatedAt,
    };
  });

  for (const [partnerId, password] of Object.entries(
    persisted.secretsByPartnerId,
  )) {
    if (typeof password === "string" && password.length > 0) {
      secrets.set(partnerId, { password });
    }
  }

  seedSecrets();
}

function notify() {
  writePersistedState();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PARTNER_STORE_EVENT));
  }
}

export function getPartnerAccountsSnapshot(): OperationsPartnerAccount[] {
  ensureHydrated();
  return partners.map(clonePartnerAccount);
}

export function subscribePartnerStore(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  ensureHydrated();
  window.addEventListener(PARTNER_STORE_EVENT, onChange);
  return () => window.removeEventListener(PARTNER_STORE_EVENT, onChange);
}

export function findPartnerAccountByEmail(
  email: string,
): OperationsPartnerAccount | undefined {
  ensureHydrated();
  const normalised = email.trim().toLowerCase();
  const match = partners.find(
    (partner) => partner.email.trim().toLowerCase() === normalised,
  );
  return match ? clonePartnerAccount(match) : undefined;
}

export function findPartnerAccountByPartnerId(
  partnerId: string,
): OperationsPartnerAccount | undefined {
  ensureHydrated();
  const match = partners.find((partner) => partner.partnerId === partnerId);
  return match ? clonePartnerAccount(match) : undefined;
}

export function getPartnerCapability(
  partnerId: string,
): PartnerCapability | null {
  return findPartnerAccountByPartnerId(partnerId)?.capability ?? null;
}

/**
 * Auth-only password check. Never expose the stored secret to UI layers.
 *
 * Mock DX: the temporary password always works so the login banner stays
 * accurate even after a first-login password change in localStorage.
 */
export function verifyPartnerMockPassword(
  partnerId: string,
  password: string,
): boolean {
  ensureHydrated();
  // Dev override — matches the on-screen mock login hint.
  if (
    password === MOCK_PARTNER_TEMP_PASSWORD &&
    Boolean(findPartnerAccountByPartnerId(partnerId))
  ) {
    return true;
  }
  const secret = secrets.get(partnerId);
  if (!secret) return false;
  return secret.password === password;
}

/**
 * Provision a directory partner + temp mock secret.
 * Returns the existing partner when applicationId already has one (idempotent).
 */
export function provisionPartnerAccountFromApplication(
  application: OperationsPartnerApplication,
): { partner: OperationsPartnerAccount; created: boolean } {
  ensureHydrated();
  const existing = partners.find(
    (entry) => entry.applicationId === application.id,
  );
  if (existing) {
    return { partner: clonePartnerAccount(existing), created: false };
  }

  const created = buildPartnerAccountFromApplication(application);
  partners = [...partners, created];
  secrets.set(created.partnerId, { password: MOCK_PARTNER_TEMP_PASSWORD });
  notify();
  return { partner: clonePartnerAccount(created), created: true };
}

export type PartnerPasswordChangeResult =
  | { ok: true; partner: OperationsPartnerAccount }
  | { ok: false; error: string };

export function completePartnerFirstLoginPasswordChange(
  partnerId: string,
  newPassword: string,
  confirmPassword: string,
): PartnerPasswordChangeResult {
  ensureHydrated();
  const partner = partners.find((entry) => entry.partnerId === partnerId);
  if (!partner) {
    return { ok: false, error: "Partner account not found." };
  }

  if (partner.accountStatus === "suspended") {
    return { ok: false, error: "This partner account is suspended." };
  }

  const trimmed = newPassword.trim();
  if (trimmed.length < 8) {
    return {
      ok: false,
      error: "Password must be at least 8 characters.",
    };
  }
  if (trimmed !== confirmPassword.trim()) {
    return {
      ok: false,
      error: "Password and confirmation do not match.",
    };
  }
  if (trimmed === MOCK_PARTNER_TEMP_PASSWORD) {
    return {
      ok: false,
      error: "Choose a new password that is not the temporary password.",
    };
  }

  const now = new Date().toISOString();
  const updated: OperationsPartnerAccount = {
    ...partner,
    accountStatus: "active",
    updatedAt: now,
  };

  partners = partners.map((entry) =>
    entry.partnerId === partnerId ? updated : entry,
  );
  secrets.set(partnerId, { password: trimmed });
  notify();

  return { ok: true, partner: clonePartnerAccount(updated) };
}

export function buildVendorAuthUser(
  partner: OperationsPartnerAccount,
): AuthUser {
  const nameParts = partner.contactName.trim().split(/\s+/);
  const firstName = nameParts[0] || partner.businessName;
  const lastName = nameParts.slice(1).join(" ") || null;

  return {
    id: partner.id,
    email: partner.email,
    phone: partner.phone,
    status:
      partner.accountStatus === "suspended"
        ? "suspended"
        : partner.accountStatus === "pending_first_login"
          ? "pending_first_login"
          : "active",
    role: "vendor",
    profile: {
      first_name: firstName,
      last_name: lastName,
      preferred_name: firstName,
    },
  };
}

export function partnerRequiresPasswordChange(
  partner: OperationsPartnerAccount | null | undefined,
): boolean {
  return partner?.accountStatus === "pending_first_login";
}
