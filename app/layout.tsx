import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import Script from "next/script";

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
        <SiteShell>{children}</SiteShell>
        <Script id="cal-embed" strategy="lazyOnload">{`
          (function(C,A,L){let p=function(a,ar){a.q.push(ar);};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true;}if(ar[0]===L){const api=function(){p(api,arguments);};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["initNamespace",namespace]);}else p(cal,ar);return;}p(cal,ar);};})(window,"https://app.cal.com/embed/embed.js","init");
          Cal("init","project-discussion-call",{origin:"https://app.cal.com"});
          Cal.ns["project-discussion-call"]("ui",{"cssVarsPerTheme":{"light":{"cal-brand":"#B86CF9"},"dark":{"cal-brand":"#B86CF9"}},"hideEventTypeDetails":false,"layout":"week_view"});
        `}</Script>
      </body>
    </html>
  );
}
