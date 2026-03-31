import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { EditarListingForm } from "@/components/editar-listing-form";
import { PageIntro } from "@/components/page-intro";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditarListingPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/publicar/${id}/editar`);
  }

  const listing = await prisma.listing.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!listing) notFound();

  return (
    <div className="space-y-8">
      <p className="-mt-1">
        <Link
          href="/mis-publicaciones"
          className="btn-ghost -ml-1 inline-flex items-center gap-1.5 text-stone-600"
        >
          <span aria-hidden>←</span>
          Ir atrás
        </Link>
      </p>
      <PageIntro kicker="Editar" title="Tu publicación">
        <p className="font-mono text-lg font-semibold tracking-tight text-neutral-950">
          {listing.plateRaw}
        </p>
      </PageIntro>
      <div className="card-surface">
        <EditarListingForm listing={listing} />
      </div>
    </div>
  );
}
