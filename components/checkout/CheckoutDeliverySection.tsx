import { Clock, MapPin, Truck } from "lucide-react";
import type { DeliveryQuotePlaceholder } from "@/types/checkout";
import { DELIVERY_TIME_PENDING_MESSAGE } from "@/lib/checkout/delivery-quote";

type CheckoutDeliverySectionProps = {
  quote: DeliveryQuotePlaceholder;
};

export function CheckoutDeliverySection({
  quote,
}: CheckoutDeliverySectionProps) {
  const isError = quote.status === "error";
  const isUnavailable = quote.status === "unavailable";
  const isLoading = quote.status === "loading";
  const isQuoted = quote.status === "quoted";
  const showAlert = isError || isUnavailable;

  return (
    <section
      aria-labelledby="checkout-delivery-heading"
      className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[8px_8px_0_0_rgba(109,0,255,0.08)] sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-lagoon/15 text-blue-lagoon">
          <Truck size={20} aria-hidden="true" />
        </span>
        <div>
          <h2
            id="checkout-delivery-heading"
            className="font-oswald text-xl font-semibold uppercase tracking-wide text-midnight-party"
          >
            Delivery
          </h2>
          <p className="mt-1 font-outfit text-sm text-midnight-party/65">
            Delivery fee depends on your address. Timing is confirmed after
            order review.
          </p>
        </div>
      </div>

      {showAlert ? (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-radiant-rose/30 bg-radiant-rose/10 px-3.5 py-3 font-outfit text-sm text-midnight-party"
        >
          {quote.errorMessage ??
            (isUnavailable
              ? "Delivery isn’t available for this location."
              : "We couldn't check delivery for this address. Try again shortly.")}
        </div>
      ) : null}

      {isLoading ? (
        <div
          className="mt-5 space-y-3"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="h-12 animate-pulse rounded-xl bg-midnight-party/8" />
          <div className="h-12 animate-pulse rounded-xl bg-midnight-party/8" />
          <p className="font-outfit text-sm text-midnight-party/55">
            Calculating delivery fee…
          </p>
        </div>
      ) : (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dashed border-midnight-party/15 bg-[#fbf8fa] px-4 py-3.5">
            <dt className="flex items-center gap-2 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/50">
              <MapPin size={14} aria-hidden="true" />
              Delivery fee
            </dt>
            <dd className="mt-1.5 font-outfit text-base font-semibold text-midnight-party">
              {isQuoted && quote.feeLabel
                ? quote.feeLabel
                : isUnavailable
                  ? "Unavailable"
                  : "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-dashed border-midnight-party/15 bg-[#fbf8fa] px-4 py-3.5">
            <dt className="flex items-center gap-2 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/50">
              <Clock size={14} aria-hidden="true" />
              Delivery time
            </dt>
            <dd className="mt-1.5 font-outfit text-sm font-semibold leading-snug text-midnight-party">
              {isUnavailable ? "—" : DELIVERY_TIME_PENDING_MESSAGE}
            </dd>
          </div>
        </dl>
      )}

      {!isLoading && !showAlert ? (
        <p className="mt-4 font-outfit text-sm leading-relaxed text-midnight-party/60">
          {quote.message ??
            (quote.status === "needs_address"
              ? "Select a delivery location so we can calculate a delivery fee."
              : "Delivery fee will appear after your location is selected.")}
        </p>
      ) : null}

      {isQuoted && quote.message ? (
        <p className="mt-4 font-outfit text-sm leading-relaxed text-midnight-party/60">
          {quote.message}
        </p>
      ) : null}
    </section>
  );
}
