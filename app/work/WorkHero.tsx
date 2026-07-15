"use client";
import Link from "next/link";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4";

/* same arrow the rest of the site uses; .btn .chip rotates it 45deg and straightens it on hover */
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

export default function WorkHero({ count }: { count: number }) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black" style={{ fontFamily: "var(--f-sans)" }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        src={HERO_VIDEO}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "70% center" }}
      />
      {/* keeps the white type legible wherever the footage goes bright */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.25) 42%, rgba(0,0,0,.8) 100%)" }}
      />

      {/* the site's fixed Nav sits in this band — reserving it keeps the spec's calc(100vh-80px) geometry */}
      <div className="h-20" aria-hidden="true" />

      <div className="relative z-10 flex h-[calc(100vh-80px)] flex-col justify-between px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16">
        {/* ── top ── */}
        <div className="max-w-3xl">
          <p
            className="mb-4 text-xs text-white/90 sm:mb-6 sm:text-sm"
            style={{ animation: "fadeSlideUp .8s ease .2s both" }}
          >
            {count > 0
              ? `${String(count).padStart(2, "0")} case studies · ${String(count).padStart(2, "0")} live sites`
              : "Selected work"}
          </p>
          <h1
            className="text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animation: "fadeSlideUp .8s ease .4s both" }}
          >
            Read the case studies.<br />
            Or skip them and<br />
            open the live sites.
          </h1>
        </div>

        {/* ── bottom ── */}
        <div>
          <p
            className="mb-5 max-w-sm text-sm leading-relaxed text-white/60 sm:mb-6 sm:max-w-lg sm:text-base md:text-lg"
            style={{ animation: "fadeSlideUp .8s ease .7s both" }}
          >
            Same team designed, built and shipped every one of them. The links are right there. No demo data, no NDA wall.
          </p>
          <Link
            href="#work-archive"
            className="btn work-hero-btn"
            style={{ animation: "fadeSlideUp .8s ease .9s both" }}
          >
            <span className="label">Open the work</span>
            <span className="chip"><ArrowIcon /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
