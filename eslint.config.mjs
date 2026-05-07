import { createRequire } from "module";
const require = createRequire(import.meta.url);

const coreWebVitals = require("eslint-config-next/core-web-vitals");
const tsConfig = require("eslint-config-next/typescript");

const config = [
  ...coreWebVitals,
  ...tsConfig,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    rules: {
      // Editorial copy uses straight apostrophes/quotes intentionally; the
      // browser renders them correctly without HTML entity escapes.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default config;
