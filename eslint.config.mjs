import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

// eslint-config-next 15 only ships an eslintrc-style config; bridge it
// into flat config until the Next 16 upgrade.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  ...compat.extends("next/core-web-vitals"),
  { ignores: [".next/**", "node_modules/**", "playwright-report/**", "test-results/**"] },
]);
