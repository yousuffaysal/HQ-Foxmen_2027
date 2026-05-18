"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = ["Web", "Mobile", "AI integration", "Ecommerce", "Real estate", "Brand · UI · UX", "Marketing"];
const budgets = ["< $25k", "$25–75k", "$75–250k", "$250k+"];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

export default function ContactPage() {
  useScrollReveal();
  const [sent, setSent] = useState(false);
  const [checkedServices, setCheckedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const init = () => {
      if (w.Cal?.ns?.["project-discussion-call"]) {
        w.Cal.ns["project-discussion-call"]("inline", {
          elementOrSelector: "#cal-inline-contact",
          config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
          calLink: "yousuf-faysal/project-discussion-call",
        });
        w.Cal.ns["project-discussion-call"]("ui", { hideEventTypeDetails: false, layout: "month_view" });
      } else {
        setTimeout(init, 150);
      }
    };
    init();
  }, []);

  function toggleService(s: string) {
    setCheckedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs fade in">
            <Link href="/">Home</Link><span className="sep">/</span><span>Contact</span>
          </div>
          <h1 className="display">
            <span className="reveal in"><span className="reveal-inner">Let&apos;s</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner it">talk.</span></span>
          </h1>
          <p className="lede fade in d2">
            Tell us about your project — or just the half-formed idea. We reply within 24 hours, Monday to Friday. No bots, no funnels, no calendar gymnastics.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="wrap-tight">
          <div className="contact-grid">
            <form className="contact-form fade" onSubmit={handleSubmit}>
              <div className="field">
                <label>What should we call you?</label>
                <input type="text" placeholder="Your name" required />
              </div>
              <div className="field">
                <label>Work email</label>
                <input type="email" placeholder="you@company.com" required />
              </div>
              <div className="field">
                <label>Company</label>
                <input type="text" placeholder="Company / brand" />
              </div>

              <div className="field">
                <label>I&apos;m interested in</label>
                <div className="chips" role="group">
                  {services.map((s) => (
                    <label key={s}>
                      <input
                        type="checkbox"
                        hidden
                        checked={checkedServices.includes(s)}
                        onChange={() => toggleService(s)}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Budget range</label>
                <div className="chips" role="group">
                  {budgets.map((b) => (
                    <label key={b} className={budget === b ? "checked" : ""}>
                      <input
                        type="radio"
                        name="budget"
                        hidden
                        checked={budget === b}
                        onChange={() => setBudget(b)}
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Tell us about your project</label>
                <textarea placeholder="What are you building? What's the deadline? What success looks like." />
              </div>

              <button type="submit" className="btn btn--lg" style={{ justifySelf: "start", marginTop: 14 }}>
                {sent
                  ? <span className="label">Sent ✓ — back soon</span>
                  : <>
                      <span className="label">Send the brief</span>
                      <span className="chip"><ArrowIcon /></span>
                    </>
                }
              </button>
            </form>

            <aside className="contact-side fade d2">
              <h3>Other ways <span className="it">in.</span></h3>
              <div className="channel">
                <div className="k">Email</div>
                <div className="v"><a href="mailto:hello@foxmen.studio">hello@foxmen.studio</a></div>
              </div>
              <div className="channel">
                <div className="k">Press &amp; partnerships</div>
                <div className="v"><a href="mailto:press@foxmen.studio">press@foxmen.studio</a></div>
              </div>
              <div className="channel">
                <div className="k">Careers</div>
                <div className="v">
                  <a href="mailto:careers@foxmen.studio">careers@foxmen.studio</a> · <span style={{ color: "var(--brand)" }}>3 open roles</span>
                </div>
              </div>
              <div className="channel">
                <div className="k">Studios</div>
                <div className="v">Dhaka · Berlin · remote worldwide</div>
              </div>
              <div className="channel">
                <div className="k">Hours</div>
                <div className="v">Mon — Fri · 09–18 GMT+6 · replies within 24h</div>
              </div>
              <div className="channel">
                <div className="k">Social</div>
                <div className="v">
                  <a href="#" style={{ marginRight: 14 }}>Twitter</a>
                  <a href="#" style={{ marginRight: 14 }}>Instagram</a>
                  <a href="#" style={{ marginRight: 14 }}>LinkedIn</a>
                  <a href="#">Dribbble</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Inline calendar */}
      <section style={{ padding: "80px 0 100px" }}>
        <div className="wrap">
          <div className="fade in" style={{ marginBottom: 10 }}>
            <span className="eyebrow">Or — book a call</span>
          </div>
          <h2 className="fade in d1" style={{ marginBottom: 40 }}>
            A <span className="it">20-min</span> intro,<br />no slides.
          </h2>
          <div
            id="cal-inline-contact"
            className="fade in d2"
            style={{
              width: "100%",
              height: 700,
              overflow: "scroll",
              borderRadius: 20,
              border: "1px solid var(--line)",
              background: "var(--bone)",
            }}
          />
        </div>
      </section>
    </>
  );
}
