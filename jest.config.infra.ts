import type { JestConfigWithTsJest } from "ts-jest";

export default async (): Promise<JestConfigWithTsJest> => ({
  displayName: "users (infra)",
  testMatch: ["**/@(src|tests)/**/*.@(infra).*"],
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", {}],
  },
  roots: ["<rootDir>"],
  globalSetup: "./tests/globalDevEnvTestsSetup.ts",
});
