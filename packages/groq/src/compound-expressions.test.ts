import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";

describe("compound expressions", () => {
  it("(10)", () => {
    const query = "(10)";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "Value"; value: 10 };
      type: "Group";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<10>();
  });

  it("(((10)))", () => {
    const query = "(((10)))";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: { base: { type: "Value"; value: 10 }; type: "Group" };
        type: "Group";
      };
      type: "Group";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<10>();
  });
});
