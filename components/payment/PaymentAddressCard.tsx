import Link from "next/link";
import { MapPin, PencilLine } from "lucide-react";
import type { CheckoutSession } from "@/types/checkout";
import { formatCheckoutAddressLines } from "@/lib/checkout/checkout-session";
import { DELIVERY_TIME_PENDING_MESSAGE } from "@/lib/checkout/delivery-quote";

type PaymentAddressCardProps = {
  session: CheckoutSession;
};

export function PaymentAddressCard({ session }: PaymentAddressCardProps) {
  const lines = formatCheckoutAddressLines(session.address);

  return (
    <section
      aria-labelledby="payment-address-heading"
      className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[8px_8px_0_0_rgba(109,0,255,0.08)] sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-lagoon/15 text-blue-lagoon">
            <MapPin size={18} aria-hidden="true" />
          </span>
          <div>
            <h2
              id="payment-address-heading"
              className="font-oswald text-xl font-semibold uppercase tracking-wide text-midnight-party"
            >
              Delivery address
            </h2>
            <p className="mt-1 font-outfit text-xs font-semibold uppercase tracking-wide text-blue-lagoon">
              {session.address.label}
              {session.location.title ? ` · ${session.location.title}` : ""}
            </p>
          </div>
        </div>
        <Link
          href="/checkout"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-midnight-party/15 bg-white px-3.5 py-2 font-outfit text-xs font-semibold uppercase tracking-wide text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        >
          <PencilLine size={14} aria-hidden="true" />
          Edit address
        </Link>
      </div>

      <div className="mt-4 space-y-1 font-outfit text-sm text-midnight-party">
        <p className="font-semibold">{session.address.recipientName}</p>
        <p className="text-midnight-party/70">{session.address.phone}</p>
        {lines.map((line) => (
          <p key={line} className="text-midnight-party/75">
            {line}
          </p>
        ))}
        {session.address.deliveryInstructions.trim() ? (
          <p className="pt-2 text-midnight-party/60">
            Note: {session.address.deliveryInstructions.trim()}
          </p>
        ) : null}
      </div>

      <dl className="mt-4 grid gap-3 border-t border-black/10 pt-4 sm:grid-cols-2">
        <div>
          <dt className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
            Delivery fee
          </dt>
          <dd className="mt-1 font-outfit text-sm font-semibold text-midnight-party">
            {session.quote.feeLabel}
          </dd>
        </div>
        <div>
          <dt className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
            Delivery time
          </dt>
          <dd className="mt-1 font-outfit text-sm font-semibold leading-snug text-midnight-party">
            {DELIVERY_TIME_PENDING_MESSAGE}
          </dd>
        </div>
      </dl>
    </section>
  );
}
