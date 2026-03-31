import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso legal",
};

export default function AvisoLegalPage() {
  return (
    <article className="max-w-2xl space-y-5 leading-relaxed text-stone-800">
      <h1 className="page-title text-3xl">Aviso legal</h1>
      <p>
        El sitio es un <strong>intermediario informativo</strong> entre
        personas. No somos una entidad gubernamental ni sustituimos trámites
        oficiales de reposición de placas, denuncias o seguros.
      </p>
      <h2 className="text-lg font-semibold text-neutral-950">
        Uso del servicio
      </h2>
      <p>
        Eres responsable de la veracidad de lo que publicas y de cómo
        contactas a otras personas. No publiques datos ajenos sin permiso ni uses
        la plataforma para acoso, fraude o venta de datos.
      </p>
      <h2 className="text-lg font-semibold text-neutral-950">
        Moderación
      </h2>
      <p>
        Las publicaciones pueden ser marcadas como «reportadas» por la
        comunidad. Quien administre la instancia puede revisar y dar de baja
        contenidos que incumplan normas o la ley.
      </p>
      <h2 className="text-lg font-semibold text-neutral-950">
        Limitación de responsabilidad
      </h2>
      <p>
        El software se ofrece «tal cual». No garantizamos que encontrarás tu
        placa ni la exactitud de las publicaciones de terceros.
      </p>
      <p>
        <Link href="/" className="link-text">
          Volver al inicio
        </Link>
      </p>
    </article>
  );
}
