import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable "Unexpected any" errors
      "react-hooks/exhaustive-deps": "off", // Disable missing dependency warnings
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars":"warn" // Allow using <img> instead of <Image />
    },
  }
];

export default eslintConfig;
