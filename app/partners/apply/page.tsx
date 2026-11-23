import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PartnerApplyHero } from "@/components/partners/PartnerApplyHero";
import { PartnerApplicationForm } from "@/components/partners/PartnerApplicationForm";

export const metadata: Metadata = {
  title: "Become a Partner | Party Wagon",
  description:
    "Apply to join Party Wagon as a Darkstore or Service Provider partner. Applications are reviewed by Operations before any account is created.",
};

export default function PartnerApplyPage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1 bg-offwhite/40">
        <PartnerApplyHero />
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <PartnerApplicationForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
