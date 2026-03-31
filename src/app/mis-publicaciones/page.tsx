import Link from "next/link";
import { redirect } from "next/navigation";
import { ListingStatus } from "@prisma/client";
import { auth } from "@/auth";
import { ListingKindBadge } from "@/components/listing-kind-badge";
import { PageIntro } from "@/components/page-intro";
import { QuickStatusForm } from "@/components/quick-status-form";
import { countryName } from "@/lib/countries";
import { prisma } from "@/lib/prisma";

export default async function MisPublicacionesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/mis-publicaciones");
  }

  const [listings, messages] = await Promise.all([
    prisma.listing.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.contactRequest.findMany({
      where: { listing: { userId: session.user.id } },
      orderBy: { createdAt: "desc" },
      take: 80,
      include: {
        listing: { select: { id: true, plateRaw: true, kind: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-12">
      <PageIntro
        kicker="Tu cuenta"
        title="Mis publicaciones"
        lead="Gestiona tus avisos. Los mensajes de contacto aparecen abajo."
      />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-950">
          Tus placas
        </h2>
        {listings.length === 0 ? (
          <p className="text-stone-600">
            Aún no publicas nada.{" "}
            <Link href="/publicar" className="link-text">
              Crear publicación
            </Link>
          </p>
        ) : (
          <ul className="space-y-3">
            {listings.map((l) => (
              <li
                key={l.id}
                className="flex flex-col gap-4 rounded-2xl border-2 border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-semibold tracking-tight text-neutral-950">
                      {l.plateRaw}
                    </span>
                    <ListingKindBadge kind={l.kind} />
                    <span className="text-sm text-stone-500">
                      {countryName(l.countryCode)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-stone-500">
                    Estado:{" "}
                    {l.status === ListingStatus.ACTIVE
                      ? "Activa"
                      : l.status === ListingStatus.RESOLVED
                        ? "Resuelta"
                        : "Reportada"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Link
                    href={`/placa/${l.id}`}
                    className="btn-secondary px-4 py-2 text-xs"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/publicar/${l.id}/editar`}
                    className="btn-primary px-4 py-2 text-xs"
                  >
                    Editar
                  </Link>
                  {l.status === ListingStatus.ACTIVE ? (
                    <QuickStatusForm listingId={l.id} />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-950">
          Mensajes recibidos
        </h2>
        {messages.length === 0 ? (
          <p className="text-sm leading-relaxed text-stone-500">
            Cuando alguien use el formulario de contacto en tus publicaciones
            activas, verás el mensaje aquí.
          </p>
        ) : (
          <ul className="space-y-4">
            {messages.map((m) => (
              <li
                key={m.id}
                className="rounded-2xl border-2 border-neutral-200 bg-stone-50/40 p-5"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Link
                    href={`/placa/${m.listing.id}`}
                    className="link-text font-mono font-semibold"
                  >
                    {m.listing.plateRaw}
                  </Link>
                  <ListingKindBadge kind={m.listing.kind} />
                  <time
                    className="text-stone-500"
                    dateTime={m.createdAt.toISOString()}
                  >
                    {m.createdAt.toLocaleString("es")}
                  </time>
                </div>
                <p className="mt-3 text-sm text-stone-800">
                  <span className="font-semibold text-stone-600">De:</span>{" "}
                  <a className="link-text" href={`mailto:${m.fromEmail}`}>
                    {m.fromEmail}
                  </a>
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                  {m.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
