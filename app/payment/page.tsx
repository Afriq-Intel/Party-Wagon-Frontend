import type { Metadata } from "next";
import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PaymentView } from "@/components/payment/PaymentView";

export const metadata: Metadata = {
  title: "Payment | Party Wagon",
  description:
    "Review your Party Wagon order and pay securely with Paystack when checkout is connected.",
};

function PaymentFallback() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      aria-busy="true"
    >
      <div className="h-10 w-56 animate-pulse rounded-lg bg-midnight-party/10" />
      <div className="mt-3 h-5 w-48 animate-pulse rounded bg-midnight-party/8" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="h-80 animate-pulse rounded-[1.75rem] bg-midnight-party/5" />
        <div className="h-96 animate-pulse rounded-[1.75rem] bg-midnight-party/5" />
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1 bg-white">
        <Suspense fallback={<PaymentFallback />}>
          <PaymentView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
