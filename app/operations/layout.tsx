import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operations | Party Wagon",
  description: "Party Wagon Operations workspace",
};

/**
 * Operations workspace shell — no customer storefront chrome.
 */
export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full w-full max-w-[100vw] overflow-x-hidden bg-[#f6f2f5] text-midnight-party antialiased">
      {children}
    </div>
  );
}
