import { NextResponse, type NextRequest } from "next/server";
import { getArtworksByIds } from "@/lib/api";
import { checkoutRequestSchema } from "@/lib/checkout";
import { shippingZones } from "@/lib/site";

/**
 * POST /api/checkout
 *
 * UI phase: validates the request and returns the totals computed on the server, so the
 * page can show them, then reports that no payment gateway is connected yet.
 *
 * Phase 3 (FastAPI) does, in one database transaction:
 *   1. re-read prices and stock for every line (never trust the browser),
 *   2. reserve stock with a conditional UPDATE (stock_qty >= qty), 15-minute hold,
 *   3. validate and redeem the coupon atomically,
 *   4. create the order (public_id UUIDv7) with item and address snapshots,
 *   5. create the SSLCommerz session or Stripe Checkout Session with an idempotency key,
 * then returns { redirectUrl }. The order is marked paid only by the verified IPN/webhook.
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return NextResponse.json({ error: "Cross-site request refused." }, { status: 403 });
  }
  const idempotencyKey = req.headers.get("idempotency-key");
  if (!idempotencyKey || idempotencyKey.length > 100) {
    return NextResponse.json({ error: "Missing idempotency key." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Send the order as JSON." }, { status: 400 });
  }
  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the highlighted fields.", fields: parsed.error.flatten() }, { status: 422 });
  }
  const { form, lines } = parsed.data;

  const artworks = await getArtworksByIds(lines.map((l) => l.artworkId));
  const problems: string[] = [];
  let subtotal = 0;
  for (const line of lines) {
    const a = artworks.find((x) => x.id === line.artworkId);
    if (!a || a.status !== "available" || a.stockQty < line.quantity) {
      problems.push(a ? `${a.title} is no longer available in that quantity.` : "A painting in your cart is no longer listed.");
      continue;
    }
    subtotal += a.price.amount * line.quantity;
  }
  if (problems.length) {
    return NextResponse.json({ error: problems.join(" "), unavailable: true }, { status: 409 });
  }

  const zone = shippingZones.find((z) => z.id === form.zone)!;
  const totals = {
    subtotal: { amount: subtotal, currency: "BDT" as const },
    delivery: zone.rate,
    discount: { amount: 0, currency: "BDT" as const },
    total: { amount: subtotal + zone.rate.amount, currency: "BDT" as const },
  };

  return NextResponse.json(
    {
      status: "gateway_not_configured",
      message:
        form.payment === "sslcommerz"
          ? "SSLCommerz is not connected yet. Your order was checked and nothing was charged."
          : "Stripe is not connected yet. Your order was checked and nothing was charged.",
      totals,
    },
    { status: 503 },
  );
}
