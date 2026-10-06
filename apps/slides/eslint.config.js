import { config } from "@workspace/eslint-config/react-internal"
export default [
  ...config,
  { ignores: ["dist/**", ".editor-data/**"] },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { URL: "readonly", console: "readonly", process: "readonly" },
    },
  },
]
