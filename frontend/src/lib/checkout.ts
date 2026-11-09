import { z } from "zod";
import { bdMobile } from "./bd";

/**
 * Checkout form contract, shared by the client form and POST /api/checkout. The client
 * sends only ids and quantities plus the address: never a price or a total. The server
 * re-reads every price, reserves stock and computes the total itself.
 */
export const checkoutSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Write an email address with an @, like name@example.com.")
      .max(200),
    name: z.string().trim().min(2, "Write the recipient's full name.").max(120),
    phone: z.string().trim().max(20),
    country: z.enum(["BD", "OTHER"]),
    countryName: z.string().trim().max(80).optional().or(z.literal("")),
    addressLine: z
      .string()
      .trim()
      .min(5, "Write the house, road and area.")
      .max(240),
    area: z
      .string()
      .trim()
      .min(2, "Write the area, thana or upazila.")
      .max(120),
    district: z.string().trim().max(80),
    city: z.string().trim().max(80).optional().or(z.literal("")),
    postalCode: z.string().trim().max(12).optional().or(z.literal("")),
    zone: z.enum(["inside_dhaka", "outside_dhaka", "international"]),
    payment: z.enum(["sslcommerz", "stripe"]),
    coupon: z.string().trim().max(40).optional().or(z.literal("")),
    acceptTerms: z.literal(true, {
      error: "Tick the box to accept the terms of sale.",
    }),
  })
  .superRefine(
    (v, ctx) => {
      // Runs even when other fields failed, so every problem shows in one round.
      const phone = typeof v.phone === "string" ? v.phone : "";
      if (v.country === "BD") {
        if (!bdMobile.test(phone.replace(/[\s-]/g, ""))) {
          ctx.addIssue({
            code: "custom",
            path: ["phone"],
            message:
              "Write a Bangladeshi mobile number, 11 digits starting with 01.",
          });
        }
        if (!v.district)
          ctx.addIssue({
            code: "custom",
            path: ["district"],
            message: "Choose the district.",
          });
        if (v.zone === "international")
          ctx.addIssue({
            code: "custom",
            path: ["zone"],
            message:
              "Choose Inside Dhaka or Outside Dhaka for a Bangladeshi address.",
          });
      } else {
        if (phone.replace(/\D/g, "").length < 7)
          ctx.addIssue({
            code: "custom",
            path: ["phone"],
            message: "Write a phone number with the country code.",
          });
        if (!v.countryName)
          ctx.addIssue({
            code: "custom",
            path: ["countryName"],
            message: "Write the country.",
          });
        if (!v.city)
          ctx.addIssue({
            code: "custom",
            path: ["city"],
            message: "Write the city.",
          });
        if (v.zone !== "international")
          ctx.addIssue({
            code: "custom",
            path: ["zone"],
            message:
              "Choose International delivery for an address outside Bangladesh.",
          });
      }
    },
    {
      when: (payload) =>
        typeof payload.value === "object" && payload.value !== null,
    },
  );

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const checkoutRequestSchema = z.object({
  form: checkoutSchema,
  lines: z
    .array(
      z.object({
        artworkId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(50),
});
