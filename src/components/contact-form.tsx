"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions/contact-actions";

const initial: ContactState = {};

function SubmitLabel() {
  const { pending } = useFormStatus();
  return pending ? "Enviando…" : "Enviar mensaje";
}

export function ContactForm({
  listingId,
  defaultEmail = "",
}: {
  listingId: string;
  defaultEmail?: string;
}) {
  const [state, formAction] = useActionState(submitContact, initial);

  if (state.success) {
    return (
      <p
        className="rounded-2xl border border-slate-200/90 bg-slate-50 px-4 py-3 text-sm text-slate-900"
        role="status"
      >
        {state.success}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="listingId" value={listingId} />
      <div>
        <label htmlFor="fromEmail" className="form-label">
          Tu correo
        </label>
        <input
          id="fromEmail"
          name="fromEmail"
          type="email"
          required
          defaultValue={defaultEmail}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="message" className="form-label">
          Mensaje (mín. 10 caracteres)
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          className="input-field min-h-[6rem] resize-y"
          placeholder="Describe cómo contactarte o dónde viste la placa…"
        />
      </div>
      {state.error ? (
        <p
          className="text-sm text-red-700"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn-primary w-full sm:w-auto">
        <SubmitLabel />
      </button>
    </form>
  );
}
