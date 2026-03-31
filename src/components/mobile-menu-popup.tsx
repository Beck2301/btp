"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SignOutButton } from "@/components/sign-out-button";
import { createPortal } from "react-dom";

export function MobileMenuPopup() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const menuContent = isOpen ? (
    <div className="fixed inset-0 z-9999 sm:hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        style={{ position: 'absolute', inset: 0 }}
      />

      <div 
        className="absolute left-4 right-4 top-20"
        style={{ position: 'absolute', left: '1rem', right: '1rem', top: '5rem' }}
      >
        <div className="mx-auto max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Menú
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:bg-stone-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col p-2">
            <Link
              href="/buscar"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-stone-50 transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                <svg className="h-5 w-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <span className="block text-sm font-semibold text-stone-900">Ver placas</span>
                <span className="block text-xs text-stone-500">Buscar y explorar</span>
              </div>
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/publicar"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-stone-50 transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                    <svg className="h-5 w-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-stone-900">Publicar</span>
                    <span className="block text-xs text-stone-500">Crear nuevo aviso</span>
                  </div>
                </Link>

                <Link
                  href="/mis-publicaciones"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-stone-50 transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                    <svg className="h-5 w-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-stone-900">Mis publicaciones</span>
                    <span className="block text-xs text-stone-500">Gestionar avisos</span>
                  </div>
                </Link>

                <div className="my-2 h-px bg-stone-200" />
                <div className="px-2 py-1">
                  <SignOutButton />
                </div>
              </>
            ) : (
              <>
                <div className="my-2 h-px bg-stone-200" />
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition"
                >
                  <svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Iniciar sesión</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Botón Menú Moderno */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 sm:hidden ${
          isOpen
            ? "bg-neutral-950 text-white shadow-lg"
            : "bg-white border border-stone-200 text-stone-700 shadow-sm hover:border-stone-300"
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="5" width="10" height="2" rx="1" />
          <rect x="3" y="11" width="18" height="2" rx="1" />
          <rect x="13" y="17" width="8" height="2" rx="1" />
        </svg>
      </button>

      {mounted && menuContent && createPortal(menuContent, document.body)}
    </>
  );
}
