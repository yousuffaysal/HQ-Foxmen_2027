import type { Metadata } from "next";

export const SITE_NAME = "Foxmen Studio";
export const TAGLINE = "Code. Craft. Care.";
export const BASE_URL = "https://www.foxmen.studio";
export const DEFAULT_OG_IMAGE = "/assets/og-image.png";
export const DEFAULT_TWITTER_CREATOR = "@foxmenstudio";

export const DEFAULT_KEYWORDS = [
  "web design agency",
  "web development agency",
  "mobile app development",
  "AI software development",
  "ecommerce development",
  "UI UX design agency",
  "brand design",
  "Foxmen Studio",
  "Next.js development",
  "real estate platform",
  "startup product agency",
  "digital agency",
  "design system",
];

export interface ConstructMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: { name: string; url?: string }[];
  category?: string;
}

/**
 * Cleanly constructs a standardized Next.js Metadata object.
 * Prevents metadata duplication and ensures canonical URLs, openGraph, and twitter cards are always well-arranged and consistent across Foxmen Studio ("Code. Craft. Care.").
 */
export function constructMetadata({
  title,
  description = "Foxmen Studio is an international creative agency building websites, mobile apps, AI-integrated software, ecommerce and real estate platforms, design systems and brands. Est. 2025.",
  image = DEFAULT_OG_IMAGE,
  url,
  keywords = DEFAULT_KEYWORDS,
  noIndex = false,
  type = "website",
  publishedTime,
  authors = [{ name: SITE_NAME, url: BASE_URL }],
  category,
}: ConstructMetadataProps = {}): Metadata {
  const isDefaultTitle = !title;
  const fullTitle = isDefaultTitle ? `${SITE_NAME} — ${TAGLINE}` : `${title} — ${SITE_NAME}`;
  const fullUrl = url ? `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}` : BASE_URL;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title: isDefaultTitle
      ? {
          default: `${SITE_NAME} — ${TAGLINE}`,
          template: `%s — ${SITE_NAME}`,
        }
      : title,
    description,
    keywords,
    authors,
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      locale: "en_US",
      url: fullUrl,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      publishedTime,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: DEFAULT_TWITTER_CREATOR,
      site: DEFAULT_TWITTER_CREATOR,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
  };
}
