import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "An article from the Foxmen Studio journal — design craft, engineering, AI in production, and studio notes.",
  openGraph: {
    siteName: "Foxmen Studio",
    type: "article",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Foxmen Studio Journal" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/og-image.png"],
  },
};

export default function JournalSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
