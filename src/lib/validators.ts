import { z } from "zod";
import { ListingKind, ListingStatus } from "@prisma/client";

export const listingCreateSchema = z.object({
  kind: z.nativeEnum(ListingKind),
  countryCode: z.string().length(2).toUpperCase(),
  region: z.string().max(120).optional().nullable(),
  plateRaw: z.string().min(1).max(32).trim(),
  description: z.string().min(10).max(4000).trim(),
  locationNote: z.string().max(500).trim().optional().nullable(),
  whatsappDigits: z
    .string()
    .max(20)
    .optional()
    .nullable()
    .transform((v) => {
      if (!v?.trim()) return null;
      const digits = v.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) return null;
      return digits;
    }),
});

export const listingUpdateSchema = listingCreateSchema.extend({
  status: z.nativeEnum(ListingStatus).optional(),
});

export const contactSchema = z.object({
  listingId: z.string().min(8).max(64),
  fromEmail: z.string().email(),
  message: z.string().min(10).max(4000).trim(),
});
