"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  buildMonthCells,
  formatMonthLabel,
  getDayMarkers,
  markerDotClass,
  markerLabel,
  toDateKey,
} from "@/lib/data/partner-availability";
import { usePartnerAvailability } from "@/lib/partner/availability-context";
import { usePartnerBookings } from "@/lib/partner/bookings-context";
import type { PartnerCalendarDayMarker } from "@/types/partner-availability";
import { AvailabilityDayPanel } from "./AvailabilityDayPanel";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const LEGEND: PartnerCalendarDayMarker[] = [
  "available",
  "limited",
  "unavailable",
  "booked",
];

function sameMonth(a: Date, year: number, monthIndex: number): boolean {
  return a.getFullYear() === year && a.getMonth() === monthIndex;
}

export function PartnerAvailabilityPage() {
  // Wall-clock "today" must be set after mount — new Date() during render
  // blocks Next.js prerender for this client route.
  const [today, setToday] = useState<Date | null>(null);
  const [year, setYear] = useState(0);
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { state, ready: availabilityReady } = usePartnerAvailability();
  const { bookings, ready: bookingsReady } = usePartnerBookings();

  const ready = availabilityReady && bookingsReady && today !== null;

  useEffect(() => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    setToday(startOfDay);
    setYear(startOfDay.getFullYear());
    setMonthIndex(startOfDay.getMonth());
    setSelectedDate(toDateKey(startOfDay));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setLoading(false), 280);
    return () => window.clearTimeout(timer);
  }, [ready]);

  const cells = useMemo(
    () => (today ? buildMonthCells(year, monthIndex) : []),
    [today, year, monthIndex],
  );

  function goPrevMonth() {
    const date = new Date(year, monthIndex - 1, 1);
    setYear(date.getFullYear());
    setMonthIndex(date.getMonth());
  }

  function goNextMonth() {
    const date = new Date(year, monthIndex + 1, 1);
    setYear(date.getFullYear());
    setMonthIndex(date.getMonth());
  }

  function goToday() {
    if (!today) return;
    setYear(today.getFullYear());
    setMonthIndex(today.getMonth());
    setSelectedDate(toDateKey(today));
  }

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="min-w-0">
        <h1 className="font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
          Availability Calendar
        </h1>
        <p className="mt-1.5 max-w-2xl font-outfit text-[13px] leading-relaxed text-midnight-party/60 sm:text-[14px]">
          Open and close booking slots, block busy days, and see existing
          bookings overlaid on your month.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.9fr)] lg:items-start">
        <section className={`${cardClass} p-4 sm:p-5`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevMonth}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
              >
                <ChevronLeft size={18} aria-hidden="true" />
                <span className="sr-only">Previous month</span>
              </button>
              <h2 className="min-w-[10rem] text-center font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party sm:min-w-[12rem] sm:text-xl">
                {today ? formatMonthLabel(year, monthIndex) : "…"}
              </h2>
              <button
                type="button"
                onClick={goNextMonth}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
              >
                <ChevronRight size={18} aria-hidden="true" />
                <span className="sr-only">Next month</span>
              </button>
            </div>

            <button
              type="button"
              onClick={goToday}
              className="inline-flex self-start items-center justify-center rounded-full border border-midnight-party/15 px-4 py-2 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster sm:self-auto"
            >
              Today
            </button>
          </div>

          <ul className="mt-4 flex flex-wrap gap-3">
            {LEGEND.map((marker) => (
              <li
                key={marker}
                className="inline-flex items-center gap-1.5 font-outfit text-[12px] text-midnight-party/65"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${markerDotClass(marker)}`}
                  aria-hidden="true"
                />
                {markerLabel(marker)}
              </li>
            ))}
          </ul>

          {loading ? (
            <div className="mt-6 flex min-h-[320px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party" />
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-7 gap-0.5 sm:gap-1.5">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="px-0.5 py-1.5 text-center font-outfit text-[9px] font-semibold uppercase tracking-wide text-midnight-party/45 sm:px-1 sm:py-2 sm:text-[11px]"
                  >
                    <span className="sm:hidden">{day.slice(0, 1)}</span>
                    <span className="hidden sm:inline">{day}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5 sm:gap-1.5">
                {cells.map((cell, index) => {
                  if (!cell) {
                    return (
                      <div
                        key={`pad-${index}`}
                        className="min-h-[2.75rem] rounded-lg bg-transparent sm:min-h-[5rem] sm:rounded-xl"
                        aria-hidden="true"
                      />
                    );
                  }

                  const dateKey = toDateKey(cell);
                  const inMonth = sameMonth(cell, year, monthIndex);
                  const isToday = today ? dateKey === toDateKey(today) : false;
                  const isSelected = selectedDate === dateKey;
                  const markers = inMonth
                    ? getDayMarkers(dateKey, state, bookings)
                    : [];

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => setSelectedDate(dateKey)}
                      className={`flex min-h-[2.75rem] flex-col rounded-lg border px-0.5 py-1 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:min-h-[5rem] sm:rounded-xl sm:px-2 sm:py-2 ${
                        isSelected
                          ? "border-lilac-luster/50 bg-lilac-luster/8 shadow-[0_0_0_1px_rgba(109,0,255,0.12)]"
                          : "border-midnight-party/8 bg-[#fbf8fa] hover:border-lilac-luster/30 hover:bg-white"
                      } ${inMonth ? "" : "opacity-40"}`}
                    >
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full font-outfit text-[11px] font-semibold sm:h-7 sm:w-7 sm:text-[13px] ${
                          isToday
                            ? "bg-midnight-party text-white"
                            : "text-midnight-party"
                        }`}
                      >
                        {cell.getDate()}
                      </span>
                      {markers.length > 0 ? (
                        <span className="mt-auto flex flex-wrap gap-0.5 pt-0.5 sm:pt-1">
                          {markers.map((marker) => (
                            <span
                              key={marker}
                              title={markerLabel(marker)}
                              className={`h-1 w-1 rounded-full sm:h-2 sm:w-2 ${markerDotClass(marker)}`}
                            />
                          ))}
                        </span>
                      ) : (
                        <span className="mt-auto pt-0.5 sm:pt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {selectedDate ? (
          <AvailabilityDayPanel
            dateKey={selectedDate}
            onClose={() => setSelectedDate(null)}
          />
        ) : (
          <aside className={`${cardClass} flex min-h-[280px] items-center justify-center p-6 text-center`}>
            <p className="max-w-xs font-outfit text-[13px] text-midnight-party/55">
              Select a date to manage slots, block the day, or review bookings.
            </p>
          </aside>
        )}
      </div>
    </main>
  );
}
