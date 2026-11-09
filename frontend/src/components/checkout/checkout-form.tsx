"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { districts } from "@/lib/bd";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { checkoutSchema, type CheckoutInput } from "@/lib/checkout";
import { formatMoney } from "@/lib/format";
import type { ShippingZone } from "@/lib/types";
import { ArtImage } from "../art-image";

const subscribeNoop = () => () => {};

type Status = { kind: "idle" | "sending" | "error" | "notice"; text: string };

export function CheckoutForm({ zones }: { zones: ShippingZone[] }) {
  const uid = useId();
  const items = useCart((s) => s.items);
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });
  // One idempotency key per checkout attempt: a double click or a retry never creates two orders.
  const idemKey = useRef<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      country: "BD",
      countryName: "",
      addressLine: "",
      area: "",
      district: "",
      city: "",
      postalCode: "",
      zone: "inside_dhaka",
      payment: "sslcommerz",
      coupon: "",
      acceptTerms: false as unknown as true,
    },
  });

  const [country, zoneId, payment] = useWatch({ control, name: ["country", "zone", "payment"] });
  const zone = zones.find((z) => z.id === zoneId) ?? zones[0];
  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const total = { amount: subtotal.amount + zone.rate.amount, currency: subtotal.currency };

  if (!hydrated) return <div className="h-96 animate-pulse rounded-[var(--r-md)] bg-surface" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="grid justify-items-start gap-4 py-10">
        <p className="t-lead">Your cart is empty, so there is nothing to check out.</p>
        <Link href="/shop?availability=available" className="btn btn--primary">
          See available paintings
        </Link>
      </div>
    );
  }

  const onSubmit = async (form: CheckoutInput) => {
    if (!idemKey.current) idemKey.current = crypto.randomUUID();
    setStatus({ kind: "sending", text: "Checking your order…" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idemKey.current },
        body: JSON.stringify({ form, lines: items.map((i) => ({ artworkId: i.artworkId, quantity: i.quantity })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.redirectUrl) {
        // Phase 3: the hosted SSLCommerz or Stripe page.
        window.location.assign(data.redirectUrl);
        return;
      }
      if (res.status === 503 && data.status === "gateway_not_configured") {
        setStatus({ kind: "notice", text: `${data.message} Server total: ${formatMoney(data.totals.total)}.` });
        return;
      }
      setStatus({ kind: "error", text: data.error ?? "The order could not be checked. Try again in a moment; your details are kept." });
    } catch {
      setStatus({ kind: "error", text: "No connection. Check your internet and press the button again; your details are kept." });
    }
  };

  const errorCount = Object.keys(errors).length;
  const fieldProps = (name: keyof CheckoutInput) => ({
    id: `${uid}-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
  });
  const Err = ({ name }: { name: keyof CheckoutInput }) =>
    errors[name] ? (
      <p className="field__error" id={`${uid}-${name}-error`}>
        {String(errors[name]?.message)}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-12 lg:grid-cols-12 lg:gap-6">
      <div className="grid content-start gap-12 lg:col-span-7">
        <fieldset className="grid gap-5">
          <legend className="t-h3 mb-5">Contact</legend>
          <div className="field">
            <label htmlFor={`${uid}-email`}>Email for the receipt and delivery updates</label>
            <input className="input" type="email" autoComplete="email" spellCheck={false} {...fieldProps("email")} {...register("email")} />
            <Err name="email" />
          </div>
        </fieldset>

        <fieldset className="grid gap-5">
          <legend className="t-h3 mb-5">Delivery address</legend>
          <div className="field">
            <label htmlFor={`${uid}-country`}>Country</label>
            <select
              className="input"
              {...fieldProps("country")}
              {...register("country", {
                onChange: (e) => setValue("zone", e.target.value === "BD" ? "inside_dhaka" : "international"),
              })}
            >
              <option value="BD">Bangladesh</option>
              <option value="OTHER">Another country</option>
            </select>
          </div>
          {country === "OTHER" && (
            <div className="field">
              <label htmlFor={`${uid}-countryName`}>Country name</label>
              <input className="input" autoComplete="country-name" {...fieldProps("countryName")} {...register("countryName")} />
              <Err name="countryName" />
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor={`${uid}-name`}>Recipient&apos;s name</label>
              <input className="input" autoComplete="name" {...fieldProps("name")} {...register("name")} />
              <Err name="name" />
            </div>
            <div className="field">
              <label htmlFor={`${uid}-phone`}>{country === "BD" ? "Mobile number" : "Phone with country code"}</label>
              <input className="input" type="tel" autoComplete="tel" inputMode="tel" {...fieldProps("phone")} {...register("phone")} />
              <Err name="phone" />
            </div>
          </div>
          <div className="field">
            <label htmlFor={`${uid}-addressLine`}>House, road and area</label>
            <input className="input" autoComplete="address-line1" {...fieldProps("addressLine")} {...register("addressLine")} />
            <Err name="addressLine" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor={`${uid}-area`}>{country === "BD" ? "Thana or upazila" : "State or region"}</label>
              <input className="input" autoComplete="address-level3" {...fieldProps("area")} {...register("area")} />
              <Err name="area" />
            </div>
            {country === "BD" ? (
              <div className="field">
                <label htmlFor={`${uid}-district`}>District</label>
                <select
                  className="input"
                  {...fieldProps("district")}
                  {...register("district", {
                    onChange: (e) => setValue("zone", e.target.value === "Dhaka" ? "inside_dhaka" : "outside_dhaka"),
                  })}
                >
                  <option value="">Choose a district</option>
                  {districts.map((d) => (
                    <option key={d.district} value={d.district}>
                      {d.district}
                    </option>
                  ))}
                </select>
                <Err name="district" />
              </div>
            ) : (
              <div className="field">
                <label htmlFor={`${uid}-city`}>City</label>
                <input className="input" autoComplete="address-level2" {...fieldProps("city")} {...register("city")} />
                <Err name="city" />
              </div>
            )}
          </div>
          <div className="field sm:max-w-[50%]">
            <label htmlFor={`${uid}-postalCode`}>
              Postal code <span className="font-normal text-muted">(optional)</span>
            </label>
            <input className="input" autoComplete="postal-code" {...fieldProps("postalCode")} {...register("postalCode")} />
          </div>
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="t-h3 mb-5">Delivery</legend>
          {zones
            .filter((z) => (country === "BD" ? z.id !== "international" : z.id === "international"))
            .map((z) => (
              <label
                key={z.id}
                className="flex min-h-14 cursor-pointer items-center gap-4 rounded-[var(--r-sm)] border border-line-strong px-4 has-[:checked]:border-ink has-[:checked]:bg-paper"
              >
                <input type="radio" value={z.id} {...register("zone")} className="size-5 accent-[var(--ink)]" />
                <span className="flex-1">
                  {z.name} <span className="text-muted">, {z.eta}</span>
                </span>
                <span className="tabular">{formatMoney(z.rate)}</span>
              </label>
            ))}
          <Err name="zone" />
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="t-h3 mb-5">Payment</legend>
          <label className="grid min-h-14 cursor-pointer grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 rounded-[var(--r-sm)] border border-line-strong p-4 has-[:checked]:border-ink has-[:checked]:bg-paper">
            <input type="radio" value="sslcommerz" {...register("payment")} className="size-5 accent-[var(--ink)]" />
            <span className="font-medium">bKash, Nagad, Rocket or a Bangladeshi card</span>
            <span className="t-small col-start-2 text-muted">Paid in taka through SSLCommerz. You leave this site to pay and come back.</span>
          </label>
          <label className="grid min-h-14 cursor-pointer grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 rounded-[var(--r-sm)] border border-line-strong p-4 has-[:checked]:border-ink has-[:checked]:bg-paper">
            <input type="radio" value="stripe" {...register("payment")} className="size-5 accent-[var(--ink)]" />
            <span className="font-medium">International card</span>
            <span className="t-small col-start-2 text-muted">Visa, Mastercard or Amex through Stripe, charged in US dollars at the day&apos;s rate.</span>
          </label>
          <p className="t-small mt-2 flex items-center gap-2 text-muted">
            <Lock size={14} aria-hidden="true" />
            Card details are entered on the payment provider&apos;s page and never reach this site.
          </p>
        </fieldset>
      </div>

      <aside className="lg:col-span-4 lg:col-start-9" aria-label="Order summary">
        <div className="grid gap-6 rounded-[var(--r-md)] border border-line bg-paper p-6 lg:sticky lg:top-[calc(var(--nav)+24px)]">
          <h2 className="t-h3">Your order</h2>
          <ul className="grid gap-4">
            {items.map((i) => (
              <li key={i.artworkId} className="grid grid-cols-[64px_1fr_auto] items-center gap-4">
                <div className="art-frame art-frame--center aspect-square">
                  <ArtImage image={i.image} sizes="64px" />
                </div>
                <div>
                  <p className="leading-snug font-medium">{i.title}</p>
                  <p className="t-small text-muted">{i.quantity > 1 ? `${i.quantity} prints` : i.medium}</p>
                </div>
                <p className="tabular">{formatMoney({ amount: i.price.amount * i.quantity, currency: i.price.currency })}</p>
              </li>
            ))}
          </ul>
          <div className="field">
            <label htmlFor={`${uid}-coupon`}>
              Discount code <span className="font-normal text-muted">(optional)</span>
            </label>
            <input className="input" autoComplete="off" {...fieldProps("coupon")} {...register("coupon")} />
          </div>
          <dl className="grid gap-2 border-t border-line pt-4 tabular">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery, {zone.name.toLowerCase()}</dt>
              <dd>{formatMoney(zone.rate)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-3 text-[20px] font-medium">
              <dt>Total</dt>
              <dd>{formatMoney(total)}</dd>
            </div>
          </dl>
          <label className="flex cursor-pointer items-start gap-3 text-[15px]">
            <input type="checkbox" {...register("acceptTerms")} {...fieldProps("acceptTerms")} className="mt-0.5 size-5 shrink-0 accent-[var(--ink)]" />
            <span>
              I accept the{" "}
              <Link href="/terms" className="link" target="_blank">
                terms of sale
              </Link>{" "}
              and the{" "}
              <Link href="/delivery" className="link" target="_blank">
                delivery and returns policy
              </Link>
              .
            </span>
          </label>
          <Err name="acceptTerms" />
          <button type="submit" className="btn btn--primary btn--block" disabled={status.kind === "sending"}>
            {payment === "stripe" ? "Pay by card" : "Pay"} {formatMoney(total)}
          </button>
          <p
            role="status"
            className={`t-small ${status.kind === "error" ? "text-danger" : status.kind === "notice" ? "rounded-[var(--r-sm)] bg-surface p-3 text-ink" : "text-muted"}`}
          >
            {errorCount > 0 && status.kind !== "sending"
              ? `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} a fix before paying.`
              : status.text || "The total is checked again on the server before you pay."}
          </p>
        </div>
      </aside>
    </form>
  );
}
