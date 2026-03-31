import Link from "next/link";
import type { ListingKind } from "@prisma/client";
import { ListingKindBadge } from "@/components/listing-kind-badge";
import { countryName } from "@/lib/countries";

export type ListingFeedRow = {
  id: string;
  plateRaw: string;
  kind: ListingKind;
  countryCode: string;
  region: string | null;
  description: string;
};

const kindAccent: Record<ListingKind, string> = {
  LOST: "border-l-amber-500/55 group-hover:border-l-amber-600/80",
  FOUND: "border-l-blue-500/45 group-hover:border-l-blue-600/80",
};

export function ListingFeedList({ listings }: { listings: ListingFeedRow[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {listings.map((row) => (
        <li key={row.id} className="min-w-0">
          <Link
            href={`/placa/${row.id}`}
            className={`group feed-card relative flex flex-col border-l-4 pl-4 pr-4 py-4 sm:pl-5 transition duration-200 hover:-translate-y-0.5 ${kindAccent[row.kind]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  <span className="font-mono text-xl font-semibold tracking-tight text-neutral-950 sm:text-[1.35rem]">
                    {row.plateRaw}
                  </span>
                  <ListingKindBadge kind={row.kind} />
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                  {countryName(row.countryCode)}
                  {row.region ? ` · ${row.region}` : ""}
                </p>
              </div>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-stone-50 text-sm text-neutral-950 transition group-hover:border-neutral-950/20 group-hover:bg-white"
                aria-hidden
              >
                ↗
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-600">
              {row.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
