import { z } from "zod";

/** Shared by the enquiry form (client) and POST /api/enquiry (server). */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Write your name, at least 2 letters.").max(120, "Keep your name under 120 characters."),
  email: z.string().trim().email("Write an email address with an @ and a domain, like name@example.com.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Write a few words about what you would like to know, at least 10 letters.")
    .max(4000, "Keep the message under 4,000 characters."),
  artwork: z.string().trim().max(160).optional().or(z.literal("")),
  /** Honeypot: real people never see or fill this field. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
