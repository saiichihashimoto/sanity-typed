/**
 * DO NOT COPY THIS FILE
 *
 * This is because we're using path aliases in the monorepo's tsconfig and is not required for @sanity-typed/* .
 * https://github.com/sanity-io/sanity/issues/5115
 */
import { dirname, resolve } from "path";
import { defineCliConfig } from "sanity/cli";
import { fileURLToPath } from "url";

export default defineCliConfig({
  vite: {
    resolve: {
      alias: {
        "@sanity-typed/types": resolve(
          dirname(fileURLToPath(import.meta.url)),
          "../types/src"
        ),
      },
    },
  },
});
