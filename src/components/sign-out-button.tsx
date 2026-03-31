"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="btn-ghost text-xs sm:text-sm"
    >
      Salir
    </button>
  );
}
