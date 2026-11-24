import { CheckCircle2, PencilLine } from "lucide-react";
import type { SelectedCheckoutLocation } from "@/types/checkout";

type CheckoutSelectedLocationCardProps = {
  location: SelectedCheckoutLocation;
  onChangeLocation: () => void;
};

function MetaRow({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <dt className="font-outfit text-[10px] font-semibold uppercase tracking-wide text-midnight-party/45">
        {label}
      </dt>
      <dd className="mt-0.5 font-outfit text-sm font-semibold text-midnight-party">
        {value}
      </dd>
    </div>
  );
}

export function CheckoutSelectedLocationCard({
  location,
  onChangeLocation,
}: CheckoutSelectedLocationCardProps) {
  const sourceLabel =
    location.source === "device"
      ? "Current location"
      : location.source === "manual"
        ? "Entered manually"
        : "Selected location";

  const hasStructuredMeta = Boolean(
    location.area || location.city || location.region || location.countryName,
  );

  return (
    <div className="rounded-2xl border border-blue-lagoon/25 bg-blue-lagoon/10 px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-blue-lagoon"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-blue-lagoon">
              {sourceLabel}
            </p>
            <p className="mt-0.5 font-outfit text-sm font-semibold text-midnight-party sm:text-base">
              {location.title}
            </p>
            <p className="mt-0.5 font-outfit text-xs leading-relaxed text-midnight-party/60">
              {location.subtitle}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onChangeLocation}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-midnight-party/15 bg-white px-3.5 py-2 font-outfit text-xs font-semibold uppercase tracking-wide text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        >
          <PencilLine size={14} aria-hidden="true" />
          Change location
        </button>
      </div>

      {hasStructuredMeta ? (
        <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-blue-lagoon/20 pt-3 sm:grid-cols-4">
          <MetaRow label="Area" value={location.area} />
          <MetaRow label="City" value={location.city} />
          <MetaRow label="Region" value={location.region} />
          <MetaRow label="Country" value={location.countryName} />
        </dl>
      ) : null}
    </div>
  );
}
