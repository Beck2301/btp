import nodemailer from "nodemailer";

function hasSmtp(): boolean {
  return Boolean(process.env.SMTP_HOST?.trim());
}

function hasResend(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (hasResend()) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });
      if (!res.ok) {
        const raw = await res.text();
        try {
          const j = JSON.parse(raw) as { message?: string };
          return {
            ok: false,
            error: j.message ?? raw,
          };
        } catch {
          return { ok: false, error: raw };
        }
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Resend error" };
    }
  }

  if (hasSmtp()) {
    try {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASSWORD
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              }
            : undefined,
      });
      await transport.sendMail({
        from: process.env.EMAIL_FROM ?? "noreply@localhost",
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "SMTP error" };
    }
  }

  return { ok: false, error: "Sin configuración de correo" };
}
