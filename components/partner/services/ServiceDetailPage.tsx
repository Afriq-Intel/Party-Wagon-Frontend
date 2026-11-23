"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  formatPartnerServicePrice,
  formatPartnerServiceUpdatedAt,
  partnerServiceAvailabilityLabel,
  partnerServiceStatusHint,
  partnerServiceStatusLabel,
} from "@/lib/data/partner-services";
import { usePartnerServices } from "@/lib/partner/services-context";
import {
  PARTNER_SERVICE_AVAILABILITIES,
  PARTNER_SERVICE_CATEGORIES,
  PARTNER_SERVICE_PRICING_UNITS,
  PARTNER_SERVICE_STATUSES,
  type PartnerService,
  type PartnerServiceAvailability,
  type PartnerServiceCategory,
  type PartnerServiceEditInput,
  type PartnerServicePackage,
  type PartnerServiceStatus,
} from "@/types/partner-services";
import { ServiceAvailabilityBadge } from "./ServiceAvailabilityBadge";
import { ServiceImagePicker } from "./ServiceImagePicker";
import { ServiceStatusBadge } from "./ServiceStatusBadge";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

const fieldClass =
  "w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white disabled:cursor-default disabled:opacity-90";

const labelClass =
  "mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45";

type ServiceDetailMode = "view" | "edit" | "create";

type DraftState = {
  name: string;
  category: PartnerServiceCategory;
  description: string;
  image: string;
  priceGhs: string;
  pricingUnit: string;
  duration: string;
  status: PartnerServiceStatus;
  availability: PartnerServiceAvailability;
  availabilityNotes: string;
  packages: PartnerServicePackage[];
};

function serviceToDraft(service: PartnerService): DraftState {
  return {
    name: service.name,
    category: service.category,
    description: service.description,
    image: service.image,
    priceGhs: String(service.priceGhs),
    pricingUnit: service.pricingUnit,
    duration: service.duration,
    status: service.status,
    availability: service.availability,
    availabilityNotes: service.availabilityNotes,
    packages: service.packages.map((pkg) => ({ ...pkg })),
  };
}

function createEmptyDraft(): DraftState {
  return {
    name: "",
    category: "Catering",
    description: "",
    image: "",
    priceGhs: "0",
    pricingUnit: "event",
    duration: "",
    status: "draft",
    availability: "available",
    availabilityNotes: "",
    packages: [],
  };
}

function draftsEqual(a: DraftState, b: DraftState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function SectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className={`${cardClass} p-4 sm:p-5`}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-oswald text-[1.05rem] font-bold uppercase tracking-wide text-midnight-party">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/55">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-[#fbf8fa] px-3.5 py-3">
      <p className={labelClass}>{label}</p>
      <div className="font-outfit text-[13.5px] font-medium text-midnight-party">
        {value}
      </div>
    </div>
  );
}

