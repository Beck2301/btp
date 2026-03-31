"use client";

import { useActionState } from "react";
import {
  reportListingFromForm,
  type ActionState,
} from "@/app/actions/listing-actions";

const initial: ActionState = {};

export function ReportListingForm({ listingId }: { listingId: string }) {
  const [state, formAction] = useActionState(reportListingFromForm, initial);

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <input type="hidden" name="listingId" value={listingId} />
      {state.success ? (
        <p className="text-sm font-medium text-slate-800">
          {state.success}
        </p>
      ) : (
        <button
          type="submit"
          className="btn-ghost text-sm text-stone-500 hover:text-stone-800"
        >
          Reportar contenido inapropiado
        </button>
      )}
      {state.error ? (
        <p className="text-sm text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}
