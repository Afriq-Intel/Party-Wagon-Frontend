"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  formatPartnerBookingEventDate,
  formatPartnerBookingPrice,
  PARTNER_BOOKINGS_PAGE_SIZE,
  partnerBookingStatusLabel,
} from "@/lib/data/partner-bookings";
import {
  filterPartnerBookings,
  paginatePartnerBookings,
} from "@/lib/partner/filter-bookings";
import { usePartnerBookings } from "@/lib/partner/bookings-context";
import type {
  PartnerBooking,
  PartnerBookingStatus,
} from "@/types/partner-bookings";
import {
  BookingConfirmModal,
  BookingDeclineModal,
} from "./BookingActionModals";
import { BookingStatusBadge } from "./BookingStatusBadge";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

type StatusFilter = PartnerBookingStatus | "all";

type BookingDialog =
  | { type: "confirm"; bookingId: string }
  | { type: "decline"; bookingId: string };

function BookingActionsMenu({
  booking,
  onConfirm,
  onDecline,
}: {
  booking: PartnerBooking;
  onConfirm: () => void;
  onDecline: () => void;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const isPending = booking.status === "pending";

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
    <div className="relative flex items-center justify-end gap-1" ref={rootRef}>
      <Link
        href={`/partner/bookings/${booking.id}`}
        title="View booking"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        <Eye size={15} aria-hidden="true" />
        <span className="sr-only">View {booking.reference}</span>
      </Link>

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <MoreHorizontal size={15} aria-hidden="true" />
        <span className="sr-only">More actions for {booking.reference}</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 bottom-full z-30 mb-1 w-48 overflow-hidden rounded-xl border border-black/8 bg-white py-1 shadow-[0_12px_28px_rgba(51,16,56,0.12)]"
        >
          <Link
            href={`/partner/bookings/${booking.id}`}
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
            onClick={() => setOpen(false)}
          >
            <Eye size={14} aria-hidden="true" />
            View details
          </Link>
          {isPending ? (
            <>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
                onClick={() => {
                  setOpen(false);
                  onConfirm();
                }}
              >
                <Check size={14} aria-hidden="true" />
                Confirm
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-radiant-rose transition hover:bg-radiant-rose/8"
                onClick={() => {
                  setOpen(false);
                  onDecline();
                }}
              >
                <X size={14} aria-hidden="true" />
                Decline
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function PartnerBookingsPage() {
  const router = useRouter();
  const searchId = useId();
  const { bookings, ready, updateBookingStatus } = usePartnerBookings();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [dialog, setDialog] = useState<BookingDialog | null>(null);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filtered = filterPartnerBookings(bookings, { search, status });
  const paged = paginatePartnerBookings(
    filtered,
    page,
    PARTNER_BOOKINGS_PAGE_SIZE,
  );

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    declined: bookings.filter((b) => b.status === "declined").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const activeBooking = dialog
    ? (bookings.find((booking) => booking.id === dialog.bookingId) ?? null)
    : null;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatusFilter(value: StatusFilter) {
    setStatus(value);
    setPage(1);
  }

  function handleConfirm(bookingId: string) {
    const updated = updateBookingStatus(bookingId, "confirmed");
    setDialog(null);
    if (updated) {
      setNotice(`Booking #${updated.reference} confirmed.`);
    }
  }

  function handleDecline(bookingId: string) {
    const updated = updateBookingStatus(bookingId, "declined");
    setDialog(null);
    if (updated) {
      setNotice(`Booking #${updated.reference} declined.`);
    }
  }

  const rangeStart =
    paged.totalItems === 0 ? 0 : (paged.page - 1) * paged.pageSize + 1;
  const rangeEnd = Math.min(paged.page * paged.pageSize, paged.totalItems);

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="min-w-0">
        <h1 className="font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
          Bookings
        </h1>
        <p className="mt-1.5 max-w-2xl font-outfit text-[13px] leading-relaxed text-midnight-party/60 sm:text-[14px]">
          Confirm and manage celebration bookings assigned to your team —
          service details, event timing, and guest counts in one place.
        </p>
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
        <div className="min-w-0">
          <label
            htmlFor={searchId}
            className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
          >
            Search
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
                updateSearch(event.target.value)
              }
              placeholder="Search by reference, customer, service or location"
              className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] py-2.5 pl-10 pr-3 font-outfit text-[13px] text-midnight-party outline-none transition placeholder:text-midnight-party/35 focus:border-lilac-luster/40 focus:bg-white"
            />
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Booking status filters"
          className="mt-4 flex flex-wrap gap-2"
        >
          {(
            [
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "confirmed", label: "Confirmed" },
              { id: "completed", label: "Completed" },
              { id: "declined", label: "Declined" },
              { id: "cancelled", label: "Cancelled" },
            ] as const
          ).map((entry) => {
            const selected = status === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => updateStatusFilter(entry.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-outfit text-[12.5px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${
                  selected
                    ? "bg-midnight-party text-white"
                    : "border border-midnight-party/10 bg-white text-midnight-party/70 hover:border-lilac-luster/35 hover:text-lilac-luster"
                }`}
              >
                {entry.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    selected
                      ? "bg-white/15 text-white"
                      : "bg-midnight-party/6 text-midnight-party/55"
                  }`}
                >
                  {statusCounts[entry.id]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={`${cardClass} overflow-visible`}>
        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party" />
          </div>
        ) : paged.totalItems === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-offwhite text-midnight-party">
              <CalendarDays size={22} aria-hidden="true" />
            </span>
            <h2 className="font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party">
              No bookings found
            </h2>
            <p className="max-w-md font-outfit text-[13px] text-midnight-party/55">
              {bookings.length === 0
                ? "No celebration bookings are assigned to your workspace yet."
                : "Try a different search or clear the status filter."}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto overflow-y-visible xl:block">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/5 bg-[#fbf8fa]">
                    <th className="px-5 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Reference
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Customer
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Service
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Event
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Guests
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Price
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
                  {paged.items.map((booking) => (
                    <tr
                      key={booking.id}
                      className="cursor-pointer border-b border-black/5 transition hover:bg-[#fbf8fa]/70"
                      onClick={() =>
                        router.push(`/partner/bookings/${booking.id}`)
                      }
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-outfit text-[13.5px] font-semibold text-midnight-party">
                          #{booking.reference}
                        </p>
                        <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                          {booking.eventType}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-outfit text-[13px] text-midnight-party">
                          {booking.customer.name}
                        </p>
                        <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                          {booking.customer.phone}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-outfit text-[13px] text-midnight-party">
                          {booking.serviceName}
                        </p>
                        <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                          {booking.packageName}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-outfit text-[13px] text-midnight-party">
                          {formatPartnerBookingEventDate(booking.eventDate)}
                        </p>
                        <p className="mt-0.5 max-w-[180px] truncate font-outfit text-[12px] text-midnight-party/50">
                          {booking.eventTime} · {booking.location}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 font-outfit text-[13px] text-midnight-party">
                        {booking.guestCount}
                      </td>
                      <td className="px-4 py-3.5 font-outfit text-[13px] font-semibold text-midnight-party">
                        {formatPartnerBookingPrice(booking.priceGhs)}
                      </td>
                      <td className="px-4 py-3.5">
                        <BookingStatusBadge status={booking.status} />
                      </td>
                      <td
                        className="px-5 py-3.5"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <BookingActionsMenu
                          booking={booking}
                          onConfirm={() =>
                            setDialog({
                              type: "confirm",
                              bookingId: booking.id,
                            })
                          }
                          onDecline={() =>
                            setDialog({
                              type: "decline",
                              bookingId: booking.id,
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-black/5 xl:hidden">
              {paged.items.map((booking) => (
                <li key={booking.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Link
                      href={`/partner/bookings/${booking.id}`}
                      className="min-w-0 flex-1"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-outfit text-[14px] font-semibold text-midnight-party">
                          #{booking.reference}
                        </p>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      <p className="mt-1 font-outfit text-[13px] text-midnight-party">
                        {booking.customer.name} · {booking.serviceName}
                      </p>
                      <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/55">
                        {formatPartnerBookingEventDate(booking.eventDate)} ·{" "}
                        {booking.eventTime}
                      </p>
                      <p className="mt-0.5 line-clamp-1 font-outfit text-[12px] text-midnight-party/45">
                        {booking.location} · {booking.guestCount} guests
                      </p>
                      <p className="mt-2 font-outfit text-[13px] font-semibold text-midnight-party">
                        {formatPartnerBookingPrice(booking.priceGhs)}
                      </p>
                    </Link>
                    <BookingActionsMenu
                      booking={booking}
                      onConfirm={() =>
                        setDialog({ type: "confirm", bookingId: booking.id })
                      }
                      onDecline={() =>
                        setDialog({ type: "decline", bookingId: booking.id })
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 border-t border-black/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="font-outfit text-[12.5px] text-midnight-party/55">
                Showing {rangeStart}–{rangeEnd} of {paged.totalItems}
                {status !== "all"
                  ? ` · ${partnerBookingStatusLabel(status)}`
                  : ""}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={paged.page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  <span className="sr-only">Previous page</span>
                </button>
                <span className="font-outfit text-[12.5px] text-midnight-party/60">
                  Page {paged.page} of {paged.totalPages}
                </span>
                <button
                  type="button"
                  disabled={paged.page >= paged.totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(paged.totalPages, prev + 1))
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                  <span className="sr-only">Next page</span>
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {activeBooking && dialog?.type === "confirm" ? (
        <BookingConfirmModal
          booking={activeBooking}
          onClose={() => setDialog(null)}
          onConfirm={() => handleConfirm(activeBooking.id)}
        />
      ) : null}

      {activeBooking && dialog?.type === "decline" ? (
        <BookingDeclineModal
          booking={activeBooking}
          onClose={() => setDialog(null)}
          onDecline={() => handleDecline(activeBooking.id)}
        />
      ) : null}
    </main>
  );
}
