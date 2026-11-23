"use client";

import { useEffect, useRef } from "react";

type ScrollHandler = (scrollY: number) => void;

/**
 * Passive scroll subscription coalesced to one rAF tick.
 * Avoids layout thrashing from raw scroll listeners.
 */
export function useRafScrollY(onScroll: ScrollHandler, enabled = true) {
  const handlerRef = useRef(onScroll);
  handlerRef.current = onScroll;

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const publish = () => {
      frame = 0;
      handlerRef.current(window.scrollY);
    };

    const onWindowScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(publish);
    };

    publish();
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);
}
