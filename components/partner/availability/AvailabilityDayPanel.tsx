"use client";

import Link from "next/link";
import { Ban, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useId, useState, type FormEvent } from "react";
import {
  blockedForDate,
  bookingsForDate,
  formatAvailabilityDate,
  formatDisplayTime,
  slotsForDate,
} from "@/lib/data/partner-availability";
import { formatPartnerBookingPrice } from "@/lib/data/partner-bookings";
import { usePartnerAvailability } from "@/lib/partner/availability-context";
import { usePartnerBookings } from "@/lib/partner/bookings-context";
import type { PartnerAvailabilitySlot } from "@/types/partner-availability";
import { BookingStatusBadge } from "@/components/partner/bookings/BookingStatusBadge";

const fieldClass =
  "w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white";

const labelClass =
  "mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45";

type SlotFormState = {
  startTime: string;
  endTime: string;
  capacity: string;
};

const EMPTY_SLOT_FORM: SlotFormState = {
  startTime: "09:00",
  endTime: "17:00",
  capacity: "",
};

export function AvailabilityDayPanel({
  dateKey,
  onClose,
}: {
  dateKey: string;
  onClose: () => void;
}) {
  const formId = useId();
  const { state, addSlot, updateSlot, deleteSlot, blockDate, unblockDate } =
    usePartnerAvailability();
  const { bookings } = usePartnerBookings();

  const daySlots = slotsForDate(state.slots, dateKey);
  const dayBookings = bookingsForDate(bookings, dateKey);
  const blocked = blockedForDate(state.blockedDates, dateKey);

  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slotForm, setSlotForm] = useState<SlotFormState>(EMPTY_SLOT_FORM);
  const [blockReason, setBlockReason] = useState(blocked?.reason ?? "");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setNotice(null);
    setError(null);
    setAdding(false);
    setEditingId(null);
    setSlotForm(EMPTY_SLOT_FORM);
    setBlockReason(blocked?.reason ?? "");
    setConfirmDeleteId(null);
    // Reset panel chrome when the selected date changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally keyed by dateKey only
  }, [dateKey]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function startAdd() {
    setEditingId(null);
    setAdding(true);
    setSlotForm(EMPTY_SLOT_FORM);
    setError(null);
  }

  function startEdit(slot: PartnerAvailabilitySlot) {
    setAdding(false);
    setEditingId(slot.id);
    setSlotForm({
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity ? String(slot.capacity) : "",
    });
    setError(null);
  }

  function cancelSlotForm() {
    setAdding(false);
    setEditingId(null);
    setSlotForm(EMPTY_SLOT_FORM);
    setError(null);
  }

  function parseCapacity(value: string): number | undefined {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    return Number(trimmed);
  }

  function handleSlotSubmit(event: FormEvent) {
    event.preventDefault();
    const capacity = parseCapacity(slotForm.capacity);
    if (slotForm.capacity.trim() && (capacity === undefined || Number.isNaN(capacity))) {
      setError("Capacity must be a whole number.");
      return;
    }

    const payload = {
      date: dateKey,
      startTime: slotForm.startTime,
      endTime: slotForm.endTime,
      capacity,
    };

    if (editingId) {
      const result = updateSlot(editingId, payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setNotice("Slot updated.");
      cancelSlotForm();
      return;
    }

    const result = addSlot(payload);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setNotice("Slot added.");
    cancelSlotForm();
  }

  function handleDeleteSlot(slotId: string) {
    const removed = deleteSlot(slotId);
    setConfirmDeleteId(null);
    if (removed) {
      setNotice("Slot removed.");
      if (editingId === slotId) cancelSlotForm();
    }
  }

  function handleBlock() {
    const result = blockDate({
      date: dateKey,
      reason: blockReason,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setNotice("Date blocked. Open slots for this day were cleared.");
    cancelSlotForm();
  }

  function handleUnblock() {
    const removed = unblockDate(dateKey);
    if (removed) {
      setNotice("Date unblocked.");
      setBlockReason("");
      setError(null);
    }
  }

  return (
    <aside className="flex min-h-0 flex-col rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]">
      <div className="flex items-start justify-between gap-3 border-b border-black/5 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.16em] text-midnight-party/45">
            Selected day
          </p>
          <h2 className="mt-1 font-oswald text-[1.25rem] font-bold uppercase tracking-wide text-midnight-party">
            {formatAvailabilityDate(dateKey)}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
        >
          <X size={16} aria-hidden="true" />
          <span className="sr-only">Close day panel</span>
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5">
        {notice ? (
          <div
            role="status"
            className="rounded-xl border border-lilac-luster/25 bg-lilac-luster/5 px-3 py-2.5 font-outfit text-[12.5px] text-midnight-party"
          >
            {notice}
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-radiant-rose/25 bg-radiant-rose/5 px-3 py-2.5 font-outfit text-[12.5px] text-radiant-rose"
          >
            {error}
          </div>
        ) : null}

        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="font-oswald text-sm font-semibold uppercase tracking-wide text-midnight-party">
              Date status
            </h3>
          </div>
          {blocked ? (
            <div className="rounded-xl border border-midnight-party/10 bg-[#fbf8fa] p-3.5">
              <p className="font-outfit text-[13px] font-semibold text-midnight-party">
                Blocked / unavailable
              </p>
              <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/55">
                {blocked.reason || "No reason noted."}
              </p>
              <button
                type="button"
                onClick={handleUnblock}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-midnight-party/15 px-3 py-1.5 font-outfit text-[12px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
              >
                <Check size={13} aria-hidden="true" />
                Unblock date
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-midnight-party/10 bg-[#fbf8fa] p-3.5">
              <label htmlFor={`${formId}-block-reason`} className={labelClass}>
                Block reason (optional)
              </label>
              <input
                id={`${formId}-block-reason`}
                value={blockReason}
                onChange={(event) => setBlockReason(event.target.value)}
                className={fieldClass}
                placeholder="e.g. Equipment maintenance"
              />
              <button
                type="button"
                onClick={handleBlock}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-midnight-party/15 px-3 py-1.5 font-outfit text-[12px] font-semibold text-midnight-party transition hover:border-radiant-rose/40 hover:text-radiant-rose"
              >
                <Ban size={13} aria-hidden="true" />
                Block this date
              </button>
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="font-oswald text-sm font-semibold uppercase tracking-wide text-midnight-party">
              Availability slots
            </h3>
            {!blocked && !adding && !editingId ? (
              <button
                type="button"
                onClick={startAdd}
                className="inline-flex items-center gap-1 rounded-full border border-midnight-party/15 px-2.5 py-1 font-outfit text-[11.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
              >
                <Plus size={13} aria-hidden="true" />
                Add slot
              </button>
            ) : null}
          </div>

          {blocked ? (
            <p className="rounded-xl border border-dashed border-midnight-party/15 px-3 py-4 text-center font-outfit text-[12.5px] text-midnight-party/50">
              Unblock this date to manage open slots.
            </p>
          ) : (
            <>
              {daySlots.length === 0 && !adding ? (
                <p className="rounded-xl border border-dashed border-midnight-party/15 px-3 py-4 text-center font-outfit text-[12.5px] text-midnight-party/50">
                  No slots yet for this day.
                </p>
              ) : null}

              <ul className="space-y-2">
                {daySlots.map((slot) => (
                  <li
                    key={slot.id}
                    className="rounded-xl border border-black/5 bg-[#fbf8fa] px-3 py-3"
                  >
                    {editingId === slot.id ? null : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-outfit text-[13.5px] font-semibold text-midnight-party">
                            {formatDisplayTime(slot.startTime)} –{" "}
                            {formatDisplayTime(slot.endTime)}
                          </p>
                          <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                            {slot.capacity
                              ? `Capacity ${slot.capacity}`
                              : "No capacity limit"}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(slot)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
                          >
                            <Pencil size={14} aria-hidden="true" />
                            <span className="sr-only">Edit slot</span>
                          </button>
                          {confirmDeleteId === slot.id ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="inline-flex h-8 items-center rounded-lg bg-radiant-rose px-2 font-outfit text-[11px] font-semibold text-white"
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(slot.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-radiant-rose/20 text-radiant-rose transition hover:bg-radiant-rose/8"
                            >
                              <Trash2 size={14} aria-hidden="true" />
                              <span className="sr-only">Delete slot</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {adding || editingId ? (
                <form
                  onSubmit={handleSlotSubmit}
                  className="mt-3 space-y-3 rounded-xl border border-lilac-luster/20 bg-lilac-luster/5 p-3.5"
                >
                  <p className="font-outfit text-[12px] font-semibold text-midnight-party">
                    {editingId ? "Edit slot" : "New slot"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor={`${formId}-start`} className={labelClass}>
                        Start
                      </label>
                      <input
                        id={`${formId}-start`}
                        type="time"
                        required
                        value={slotForm.startTime}
                        onChange={(event) =>
                          setSlotForm((current) => ({
                            ...current,
                            startTime: event.target.value,
                          }))
                        }
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor={`${formId}-end`} className={labelClass}>
                        End
                      </label>
                      <input
                        id={`${formId}-end`}
                        type="time"
                        required
                        value={slotForm.endTime}
                        onChange={(event) =>
                          setSlotForm((current) => ({
                            ...current,
                            endTime: event.target.value,
                          }))
                        }
                        className={fieldClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`${formId}-capacity`} className={labelClass}>
                      Capacity (optional)
                    </label>
                    <input
                      id={`${formId}-capacity`}
                      type="number"
                      min={1}
                      step={1}
                      value={slotForm.capacity}
                      onChange={(event) =>
                        setSlotForm((current) => ({
                          ...current,
                          capacity: event.target.value,
                        }))
                      }
                      className={fieldClass}
                      placeholder="e.g. 2"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-full bg-midnight-party px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-white transition hover:bg-lilac-luster"
                    >
                      <Check size={14} aria-hidden="true" />
                      {editingId ? "Save slot" : "Add slot"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelSlotForm}
                      className="inline-flex items-center rounded-full border border-midnight-party/15 px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}
            </>
          )}
        </section>

        <section>
          <h3 className="mb-2 font-oswald text-sm font-semibold uppercase tracking-wide text-midnight-party">
            Bookings this day
          </h3>
          {dayBookings.length === 0 ? (
            <p className="rounded-xl border border-dashed border-midnight-party/15 px-3 py-4 text-center font-outfit text-[12.5px] text-midnight-party/50">
              No active bookings on this date.
            </p>
          ) : (
            <ul className="space-y-2">
              {dayBookings.map((booking) => (
                <li key={booking.id}>
                  <Link
                    href={`/partner/bookings/${booking.id}`}
                    className="block rounded-xl border border-black/5 bg-[#fbf8fa] px-3 py-3 transition hover:border-lilac-luster/35"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-outfit text-[13.5px] font-semibold text-midnight-party">
                        #{booking.reference}
                      </p>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                    <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/65">
                      {booking.eventType} · {booking.serviceName}
                    </p>
                    <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                      {booking.eventTime} · {booking.guestCount} guests ·{" "}
                      {formatPartnerBookingPrice(booking.priceGhs)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-outfit text-[11.5px] text-midnight-party/40">
            Bookings are read-only here. Confirm or decline from Bookings.
          </p>
        </section>
      </div>
    </aside>
  );
}
