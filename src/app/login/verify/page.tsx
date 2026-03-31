import Link from "next/link";
import { maskEmail } from "@/lib/mask-email";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyPage({ searchParams }: Props) {
  const sp = await searchParams;
  let raw = "";
  if (typeof sp.email === "string") {
    try {
      raw = decodeURIComponent(sp.email.trim());
    } catch {
      raw = sp.email.trim();
    }
  }
  const hint = raw.includes("@") ? maskEmail(raw) : null;

  return (
    <div className="card-surface mx-auto max-w-lg space-y-5 p-8">
      <p className="section-kicker">Paso siguiente</p>
      <h1 className="text-2xl font-semibold text-neutral-950">
        Revisa tu correo
      </h1>
      {hint ? (
        <p className="leading-relaxed text-stone-800">
          Te enviamos un enlace para entrar a{" "}
          <strong className="font-mono text-neutral-950">{hint}</strong>. Ábrelo
          en este dispositivo cuando puedas.
        </p>
      ) : (
        <p className="text-stone-600">
          Te enviamos un enlace para entrar. Revisa el correo que usaste al
          solicitar el acceso.
        </p>
      )}
      <p className="text-sm leading-relaxed text-stone-600">
        Al iniciar sesión podrás ver tus publicaciones, editar tus avisos y
        actualizar tu información. El correo suele llegar en uno o dos
        minutos.
      </p>
      <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-stone-600">
        <li>Revisa también spam o promociones.</li>
        <li>
          El enlace caduca en poco tiempo; si expiró, vuelve a{" "}
          <Link href="/login" className="link-text">
            Entrar
          </Link>
          .
        </li>
      </ul>
      <div className="flex flex-wrap gap-4 border-t border-neutral-200 pt-5 text-sm">
        <Link href="/login" className="link-text">
          Pedir otro enlace
        </Link>
        <Link href="/" className="link-text">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
