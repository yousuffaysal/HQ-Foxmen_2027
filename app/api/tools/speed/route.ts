import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url } = await req.json() as { url: string };

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PAGESPEED_KEY ?? "";
  const apiUrl =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(url)}&strategy=mobile` +
    (apiKey ? `&key=${apiKey}` : "");

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "Could not analyse URL" }, { status: 400 });
    }

    const data = await res.json() as {
      lighthouseResult?: {
        categories?: { performance?: { score?: number } };
        audits?: Record<string, { displayValue?: string; score?: number }>;
      };
    };

    const cats   = data.lighthouseResult?.categories;
    const audits = data.lighthouseResult?.audits;

    return NextResponse.json({
      score:      Math.round((cats?.performance?.score ?? 0) * 100),
      fcp:        audits?.["first-contentful-paint"]?.displayValue,
      lcp:        audits?.["largest-contentful-paint"]?.displayValue,
      cls:        audits?.["cumulative-layout-shift"]?.displayValue,
      tbt:        audits?.["total-blocking-time"]?.displayValue,
      speedIndex: audits?.["speed-index"]?.displayValue,
      fcpScore:   audits?.["first-contentful-paint"]?.score ?? 0,
      lcpScore:   audits?.["largest-contentful-paint"]?.score ?? 0,
      clsScore:   audits?.["cumulative-layout-shift"]?.score ?? 0,
      tbtScore:   audits?.["total-blocking-time"]?.score ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Failed to analyse URL" }, { status: 500 });
  }
}
