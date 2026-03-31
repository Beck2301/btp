import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-16 text-center">
      <div className="card-surface border-2 border-neutral-200 py-10">
        <p className="section-kicker justify-center text-center">Error 404</p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-950">
          Página no encontrada
        </h1>
        <p className="mt-3 text-stone-600">
          Esa ruta no existe o ya no está disponible.
        </p>
        <Link href="/" className="btn-primary mx-auto mt-6 inline-flex">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