export function ServiceDetailPage({
  serviceId,
  mode,
}: {
  serviceId?: string;
  mode: ServiceDetailMode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = useId();
  const { getService, createService, updateService, ready } =
    usePartnerServices();
  const service = serviceId ? getService(serviceId) : undefined;

  const [draft, setDraft] = useState<DraftState | null>(null);
  const [baseline, setBaseline] = useState<DraftState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isEditable = isCreate || isEdit;

  useEffect(() => {
    if (!isCreate) return;
    const next = createEmptyDraft();
    setDraft(next);
    setBaseline(next);
    setError(null);
  }, [isCreate]);

  useEffect(() => {
    if (isCreate || !service) return;
    const next = serviceToDraft(service);
    setDraft(next);
    setBaseline(next);
    setError(null);
  }, [isCreate, service]);

  useEffect(() => {
    if (mode !== "view" || !serviceId) return;
    if (searchParams.get("saved") !== "1" || !service) return;
    const created = searchParams.get("created") === "1";
    setSuccess(
      created
        ? `Created “${service.name}” in your services.`
        : `Saved changes to “${service.name}”.`,
    );
    router.replace(`/partner/services/${serviceId}`, { scroll: false });
  }, [mode, service, serviceId, router, searchParams]);

  const isDirty = useMemo(() => {
    if (!draft || !baseline) return false;
    return !draftsEqual(draft, baseline);
  }, [draft, baseline]);

  useEffect(() => {
    if (!isEditable || !isDirty) return;

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isEditable, isDirty]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(null), 3200);
    return () => window.clearTimeout(timer);
  }, [success]);

  function confirmDiscard(): boolean {
    if (!isDirty) return true;
    return window.confirm(
      "You have unsaved changes. Leave this page and discard them?",
    );
  }

  function navigateBack() {
    if (isEditable && !confirmDiscard()) return;
    router.push("/partner/services");
  }

  function navigateToEdit() {
    if (!serviceId) return;
    router.push(`/partner/services/${serviceId}/edit`);
  }

  function updateDraft<K extends keyof DraftState>(
    key: K,
    value: DraftState[K],
  ) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setError(null);
  }

  function addPackage() {
    if (!draft) return;
    const pkg: PartnerServicePackage = {
      id: `temp-${Date.now()}`,
      name: "",
      priceGhs: Number(draft.priceGhs) || 0,
      pricingUnit: draft.pricingUnit || "event",
      description: "",
    };
    updateDraft("packages", [...draft.packages, pkg]);
  }

  function updatePackage(
    packageId: string,
    patch: Partial<PartnerServicePackage>,
  ) {
    setDraft((current) => {
      if (!current) return current;
      return {
        ...current,
        packages: current.packages.map((pkg) =>
          pkg.id === packageId ? { ...pkg, ...patch } : pkg,
        ),
      };
    });
    setError(null);
  }

  function removePackage(packageId: string) {
    if (!draft) return;
    updateDraft(
      "packages",
      draft.packages.filter((pkg) => pkg.id !== packageId),
    );
  }

  function buildInput(current: DraftState): PartnerServiceEditInput | null {
    const name = current.name.trim();
    const description = current.description.trim();
    const duration = current.duration.trim();
    const priceGhs = Number(current.priceGhs);
    const pricingUnit = current.pricingUnit.trim();
    const availabilityNotes = current.availabilityNotes.trim();

    if (!name) {
      setError("Service name is required.");
      return null;
    }
    if (!current.category) {
      setError("Category is required.");
      return null;
    }
    if (!description) {
      setError("Description is required.");
      return null;
    }
    if (!current.image) {
      setError("Add a service image.");
      return null;
    }
    if (!Number.isFinite(priceGhs) || priceGhs < 0) {
      setError("Enter a valid starting price in GHS.");
      return null;
    }
    if (!pricingUnit) {
      setError("Pricing unit is required.");
      return null;
    }
    if (!duration) {
      setError("Duration is required.");
      return null;
    }
    if (!availabilityNotes) {
      setError("Add a short availability note for hosts.");
      return null;
    }
    if (current.packages.length === 0) {
      setError("Add at least one package.");
      return null;
    }

    for (const pkg of current.packages) {
      if (!pkg.name.trim()) {
        setError("Each package needs a name.");
        return null;
      }
      if (!Number.isFinite(pkg.priceGhs) || pkg.priceGhs < 0) {
        setError("Each package needs a valid price.");
        return null;
      }
      if (!pkg.pricingUnit.trim()) {
        setError("Each package needs a pricing unit.");
        return null;
      }
    }

    return {
      name,
      category: current.category,
      description,
      image: current.image,
      priceGhs,
      pricingUnit,
      duration,
      status: current.status,
      availability: current.availability,
      availabilityNotes,
      packages: current.packages.map((pkg) => ({
        ...pkg,
        name: pkg.name.trim(),
        pricingUnit: pkg.pricingUnit.trim(),
        description: pkg.description?.trim() || undefined,
      })),
    };
  }

  function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;

    const input = buildInput(draft);
    if (!input) return;

    if (isCreate) {
      const created = createService(input);
      if (!created) {
        setError("Could not create this service.");
        return;
      }
      setError(null);
      router.replace(`/partner/services/${created.id}?saved=1&created=1`);
      return;
    }

    if (!serviceId) {
      setError("Could not save this service.");
      return;
    }

    const updated = updateService(serviceId, input);
    if (!updated) {
      setError("Could not save this service.");
      return;
    }

    const next = serviceToDraft(updated);
    setDraft(next);
    setBaseline(next);
    setError(null);
    router.replace(`/partner/services/${serviceId}?saved=1`);
  }

  function handleCancel() {
    if (!confirmDiscard()) return;
    if (isCreate) {
      router.push("/partner/services");
      return;
    }
    if (baseline) {
      setDraft(baseline);
      setError(null);
    }
    if (serviceId) {
      router.push(`/partner/services/${serviceId}`);
    }
  }

  if (!ready || (!isCreate && !draft && serviceId && !service)) {
    return (
      <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-black/5 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party" />
        </div>
      </main>
    );
  }

  if (!isCreate && !service) {
    return (
      <main className="mx-auto flex w-full min-w-0 max-w-[900px] flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <article className={`${cardClass} p-6 sm:p-8`}>
          <h1 className="font-oswald text-[1.7rem] font-bold uppercase tracking-wide text-midnight-party">
            Service not found
          </h1>
          <p className="mt-3 font-outfit text-[14px] text-midnight-party/65">
            This service is not in your workspace listings, or it may have been
            removed from this browser session.
          </p>
          <Link
            href="/partner/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to My Services
          </Link>
        </article>
      </main>
    );
  }

  if (!draft) {
    return null;
  }

  const title = isCreate
    ? "Add Service"
    : isEdit
      ? "Edit Service"
      : draft.name;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <nav className="mb-2 flex flex-wrap items-center gap-1.5 font-outfit text-[12px] text-midnight-party/45">
            <Link
              href="/partner/services"
              onClick={(event) => {
                if (isEditable && isDirty && !confirmDiscard()) {
                  event.preventDefault();
                }
              }}
              className="transition hover:text-lilac-luster"
            >
              My Services
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="text-midnight-party/70">
              {isCreate ? "Add" : isEdit ? "Edit" : "View"}
            </span>
          </nav>
          <h1 className="font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
            {title}
          </h1>
          <p className="mt-1.5 max-w-2xl font-outfit text-[13px] leading-relaxed text-midnight-party/60">
            {isCreate
              ? "Create a new service listing with pricing, packages, duration and availability."
              : isEdit
                ? "Update your offering details. Changes stay in this mock workspace until a partner services API lands."
                : "Review how this service appears to celebration hosts."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={navigateBack}
            className="inline-flex items-center gap-2 rounded-full border border-midnight-party/15 bg-white px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </button>
          {!isEditable && serviceId ? (
            <button
              type="button"
              onClick={navigateToEdit}
              className="inline-flex items-center gap-2 rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
            >
              <Pencil size={15} aria-hidden="true" />
              Edit
            </button>
          ) : null}
          {isEditable ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center rounded-full border border-midnight-party/15 bg-white px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={formId}
                className="inline-flex items-center gap-2 rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
              >
                <Check size={15} aria-hidden="true" />
                {isCreate ? "Create service" : "Save changes"}
              </button>
            </>
          ) : null}
        </div>
      </div>

      {success ? (
        <div
          role="status"
          className="rounded-xl border border-lilac-luster/25 bg-lilac-luster/5 px-4 py-3 font-outfit text-[13px] text-midnight-party"
        >
          {success}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-radiant-rose/25 bg-radiant-rose/5 px-4 py-3 font-outfit text-[13px] text-radiant-rose"
        >
          {error}
        </div>
      ) : null}

      <form id={formId} onSubmit={handleSave} className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex min-w-0 flex-col gap-4">
          <SectionCard
            title="Service details"
            description="Name, category and description hosts will see."
          >
            {isEditable ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor={`${formId}-name`} className={labelClass}>
                    Service name
                  </label>
                  <input
                    id={`${formId}-name`}
                    value={draft.name}
                    onChange={(event) =>
                      updateDraft("name", event.target.value)
                    }
                    className={fieldClass}
                    placeholder="e.g. Private Chef Experience"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-category`} className={labelClass}>
                    Category
                  </label>
                  <select
                    id={`${formId}-category`}
                    value={draft.category}
                    onChange={(event) =>
                      updateDraft(
                        "category",
                        event.target.value as PartnerServiceCategory,
                      )
                    }
                    className={fieldClass}
                  >
                    {PARTNER_SERVICE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-duration`} className={labelClass}>
                    Duration
                  </label>
                  <input
                    id={`${formId}-duration`}
                    value={draft.duration}
                    onChange={(event) =>
                      updateDraft("duration", event.target.value)
                    }
                    className={fieldClass}
                    placeholder="e.g. 3 hours, Half day"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`${formId}-description`}
                    className={labelClass}
                  >
                    Description
                  </label>
                  <textarea
                    id={`${formId}-description`}
                    value={draft.description}
                    onChange={(event) =>
                      updateDraft("description", event.target.value)
                    }
                    rows={4}
                    className={`${fieldClass} resize-y`}
                    placeholder="Tell hosts what is included and the vibe of this offering."
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <ReadOnlyField label="Service name" value={draft.name} />
                <ReadOnlyField label="Category" value={draft.category} />
                <ReadOnlyField label="Duration" value={draft.duration} />
                <div className="sm:col-span-2">
                  <ReadOnlyField
                    label="Description"
                    value={draft.description}
                  />
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Pricing & packages"
            description="Starting price plus the packages hosts can choose."
            action={
              isEditable ? (
                <button
                  type="button"
                  onClick={addPackage}
                  className="inline-flex items-center gap-1.5 rounded-full border border-midnight-party/15 px-3 py-1.5 font-outfit text-[12px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
                >
                  <Plus size={14} aria-hidden="true" />
                  Add package
                </button>
              ) : null
            }
          >
            {isEditable ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${formId}-price`} className={labelClass}>
                    Starting price (GHS)
                  </label>
                  <input
                    id={`${formId}-price`}
                    type="number"
                    min={0}
                    step={1}
                    value={draft.priceGhs}
                    onChange={(event) =>
                      updateDraft("priceGhs", event.target.value)
                    }
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-unit`} className={labelClass}>
                    Pricing unit
                  </label>
                  <select
                    id={`${formId}-unit`}
                    value={draft.pricingUnit}
                    onChange={(event) =>
                      updateDraft("pricingUnit", event.target.value)
                    }
                    className={fieldClass}
                  >
                    {PARTNER_SERVICE_PRICING_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <ReadOnlyField
                  label="Starting price"
                  value={formatPartnerServicePrice(
                    Number(draft.priceGhs) || 0,
                    draft.pricingUnit,
                  )}
                />
                <ReadOnlyField
                  label="Pricing unit"
                  value={draft.pricingUnit}
                />
              </div>
            )}

            <div className="mt-4 space-y-3">
              {draft.packages.length === 0 ? (
                <p className="rounded-xl border border-dashed border-midnight-party/15 px-4 py-6 text-center font-outfit text-[13px] text-midnight-party/50">
                  No packages yet.
                  {isEditable
                    ? " Add at least one package before saving."
                    : ""}
                </p>
              ) : (
                draft.packages.map((pkg, index) => (
                  <div
                    key={pkg.id}
                    className="rounded-xl border border-black/5 bg-[#fbf8fa] p-3.5"
                  >
                    {isEditable ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2 flex items-start justify-between gap-2">
                          <p className="font-outfit text-[12px] font-semibold uppercase tracking-wide text-midnight-party/45">
                            Package {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => removePackage(pkg.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-radiant-rose/20 text-radiant-rose transition hover:bg-radiant-rose/8"
                          >
                            <Trash2 size={14} aria-hidden="true" />
                            <span className="sr-only">Remove package</span>
                          </button>
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Package name</label>
                          <input
                            value={pkg.name}
                            onChange={(event) =>
                              updatePackage(pkg.id, {
                                name: event.target.value,
                              })
                            }
                            className={fieldClass}
                            placeholder="e.g. Classic bar setup"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Price (GHS)</label>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={pkg.priceGhs}
                            onChange={(event) =>
                              updatePackage(pkg.id, {
                                priceGhs: Number(event.target.value) || 0,
                              })
                            }
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Unit</label>
                          <select
                            value={pkg.pricingUnit}
                            onChange={(event) =>
                              updatePackage(pkg.id, {
                                pricingUnit: event.target.value,
                              })
                            }
                            className={fieldClass}
                          >
                            {PARTNER_SERVICE_PRICING_UNITS.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>
                            Description (optional)
                          </label>
                          <input
                            value={pkg.description ?? ""}
                            onChange={(event) =>
                              updatePackage(pkg.id, {
                                description: event.target.value,
                              })
                            }
                            className={fieldClass}
                            placeholder="What’s included"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="font-outfit text-[14px] font-semibold text-midnight-party">
                            {pkg.name}
                          </p>
                          <p className="font-outfit text-[13px] font-semibold text-midnight-party">
                            {formatPartnerServicePrice(
                              pkg.priceGhs,
                              pkg.pricingUnit,
                            )}
                          </p>
                        </div>
                        {pkg.description ? (
                          <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/55">
                            {pkg.description}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <SectionCard
            title="Service image"
            description="Primary photo for your listing."
          >
            <ServiceImagePicker
              image={draft.image}
              editable={isEditable}
              onChange={(image) => updateDraft("image", image)}
              onError={setError}
            />
          </SectionCard>

          <SectionCard
            title="Status & availability"
            description="Control listing visibility and booking readiness."
          >
            {isEditable ? (
              <div className="grid gap-3">
                <div>
                  <label htmlFor={`${formId}-status`} className={labelClass}>
                    Status
                  </label>
                  <select
                    id={`${formId}-status`}
                    value={draft.status}
                    onChange={(event) =>
                      updateDraft(
                        "status",
                        event.target.value as PartnerServiceStatus,
                      )
                    }
                    className={fieldClass}
                  >
                    {PARTNER_SERVICE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {partnerServiceStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 font-outfit text-[12px] text-midnight-party/45">
                    {partnerServiceStatusHint(draft.status)}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor={`${formId}-availability`}
                    className={labelClass}
                  >
                    Availability
                  </label>
                  <select
                    id={`${formId}-availability`}
                    value={draft.availability}
                    onChange={(event) =>
                      updateDraft(
                        "availability",
                        event.target.value as PartnerServiceAvailability,
                      )
                    }
                    className={fieldClass}
                  >
                    {PARTNER_SERVICE_AVAILABILITIES.map((availability) => (
                      <option key={availability} value={availability}>
                        {partnerServiceAvailabilityLabel(availability)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor={`${formId}-availability-notes`}
                    className={labelClass}
                  >
                    Availability notes
                  </label>
                  <input
                    id={`${formId}-availability-notes`}
                    value={draft.availabilityNotes}
                    onChange={(event) =>
                      updateDraft("availabilityNotes", event.target.value)
                    }
                    className={fieldClass}
                    placeholder="e.g. Fri–Sun · Greater Accra"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <ServiceStatusBadge status={draft.status} />
                  <ServiceAvailabilityBadge availability={draft.availability} />
                </div>
                <ReadOnlyField
                  label="Availability notes"
                  value={draft.availabilityNotes}
                />
                {service ? (
                  <ReadOnlyField
                    label="Last updated"
                    value={formatPartnerServiceUpdatedAt(service.updatedAt)}
                  />
                ) : null}
              </div>
            )}
          </SectionCard>
        </div>
      </form>
    </main>
  );
}
