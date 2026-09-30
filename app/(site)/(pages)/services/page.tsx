import type { Metadata } from "next";
import ServicesPage from "@/components/site/pages/ServicesPage";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({ title: "Services and prices", description: "Business websites, e-commerce stores, 3D websites, AI chatbots, custom web apps and monthly care plans, with clear starting prices in BDT and USD.", url: "/services" });

export default function Page() {
  return <ServicesPage />;
}
