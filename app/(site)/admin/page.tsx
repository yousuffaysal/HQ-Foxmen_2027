import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminPage from "@/components/site/pages/AdminPage";
import { getAiRuns, listConsultations, listInquiries, type Consultation, type Inquiry } from "@/lib/site/store";
import { listProjects } from "@/lib/site/projects";
import { getToolSettings } from "@/lib/site/tools-store";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  // proxy.ts already gates /admin; check again here so the data never renders without a session.
  const session = await auth();
  if (!session?.user) redirect("/login?from=/admin");
  if ((session.user as { role?: string }).role !== "admin") redirect("/portal");

  let inquiries: Inquiry[] = [], consultations: Consultation[] = [];
  let dbError = false;
  try { [inquiries, consultations] = await Promise.all([listInquiries(), listConsultations()]); }
  catch (e) { console.error("[admin] load", e); dbError = true; }
  const [projects, runs, tools] = await Promise.all([listProjects({ includeHidden: true }), getAiRuns(), getToolSettings({ live: true })]);
  return <AdminPage initialInquiries={inquiries} initialConsultations={consultations} initialProjects={projects} initialTools={tools} runs={runs} dbError={dbError} />;
}
