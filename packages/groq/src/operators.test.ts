import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";

describe("operators", () => {
  it("4==5", () => {
    const query = "4==5";

    expectType<Parse<typeof query>>().toStrictEqual<{
      left: { type: "Value"; value: 4 };
      op: "==";
      right: { type: "Value"; value: 5 };
      type: "OpCall";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
  });

  it("4!=5", () => {
    const query = "4!=5";

    expectType<Parse<typeof query>>().toStrictEqual<{
      left: { type: "Value"; value: 4 };
      op: "!=";
      right: { type: "Value"; value: 5 };
      type: "OpCall";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
  });

  it("5==5", () => {
    const query = "5==5";

    expectType<Parse<typeof query>>().toStrictEqual<{
      left: { type: "Value"; value: 5 };
      op: "==";
      right: { type: "Value"; value: 5 };
      type: "OpCall";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
  });

  it("5!=5", () => {
    const query = "5!=5";

    expectType<Parse<typeof query>>().toStrictEqual<{
      left: { type: "Value"; value: 5 };
      op: "!=";
      right: { type: "Value"; value: 5 };
      type: "OpCall";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
  });
});
