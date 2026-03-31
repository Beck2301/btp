/** Código telefónico internacional (sin `+`) para WhatsApp. */
const CALLING_CODES = {
  AR: "54",
  BO: "591",
  BR: "55",
  CL: "56",
  CO: "57",
  CR: "506",
  CU: "53",
  DO: "1",
  EC: "593",
  ES: "34",
  GT: "502",
  HN: "504",
  MX: "52",
  NI: "505",
  PA: "507",
  PE: "51",
  PR: "1",
  PY: "595",
  SV: "503",
  US: "1",
  UY: "598",
  VE: "58",
} as const;

const DEFAULT_CALLING_CODE = "503"; // El Salvador

export function whatsappCallingCode(countryCode?: string | null): string {
  if (!countryCode) return DEFAULT_CALLING_CODE;
  const code = countryCode.trim().toUpperCase();
  return (code in CALLING_CODES ? (CALLING_CODES as Record<string, string>)[code] : null) ?? DEFAULT_CALLING_CODE;
}

