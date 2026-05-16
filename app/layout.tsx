import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import FoxChat from "@/components/FoxChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Foxmen Studio — Code. Craft. Care.", template: "%s — Foxmen Studio" },
  description:
    "Foxmen Studio is an international agency building websites, mobile apps, AI-integrated software, ecommerce and real estate platforms, design systems and brands.",
  icons: { icon: "/assets/logo-mark.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${instrumentSans.variable}`}
    >
      <body
        data-mood="violet"
        data-display="serif"
        data-density="standard"
        data-noise="on"
        suppressHydrationWarning
      >
        <Preloader />
        <Nav />
        <main>{children}</main>
        <Footer />
        <FoxChat />
      </body>
    </html>
  );
}
