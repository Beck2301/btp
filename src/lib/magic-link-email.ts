const APP = "Placas";

/** Contenido del correo de acceso (enlace mágico). */
export function buildMagicLinkEmail(url: string) {
  const subject = `Tu enlace para entrar — ${APP}`;
  const text = [
    `Usa este enlace para entrar en ${APP} (caduca en pocos minutos):`,
    "",
    url,
    "",
    "Si no pediste este correo, ignóralo.",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#18181b;max-width:480px;margin:0;padding:24px;">
  <p style="margin:0 0 16px;">Hola,</p>
  <p style="margin:0 0 16px;">Pulsa el botón para entrar en <strong>${APP}</strong>. El enlace caduca en pocos minutos.</p>
  <p style="margin:24px 0;">
    <a href="${escapeHtml(url)}" style="display:inline-block;background:#18181b;color:#fafafa;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
      Entrar
    </a>
  </p>
  <p style="margin:0 0 8px;font-size:13px;color:#71717a;">Si el botón no funciona, copia y pega esta URL en el navegador:</p>
  <p style="margin:0;font-size:12px;word-break:break-all;color:#52525b;">${escapeHtml(url)}</p>
  <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
  <p style="margin:0;font-size:12px;color:#a1a1aa;">Si no pediste este correo, puedes ignorarlo.</p>
</body>
</html>`;

  return { subject, text, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
