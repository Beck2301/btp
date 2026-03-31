"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ListingStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizePlate } from "@/lib/plates";
import { listingCreateSchema, listingUpdateSchema } from "@/lib/validators";

export type ActionState = { error?: string; success?: string };

export async function createListing(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Inicia sesión para publicar." };
  }

  const raw = {
    kind: formData.get("kind"),
    countryCode: String(formData.get("countryCode") ?? "").toUpperCase(),
    region: formData.get("region") || null,
    plateRaw: String(formData.get("plateRaw") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    locationNote: formData.get("locationNote") || null,
    whatsappDigits: formData.get("whatsappDigits") || null,
  };

  const parsed = listingCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") || "Datos inválidos." };
  }

  const d = parsed.data;
  const plateNormalized = normalizePlate(d.plateRaw);

  await prisma.listing.create({
    data: {
      userId: session.user.id,
      kind: d.kind,
      countryCode: d.countryCode,
      region: d.region?.trim() || null,
      plateRaw: d.plateRaw,
      plateNormalized,
      description: d.description,
      locationNote: d.locationNote?.trim() || null,
      whatsappDigits: d.whatsappDigits,
    },
  });

  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath("/mis-publicaciones");
  redirect("/mis-publicaciones");
}

export async function updateListing(
  listingId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Inicia sesión." };
  }

  const existing = await prisma.listing.findFirst({
    where: { id: listingId, userId: session.user.id },
  });
  if (!existing) {
    return { error: "Publicación no encontrada." };
  }

  const raw = {
    kind: formData.get("kind"),
    countryCode: String(formData.get("countryCode") ?? "").toUpperCase(),
    region: formData.get("region") || null,
    plateRaw: String(formData.get("plateRaw") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    locationNote: formData.get("locationNote") || null,
    whatsappDigits: formData.get("whatsappDigits") || null,
    status: formData.get("status") || undefined,
  };

  const parsed = listingUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") || "Datos inválidos." };
  }

  const d = parsed.data;
  const plateNormalized = normalizePlate(d.plateRaw);

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      kind: d.kind,
      countryCode: d.countryCode,
      region: d.region?.trim() || null,
      plateRaw: d.plateRaw,
      plateNormalized,
      description: d.description,
      locationNote: d.locationNote?.trim() || null,
      whatsappDigits: d.whatsappDigits,
      ...(d.status ? { status: d.status } : {}),
    },
  });

  revalidatePath(`/placa/${listingId}`);
  revalidatePath("/buscar");
  revalidatePath("/mis-publicaciones");
  return { success: "Cambios guardados." };
}

export async function setListingStatus(
  listingId: string,
  status: ListingStatus,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Inicia sesión." };
  }

  const n = await prisma.listing.updateMany({
    where: { id: listingId, userId: session.user.id },
    data: { status },
  });
  if (n.count === 0) {
    return { error: "No se pudo actualizar." };
  }

  revalidatePath(`/placa/${listingId}`);
  revalidatePath("/buscar");
  revalidatePath("/mis-publicaciones");
  return { success: "Estado actualizado." };
}

export async function setListingStatusFromForm(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const listingId = String(formData.get("listingId") ?? "");
  const status = String(formData.get("status") ?? "") as ListingStatus;
  if (!Object.values(ListingStatus).includes(status)) {
    return { error: "Estado no válido." };
  }
  return setListingStatus(listingId, status);
}

export async function reportListing(listingId: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/placa/${listingId}`);
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    return { error: "No existe la publicación." };
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: { status: ListingStatus.REPORTED },
  });

  revalidatePath(`/placa/${listingId}`);
  revalidatePath("/buscar");
  return { success: "Gracias. Marcamos la publicación para revisión." };
}

export async function reportListingFromForm(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("listingId") ?? "");
  return reportListing(id);
}
