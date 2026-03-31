import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200/90 bg-white py-10 text-sm text-stone-600">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-10">
        <p className="max-w-md leading-relaxed">
          Comunidad para buscar y encontrar placas extraviadas. No sustituye
          trámites oficiales.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/legal/privacidad" className="link-text">
            Privacidad
          </Link>
          <Link href="/legal/aviso" className="link-text">
            Aviso legal
          </Link>
        </div>
      </div>
    </footer>
  );
}
