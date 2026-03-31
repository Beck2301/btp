/** Oculta parte del local-part para mostrar en UI sin exponer el correo completo. */
export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at < 1) return "***";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (!domain) return "***";
  if (local.length <= 2) return `***@${domain}`;
  return `${local[0]}***${local.slice(-1)}@${domain}`;
}
