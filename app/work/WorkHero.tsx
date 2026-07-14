"use client";
import Link from "next/link";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4";

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
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
            {count > 0 ? `Selected Work · ${String(count).padStart(2, "0")} Case Studies` : "Selected Work"}
          </p>
          <h1
            className="text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animation: "fadeSlideUp .8s ease .4s both" }}
          >
            Shaping digital<br />
            products, one<br />
            shipped build at a time.
          </h1>
        </div>

        {/* ── bottom ── */}
        <div>
          <p
            className="mb-5 max-w-sm text-sm leading-relaxed text-white/60 sm:mb-6 sm:max-w-lg sm:text-base md:text-lg"
            style={{ animation: "fadeSlideUp .8s ease .7s both" }}
          >
            Products built end to end, from seed-stage MVPs to multi-vendor platforms shipping at scale.
          </p>
          <Link
            href="#work-archive"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105 sm:px-6 sm:py-3"
            style={{ animation: "fadeSlideUp .8s ease .9s both" }}
          >
            Explore Work
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
