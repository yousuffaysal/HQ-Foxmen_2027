import type { Metadata } from "next";
import WorkPage from "@/components/site/pages/WorkPage";
import { constructMetadata } from "@/lib/metadata";
import { getHiddenProjects } from "@/lib/site/store";

export const metadata: Metadata = constructMetadata({ title: "Selected work", description: "Websites, online stores, AI products and platforms built by Foxmen Studio.", url: "/work" });
export const revalidate = 300; // admin visibility toggles also revalidate this path immediately

export default async function Page() {
  return <WorkPage hidden={await getHiddenProjects()} />;
}
