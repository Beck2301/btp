/** Normaliza placa para búsqueda: mayúsculas y sin separadores comunes. */
export function normalizePlate(input: string): string {
  return input.toUpperCase().replace(/[\s\-_.]/g, "");
}
