"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await signIn("nodemailer", {
        email: email.trim(),
        redirect: false,
        callbackUrl: callbackUrl ?? "/mis-publicaciones",
      });

      if (res?.error) {
        setError(
          "No se pudo enviar el enlace. Revisa el correo o la configuración SMTP/Resend.",
        );
        return;
      }

      const next = new URLSearchParams();
      next.set("email", email.trim());
      window.location.href = `/login/verify?${next.toString()}`;
    } catch {
      setError("Algo salió mal. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex max-w-md flex-col gap-6 card-surface p-8"
    >
      <div>
        <label htmlFor="email" className="form-label">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="tu@correo.com"
        />
      </div>
      {error ? (
        <p
          className="rounded-xl border border-red-200/90 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Enviando…" : "Enviar enlace mágico"}
      </button>
      <p className="text-xs leading-relaxed text-stone-500">
        Sin contraseña: recibirás un enlace para entrar. Si no ves el correo,
        revisa spam/promociones y vuelve a solicitar acceso.
      </p>
      <p className="text-center text-sm">
        <Link href="/" className="link-text">
          Volver al inicio
        </Link>
      </p>
    </form>
  );
}
