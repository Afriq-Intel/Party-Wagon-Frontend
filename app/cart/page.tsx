import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart | Party Wagon",
  description:
    "Review your Party Wagon cart, update quantities, and proceed to checkout.",
};

export default function CartPage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1 bg-white">
        <CartView />
      </main>
      <Footer />
    </>
  );
}
