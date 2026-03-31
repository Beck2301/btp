import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ page?: string; country?: string }>;
};

/** Compatibilidad: antes estaba el listado aquí; ahora todo vive en /buscar. */
export default async function PlacasRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  if (sp.page) q.set("page", sp.page);
  if (sp.country) q.set("country", sp.country);
  const s = q.toString();
  redirect(s ? `/buscar?${s}` : "/buscar");
}
