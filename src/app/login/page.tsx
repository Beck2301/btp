import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";
import { PageIntro } from "@/components/page-intro";
import { messageForAuthError } from "@/lib/auth-errors";

type Props = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const session = await auth();

  const callbackUrl =
    typeof sp.callbackUrl === "string" ? sp.callbackUrl : undefined;
  const safeCallback =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : undefined;

  if (session?.user) {
    redirect(safeCallback ?? "/mis-publicaciones");
  }

  const errorCode = typeof sp.error === "string" ? sp.error : undefined;
  const authErrorBanner = messageForAuthError(errorCode);

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <PageIntro
        kicker="Acceso"
        title="Entrar"
        lead="Necesitas una sesión para ver tus publicaciones, editar tus avisos y mantener tu información al día. Te enviamos un enlace mágico al correo, sin contraseña."
      />
      {authErrorBanner ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200/90 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {authErrorBanner}
        </div>
      ) : null}
      <LoginForm callbackUrl={safeCallback} />
    </div>
  );
}
