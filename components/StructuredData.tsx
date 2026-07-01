import React from "react";

const BASE_URL = "https://www.foxmen.studio";
const SITE_NAME = "Foxmen Studio";
const LOGO_URL = `${BASE_URL}/assets/logo-mark.svg`;
const OG_IMAGE_URL = `${BASE_URL}/assets/og-image.png`;

const SOCIAL_LINKS = [
  "https://x.com/FoxmenStudio",
  "https://www.instagram.com/foxmen_studio/",
  "https://www.linkedin.com/company/foxmen-studio/",
  "https://www.facebook.com/people/Foxmen-Studio/61579940840061/",
  "https://dribbble.com/foxmen-studio",
];

/**
 * Injects Schema.org JSON-LD structured data into the root layout.
 * This instructs Google search crawlers to format SERP results with rich Sitelinks,
 * social profile cards, company logo, and clean section descriptions (like Themefisher).
 */
export function RootStructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Foxmen Studio Agency",
    url: BASE_URL,
    logo: LOGO_URL,
    image: OG_IMAGE_URL,
    description:
      "International creative agency building websites, mobile apps, AI-integrated software, ecommerce and real estate platforms, design systems and brands. Est. 2025.",
    slogan: "Code. Craft. Care.",
    email: "contact@foxmenstudio.com",
    foundingDate: "2025",
    founders: [
      {
        "@type": "Person",
        name: "Yousuf H. Faysal",
        jobTitle: "Founder & CEO",
      },
      {
        "@type": "Person",
        name: "Rayhan Ahmed",
        jobTitle: "Co-founder & Head of Engineering",
      },
    ],
    sameAs: SOCIAL_LINKS,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: SITE_NAME,
    alternateName: "Foxmen Studio — Code. Craft. Care.",
    url: BASE_URL,
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/journal?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  /**
   * SiteNavigationElement / ItemList tells Google which pages should appear as Google Sitelinks
   * underneath the main domain search result, complete with individual descriptions.
   */
  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Foxmen Studio Sitelinks",
    description: "Primary navigation and core services of Foxmen Studio.",
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Services",
        description:
          "Web design & development, mobile apps, AI-integrated software, ecommerce, real estate platforms, and UI/UX design.",
        url: `${BASE_URL}/services`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Work & Case Studies",
        description:
          "Selected portfolio and engineering case studies of websites, mobile apps, AI products, and scalable design systems.",
        url: `${BASE_URL}/work`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "About Our Studio",
        description:
          "Meet the Foxmen Studio team — founders, engineers, and designers building world-class digital products since 2025.",
        url: `${BASE_URL}/about`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Free Tools",
        description:
          "Free website speed checker, AI website roaster, project price calculator, tech stack recommender, and rate comparator.",
        url: `${BASE_URL}/tools`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 5,
        name: "Journal",
        description:
          "Design craft, engineering deep-dives, AI in production, case studies, and studio notes from our team.",
        url: `${BASE_URL}/journal`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 6,
        name: "Contact Us",
        description:
          "Start a project with Foxmen Studio. Tell us what you're building — we reply within 24 hours.",
        url: `${BASE_URL}/contact`,
      },
    ],
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${BASE_URL}/#service`,
    name: SITE_NAME,
    image: OG_IMAGE_URL,
    url: BASE_URL,
    priceRange: "$$$",
    description:
      "International creative agency building high-end digital products, AI solutions, web apps, mobile apps, and brands.",
    email: "contact@foxmenstudio.com",
    sameAs: SOCIAL_LINKS,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteNavigationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
    </>
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Injects BreadcrumbList Schema into sub-pages to help Google display
 * breadcrumb trails (e.g. Foxmen Studio › services) in search results.
 */
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: item.url.startsWith("http")
          ? item.url
          : `${BASE_URL}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
