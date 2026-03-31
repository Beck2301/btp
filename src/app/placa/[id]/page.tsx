import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingStatus } from "@prisma/client";
import { auth } from "@/auth";
import { ContactForm } from "@/components/contact-form";
import { ListingKindBadge } from "@/components/listing-kind-badge";
import { ReportListingForm } from "@/components/report-listing-form";
import { countryName } from "@/lib/countries";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function PlacaDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { user: { select: { id: true } } },
  });

  if (!listing) notFound();

  const isOwner = session?.user?.id === listing.userId;
  if (listing.status !== ListingStatus.ACTIVE && !isOwner) notFound();

  const showContact =
    listing.status === ListingStatus.ACTIVE && !isOwner;

  return (
    <article className="space-y-8">
      <div>
        <Link
          href="/buscar"
          className="inline-flex items-center gap-1 text-sm font-medium text-stone-600 transition hover:text-neutral-950"
        >
          <span aria-hidden>←</span> Volver a ver placas
        </Link>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            {listing.plateRaw}
          </h1>
          <ListingKindBadge kind={listing.kind} />
        </div>
        <p className="mt-3 text-stone-600">
          {countryName(listing.countryCode)}
          {listing.region ? ` · ${listing.region}` : ""}
        </p>
        {listing.status !== ListingStatus.ACTIVE ? (
          <p className="mt-3 rounded-xl border border-stone-300/90 bg-stone-100 px-4 py-2 text-sm font-medium text-stone-900">
            Estado:{" "}
            {listing.status === ListingStatus.RESOLVED
              ? "Resuelta"
              : "Reportada / en revisión"}
          </p>
        ) : null}
      </div>

      <section className="card-surface">
        <h2 className="section-kicker mb-3">Descripción</h2>
        <p className="whitespace-pre-wrap leading-relaxed text-stone-800">
          {listing.description}
        </p>
        {listing.locationNote ? (
          <>
            <h3 className="mt-6 text-sm font-semibold text-stone-500">
              Lugar aproximado
            </h3>
            <p className="mt-1 text-stone-800">{listing.locationNote}</p>
          </>
        ) : null}
      </section>

      {listing.whatsappDigits && listing.status === ListingStatus.ACTIVE ? (
        <section className="card-surface">
          <h2 className="text-sm font-semibold text-stone-600">
            WhatsApp del publicador
          </h2>
          <a
            href={`https://wa.me/${listing.whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex rounded-full bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/25 transition hover:bg-slate-700"
          >
            Abrir WhatsApp
          </a>
          <p className="mt-3 text-xs text-stone-500">
            Enlace elegido por quien publicó. Úsalo con respeto.
          </p>
        </section>
      ) : null}

      {showContact ? (
        <section className="card-surface">
          <h2 className="text-lg font-semibold text-neutral-950">
            Contactar
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Tu mensaje queda registrado para el publicador. Si el sitio tiene
            correo configurado, intentamos avisarle.
          </p>
          <div className="mt-5">
            <ContactForm
              listingId={listing.id}
              defaultEmail={session?.user?.email ?? ""}
            />
          </div>
        </section>
      ) : null}

      {isOwner ? (
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/publicar/${listing.id}/editar`}
            className="btn-secondary"
          >
            Editar publicación
          </Link>
        </div>
      ) : (
        <ReportListingForm listingId={listing.id} />
      )}
    </article>
  );
}
