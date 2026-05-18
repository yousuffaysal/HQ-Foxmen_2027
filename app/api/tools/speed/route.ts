import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Top-level catch — ensures we ALWAYS return JSON, never HTML
  try {
    let body: { url?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const rawUrl = body.url?.trim() ?? "";
    if (!rawUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalise — prepend https:// if no scheme
    const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

    try {
      new URL(normalized);
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid website URL (e.g. foxmen.studio)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PAGESPEED_KEY ?? "";
    const apiUrl =
      "https://www.googleapis.com/pagespeedonline/v5/runPagespeed" +
      `?url=${encodeURIComponent(normalized)}&strategy=mobile` +
      (apiKey ? `&key=${apiKey}` : "");

    let res: Response;
    try {
      res = await fetch(apiUrl, { method: "GET" });
    } catch (fetchErr) {
      console.error("[speed] fetch error:", fetchErr);
      return NextResponse.json(
        { error: "Could not reach analysis service. Please try again." },
        { status: 502 }
      );
    }

    // Guard against HTML responses (rate-limits, auth errors, etc.)
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      const preview = await res.text().then(t => t.slice(0, 200)).catch(() => "");
      console.error("[speed] non-JSON response:", res.status, preview);
      return NextResponse.json(
        { error: "Could not analyse this URL. Make sure it is a live, public website." },
        { status: 400 }
      );
    }

    let data: {
      error?: { message?: string; code?: number };
      lighthouseResult?: {
        categories?: { performance?: { score?: number } };
        audits?: Record<string, { displayValue?: string; score?: number }>;
      };
    };
    try {
      data = await res.json();
    } catch (parseErr) {
      console.error("[speed] JSON parse error:", parseErr);
      return NextResponse.json(
        { error: "Received an unreadable response. Please try again." },
        { status: 502 }
      );
    }

    if (!res.ok || data.error) {
      const msg = data.error?.message ?? "Could not analyse this URL";
      console.error("[speed] API error:", data.error);
      return NextResponse.json({ error: msg }, { status: 400 });
    }

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

  } catch (err) {
    console.error("[speed] unhandled error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
