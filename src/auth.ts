import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Nodemailer from "next-auth/providers/nodemailer";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { buildMagicLinkEmail } from "@/lib/magic-link-email";
import { sendEmail } from "@/lib/mail";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  providers: [
    Nodemailer({
      server: {
        host: process.env.SMTP_HOST || "127.0.0.1",
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASSWORD
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              }
            : undefined,
      },
      from: process.env.EMAIL_FROM ?? "Placas <noreply@localhost>",
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { subject, text, html } = buildMagicLinkEmail(url);
        const smtpConfigured = Boolean(process.env.SMTP_HOST?.trim());
        const resendConfigured = Boolean(process.env.RESEND_API_KEY?.trim());

        if (!smtpConfigured && !resendConfigured) {
          console.log("\n========== Enlace mágico (sin Resend/SMTP) ==========");
          console.log(`Para: ${identifier}\n`);
          console.log(text);
          console.log("\n====================================================\n");
          return;
        }

        if (resendConfigured && !smtpConfigured) {
          const result = await sendEmail({
            to: identifier,
            subject,
            text,
            html,
          });
          if (!result.ok) {
            console.error("[Auth] Envío de correo falló:", result.error);
            throw new Error("No se pudo enviar el correo de acceso.");
          }
          return;
        }

        const transport = nodemailer.createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject,
          text,
          html,
        });
        if (result.rejected.length > 0) {
          throw new Error("No se pudo enviar el correo de acceso.");
        }
      },
    }),
  ],
});
