import tailwind from "tailwindcss";
import presetEnv from "postcss-preset-env";
import tailwindNesting from "tailwindcss/nesting";

import config from "./tailwind.config";

export default {
  plugins: [
    tailwindNesting(),
    tailwind(config),
    presetEnv({
      features: {
        "nesting-rules": false,
      },
    }),
  ],
};
