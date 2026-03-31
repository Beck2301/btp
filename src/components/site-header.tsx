import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-0.5"
        >
          <img
            src="/btp-logo.png"
            alt="Busca Tu Placa (BTP)"
            className="h-7 w-auto"
          />
         
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          <Link href="/buscar" className="nav-link">
            Ver placas
          </Link>
          {session?.user ? (
            <>
              <Link href="/publicar" className="nav-link">
                Publicar
              </Link>
              <Link href="/mis-publicaciones" className="nav-link">
                Mis publicaciones
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="ml-1 inline-flex items-center justify-center rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 sm:text-sm"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
