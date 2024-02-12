import type { JestConfigWithTsJest } from "ts-jest";

export default async (): Promise<JestConfigWithTsJest> => ({
  displayName: "tests (unit)",
  testMatch: ["**/@(src|tests)/**/*.@(test|spec).*"],
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", {}],
  },
  roots: ["<rootDir>"],
});
