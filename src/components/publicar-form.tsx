"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ListingKind } from "@prisma/client";
import { createListing, type ActionState } from "@/app/actions/listing-actions";
import { COUNTRIES } from "@/lib/countries";
import { whatsappCallingCode } from "@/lib/whatsapp-calling-codes";

const initial: ActionState = {};

function SubmitLabel() {
  const { pending } = useFormStatus();
  return pending ? "Publicando…" : "Publicar";
}

export function PublicarForm({
  defaultCountryCode,
}: {
  defaultCountryCode: string;
}) {
  const [state, formAction] = useActionState(createListing, initial);
  const defaultWhatsappPrefix = whatsappCallingCode(defaultCountryCode);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className="space-y-3">
        <legend className="form-label mb-2">Tipo</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <label className="choice-pill flex-1 sm:min-w-[10rem]">
            <input
              type="radio"
              name="kind"
              value={ListingKind.LOST}
              defaultChecked
              required
              className="accent-neutral-950"
            />
            Perdí mi placa
          </label>
          <label className="choice-pill flex-1 sm:min-w-[10rem]">
            <input
              type="radio"
              name="kind"
              value={ListingKind.FOUND}
              required
              className="accent-neutral-950"
            />
            Encontré una placa
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="countryCode" className="form-label">
          País
        </label>
        <select
          id="countryCode"
          name="countryCode"
          required
          defaultValue={defaultCountryCode}
          className="select-field max-w-md"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs leading-relaxed text-stone-500">
          Lo sugerimos según tu conexión; cámbialo si no coincide.
        </p>
      </div>

      <div>
        <label htmlFor="region" className="form-label">
          Región o ciudad (opcional)
        </label>
        <input
          id="region"
          name="region"
          type="text"
          maxLength={120}
          className="input-field max-w-md"
          placeholder="Ej. San Salvador"
        />
      </div>

      <div>
        <label htmlFor="plateRaw" className="form-label">
          Placa (como la recuerdas)
        </label>
        <input
          id="plateRaw"
          name="plateRaw"
          type="text"
          required
          maxLength={32}
          className="input-field max-w-md font-mono tracking-wide"
        />
      </div>

      <div>
        <label htmlFor="description" className="form-label">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={5}
          className="input-field min-h-[8rem] resize-y"
          placeholder="Fecha aproximada, vehículo, detalles que ayuden a identificar…"
        />
      </div>

      <div>
        <label htmlFor="locationNote" className="form-label">
          Lugar aproximado (opcional)
        </label>
        <input
          id="locationNote"
          name="locationNote"
          type="text"
          maxLength={500}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="whatsappDigits" className="form-label">
          WhatsApp opcional (solo números, sin +)
        </label>
        <input
          id="whatsappDigits"
          name="whatsappDigits"
          type="text"
          inputMode="numeric"
          className="input-field max-w-md font-mono"
          defaultValue={defaultWhatsappPrefix}
          placeholder={`${defaultWhatsappPrefix}12345678 — enlace en la ficha pública`}
        />
        <p className="mt-2 text-xs leading-relaxed text-stone-500">
          Si lo dejas vacío, el contacto será solo por el formulario (y el correo
          del publicador si está configurado).
        </p>
      </div>

      {state.error ? (
        <p
          className="rounded-xl border border-red-200/90 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn-primary w-full max-w-xs">
        <SubmitLabel />
      </button>
    </form>
  );
}
