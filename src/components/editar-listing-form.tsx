"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ListingKind, ListingStatus, type Listing } from "@prisma/client";
import { updateListing, type ActionState } from "@/app/actions/listing-actions";
import { COUNTRIES } from "@/lib/countries";

function SubmitLabel() {
  const { pending } = useFormStatus();
  return pending ? "Guardando…" : "Guardar cambios";
}

export function EditarListingForm({ listing }: { listing: Listing }) {
  const bound = updateListing.bind(null, listing.id);
  const [state, formAction] = useActionState(bound, {} as ActionState);

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
              defaultChecked={listing.kind === ListingKind.LOST}
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
              defaultChecked={listing.kind === ListingKind.FOUND}
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
          defaultValue={listing.countryCode}
          className="select-field max-w-md"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
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
          defaultValue={listing.region ?? ""}
          className="input-field max-w-md"
        />
      </div>

      <div>
        <label htmlFor="plateRaw" className="form-label">
          Placa
        </label>
        <input
          id="plateRaw"
          name="plateRaw"
          type="text"
          required
          maxLength={32}
          defaultValue={listing.plateRaw}
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
          defaultValue={listing.description}
          className="input-field min-h-[8rem] resize-y"
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
          defaultValue={listing.locationNote ?? ""}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="whatsappDigits" className="form-label">
          WhatsApp opcional (solo números)
        </label>
        <input
          id="whatsappDigits"
          name="whatsappDigits"
          type="text"
          defaultValue={listing.whatsappDigits ?? ""}
          className="input-field max-w-md font-mono"
        />
      </div>

      <div>
        <label htmlFor="status" className="form-label">
          Estado de la publicación
        </label>
        <select
          id="status"
          name="status"
          defaultValue={listing.status}
          className="select-field max-w-md"
        >
          <option value={ListingStatus.ACTIVE}>Activa</option>
          <option value={ListingStatus.RESOLVED}>Resuelta</option>
          <option value={ListingStatus.REPORTED}>Reportada</option>
        </select>
      </div>

      {state.error ? (
        <p
          className="rounded-xl border border-red-200/90 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          role="status"
        >
          {state.success}
        </p>
      ) : null}

      <button type="submit" className="btn-primary w-full max-w-xs">
        <SubmitLabel />
      </button>
    </form>
  );
}
