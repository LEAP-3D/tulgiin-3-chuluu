import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .eslintrc.* (legacy) тохиргоог flat config болгож хөрвүүлнэ
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  // Expo-ийн стандарт дүрмүүд
  ...compat.extends("expo"),

  // (хүсвэл) ignore-ууд
  {
    ignores: ["node_modules/**", "dist/**", "build/**"],
  },
];
