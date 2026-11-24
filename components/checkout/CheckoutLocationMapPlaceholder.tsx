import { MapPin } from "lucide-react";
import type { SelectedCheckoutLocation } from "@/types/checkout";

type CheckoutLocationMapPlaceholderProps = {
  location: SelectedCheckoutLocation | null;
};

/**
 * Visual map stand-in until a real map SDK is integrated.
 * Does not render tiles or call map/geocoding services.
 */
export function CheckoutLocationMapPlaceholder({
  location,
}: CheckoutLocationMapPlaceholderProps) {
  const hasPin = Boolean(location);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-midnight-party/10 bg-[linear-gradient(145deg,#f3eef2_0%,#e8f7f6_45%,#fff6d6_100%)]"
      aria-hidden={!hasPin}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[12%] top-[28%] h-px w-[76%] bg-midnight-party/15" />
        <div className="absolute left-[18%] top-[52%] h-px w-[64%] bg-midnight-party/12" />
        <div className="absolute left-[30%] top-[18%] h-[64%] w-px bg-midnight-party/12" />
        <div className="absolute left-[58%] top-[22%] h-[58%] w-px bg-midnight-party/10" />
        <div className="absolute left-[20%] top-[40%] h-16 w-24 rounded-full border border-lilac-luster/20" />
        <div className="absolute right-[18%] top-[30%] h-20 w-20 rounded-full border border-blue-lagoon/25" />
      </div>

      <div className="relative flex min-h-[10.5rem] flex-col items-center justify-center px-4 py-8 sm:min-h-[12rem]">
        <span
          className={`inline-flex h-12 w-12 items-center justify-center rounded-full shadow-[0_8px_20px_rgba(51,16,56,0.18)] transition ${
            hasPin
              ? "bg-radiant-rose text-white"
              : "bg-white/80 text-midnight-party/40"
          }`}
        >
          <MapPin size={22} aria-hidden="true" />
        </span>
        <p className="mt-3 max-w-xs text-center font-outfit text-sm font-semibold text-midnight-party">
          {hasPin ? location?.title : "Select a location to drop the pin"}
        </p>
        <p className="mt-1 max-w-sm text-center font-outfit text-xs text-midnight-party/55">
          {hasPin
            ? location?.subtitle
            : "Map preview placeholder — live map comes with the location provider."}
        </p>
        {hasPin &&
        location?.latitude != null &&
        location?.longitude != null ? (
          <p className="mt-2 font-outfit text-[11px] tabular-nums text-midnight-party/45">
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
