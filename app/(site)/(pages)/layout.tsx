import SiteChrome from "@/components/site/SiteChrome";
import { listProjects } from "@/lib/site/projects";

// Admin project edits call revalidatePath("/", "layout"); this is only the fallback refresh.
export const revalidate = 300;

// Public pages share one persistent chrome so the curtain transition spans route changes.
// The (visible) project list is loaded once here and shared with every page through context.
export default async function PagesLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome projects={await listProjects()}>{children}</SiteChrome>;
}
