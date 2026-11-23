"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import {
  formatPartnerBookingEventDate,
  formatPartnerBookingPrice,
  partnerBookingStatusHint,
} from "@/lib/data/partner-bookings";
import type { PartnerBooking } from "@/types/partner-bookings";
import { BookingStatusBadge } from "./BookingStatusBadge";

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-midnight-party/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[81] flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-black/5 bg-white shadow-[0_24px_60px_rgba(51,16,56,0.22)] sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-black/5 px-4 py-3.5 sm:px-5">
          <h2
            id={titleId}
            className="font-oswald text-[1.15rem] font-bold uppercase tracking-wide text-midnight-party"
          >
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            <X size={16} aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function BookingSummaryCard({ booking }: { booking: PartnerBooking }) {
  return (
    <div className="rounded-xl border border-black/5 bg-[#fbf8fa] p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-outfit text-[14px] font-semibold text-midnight-party">
            #{booking.reference}
          </p>
          <p className="mt-0.5 font-outfit text-[12.5px] text-midnight-party/55">
            {booking.eventType} · {booking.customer.name}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>
      <p className="mt-2 font-outfit text-[12.5px] text-midnight-party/60">
        {booking.serviceName} · {formatPartnerBookingEventDate(booking.eventDate)}{" "}
        · {booking.eventTime}
      </p>
      <p className="mt-1 font-outfit text-[13px] font-semibold text-midnight-party">
        {formatPartnerBookingPrice(booking.priceGhs)}
      </p>
    </div>
  );
}

export function BookingConfirmModal({
  booking,
  onClose,
  onConfirm,
}: {
  booking: PartnerBooking;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell title="Confirm booking" onClose={onClose}>
      <BookingSummaryCard booking={booking} />
      <p className="mt-4 font-outfit text-[13px] leading-relaxed text-midnight-party/65">
        Confirm this booking so {booking.customer.name} can plan with
        confidence. Status will move to confirmed in this mock workspace.
      </p>
      <p className="mt-2 font-outfit text-[12px] text-midnight-party/45">
        {partnerBookingStatusHint("confirmed")}
      </p>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center justify-center rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        >
          Confirm booking
        </button>
      </div>
    </ModalShell>
  );
}

export function BookingDeclineModal({
  booking,
  onClose,
  onDecline,
}: {
  booking: PartnerBooking;
  onClose: () => void;
  onDecline: () => void;
}) {
  return (
    <ModalShell title="Decline booking" onClose={onClose}>
      <BookingSummaryCard booking={booking} />
      <p className="mt-4 font-outfit text-[13px] leading-relaxed text-midnight-party/65">
        Decline this request if you cannot take it. Status will move to
        declined in this mock workspace (no customer notification is sent).
      </p>
      <p className="mt-2 font-outfit text-[12px] text-midnight-party/45">
        {partnerBookingStatusHint("declined")}
      </p>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        >
          Keep pending
        </button>
        <button
          type="button"
          onClick={onDecline}
          className="inline-flex items-center justify-center rounded-full bg-radiant-rose px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-radiant-rose/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        >
          Decline booking
        </button>
      </div>
    </ModalShell>
  );
}
