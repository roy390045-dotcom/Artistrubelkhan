import { NextResponse, type NextRequest } from "next/server";
import { enquirySchema } from "@/lib/enquiry";

/**
 * POST /api/enquiry. UI phase: validates and accepts. Phase 2 forwards the enquiry to
 * FastAPI (ENQUIRIES table + email to the artist). Cloudflare rate-limits this path in
 * production; the in-memory limiter below covers the single-process dev/VPS case.
 */
const hits = new Map<string, { count: number; reset: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  h.count += 1;
  return h.count > LIMIT;
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return NextResponse.json({ error: "Cross-site request refused." }, { status: 403 });
  }
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many enquiries. Try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Send the enquiry as JSON." }, { status: 400 });
  }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the fields.", fields: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  if (parsed.data.website) {
    // Honeypot filled: answer like a success so bots learn nothing.
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  // Phase 2: await fetch(`${process.env.API_URL}/enquiries`, { method: "POST", ... })
  return NextResponse.json({ ok: true }, { status: 202 });
}
