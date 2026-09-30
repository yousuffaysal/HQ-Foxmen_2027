import SiteChrome from "@/components/site/SiteChrome";

// Public pages share one persistent chrome so the curtain transition spans route changes.
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
