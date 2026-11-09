import { z } from "zod";

const email = z.string().trim().email("Write an email address with an @, like name@example.com.").max(200);

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Write your password.").max(200),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Write your name, at least 2 letters.").max(120),
  email,
  password: z
    .string()
    .min(10, "Use at least 10 characters for the password.")
    .max(200, "Keep the password under 200 characters."),
});

export const resetSchema = z.object({ email });

export type AuthMode = "sign-in" | "register" | "reset";
