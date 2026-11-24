"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  Building2,
  Landmark,
  LoaderCircle,
  MapPinned,
  Navigation,
  Search,
} from "lucide-react";
import { getLocationSuggestionProvider } from "@/lib/checkout/location-provider";
import type {
  CheckoutLocationSuggestion,
  LocationSearchStatus,
} from "@/types/checkout";

type CheckoutLocationSearchProps = {
  disabled?: boolean;
  onSelectSuggestion: (suggestion: CheckoutLocationSuggestion) => void;
  onUseCurrentLocation: () => void;
  onEnterManually: () => void;
  locating: boolean;
  locationError: string | null;
  locationNotice: string | null;
};

function kindIcon(kind: CheckoutLocationSuggestion["kind"]) {
  if (kind === "landmark") return Landmark;
  if (kind === "estate") return Building2;
  return MapPinned;
}

const SEARCH_PLACEHOLDER = "Search area, estate, landmark or address...";

export function CheckoutLocationSearch({
  disabled = false,
  onSelectSuggestion,
  onUseCurrentLocation,
  onEnterManually,
  locating,
  locationError,
  locationNotice,
}: CheckoutLocationSearchProps) {
  const inputId = useId();
  const listId = `${inputId}-listbox`;
  const provider = getLocationSuggestionProvider();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LocationSearchStatus>("idle");
  const [suggestions, setSuggestions] = useState<CheckoutLocationSuggestion[]>(
    [],
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const blurTimer = useRef<number | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setStatus("idle");
      setActiveIndex(-1);
      return;
    }

    // Debounce typing only — search itself is local/synchronous mock data.
    setStatus("loading");
    const timer = window.setTimeout(() => {
      const results = provider.search(trimmed);
      setSuggestions(results);
      setStatus(results.length === 0 ? "empty" : "ready");
      setActiveIndex(results.length > 0 ? 0 : -1);
      setOpen(true);
    }, 180);

    return () => {
      window.clearTimeout(timer);
    };
  }, [provider, query]);

  useEffect(() => {
    return () => {
      if (blurTimer.current != null) window.clearTimeout(blurTimer.current);
    };
  }, []);

  function selectSuggestion(suggestion: CheckoutLocationSuggestion) {
    setQuery(suggestion.primaryText);
    setOpen(false);
    setSuggestions([]);
    setStatus("idle");
    onSelectSuggestion(suggestion);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (event.key === "Escape") setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        index + 1 >= suggestions.length ? 0 : index + 1,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1,
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown =
    open &&
    !disabled &&
    (status === "loading" || status === "ready" || status === "empty");

  return (
    <div className="space-y-3">
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          {SEARCH_PLACEHOLDER}
        </label>
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-party/40"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          disabled={disabled}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setOpen(true);
          }}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => setOpen(false), 140);
          }}
          onKeyDown={handleKeyDown}
          placeholder={SEARCH_PLACEHOLDER}
          className="w-full rounded-xl border border-midnight-party/12 bg-[#fbf8fa] py-3.5 pl-11 pr-11 font-outfit text-[14px] text-midnight-party outline-none transition placeholder:text-midnight-party/40 focus:border-lilac-luster/45 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        />
        {status === "loading" ? (
          <LoaderCircle
            size={18}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-lilac-luster"
            aria-hidden="true"
          />
        ) : null}

        {showDropdown ? (
          <div
            id={listId}
            role="listbox"
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-midnight-party/10 bg-white shadow-[0_16px_40px_rgba(51,16,56,0.14)]"
          >
            {provider.isMock ? (
              <p className="border-b border-midnight-party/8 bg-lemon-twist/25 px-3.5 py-2 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/70">
                Demo suggestions · local mock data only
              </p>
            ) : null}

            {status === "loading" ? (
              <div className="flex items-center gap-2 px-4 py-4 font-outfit text-sm text-midnight-party/60">
                <LoaderCircle
                  size={16}
                  className="animate-spin text-lilac-luster"
                  aria-hidden="true"
                />
                Searching areas & landmarks…
              </div>
            ) : null}

            {status === "empty" ? (
              <div className="px-4 py-5 text-center">
                <p className="font-outfit text-sm font-semibold text-midnight-party">
                  No matches for “{query.trim()}”
                </p>
                <p className="mt-1 font-outfit text-xs text-midnight-party/55">
                  Try an area, estate, or landmark — or enter the address
                  manually.
                </p>
                <button
                  type="button"
                  className="mt-3 font-outfit text-sm font-semibold text-lilac-luster hover:text-midnight-party"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setOpen(false);
                    onEnterManually();
                  }}
                >
                  Enter address manually
                </button>
              </div>
            ) : null}

            {status === "ready"
              ? suggestions.map((suggestion, index) => {
                  const Icon = kindIcon(suggestion.kind);
                  const active = index === activeIndex;
                  return (
                    <button
                      key={suggestion.id}
                      id={`${listId}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`flex w-full items-start gap-3 px-3.5 py-3 text-left transition ${
                        active ? "bg-lilac-luster/10" : "hover:bg-offwhite/70"
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-midnight-party/6 text-lilac-luster">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-outfit text-sm font-semibold text-midnight-party">
                          {suggestion.primaryText}
                        </span>
                        <span className="mt-0.5 block font-outfit text-xs text-midnight-party/55">
                          {suggestion.secondaryText}
                        </span>
                      </span>
                    </button>
                  );
                })
              : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={disabled || locating}
          onClick={onUseCurrentLocation}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-midnight-party/15 bg-white px-4 py-2.5 font-outfit text-sm font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locating ? (
            <LoaderCircle
              size={16}
              className="animate-spin text-lilac-luster"
              aria-hidden="true"
            />
          ) : (
            <Navigation size={16} aria-hidden="true" />
          )}
          {locating ? "Getting location…" : "Use my current location"}
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onEnterManually}
          className="font-outfit text-sm font-semibold text-lilac-luster transition hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster disabled:opacity-60"
        >
          Enter address manually
        </button>
      </div>

      {locationError ? (
        <p className="font-outfit text-[12.5px] text-radiant-rose" role="alert">
          {locationError}
        </p>
      ) : null}

      {locationNotice && !locationError ? (
        <p
          className="rounded-xl border border-lemon-twist/40 bg-lemon-twist/15 px-3.5 py-2.5 font-outfit text-[12.5px] text-midnight-party"
          role="status"
        >
          {locationNotice}
        </p>
      ) : null}

      <p className="font-outfit text-xs leading-relaxed text-midnight-party/50">
        Search estates, areas, and landmarks across Ghana. House number and
        street details come next after you pick a spot.
      </p>
    </div>
  );
}
