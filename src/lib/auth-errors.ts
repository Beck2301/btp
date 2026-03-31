/** Mensajes en español para códigos ?error= de Auth.js en /login */
export function messageForAuthError(
  code: string | undefined,
): string | null {
  if (!code) return null;

  const map: Record<string, string> = {
    Configuration:
      "Error de configuración del servidor (revisa AUTH_SECRET y el proveedor de correo).",
    AccessDenied: "Acceso denegado.",
    Verification:
      "El enlace ya no es válido o expiró. Pide uno nuevo desde aquí.",
    OAuthSignin: "Error al iniciar sesión con el proveedor.",
    OAuthCallback: "Error en la respuesta del proveedor.",
    OAuthCreateAccount: "No se pudo crear la cuenta.",
    EmailCreateAccount: "No se pudo crear la cuenta con ese correo.",
    Callback: "Error en el enlace de retorno.",
    OAuthAccountNotLinked:
      "Ese correo ya está asociado a otro método de acceso.",
    EmailSignin: "No se pudo enviar el correo de acceso.",
    CredentialsSignin: "Credenciales incorrectas.",
    SessionRequired: "Necesitas iniciar sesión para ver esta página.",
    default: "Algo salió mal al iniciar sesión. Intenta de nuevo.",
  };

  return map[code] ?? map.default;
}
