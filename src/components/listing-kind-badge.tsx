import type { ListingKind } from "@prisma/client";

const labels: Record<ListingKind, string> = {
  LOST: "Perdida",
  FOUND: "Encontrada",
};

const styles: Record<ListingKind, string> = {
  LOST: "bg-amber-100/75 text-amber-950 ring-1 ring-amber-200/75",
  FOUND: "bg-blue-100/75 text-blue-950 ring-1 ring-blue-200/75",
};

export function ListingKindBadge({ kind }: { kind: ListingKind }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${styles[kind]}`}
    >
      {labels[kind]}
    </span>
  );
}
