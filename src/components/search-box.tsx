import { COUNTRIES, countryName } from "@/lib/countries";

export function SearchBox({
  defaultQuery = "",
  defaultCountry = "",
  defaultKind = "all",
  compact = false,
  showKindFilter = true,
}: {
  defaultQuery?: string;
  defaultCountry?: string;
  defaultKind?: "all" | "found" | "lost";
  /** Menos padding, campos más bajos y textos auxiliares breves (p. ej. columna lateral). */
  compact?: boolean;
  /** Para layouts donde el tipo se gestiona aparte (p. ej. bar a la derecha). */
  showKindFilter?: boolean;
}) {
  const countryHint =
    defaultCountry !== ""
      ? ` · ${countryName(defaultCountry)} por defecto`
      : "";
  const kind = defaultKind;

  const KindPill = ({
    value,
    label,
    activeClasses,
  }: {
    value: "all" | "found" | "lost";
    label: string;
    activeClasses: string;
  }) => {
    const isActive = kind === value;
    return (
      <label
        className={[
          "flex w-full min-w-0 cursor-pointer items-center justify-center rounded-lg border px-2 py-1.5 text-[10px] font-semibold leading-tight transition",
          isActive
            ? activeClasses
            : "border-neutral-200 bg-white/70 text-stone-600 hover:bg-white",
        ].join(" ")}
      >
        <input
          type="radio"
          name="kind"
          value={value}
          defaultChecked={isActive}
          className="sr-only"
        />
        {label}
      </label>
    );
  };

  if (compact) {
    return (
      <form
        action="/buscar"
        method="get"
        className="flex w-full flex-col gap-3"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="q"
              className="mb-1 block text-xs font-semibold text-stone-800"
            >
              Placa
            </label>
            <input
              id="q"
              name="q"
              type="text"
              defaultValue={defaultQuery}
              placeholder="Ej. P123456"
              className="input-field py-2 font-mono text-sm tracking-wide"
            />
          </div>
        </div>
        {showKindFilter ? (
          <div className="rounded-xl border border-neutral-200 bg-stone-50/50 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Tipo
            </p>
            <div className="grid grid-cols-1 gap-2">
              <KindPill
                value="all"
                label="Todo"
                activeClasses="border-neutral-300 bg-neutral-100/70 text-neutral-950"
              />
              <KindPill
                value="found"
                label="Encontradas"
                activeClasses="border-blue-200 bg-blue-50/70 text-blue-900"
              />
              <KindPill
                value="lost"
                label="Perdidas"
                activeClasses="border-amber-200 bg-amber-50/70 text-amber-900"
              />
            </div>
          </div>
        ) : null}
        <details className="group rounded-lg bg-stone-50/60 px-2.5 py-2">
          <summary className="cursor-pointer list-none text-xs font-medium text-stone-600 outline-none transition group-open:text-neutral-950 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <span className="text-neutral-950">País</span>
              <span className="font-normal text-stone-500">
                (opcional){countryHint}
              </span>
              <span className="text-stone-400 transition group-open:rotate-180">
                ▾
              </span>
            </span>
          </summary>
          <div className="mt-2 border-t border-neutral-200/70 pt-2">
            <label htmlFor="country" className="sr-only">
              País
            </label>
            <select
              id="country"
              name="country"
              defaultValue={defaultCountry}
              className="select-field w-full py-2 text-sm"
            >
              <option value="">Cualquiera</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </details>
        <button
          type="submit"
          className="btn-primary w-full shrink-0 px-4 py-2 text-sm sm:w-auto sm:min-w-26"
        >
          Buscar
        </button>
      </form>
    );
  }

  return (
    <form action="/buscar" method="get" className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="q" className="form-label">
            Número de placa
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={defaultQuery}
            placeholder="Ej. P123456"
            className="input-field font-mono text-base tracking-wide"
          />
          <p className="mt-2 text-xs leading-relaxed text-stone-500">
            Opcional: déjalo vacío y pulsa Buscar para aplicar solo el país al
            listado inferior.
          </p>
        </div>
        <button
          type="submit"
          className="btn-primary shrink-0 sm:min-w-34"
        >
          Buscar
        </button>
      </div>
      {showKindFilter ? (
        <div className="rounded-xl border border-neutral-200 bg-stone-50/50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Tipo
          </p>
          <div className="flex flex-wrap gap-2">
            <KindPill
              value="all"
              label="Todo"
              activeClasses="border-neutral-300 bg-neutral-100 text-neutral-950"
            />
            <KindPill
              value="found"
              label="Encontradas"
              activeClasses="border-blue-200 bg-blue-50/70 text-blue-900"
            />
            <KindPill
              value="lost"
              label="Perdidas"
              activeClasses="border-amber-200 bg-amber-50/70 text-amber-900"
            />
          </div>
        </div>
      ) : null}
      <details className="group rounded-xl border-2 border-neutral-200 bg-stone-50/50 px-4 py-3">
        <summary className="cursor-pointer list-none text-sm font-medium text-stone-600 outline-none transition group-open:text-neutral-950 [&::-webkit-details-marker]:hidden">
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-neutral-950">País de la búsqueda</span>
            <span className="text-xs font-normal text-stone-500">
              (opcional){countryHint}
            </span>
            <span className="text-stone-400 transition group-open:rotate-180">
              ▾
            </span>
          </span>
        </summary>
        <div className="mt-4 max-w-md border-t border-neutral-200/80 pt-4">
          <label htmlFor="country" className="sr-only">
            País
          </label>
          <select
            id="country"
            name="country"
            defaultValue={defaultCountry}
            className="select-field max-w-md text-sm"
          >
            <option value="">Cualquiera</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-relaxed text-stone-500">
            Usamos el país detectado en el servidor; cámbialo si quieres otro
            país o «Cualquiera» para todas las publicaciones.
          </p>
        </div>
      </details>
    </form>
  );
}
