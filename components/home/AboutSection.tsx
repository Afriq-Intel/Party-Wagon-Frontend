import { AboutCloudStage } from "@/components/home/AboutCloudStage";

export function AboutSection() {
  return (
    <section
      className="relative overflow-hidden bg-white px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-10 lg:pb-8 lg:pt-14"
      aria-labelledby="about-heading"
    >
      <AboutCloudStage />
    </section>
  );
}
