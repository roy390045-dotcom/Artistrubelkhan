"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryInput } from "@/lib/enquiry";

/**
 * The one form recipe (taste-skill system.md, Forms): visible labels, errors under each
 * field checked on submit, the first failing field focused, one status line, and a
 * confirmation only after the server accepted the enquiry.
 */
export function EnquiryForm({ artwork = "", onSent }: { artwork?: string; onSent?: () => void }) {
  const uid = useId();
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "sent" | "error"; text: string }>({ kind: "idle", text: "" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    defaultValues: { name: "", email: "", message: "", artwork, website: "" },
  });

  const onSubmit = async (data: EnquiryInput) => {
    const slow = window.setTimeout(() => setStatus({ kind: "sending", text: "Sending" }), 300);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      window.clearTimeout(slow);
      if (!res.ok) throw new Error(String(res.status));
      setStatus({ kind: "sent", text: "Your enquiry is sent. The reply comes to the email address you gave." });
      reset({ name: "", email: "", message: "", artwork, website: "" });
      onSent?.();
    } catch {
      window.clearTimeout(slow);
      setStatus({ kind: "error", text: "The enquiry did not send. Check your connection and press Send enquiry again; your words are kept." });
    }
  };

  const errorCount = Object.keys(errors).length;
  const f = (name: keyof EnquiryInput) => ({
    id: `${uid}-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <div className="field">
        <label htmlFor={`${uid}-name`}>Your name</label>
        <input className="input" autoComplete="name" {...f("name")} {...register("name")} />
        {errors.name && (
          <p className="field__error" id={`${uid}-name-error`}>
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor={`${uid}-email`}>Email</label>
        <input className="input" type="email" autoComplete="email" {...f("email")} {...register("email")} />
        {errors.email && (
          <p className="field__error" id={`${uid}-email-error`}>
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor={`${uid}-artwork`}>
          Painting <span className="font-normal text-muted">(optional)</span>
        </label>
        <input className="input" {...f("artwork")} {...register("artwork")} />
      </div>
      <div className="field">
        <label htmlFor={`${uid}-message`}>Message</label>
        <textarea className="input" rows={5} {...f("message")} {...register("message")} />
        {errors.message && (
          <p className="field__error" id={`${uid}-message-error`}>
            {errors.message.message}
          </p>
        )}
      </div>
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <div className="grid gap-3">
        <button type="submit" className="btn btn--primary justify-self-start" disabled={status.kind === "sending"}>
          Send enquiry
        </button>
        <p role="status" className={`t-small ${status.kind === "error" ? "text-danger" : "text-muted"}`}>
          {errorCount > 0 && status.kind !== "sending"
            ? `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} a fix before sending.`
            : status.text}
        </p>
        {status.kind !== "sent" && <p className="t-small text-muted">Replies come by email.</p>}
      </div>
    </form>
  );
}
