"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Shared query string for desktop + mobile header search fields.
 * Syncs from `/catalogue?q=` when browsing the catalogue.
 */
export function useGlobalSearchQuery() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = pathname.startsWith("/catalogue")
    ? (searchParams.get("q") ?? "")
    : "";

  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  return { query, setQuery, pathname, urlQuery, searchParams };
}
