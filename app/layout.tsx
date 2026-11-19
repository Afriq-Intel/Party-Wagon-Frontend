import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import { Outfit, Playfair_Display } from "next/font/google";
import { AgeVerification } from "@/components/age-gate/AgeVerification";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider } from "@/lib/cart/cart-context";
import "./globals.css";

const oswald = localFont({
  src: [
    {
      path: "../public/fonts/Oswald-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-oswald",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const obloquy = localFont({
  src: "../public/fonts/obloquys.ttf",
  variable: "--font-obloquy",
  display: "swap",
  weight: "400",
});

const ageSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-age-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Party Wagon | Good Times Start Here",
  description:
    "Party essentials, drinks, merchandise, and personalised party plans. Where the party dey, we dey.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${outfit.variable} ${obloquy.variable} ${ageSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-outfit text-midnight-party">
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <AgeVerification />
            </Suspense>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
