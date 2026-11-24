import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout | Party Wagon",
  description:
    "Enter your delivery address and review your Party Wagon order before payment.",
};

export default function CheckoutPage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1 bg-white">
        <CheckoutView />
      </main>
      <Footer />
    </>
  );
}
