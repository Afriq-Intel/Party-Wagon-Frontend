"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { AgeGateCloud } from "@/components/age-gate/AgeGateCloud";

const STORAGE_KEY = "party-wagon-age-verified";
const AGE_EVENT = "party-wagon-age-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AGE_EVENT, onStoreChange);
  };
}

function getVerifiedSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

export function AgeVerification() {
  const pathname = usePathname();
  const confirmTitleId = useId();
  const deniedTitleId = useId();
  const confirmDescriptionId = useId();
  const deniedDescriptionId = useId();
  const verified = useSyncExternalStore(
    subscribe,
    getVerifiedSnapshot,
    getServerSnapshot,
  );
  const [denied, setDenied] = useState(false);
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isStaffWorkspaceRoute =
    pathname?.startsWith("/operations") ||
    pathname?.startsWith("/driver") ||
    pathname?.startsWith("/partner") ||
    pathname?.startsWith("/store") ||
    pathname?.startsWith("/account") ||
    false;

  useEffect(() => {
    if (isStaffWorkspaceRoute) return;
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      setEntered(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [isStaffWorkspaceRoute]);

  useEffect(() => {
    if (isStaffWorkspaceRoute || verified) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isStaffWorkspaceRoute, verified]);

  const handleYes = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Access still granted for this session if storage is unavailable.
    }
    window.dispatchEvent(new Event(AGE_EVENT));
    setDenied(false);
  };

  const handleNo = () => {
    setDenied(true);
  };

  // Staff workspaces should not show the storefront age gate.
  if (isStaffWorkspaceRoute || verified) return null;

  const showDenied = denied;
  const titleId = showDenied ? deniedTitleId : confirmTitleId;
  const descriptionId = showDenied
    ? deniedDescriptionId
    : confirmDescriptionId;
  const gateClass =
    mounted && entered ? "age-gate age-gate--entered" : "age-gate age-gate--checking";

  return (
    <section
      className={gateClass}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-busy={!mounted ? true : undefined}
    >
      <div className="age-gate__background" aria-hidden="true">
        <Image
          src="/assets/banners/hero-party.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="age-gate__background-image"
        />
        <div className="age-gate__background-scrim" />
      </div>

      <AgeGateCloud className="age-gate__cloud" />

      <div
        className={`age-gate__inner ${showDenied ? "age-gate__inner--denied" : ""}`}
      >
        <div className="age-gate__holder" hidden={showDenied}>
          <h2 id={confirmTitleId} className="age-gate__title">
            {"please confirm\nyour age."}
          </h2>
          <p id={confirmDescriptionId} className="age-gate__copy">
            {"You must be at least 21 years old\nto enter this site."}
          </p>

          <div className="age-gate__actions">
            <button
              type="button"
              className="age-gate__button"
              aria-label="Yes, I am of legal drinking age"
              onClick={handleYes}
            >
              yes
            </button>
            <button
              type="button"
              className="age-gate__button"
              aria-label="No, I am not of legal drinking age"
              onClick={handleNo}
            >
              no
            </button>
          </div>
        </div>

        <div
          className="age-gate__denied"
          hidden={!showDenied}
          aria-live="polite"
        >
          <h2 id={deniedTitleId} className="age-gate__title">
            {"sorry,\nwe can’t let you enter."}
          </h2>
          <p id={deniedDescriptionId} className="age-gate__copy">
            {"You must be at least 21 years old\nto view this site."}
          </p>
        </div>

        <div className="age-gate__policy">
          <p>
            By entering this site you are agreeing to the{" "}
            <Link href="/privacy" className="age-gate__policy-link">
              Privacy Policy.
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
