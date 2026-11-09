"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, resetSchema, signInSchema, type AuthMode } from "@/lib/auth-schemas";

const config = {
  "sign-in": { schema: signInSchema, button: "Sign in", fields: ["email", "password"] as const },
  register: { schema: registerSchema, button: "Create an account", fields: ["name", "email", "password"] as const },
  reset: { schema: resetSchema, button: "Send the reset link", fields: ["email"] as const },
};

const labels: Record<string, string> = { name: "Your name", email: "Email", password: "Password" };
const autocomplete: Record<AuthMode, Record<string, string>> = {
  "sign-in": { email: "email", password: "current-password" },
  register: { name: "name", email: "email", password: "new-password" },
  reset: { email: "email" },
};

/**
 * Sign in, register and reset share one form recipe. Phase 2: FastAPI sets an HttpOnly,
 * Secure, SameSite=Lax session cookie (Argon2id hashes, rate-limited, locked after
 * repeated failures). The reset answer never says whether an email has an account.
 */
export function AuthForm({ mode }: { mode: AuthMode }) {
  const uid = useId();
  const { schema, button, fields } = config[mode];
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "error" | "ok"; text: string }>({ kind: "idle", text: "" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, string>>({
    resolver: zodResolver(schema as never),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const onSubmit = async (data: Record<string, string>) => {
    setStatus({ kind: "sending", text: "Sending…" });
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "same-origin",
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ kind: "ok", text: body.message ?? "Done." });
        return;
      }
      setStatus({ kind: "error", text: body.error ?? "That did not work. Try again in a moment." });
    } catch {
      setStatus({ kind: "error", text: "No connection. Check your internet and try again." });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      {fields.map((name) => (
        <div key={name} className="field">
          <label htmlFor={`${uid}-${name}`}>{labels[name]}</label>
          <input
            id={`${uid}-${name}`}
            className="input"
            type={name === "password" ? "password" : name === "email" ? "email" : "text"}
            autoComplete={autocomplete[mode][name]}
            spellCheck={name === "name" ? undefined : false}
            aria-invalid={errors[name] ? true : undefined}
            aria-describedby={errors[name] ? `${uid}-${name}-error` : undefined}
            {...register(name)}
          />
          {errors[name] && (
            <p className="field__error" id={`${uid}-${name}-error`}>
              {String(errors[name]?.message)}
            </p>
          )}
        </div>
      ))}
      <button type="submit" className="btn btn--primary justify-self-start" disabled={status.kind === "sending"}>
        {button}
      </button>
      <p role="status" className={`t-small ${status.kind === "error" ? "text-danger" : "text-muted"}`}>
        {status.text}
      </p>
    </form>
  );
}
