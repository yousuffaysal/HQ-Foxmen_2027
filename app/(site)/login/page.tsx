import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/site/pages/LoginForm";

export const metadata: Metadata = { title: "Sign in · Foxmen Studio", robots: { index: false, follow: false } };

export default function Page() {
  return <Suspense><LoginForm /></Suspense>;
}
