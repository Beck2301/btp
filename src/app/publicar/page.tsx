import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageIntro } from "@/components/page-intro";
import { PublicarForm } from "@/components/publicar-form";
import {
  defaultPublishCountryCode,
  getGeoCountryCode,
} from "@/lib/detect-country";

export default async function PublicarPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/publicar");
  }

  const geo = await getGeoCountryCode();
  const defaultCountryCode = defaultPublishCountryCode(geo);

  return (
    <div className="space-y-8">
      <PageIntro
        kicker="Nueva entrada"
        title="Publicar aviso"
        lead="Los datos de la publicación son visibles; tu correo no. WhatsApp solo si lo añades."
      />
      <div className="card-surface">
        <PublicarForm defaultCountryCode={defaultCountryCode} />
      </div>
    </div>
  );
}
