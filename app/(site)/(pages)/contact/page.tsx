import type { Metadata } from "next";
import ContactPage from "@/components/site/pages/ContactPage";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({ title: "Contact", description: "Tell us about your project. We will reply with a clear plan and price.", url: "/contact" });

export default function Page() {
  return <ContactPage />;
}
