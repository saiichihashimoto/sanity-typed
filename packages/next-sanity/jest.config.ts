import type { Config } from "jest";

const config: Config = {
  fakeTimers: { enableGlobally: true, now: 1696486441293 },
  passWithNoTests: true,
  preset: "ts-jest",
  restoreMocks: true,
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  verbose: true,
  modulePaths: ["."],
  moduleNameMapper: {
    "^@portabletext-typed/([^/]+)/src/(.*)$":
      "<rootDir>/../../packages/$1/src/$2",
    "^@portabletext-typed/([^/]*)$": "<rootDir>/../../packages/pt-$1/src",
    "^@sanity-typed/([^/]+)/src/(.*)$": "<rootDir>/../../packages/$1/src/$2",
    "^@sanity-typed/([^/]*)$": "<rootDir>/../../packages/$1/src",
  },
};

export default config;
