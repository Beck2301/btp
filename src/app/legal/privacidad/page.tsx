import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidad",
};

export default function PrivacidadPage() {
  return (
    <article className="max-w-2xl space-y-5 leading-relaxed text-stone-800">
      <h1 className="page-title text-3xl">Privacidad</h1>
      <p>
        Esta aplicación es un proyecto comunitario para ayudar a conectar a
        quienes pierden o encuentran placas vehiculares. El responsable del
        tratamiento de los datos es quien despliegue la instancia.
      </p>
      <h2 className="text-lg font-semibold text-neutral-950">
        Qué datos recogemos
      </h2>
      <ul className="list-inside list-disc space-y-2">
        <li>
          <strong>Correo electrónico</strong> para iniciar sesión con enlace
          mágico y, si lo configuras en el servidor, para notificaciones.
        </li>
        <li>
          <strong>Contenido de las publicaciones</strong> (placa, país, texto
          descriptivo, notas de ubicación y, si lo indicas, un número para
          WhatsApp).
        </li>
        <li>
          <strong>Mensajes de contacto</strong>: correo del remitente y texto
          del mensaje, visibles para el autor de la publicación en «Mis
          publicaciones».
        </li>
      </ul>
      <h2 className="text-lg font-semibold text-neutral-950">
        Finalidad
      </h2>
      <p>
        Facilitar la publicación, búsqueda y contacto entre usuarios. No
        vendemos datos a terceros en esta plantilla de código abierto; quien
        despliegue el servicio debe cumplir la ley aplicable (por ejemplo,
        informar a usuarios y definir conservación).
      </p>
      <h2 className="text-lg font-semibold text-neutral-950">
        Conservación
      </h2>
      <p>
        Puedes borrar o marcar como resueltas tus publicaciones desde «Mis
        publicaciones». Los mensajes de contacto se conservan asociados a la
        publicación hasta que elimines la publicación o la base de datos.
      </p>
      <p>
        <Link href="/" className="link-text">
          Volver al inicio
        </Link>
      </p>
    </article>
  );
}
