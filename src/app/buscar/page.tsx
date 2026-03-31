import Link from "next/link";
import type { Metadata } from "next";
import { ListingKind, ListingStatus } from "@prisma/client";
import { ListingFeedList } from "@/components/listing-feed-list";
import { KindFilterBar } from "@/components/kind-filter-bar";
import { SearchBox } from "@/components/search-box";
import { countryName, isSupportedCountryCode } from "@/lib/countries";
import { getGeoCountryCode } from "@/lib/detect-country";
import { prisma } from "@/lib/prisma";
import { normalizePlate } from "@/lib/plates";

export const metadata: Metadata = {
  title: "Ver placas",
};

const BROWSE_PAGE_SIZE = 24;

const emptyCallout =
  "rounded-2xl border-2 border-neutral-200 bg-stone-50/60 px-5 py-6";

type Props = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    page?: string;
    kind?: string;
  }>;
};

export default async function BuscarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const countryParam = (sp.country ?? "").trim().toUpperCase();
  const kindParamRaw = (sp.kind ?? "all").trim().toLowerCase();
  const kindParam: "all" | "found" | "lost" =
    kindParamRaw === "found" ? "found" : kindParamRaw === "lost" ? "lost" : "all";
  const kindFilter: ListingKind | null =
    kindParam === "found" ? "FOUND" : kindParam === "lost" ? "LOST" : null;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const geo = await getGeoCountryCode();
  const countryFilter =
    countryParam.length === 2 && isSupportedCountryCode(countryParam)
      ? countryParam
      : "";
  const countryForSelect = countryFilter || geo || "";

  const kindLabel =
    kindFilter === "FOUND"
      ? "Encontradas"
      : kindFilter === "LOST"
        ? "Perdidas"
        : null;

  const searchResults =
    q.length > 0
      ? await prisma.listing.findMany({
          where: {
            status: ListingStatus.ACTIVE,
            plateNormalized: normalizePlate(q),
            ...(countryFilter ? { countryCode: countryFilter } : {}),
            ...(kindFilter ? { kind: kindFilter } : {}),
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        })
      : [];

  const browseWhere = {
    status: ListingStatus.ACTIVE,
    ...(countryFilter ? { countryCode: countryFilter } : {}),
    ...(kindFilter ? { kind: kindFilter } : {}),
  };

  const total =
    q.length === 0
      ? await prisma.listing.count({ where: browseWhere })
      : 0;

  const totalPages =
    q.length === 0 ? Math.max(1, Math.ceil(total / BROWSE_PAGE_SIZE)) : 1;
  const browsePage = Math.min(page, totalPages);

  const recentListings =
    q.length === 0
      ? await prisma.listing.findMany({
          where: browseWhere,
          orderBy: { createdAt: "desc" },
          skip: (browsePage - 1) * BROWSE_PAGE_SIZE,
          take: BROWSE_PAGE_SIZE,
        })
      : [];

  const from = total === 0 ? 0 : (browsePage - 1) * BROWSE_PAGE_SIZE + 1;
  const to = Math.min(browsePage * BROWSE_PAGE_SIZE, total);

  const browseQs = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (countryFilter) params.set("country", countryFilter);
    if (kindParam !== "all") params.set("kind", kindParam);
    const s = params.toString();
    return s ? `?${s}` : "";
  };

  const resultsPanel =
    q.length > 0 ? (
      searchResults.length === 0 ? (
        <div className={emptyCallout}>
          <p className="text-stone-700">
            No hay publicaciones activas para{" "}
            <strong className="font-mono font-semibold text-neutral-950">
              {q}
            </strong>
            {countryFilter ? ` en ${countryName(countryFilter)}` : ""}
            {kindLabel ? ` · ${kindLabel}` : ""}.{" "}
            <Link href="/publicar" className="link-text">
              Publica un aviso
            </Link>
            .
          </p>
        </div>
      ) : (
        <section className="space-y-4" aria-label="Resultados de búsqueda">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
              Resultados
            </h2>
            <p className="text-sm text-stone-500">
              {searchResults.length}{" "}
              {searchResults.length === 1 ? "coincidencia" : "coincidencias"}
            </p>
          </div>
          <ListingFeedList listings={searchResults} />
        </section>
      )
    ) : (
      <section className="space-y-4" aria-label="Publicaciones recientes">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
            Publicaciones recientes
          </h2>
          {total > 0 ? (
            <span className="text-sm text-stone-500">
              {total} en total
              {countryFilter ? ` · ${countryName(countryFilter)}` : ""}
              {kindLabel ? ` · ${kindLabel}` : ""}
            </span>
          ) : null}
        </div>
        {total === 0 ? (
          <div className={emptyCallout}>
            <p className="text-stone-700">
              No hay publicaciones activas
              {countryFilter ? ` en ${countryName(countryFilter)}` : ""}.{" "}
              {kindLabel ? `Actualmente no hay ${kindLabel.toLowerCase()} activas.` : null}{" "}
              <Link href="/publicar" className="link-text">
                Publicar la primera
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-stone-500">
              Mostrando {from}–{to} de {total}
              {kindLabel ? ` · ${kindLabel}` : ""}
            </p>
            <ListingFeedList listings={recentListings} />
            {totalPages > 1 ? (
              <nav
                className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                aria-label="Paginación"
              >
                <div className="text-sm text-stone-600">
                  Página{" "}
                  <span className="font-semibold text-neutral-950">
                    {browsePage}
                  </span>{" "}
                  de {totalPages}
                </div>
                <div className="flex flex-wrap gap-2">
                  {browsePage > 1 ? (
                    <Link
                      href={`/buscar${browseQs(browsePage - 1)}`}
                      className="btn-secondary px-4 py-2 text-xs sm:text-sm"
                    >
                      Anterior
                    </Link>
                  ) : (
                    <span className="rounded-full px-4 py-2 text-sm text-stone-400">
                      Anterior
                    </span>
                  )}
                  {browsePage < totalPages ? (
                    <Link
                      href={`/buscar${browseQs(browsePage + 1)}`}
                      className="btn-primary px-4 py-2 text-xs sm:text-sm"
                    >
                      Siguiente
                    </Link>
                  ) : (
                    <span className="rounded-full px-4 py-2 text-sm text-stone-400">
                      Siguiente
                    </span>
                  )}
                </div>
              </nav>
            ) : null}
          </>
        )}
      </section>
    );

  return (
    <div className="space-y-0">
      <section className="bleed-full relative overflow-hidden bg-linear-to-b from-stone-50 via-white to-white pb-10 sm:pb-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-[3rem] bg-neutral-400/12 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-24 h-64 w-64 rounded-full bg-slate-400/12 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pt-8">
          <header className="mb-8 max-w-2xl lg:mb-10">
            <p className="section-kicker">Directorio</p>
            <h1 className="page-title">Ver placas</h1>
            <p className="mt-2 text-sm leading-snug text-stone-500">
              Busca por número exacto o revisa el listado reciente.
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
            <aside className="lg:col-span-4 xl:col-span-4">
              <div className="rounded-2xl border border-neutral-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-5 lg:sticky lg:top-20">
                <h2 className="sr-only">Filtros de búsqueda</h2>
                <SearchBox
                  compact
                  defaultQuery={q}
                  defaultCountry={countryForSelect}
                  showKindFilter={false}
                  defaultKind={
                    kindParam === "found"
                      ? "found"
                      : kindParam === "lost"
                        ? "lost"
                        : "all"
                  }
                />
              </div>
            </aside>
            <div className="min-w-0 lg:col-span-8 xl:col-span-8">
              <div className="mb-4">
                <KindFilterBar kind={kindParam} q={q} country={countryFilter} />
              </div>
              {resultsPanel}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
