"use client";

import Link from "next/link";
import {
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  formatPartnerServicePrice,
  serviceToEditInput,
} from "@/lib/data/partner-services";
import { usePartnerServices } from "@/lib/partner/services-context";
import type {
  PartnerService,
  PartnerServicePackage,
} from "@/types/partner-services";
import { ServiceStatusBadge } from "@/components/partner/services/ServiceStatusBadge";
import {
  PackageFormModal,
  RemovePackageModal,
  StartingPriceModal,
  type PackageFormValues,
} from "./PricingActionModals";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

type PackageRow = {
  key: string;
  service: PartnerService;
  pkg: PartnerServicePackage;
};

type PricingDialog =
  | { type: "edit-package"; serviceId: string; packageId: string }
  | { type: "add-package"; serviceId: string }
  | { type: "remove-package"; serviceId: string; packageId: string }
  | { type: "starting-price"; serviceId: string };

function PackageActionsMenu({
  onEdit,
  onRemove,
}: {
  onEdit: () => void;
  onRemove: () => void;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreHorizontal size={15} aria-hidden="true" />
        <span className="sr-only">Package actions</span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 bottom-full z-30 mb-1 w-44 overflow-hidden rounded-xl border border-black/8 bg-white py-1 shadow-[0_12px_28px_rgba(51,16,56,0.12)]"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            <Pencil size={14} aria-hidden="true" />
            Edit package
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-radiant-rose transition hover:bg-radiant-rose/8"
            onClick={() => {
              setOpen(false);
              onRemove();
            }}
          >
            <Trash2 size={14} aria-hidden="true" />
            Remove package
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function PartnerPricingPage() {
  const searchId = useId();
  const serviceFilterId = useId();
  const addServiceId = useId();
  const { services, ready, updateService } = usePartnerServices();

  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string | "all">("all");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [dialog, setDialog] = useState<PricingDialog | null>(null);
  const [addServiceChoice, setAddServiceChoice] = useState("");

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setLoading(false), 280);
    return () => window.clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (serviceFilter !== "all" && !services.some((s) => s.id === serviceFilter)) {
      setServiceFilter("all");
    }
  }, [serviceFilter, services]);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const flattened: PackageRow[] = [];

    for (const service of services) {
      if (serviceFilter !== "all" && service.id !== serviceFilter) continue;
      for (const pkg of service.packages) {
        if (query) {
          const haystack = [
            pkg.name,
            pkg.description ?? "",
            service.name,
            service.category,
            pkg.pricingUnit,
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(query)) continue;
        }
        flattened.push({
          key: `${service.id}:${pkg.id}`,
          service,
          pkg,
        });
      }
    }

    return flattened.sort((a, b) => {
      const byService = a.service.name.localeCompare(b.service.name);
      if (byService !== 0) return byService;
      return a.pkg.name.localeCompare(b.pkg.name);
    });
  }, [services, search, serviceFilter]);

  const sortedServices = useMemo(
    () => [...services].sort((a, b) => a.name.localeCompare(b.name)),
    [services],
  );

  function saveServiceUpdate(
    service: PartnerService,
    next: ReturnType<typeof serviceToEditInput>,
    successMessage: string,
  ): string | null {
    const updated = updateService(service.id, next);
    if (!updated) {
      return "Could not save changes to this service.";
    }
    setDialog(null);
    setNotice(successMessage);
    return null;
  }

  function handleSavePackage(
    service: PartnerService,
    packageId: string | null,
    values: PackageFormValues,
  ): string | null {
    const input = serviceToEditInput(service);
    if (packageId) {
      input.packages = input.packages.map((pkg) =>
        pkg.id === packageId
          ? {
              ...pkg,
              name: values.name,
              description: values.description || undefined,
              priceGhs: values.priceGhs,
              pricingUnit: values.pricingUnit,
            }
          : pkg,
      );
    } else {
      input.packages = [
        ...input.packages,
        {
          id: `temp-${Date.now()}`,
          name: values.name,
          description: values.description || undefined,
          priceGhs: values.priceGhs,
          pricingUnit: values.pricingUnit,
        },
      ];
    }

    return saveServiceUpdate(
      service,
      input,
      packageId
        ? `Updated package “${values.name}”.`
        : `Added package “${values.name}” to ${service.name}.`,
    );
  }

  function handleRemovePackage(service: PartnerService, packageId: string) {
    if (service.packages.length <= 1) return;
    const input = serviceToEditInput(service);
    const removed = input.packages.find((pkg) => pkg.id === packageId);
    input.packages = input.packages.filter((pkg) => pkg.id !== packageId);
    saveServiceUpdate(
      service,
      input,
      removed
        ? `Removed package “${removed.name}” from ${service.name}.`
        : `Removed package from ${service.name}.`,
    );
  }

  function handleStartingPrice(
    service: PartnerService,
    priceGhs: number,
    pricingUnit: string,
  ): string | null {
    const input = serviceToEditInput(service);
    input.priceGhs = priceGhs;
    input.pricingUnit = pricingUnit;
    return saveServiceUpdate(
      service,
      input,
      `Updated starting price for “${service.name}”.`,
    );
  }

  function openAddPackage() {
    const targetId =
      addServiceChoice ||
      (serviceFilter !== "all" ? serviceFilter : sortedServices[0]?.id);
    if (!targetId) {
      setNotice("Add a service in My Services before creating packages.");
      return;
    }
    setDialog({ type: "add-package", serviceId: targetId });
  }

  const activeService = dialog
    ? services.find((service) => service.id === dialog.serviceId)
    : undefined;

  const activePackage =
    activeService &&
    dialog &&
    (dialog.type === "edit-package" || dialog.type === "remove-package")
      ? activeService.packages.find((pkg) => pkg.id === dialog.packageId)
      : undefined;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
            Pricing &amp; Packages
          </h1>
          <p className="mt-1.5 max-w-2xl font-outfit text-[13px] leading-relaxed text-midnight-party/60 sm:text-[14px]">
            Keep package prices current across your services. Changes save to
            the same My Services catalogue in this browser.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddPackage}
          disabled={sortedServices.length === 0}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster disabled:cursor-not-allowed disabled:opacity-45 sm:px-5"
        >
          <Plus size={16} aria-hidden="true" />
          Add package
        </button>
      </div>

      {notice ? (
        <div
          role="status"
          className="rounded-xl border border-lilac-luster/25 bg-lilac-luster/5 px-4 py-3 font-outfit text-[13px] text-midnight-party"
        >
          {notice}
        </div>
      ) : null}

      <section className={`${cardClass} p-4 sm:p-5`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <label
              htmlFor={searchId}
              className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
            >
              Search packages
            </label>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-midnight-party/40"
                aria-hidden="true"
              />
              <input
                id={searchId}
                type="search"
                value={search}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by package, service or unit"
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] py-2.5 pl-10 pr-3 font-outfit text-[13px] text-midnight-party outline-none transition placeholder:text-midnight-party/35 focus:border-lilac-luster/40 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[420px]">
            <div>
              <label
                htmlFor={serviceFilterId}
                className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
              >
                Service
              </label>
              <select
                id={serviceFilterId}
                value={serviceFilter}
                onChange={(event) =>
                  setServiceFilter(
                    event.target.value === "all" ? "all" : event.target.value,
                  )
                }
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
              >
                <option value="all">All services</option>
                {sortedServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor={addServiceId}
                className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
              >
                Add package to
              </label>
              <select
                id={addServiceId}
                value={addServiceChoice}
                onChange={(event) => setAddServiceChoice(event.target.value)}
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
              >
                <option value="">Default selection</option>
                {sortedServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className={`${cardClass} overflow-visible`}>
        <div className="border-b border-black/5 px-4 py-3 sm:px-5">
          <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party">
            Packages
          </h2>
          <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/50">
            {rows.length} package{rows.length === 1 ? "" : "s"} across your
            services
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-offwhite text-midnight-party">
              <Tag size={22} aria-hidden="true" />
            </span>
            <h3 className="font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party">
              No packages found
            </h3>
            <p className="max-w-md font-outfit text-[13px] text-midnight-party/55">
              {services.length === 0
                ? "Create a service in My Services first, then add packages here."
                : "Try a different search or service filter."}
            </p>
            {services.length === 0 ? (
              <Link
                href="/partner/services/new"
                className="mt-1 inline-flex items-center gap-2 rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
              >
                <Plus size={15} aria-hidden="true" />
                Add service
              </Link>
            ) : null}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/5 bg-[#fbf8fa]">
                    <th className="px-5 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Package
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Service
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Price
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Unit
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Status
                    </th>
                    <th className="px-5 py-3 text-right font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ key, service, pkg }) => (
                    <tr key={key} className="border-b border-black/5">
                      <td className="px-5 py-3.5">
                        <p className="font-outfit text-[13.5px] font-semibold text-midnight-party">
                          {pkg.name}
                        </p>
                        {pkg.description ? (
                          <p className="mt-0.5 line-clamp-1 font-outfit text-[12px] text-midnight-party/50">
                            {pkg.description}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/partner/services/${service.id}`}
                          className="font-outfit text-[13px] font-medium text-lilac-luster transition hover:text-radiant-rose"
                        >
                          {service.name}
                        </Link>
                        <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/45">
                          {service.category}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 font-outfit text-[13px] font-semibold text-midnight-party">
                        {formatPartnerServicePrice(pkg.priceGhs)}
                      </td>
                      <td className="px-4 py-3.5 font-outfit text-[13px] text-midnight-party">
                        {pkg.pricingUnit}
                      </td>
                      <td className="px-4 py-3.5">
                        <ServiceStatusBadge status={service.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end">
                          <PackageActionsMenu
                            onEdit={() =>
                              setDialog({
                                type: "edit-package",
                                serviceId: service.id,
                                packageId: pkg.id,
                              })
                            }
                            onRemove={() =>
                              setDialog({
                                type: "remove-package",
                                serviceId: service.id,
                                packageId: pkg.id,
                              })
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-black/5 xl:hidden">
              {rows.map(({ key, service, pkg }) => (
                <li key={key} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-outfit text-[14px] font-semibold text-midnight-party">
                          {pkg.name}
                        </p>
                        <ServiceStatusBadge status={service.status} />
                      </div>
                      <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/55">
                        {service.name}
                      </p>
                      <p className="mt-2 font-outfit text-[13px] font-semibold text-midnight-party">
                        {formatPartnerServicePrice(
                          pkg.priceGhs,
                          pkg.pricingUnit,
                        )}
                      </p>
                    </div>
                    <PackageActionsMenu
                      onEdit={() =>
                        setDialog({
                          type: "edit-package",
                          serviceId: service.id,
                          packageId: pkg.id,
                        })
                      }
                      onRemove={() =>
                        setDialog({
                          type: "remove-package",
                          serviceId: service.id,
                          packageId: pkg.id,
                        })
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-black/5 px-4 py-3 sm:px-5">
          <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party">
            Service starting prices
          </h2>
          <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/50">
            Base “from” price shown on your service listings
          </p>
        </div>
        {sortedServices.length === 0 ? (
          <p className="px-4 py-8 text-center font-outfit text-[13px] text-midnight-party/50 sm:px-5">
            No services yet.
          </p>
        ) : (
          <ul className="divide-y divide-black/5">
            {sortedServices.map((service) => (
              <li
                key={service.id}
                className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-outfit text-[14px] font-semibold text-midnight-party">
                      {service.name}
                    </p>
                    <ServiceStatusBadge status={service.status} />
                  </div>
                  <p className="mt-1 font-outfit text-[13px] text-midnight-party/65">
                    {formatPartnerServicePrice(
                      service.priceGhs,
                      service.pricingUnit,
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDialog({
                      type: "starting-price",
                      serviceId: service.id,
                    })
                  }
                  className="inline-flex items-center gap-1.5 self-start rounded-full border border-midnight-party/15 px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
                >
                  <Pencil size={14} aria-hidden="true" />
                  Edit starting price
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {dialog?.type === "edit-package" && activeService && activePackage ? (
        <PackageFormModal
          title="Edit package"
          serviceName={activeService.name}
          initial={{
            name: activePackage.name,
            description: activePackage.description ?? "",
            priceGhs: activePackage.priceGhs,
            pricingUnit: activePackage.pricingUnit,
          }}
          onClose={() => setDialog(null)}
          onSave={(values) =>
            handleSavePackage(activeService, activePackage.id, values)
          }
        />
      ) : null}

      {dialog?.type === "add-package" && activeService ? (
        <PackageFormModal
          title="Add package"
          serviceName={activeService.name}
          initial={{
            name: "",
            description: "",
            priceGhs: activeService.priceGhs,
            pricingUnit: activeService.pricingUnit || "event",
          }}
          onClose={() => setDialog(null)}
          onSave={(values) => handleSavePackage(activeService, null, values)}
        />
      ) : null}

      {dialog?.type === "remove-package" && activeService && activePackage ? (
        <RemovePackageModal
          service={activeService}
          pkg={activePackage}
          onClose={() => setDialog(null)}
          onConfirm={() =>
            handleRemovePackage(activeService, activePackage.id)
          }
        />
      ) : null}

      {dialog?.type === "starting-price" && activeService ? (
        <StartingPriceModal
          service={activeService}
          onClose={() => setDialog(null)}
          onSave={(priceGhs, pricingUnit) =>
            handleStartingPrice(activeService, priceGhs, pricingUnit)
          }
        />
      ) : null}
    </main>
  );
}
