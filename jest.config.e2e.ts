import type { JestConfigWithTsJest } from "ts-jest";

export default async (): Promise<JestConfigWithTsJest> => ({
  displayName: "tests (E2E)",
  testMatch: ["**/@(src|tests)/**/*.@(e2e).*"],
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", {}],
  },
  roots: ["<rootDir>"],
  globalSetup: "./tests/globalDevEnvTestsSetup.ts",
});
