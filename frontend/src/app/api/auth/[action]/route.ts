import { NextResponse, type NextRequest } from "next/server";
import { registerSchema, resetSchema, signInSchema } from "@/lib/auth-schemas";

const schemas = { "sign-in": signInSchema, register: registerSchema, reset: resetSchema } as const;

/**
 * UI phase stand-in for the FastAPI auth endpoints. It validates input the same way the
 * backend will and says plainly that accounts are not live yet.
 */
export async function POST(req: NextRequest, ctx: RouteContext<"/api/auth/[action]">) {
  const { action } = await ctx.params;
  const schema = schemas[action as keyof typeof schemas];
  if (!schema) return NextResponse.json({ error: "Unknown action." }, { status: 404 });

  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return NextResponse.json({ error: "Cross-site request refused." }, { status: 403 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the fields." }, { status: 422 });

  if (action === "reset") {
    // Same answer whether or not the email has an account (no account enumeration).
    return NextResponse.json({ message: "If that email has an account, a reset link is on its way. It works for 30 minutes." });
  }
  return NextResponse.json({ error: "Accounts open when the store goes live. You can still buy as a guest." }, { status: 503 });
}
