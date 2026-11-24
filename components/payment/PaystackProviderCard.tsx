import { CreditCard, Smartphone } from "lucide-react";
import { PAYSTACK_SUPPORTED_CHANNELS } from "@/lib/payments/paystack-channels";

/**
 * Paystack branding + informational channels.
 * Method selection itself happens in Paystack Checkout after init.
 */
export function PaystackProviderCard() {
  return (
    <section
      aria-labelledby="paystack-provider-heading"
      className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[8px_8px_0_0_rgba(109,0,255,0.08)] sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.14em] text-midnight-party/45">
            Payment provider
          </p>
          <h2
            id="paystack-provider-heading"
            className="mt-1 font-oswald text-xl font-semibold uppercase tracking-wide text-midnight-party"
          >
            Paystack
          </h2>
          <p className="mt-2 max-w-xl font-outfit text-sm leading-relaxed text-midnight-party/65">
            You&apos;ll complete payment securely in Paystack Checkout. Party
            Wagon never collects card or Mobile Money PINs on this page.
          </p>
        </div>

        <div
          className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2"
          style={{ backgroundColor: "#0A2540" }}
        >
          <span
            className="font-outfit text-sm font-bold tracking-wide"
            style={{ color: "#00C3F7" }}
          >
            paystack
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
          Supported in Checkout
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {PAYSTACK_SUPPORTED_CHANNELS.map((channel) => {
            const Icon =
              channel.id === "mobile_money" ? Smartphone : CreditCard;
            return (
              <li
                key={channel.id}
                className="flex items-start gap-3 rounded-2xl border border-black/10 bg-[#fbf8fa] px-4 py-3.5"
              >
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0A2540]">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-outfit text-sm font-semibold text-midnight-party">
                    {channel.label}
                  </span>
                  <span className="mt-0.5 block font-outfit text-xs leading-relaxed text-midnight-party/60">
                    {channel.description}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 font-outfit text-xs text-midnight-party/50">
          These options are informational. Paystack Checkout will ask you to
          choose Mobile Money or Card when payment goes live.
        </p>
      </div>
    </section>
  );
}
