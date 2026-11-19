"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Search, X } from "lucide-react";
import {
  buildGlobalSearchResults,
  getCatalogueSearchHref,
  type SearchSuggestion,
} from "@/lib/search/global-search";
import { getClientSearchIndex } from "@/lib/search/search-index";

type GlobalSearchProps = {
  id: string;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  pathname: string;
  searchParams: URLSearchParams | { get: (key: string) => string | null };
  className?: string;
};

export function GlobalSearch({
  id,
  query,
  setQuery,
  pathname,
  searchParams,
  className = "",
}: GlobalSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const index = useMemo(() => getClientSearchIndex(), []);
  const results = useMemo(
    () => buildGlobalSearchResults(index, query),
    [index, query],
  );

  const flatSuggestions: SearchSuggestion[] = useMemo(
    () => [...results.products, ...results.services],
    [results.products, results.services],
  );

  const showPanel = open && query.trim().length > 0;

  const closePanel = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closePanel();
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [closePanel]);

  function submitSearch(nextQuery = query) {
    const trimmed = nextQuery.trim();
    closePanel();
    if (!trimmed) {
      if (pathname.startsWith("/catalogue")) {
        router.push("/catalogue");
      }
      return;
    }
    router.push(getCatalogueSearchHref(trimmed));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeIndex >= 0 && flatSuggestions[activeIndex]) {
      router.push(flatSuggestions[activeIndex].href);
      closePanel();
      return;
    }
    submitSearch();
  }

  function clearQuery() {
    setQuery("");
    setActiveIndex(-1);
    setOpen(false);
    inputRef.current?.focus();
    if (pathname.startsWith("/catalogue") && searchParams.get("q")) {
      router.push("/catalogue");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showPanel) {
      if (event.key === "Escape") {
        inputRef.current?.blur();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        Math.min(current + 1, flatSuggestions.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, -1));
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor={id} className="sr-only">
          Search for products and services
        </label>
        <div className="flex h-11 items-center gap-3 rounded-full bg-white px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-lemon-twist">
          <button
            type="submit"
            aria-label="Submit search"
            className="inline-flex size-[18px] shrink-0 items-center justify-center text-midnight-party/50 transition hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist"
          >
            <Search size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <input
            ref={inputRef}
            id={id}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={showPanel}
            aria-activedescendant={
              activeIndex >= 0
                ? `${listboxId}-option-${activeIndex}`
                : undefined
            }
            placeholder="Search for products and services"
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 font-outfit text-sm leading-none text-midnight-party placeholder:text-midnight-party/45 focus-visible:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={clearQuery}
              aria-label="Clear search"
              className="inline-flex size-5 shrink-0 items-center justify-center text-midnight-party/50 transition hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist"
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </form>

      {showPanel ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_16px_40px_rgba(51,16,56,0.18)]"
        >
          {results.total === 0 ? (
            <div className="px-4 py-5 text-center">
              <p className="font-outfit text-sm font-semibold text-midnight-party">
                No matches for “{results.query}”
              </p>
              <p className="mt-1 font-outfit text-xs text-midnight-party/60">
                Try another product name, brand, category, or service.
              </p>
              <button
                type="button"
                onClick={() => submitSearch()}
                className="mt-3 font-outfit text-xs font-semibold text-lilac-luster underline-offset-2 hover:underline"
              >
                Search catalogue anyway
              </button>
            </div>
          ) : (
            <div className="max-h-[min(24rem,70vh)] overflow-y-auto py-2">
              {results.products.length > 0 ? (
                <SuggestionGroup label="Products">
                  {results.products.map((item, index) => (
                    <SuggestionRow
                      key={item.id}
                      id={`${listboxId}-option-${index}`}
                      suggestion={item}
                      active={activeIndex === index}
                      onNavigate={closePanel}
                    />
                  ))}
                </SuggestionGroup>
              ) : null}

              {results.services.length > 0 ? (
                <SuggestionGroup label="Services">
                  {results.services.map((item, index) => {
                    const flatIndex = results.products.length + index;
                    return (
                      <SuggestionRow
                        key={item.id}
                        id={`${listboxId}-option-${flatIndex}`}
                        suggestion={item}
                        active={activeIndex === flatIndex}
                        onNavigate={closePanel}
                      />
                    );
                  })}
                </SuggestionGroup>
              ) : null}

              <div className="border-t border-black/8 px-3 py-2">
                <button
                  type="button"
                  onClick={() => submitSearch()}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 font-outfit text-xs font-semibold text-lilac-luster transition hover:bg-offwhite/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
                >
                  <span>View all catalogue results</span>
                  <span className="text-midnight-party/45">Enter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SuggestionGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="px-2 py-1">
      <p className="px-2 py-1.5 font-outfit text-[11px] font-semibold uppercase tracking-[0.14em] text-midnight-party/45">
        {label}
      </p>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  );
}

function SuggestionRow({
  id,
  suggestion,
  active,
  onNavigate,
}: {
  id: string;
  suggestion: SearchSuggestion;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <li role="option" id={id} aria-selected={active}>
      <Link
        href={suggestion.href}
        onClick={onNavigate}
        className={`flex items-center gap-3 rounded-xl px-2 py-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${
          active ? "bg-lilac-luster/10" : "hover:bg-offwhite/80"
        }`}
      >
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#f3eef2]">
          <Image
            src={suggestion.image}
            alt=""
            fill
            sizes="44px"
            className="object-cover object-center"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-outfit text-sm font-semibold text-midnight-party">
            {suggestion.title}
          </span>
          <span className="mt-0.5 block truncate font-outfit text-xs text-midnight-party/55">
            {suggestion.subtitle}
          </span>
        </span>
        {"priceLabel" in suggestion && suggestion.priceLabel ? (
          <span className="shrink-0 font-outfit text-xs font-bold text-midnight-party">
            {suggestion.priceLabel}
          </span>
        ) : null}
      </Link>
    </li>
  );
}
