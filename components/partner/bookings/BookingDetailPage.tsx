"use client";

import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  formatPartnerBookingEventDate,
  formatPartnerBookingPrice,
  formatPartnerBookingUpdatedAt,
  partnerBookingStatusHint,
} from "@/lib/data/partner-bookings";
import { usePartnerBookings } from "@/lib/partner/bookings-context";
import {
  BookingConfirmModal,
  BookingDeclineModal,
} from "./BookingActionModals";
import { BookingStatusBadge } from "./BookingStatusBadge";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

const labelClass =
  "mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45";

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

export function BookingDetailPage({ bookingId }: { bookingId: string }) {
  const { getBooking, ready, updateBookingStatus } = usePartnerBookings();
  const booking = getBooking(bookingId);

  const [notice, setNotice] = useState<string | null>(null);
  const [dialog, setDialog] = useState<"confirm" | "decline" | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!ready) {
    return (
      <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-black/5 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party" />
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="mx-auto flex w-full min-w-0 max-w-[900px] flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <article className={`${cardClass} p-6 sm:p-8`}>
          <h1 className="font-oswald text-[1.7rem] font-bold uppercase tracking-wide text-midnight-party">
            Booking not found
          </h1>
          <p className="mt-3 font-outfit text-[14px] text-midnight-party/65">
            This booking is not in your workspace listings, or it may have been
            removed from this browser session.
          </p>
          <Link
            href="/partner/bookings"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to Bookings
          </Link>
        </article>
      </main>
    );
  }

  const isPending = booking.status === "pending";
  const currentBookingId = booking.id;

  function handleConfirm() {
    const updated = updateBookingStatus(currentBookingId, "confirmed");
    setDialog(null);
    if (updated) {
      setNotice(`Booking #${updated.reference} confirmed.`);
    }
  }

  function handleDecline() {
    const updated = updateBookingStatus(currentBookingId, "declined");
    setDialog(null);
    if (updated) {
      setNotice(`Booking #${updated.reference} declined.`);
    }
  }

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <nav className="mb-2 flex flex-wrap items-center gap-1.5 font-outfit text-[12px] text-midnight-party/45">
            <Link
              href="/partner/bookings"
              className="transition hover:text-lilac-luster"
            >
              Bookings
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="text-midnight-party/70">#{booking.reference}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
              #{booking.reference}
            </h1>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="mt-1.5 max-w-2xl font-outfit text-[13px] leading-relaxed text-midnight-party/60">
            {booking.eventType} · {booking.serviceName} ·{" "}
            {formatPartnerBookingEventDate(booking.eventDate)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/partner/bookings"
            className="inline-flex items-center gap-2 rounded-full border border-midnight-party/15 bg-white px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </Link>
          {isPending ? (
            <>
              <button
                type="button"
                onClick={() => setDialog("decline")}
                className="inline-flex items-center gap-2 rounded-full border border-radiant-rose/25 bg-white px-4 py-2.5 font-outfit text-[13px] font-semibold text-radiant-rose transition hover:bg-radiant-rose/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
              >
                <X size={15} aria-hidden="true" />
                Decline
              </button>
              <button
                type="button"
                onClick={() => setDialog("confirm")}
                className="inline-flex items-center gap-2 rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
              >
                <Check size={15} aria-hidden="true" />
                Confirm
              </button>
            </>
          ) : null}
        </div>
      </div>

      {notice ? (
        <div
          role="status"
          className="rounded-xl border border-lilac-luster/25 bg-lilac-luster/5 px-4 py-3 font-outfit text-[13px] text-midnight-party"
        >
          {notice}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex min-w-0 flex-col gap-4">
          <SectionCard
            title="Event details"
            description="When and where this celebration is happening."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ReadOnlyField label="Event type" value={booking.eventType} />
              <ReadOnlyField
                label="Date"
                value={formatPartnerBookingEventDate(booking.eventDate)}
              />
              <ReadOnlyField label="Time" value={booking.eventTime} />
              <ReadOnlyField
                label="Guest count"
                value={`${booking.guestCount} guests`}
              />
              <div className="sm:col-span-2">
                <ReadOnlyField label="Location" value={booking.location} />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Service & package"
            description="What the host booked from your offerings."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ReadOnlyField label="Service" value={booking.serviceName} />
              <ReadOnlyField label="Package" value={booking.packageName} />
              <ReadOnlyField
                label="Price"
                value={formatPartnerBookingPrice(booking.priceGhs)}
              />
              <ReadOnlyField
                label="Status"
                value={<BookingStatusBadge status={booking.status} />}
              />
            </div>
            <p className="mt-3 font-outfit text-[12.5px] text-midnight-party/50">
              {partnerBookingStatusHint(booking.status)}
            </p>
          </SectionCard>

          <SectionCard title="Special requests">
            <div className="rounded-xl border border-black/5 bg-[#fbf8fa] px-3.5 py-3 font-outfit text-[13.5px] text-midnight-party">
              {booking.specialRequests.trim()
                ? booking.specialRequests
                : "No special requests noted."}
            </div>
          </SectionCard>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <SectionCard
            title="Customer contact"
            description="Reach the host if you need to coordinate."
          >
            <div className="space-y-3">
              <ReadOnlyField label="Name" value={booking.customer.name} />
              <ReadOnlyField
                label="Email"
                value={
                  <a
                    href={`mailto:${booking.customer.email}`}
                    className="text-lilac-luster transition hover:text-radiant-rose"
                  >
                    {booking.customer.email}
                  </a>
                }
              />
              <ReadOnlyField
                label="Phone"
                value={
                  <a
                    href={`tel:${booking.customer.phone.replace(/\s+/g, "")}`}
                    className="text-lilac-luster transition hover:text-radiant-rose"
                  >
                    {booking.customer.phone}
                  </a>
                }
              />
            </div>
          </SectionCard>

          <SectionCard title="Record">
            <div className="space-y-3">
              <ReadOnlyField
                label="Reference"
                value={`#${booking.reference}`}
              />
              <ReadOnlyField
                label="Requested"
                value={formatPartnerBookingUpdatedAt(booking.createdAt)}
              />
              <ReadOnlyField
                label="Last updated"
                value={formatPartnerBookingUpdatedAt(booking.updatedAt)}
              />
            </div>
          </SectionCard>

          {isPending ? (
            <SectionCard
              title="Respond"
              description="Pending bookings need your confirmation."
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setDialog("confirm")}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
                >
                  <Check size={15} aria-hidden="true" />
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setDialog("decline")}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-radiant-rose/25 px-4 py-2.5 font-outfit text-[13px] font-semibold text-radiant-rose transition hover:bg-radiant-rose/8"
                >
                  <X size={15} aria-hidden="true" />
                  Decline
                </button>
              </div>
            </SectionCard>
          ) : null}
        </div>
      </div>

      {dialog === "confirm" ? (
        <BookingConfirmModal
          booking={booking}
          onClose={() => setDialog(null)}
          onConfirm={handleConfirm}
        />
      ) : null}

      {dialog === "decline" ? (
        <BookingDeclineModal
          booking={booking}
          onClose={() => setDialog(null)}
          onDecline={handleDecline}
        />
      ) : null}
    </main>
  );
}
