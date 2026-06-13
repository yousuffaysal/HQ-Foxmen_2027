import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
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
  metadataBase: new URL("https://foxmen.studio"),
  title: {
    default: "Foxmen Studio — Code. Craft. Care.",
    template: "%s — Foxmen Studio",
  },
  description:
    "Foxmen Studio is an international creative agency building websites, mobile apps, AI-integrated software, ecommerce and real estate platforms, design systems and brands. Est. 2025.",
  keywords: [
    "web design agency", "web development agency", "mobile app development",
    "AI software development", "ecommerce development", "UI UX design agency",
    "brand design", "Foxmen Studio", "Next.js development", "real estate platform",
    "startup product agency", "digital agency", "design system",
  ],
  authors: [{ name: "Foxmen Studio", url: "https://foxmen.studio" }],
  creator: "Foxmen Studio",
  publisher: "Foxmen Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://foxmen.studio",
    siteName: "Foxmen Studio",
    title: "Foxmen Studio — Code. Craft. Care.",
    description:
      "International creative agency building websites, mobile apps, AI-integrated software, ecommerce platforms, and design systems.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foxmen Studio — Code. Craft. Care.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foxmen Studio — Code. Craft. Care.",
    description:
      "International creative agency building websites, mobile apps, AI-integrated software, ecommerce platforms, and design systems.",
    images: ["/assets/og-image.png"],
    creator: "@foxmenstudio",
    site: "@foxmenstudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/assets/logo-mark.svg",
    shortcut: "/icon.svg",
  },
  alternates: {
    canonical: "https://foxmen.studio",
  },
  category: "technology",
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J3RWYPW4EH" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-J3RWYPW4EH');
        `}</Script>
        <Script id="cal-embed" strategy="lazyOnload">{`
          (function(C,A,L){let p=function(a,ar){a.q.push(ar);};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true;}if(ar[0]===L){const api=function(){p(api,arguments);};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["initNamespace",namespace]);}else p(cal,ar);return;}p(cal,ar);};})(window,"https://app.cal.com/embed/embed.js","init");
          Cal("init","project-discussion-call",{origin:"https://app.cal.com"});
          Cal.ns["project-discussion-call"]("ui",{"cssVarsPerTheme":{"light":{"cal-brand":"#B86CF9"},"dark":{"cal-brand":"#B86CF9"}},"hideEventTypeDetails":false,"layout":"week_view"});
        `}</Script>
      </body>
    </html>
  );
}
