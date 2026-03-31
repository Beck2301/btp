"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { contactSchema } from "@/lib/validators";

export type ContactState = {
  error?: string;
  success?: string;
  emailed?: boolean;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const session = await auth();

  const raw = {
    listingId: String(formData.get("listingId") ?? ""),
    fromEmail: String(formData.get("fromEmail") ?? "").trim(),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.fromEmail?.[0] ??
        parsed.error.flatten().fieldErrors.message?.[0] ??
        "Revisa el formulario.",
    };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    include: { user: true },
  });

  if (!listing || listing.status !== "ACTIVE") {
    return { error: "Esta publicación no acepta contactos." };
  }

  if (session?.user?.id && listing.userId === session.user.id) {
    return { error: "No puedes enviarte un mensaje a ti mismo." };
  }

  await prisma.contactRequest.create({
    data: {
      listingId: listing.id,
      fromEmail: parsed.data.fromEmail,
      message: parsed.data.message,
      fromUserId: session?.user?.id ?? null,
    },
  });

  let emailed = false;
  const ownerEmail = listing.user?.email;
  if (ownerEmail) {
    const site =
      process.env.NEXTAUTH_URL ??
      process.env.AUTH_URL ??
      "http://localhost:3000";
    const html = `
      <p>Alguien respondió a tu publicación de placa <strong>${listing.plateRaw}</strong>.</p>
      <p><strong>Correo del contacto:</strong> ${parsed.data.fromEmail}</p>
      <p><strong>Mensaje:</strong></p>
      <pre style="white-space:pre-wrap;font-family:sans-serif">${parsed.data.message.replace(/</g, "&lt;")}</pre>
      <p><a href="${site}/mis-publicaciones">Ver tus publicaciones y mensajes</a></p>
    `;
    const result = await sendEmail({
      to: ownerEmail,
      subject: `Nuevo contacto — placa ${listing.plateRaw}`,
      text: `Contacto: ${parsed.data.fromEmail}\n\n${parsed.data.message}`,
      html,
    });
    emailed = result.ok;
    if (!result.ok && process.env.NODE_ENV === "development") {
      console.log("[Contact] Email no enviado:", result.error);
    }
  }

  revalidatePath(`/placa/${listing.id}`);
  revalidatePath("/mis-publicaciones");

  return {
    success:
      emailed
        ? "Mensaje enviado. El publicador también recibirá un correo si está configurado."
        : "Mensaje registrado. El publicador lo verá al iniciar sesión en «Mis publicaciones».",
    emailed,
  };
}
