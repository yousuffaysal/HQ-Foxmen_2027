import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./site.css";
import "@/components/site/hover.css";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...constructMetadata({
    title: undefined,
    description: "Foxmen Studio builds fast websites, online stores, AI chatbots and custom software for growing businesses worldwide. Designed and coded by hand, with no templates.",
    category: "technology",
  }),
  title: "Foxmen Studio",
  other: { "p:domain_verify": "21219fd3e40b159af585737929893236" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F3EEE4" };

// Root layout for the redesigned site (public pages, login and the new admin).
export default function SiteRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="fx-js" suppressHydrationWarning>
      <body>
        <noscript><style>{`html.fx-js [data-reveal]{opacity:1!important;transform:none!important}`}</style></noscript>
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J3RWYPW4EH" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-J3RWYPW4EH');
        `}</Script>
      </body>
    </html>
  );
}
