"use client";

import { useActionState } from "react";
import { ListingStatus } from "@prisma/client";
import {
  setListingStatusFromForm,
  type ActionState,
} from "@/app/actions/listing-actions";

const initial: ActionState = {};

export function QuickStatusForm({
  listingId,
  label = "Marcar como resuelta",
}: {
  listingId: string;
  label?: string;
}) {
  const [state, formAction] = useActionState(setListingStatusFromForm, initial);

  if (state.error) {
    return (
      <span className="text-sm font-medium text-red-700">
        {state.error}
      </span>
    );
  }

  if (state.success) {
    return (
      <span className="text-sm font-medium text-slate-800">
        {state.success}
      </span>
    );
  }

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="status" value={ListingStatus.RESOLVED} />
      <button
        type="submit"
        className="btn-ghost border-2 border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-950 hover:border-neutral-950 hover:bg-stone-50"
      >
        {label}
      </button>
    </form>
  );
}
