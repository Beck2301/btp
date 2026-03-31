"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { SignOutButton } from "@/components/sign-out-button";
import { MobileMenuPopup } from "@/components/mobile-menu-popup";

export function SiteHeaderClient() {
  const { data: session } = useSession();

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

        {/* Desktop Navigation */}
        <nav className="hidden items-center justify-end gap-1 sm:flex sm:gap-2">
          <Link href="/buscar" className="nav-link text-sm">
            Ver placas
          </Link>
          {session?.user ? (
            <>
              <Link href="/publicar" className="nav-link text-sm">
                Publicar
              </Link>
              <Link href="/mis-publicaciones" className="nav-link text-sm">
                Mis publicaciones
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="ml-1 inline-flex items-center justify-center rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Entrar
            </Link>
          )}
        </nav>

        <MobileMenuPopup />
      </div>
    </header>
  );
}
