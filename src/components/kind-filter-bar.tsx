"use client";

import { useRouter } from "next/navigation";

type Kind = "all" | "found" | "lost";

function kindToLabel(kind: Kind) {
  switch (kind) {
    case "found":
      return "Encontradas";
    case "lost":
      return "Perdidas";
    default:
      return "Todo";
  }
}

function kindToParams(kind: Kind) {
  if (kind === "all") return null;
  return kind;
}

export function KindFilterBar({
  kind,
  q,
  country,
}: {
  kind: Kind;
  q: string;
  country: string;
}) {
  const router = useRouter();

  const setKind = (nextKind: Kind) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (country) params.set("country", country);
    params.set("page", "1");
    const kindParam = kindToParams(nextKind);
    if (kindParam) params.set("kind", kindParam);

    const s = params.toString();
    router.push(s ? `/buscar?${s}` : "/buscar");
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    if (country) params.set("country", country);
    params.set("page", "1");
    const s = params.toString();
    router.push(s ? `/buscar?${s}` : "/buscar");
  };

  const base =
    "flex-1 min-w-0 rounded-full border px-3 py-1.5 text-center text-[12px] font-semibold transition";

  const button =
    "bg-white/70 text-stone-600 border-neutral-200 hover:bg-white cursor-pointer";

  const buttonFound =
    "bg-blue-50/80 text-blue-900 border-blue-200";

  const buttonLost =
    "bg-amber-50/80 text-amber-900 border-amber-200";

  const buttonActive = (k: Kind) => {
    if (k === "found") return buttonFound;
    if (k === "lost") return buttonLost;
    return "bg-neutral-100 text-neutral-950 border-neutral-300";
  };

  const active = kind;
  const hasPlate = q.trim().length > 0;

  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white/60 p-2 shadow-sm backdrop-blur-sm">
      <div className="flex gap-2">
        {(["all", "found", "lost"] as const).map((k) => {
          const isActive = active === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={[
                base,
                button,
                isActive ? buttonActive(k) : "",
              ].join(" ")}
            >
              {kindToLabel(k)}
            </button>
          );
        })}
      </div>
      {active !== "all" || hasPlate ? (
        <button
          type="button"
          onClick={clearAll}
          aria-label="Limpiar filtros"
          className="absolute cursor-pointer font-bold -top-16 right-0 inline-flex p-2 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-stone-600 shadow-sm transition hover:bg-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="15" height="15" ><path  d="m37.304 11.282l1.414 1.414l-26.022 26.02l-1.414-1.413z"/><path  d="m12.696 11.282l26.022 26.02l-1.414 1.415l-26.022-26.02z"/></svg>
        </button>
      ) : null}
    </div>
  );
}

