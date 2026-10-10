import type { Metadata } from 'next';
import './errandly.css';
import SiteShell from '@/components/errandly/site-shell';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.foxmen.studio'),
  title: { default: 'Errandly — Your work. Handled.', template: '%s · Errandly' },
  description: 'Your personal AI for everyday work. Organize files, understand documents, and create reports on your Mac. Local by default. Now available for macOS.',
  alternates: { canonical: '/ai_products/errandly' },
};

// Root layout for Errandly, Foxmen Studio's first product. Kept separate from (site) so its styles never mix.
export default function ErrandlyLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning><a className="skip" href="#main">Skip to content</a><SiteShell>{children}</SiteShell></body></html>;
}
