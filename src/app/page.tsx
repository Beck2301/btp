import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-0">
      <section className="bleed-full bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            <div className="max-w-xl lg:max-w-none">
              <h1 className="text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.12] tracking-tight text-neutral-950">
                La forma{" "}
                <span className="relative inline-block rounded-full bg-blue-100/55 px-3 py-0.5 ring-1 ring-blue-200/80 shadow-[0_10px_28px_-18px_rgba(29,78,216,0.45)]">
                  más eficiente
                </span>{" "}
                para encontrar o publicar placas{" "}
                <span className="relative mt-1 inline-block rounded-full bg-slate-900/10 px-3 py-0.5 ring-1 ring-blue-700/20">
                  extraviadas
                </span>
                .
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-stone-600 sm:text-lg">
                Sin trámites oficiales: solo avisos y contacto. Elige si buscas
                o si quieres publicar.
              </p>
            </div>

            <div className="relative lg:pl-4">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-6 top-0 h-72 w-72 rounded-[3rem] bg-neutral-400/10 blur-3xl sm:h-80 sm:w-80"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-12 h-64 w-64 rounded-full bg-slate-400/10 blur-3xl"
              />

              <ul className="relative z-10 mx-auto max-w-md list-none space-y-3 lg:mx-0">
                <li>
                  <Link
                    href="/buscar"
                    className="group flex items-center justify-between gap-4 rounded-xl border-2 border-neutral-200 bg-white px-6 py-5 shadow-sm transition hover:border-neutral-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900/30"
                  >
                    <div>
                      <span className="text-lg font-semibold text-neutral-950 sm:text-xl">
                        Ver placas perdidas
                      </span>
                      <p className="mt-1 text-sm text-stone-600">
                        Buscar y explorar avisos
                      </p>
                    </div>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-lg text-neutral-950 transition group-hover:border-neutral-300 group-hover:bg-neutral-200/80"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publicar"
                    className="group flex items-center justify-between gap-4 rounded-xl border-2 border-neutral-950 bg-neutral-950 px-6 py-5 text-white shadow-md transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
                  >
                    <div>
                      <span className="text-lg font-semibold leading-snug sm:text-xl">
                        Encontré una placa / Perdí la mía
                      </span>
                      <p className="mt-1 text-sm text-white/75">
                        Publicar un aviso
                      </p>
                    </div>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg text-neutral-950 transition group-hover:bg-neutral-100"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
