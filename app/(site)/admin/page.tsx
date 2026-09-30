import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminPage from "@/components/site/pages/AdminPage";
import { getAiRuns, getHiddenProjects, listInquiries, type Inquiry } from "@/lib/site/store";

export const metadata: Metadata = { title: "Admin · Foxmen Studio", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  // proxy.ts already gates /admin; check again here so the data never renders without a session.
  const session = await auth();
  if (!session?.user) redirect("/login?from=/admin");
  if ((session.user as { role?: string }).role !== "admin") redirect("/portal");

  let inquiries: Inquiry[] = [];
  let dbError = false;
  try { inquiries = await listInquiries(); } catch (e) { console.error("[admin] inquiries", e); dbError = true; }
  const [hidden, runs] = await Promise.all([getHiddenProjects(), getAiRuns()]);
  return <AdminPage initialInquiries={inquiries} initialHidden={hidden} runs={runs} dbError={dbError} />;
}
