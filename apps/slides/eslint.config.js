import { config } from "@workspace/eslint-config/react-internal"
export default [
  ...config,
  { ignores: ["dist/**"] },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { URL: "readonly", console: "readonly", process: "readonly" },
    },
  },
]
