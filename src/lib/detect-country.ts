import { headers } from "next/headers";
import { isSupportedCountryCode } from "@/lib/countries";

/**
 * ISO 3166-1 alpha-2 aproximado según cabeceras del edge (sin pedir permisos
 * al navegador). En Vercel: x-vercel-ip-country. En Cloudflare: cf-ipcountry.
 */
export async function getGeoCountryCode(): Promise<string | undefined> {
  const h = await headers();
  const raw = [
    h.get("x-vercel-ip-country"),
    h.get("cf-ipcountry"),
    h.get("cloudfront-viewer-country"),
  ]
    .map((v) => v?.trim().toUpperCase())
    .find((c) => c && c !== "XX" && isSupportedCountryCode(c));
  return raw;
}

/** Valor por defecto al publicar si no hay detección (misma base que antes). */
export function defaultPublishCountryCode(geo?: string | null): string {
  if (geo && isSupportedCountryCode(geo)) return geo.toUpperCase();
  return "SV";
}
