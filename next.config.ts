import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Raíz del repo (evita el aviso de Turbopack si hay otro package-lock en un directorio padre). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
