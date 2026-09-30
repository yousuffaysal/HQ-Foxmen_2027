"use client";
import { useState, type FormEvent } from "react";
import ContactView from "../views/ContactView";
import { useSite } from "../SiteChrome";
import { BUDGETS_BDT, BUDGETS_USD, CONTACT, CONTACT_SERVICES } from "@/lib/site/data";

export default function ContactPage() {
  const { go, cur, setCur, scrollTop } = useSite();
  const usd = cur === "usd";
  const [cServices, setCServices] = useState<string[]>([]);
  const [cBudget, setCBudget] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submitContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const fd = new FormData(e.currentTarget);
    setSending(true);
    try {
      const r = await fetch("/api/site/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone") || "", company: fd.get("company") || "",
          message: fd.get("message") || "", website: fd.get("website") || "",
          services: cServices.join(", "), budget: cBudget,
        }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        alert(d.error || `Could not send your message. Please email ${CONTACT.email}.`);
        return;
      }
      setSent(true); setCServices([]); setCBudget("");
      scrollTop();
    } catch {
      alert(`Could not send your message. Please email ${CONTACT.email}.`);
    } finally {
      setSending(false);
    }
  };

  const v = {
    go, contactEmail: CONTACT.email, contactPhone: CONTACT.phone,
    notSent: !sent, sent, submitContact,
    curOpts: ([["usd", "USD"], ["bdt", "BDT"]] as const).map(([k, l]) => ({ label: l, bg: cur === k ? "#1F1712" : "transparent", fg: cur === k ? "#F3EEE4" : "#1F1712", pick: () => { setCur(k); setCBudget(""); } })),
    cChips: CONTACT_SERVICES.map(l => { const on = cServices.includes(l); return { label: l, bg: on ? "#1F1712" : "transparent", fg: on ? "#F3EEE4" : "#1F1712", toggle: () => setCServices(on ? cServices.filter(x => x !== l) : [...cServices, l]) }; }),
    bChips: (usd ? BUDGETS_USD : BUDGETS_BDT).map(l => { const on = cBudget === l; return { label: l, bg: on ? "#1F1712" : "transparent", fg: on ? "#F3EEE4" : "#1F1712", toggle: () => setCBudget(on ? "" : l) }; }),
  };
  return <ContactView v={v} />;
}
