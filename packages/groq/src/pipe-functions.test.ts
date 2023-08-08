import { describe, it } from "@jest/globals";
import type { GroqPipeFunction } from "groq-js";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";

const FOO: unique symbol = Symbol("foo");
type Foo = typeof FOO;

describe("pipe functions", () => {
  describe("global", () => {
    it("false|order(name)", () => {
      const query = "false|order(name)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ name: "name"; type: "AccessAttribute" }];
        base: { type: "Value"; value: false };
        func: GroqPipeFunction;
        name: "global::order";
        type: "PipeFuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("*|order(name)", () => {
      const query = "*|order(name)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ name: "name"; type: "AccessAttribute" }];
        base: { type: "Everything" };
        func: GroqPipeFunction;
        name: "global::order";
        type: "PipeFuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { dataset: Foo[] }>
      >().toStrictEqual<Foo[]>();
    });

    it("*|order(name asc)", () => {
      const query = "*|order(name asc)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { base: { name: "name"; type: "AccessAttribute" }; type: "Asc" }
        ];
        base: { type: "Everything" };
        func: GroqPipeFunction;
        name: "global::order";
        type: "PipeFuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { dataset: Foo[] }>
      >().toStrictEqual<Foo[]>();
    });

    it("*|order(name desc)", () => {
      const query = "*|order(name desc)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { base: { name: "name"; type: "AccessAttribute" }; type: "Desc" }
        ];
        base: { type: "Everything" };
        func: GroqPipeFunction;
        name: "global::order";
        type: "PipeFuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { dataset: Foo[] }>
      >().toStrictEqual<Foo[]>();
    });

    it("[1,2,3]|order(name)", () => {
      const query = "[1,2,3]|order(name)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ name: "name"; type: "AccessAttribute" }];
        base: {
          elements: [
            {
              isSplat: false;
              type: "ArrayElement";
              value: { type: "Value"; value: 1 };
            },
            {
              isSplat: false;
              type: "ArrayElement";
              value: { type: "Value"; value: 2 };
            },
            {
              isSplat: false;
              type: "ArrayElement";
              value: { type: "Value"; value: 3 };
            }
          ];
          type: "Array";
        };
        func: GroqPipeFunction;
        name: "global::order";
        type: "PipeFuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<(1 | 2 | 3)[]>();
    });

    it("*|global::order(name)", () => {
      const query = "*|global::order(name)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ name: "name"; type: "AccessAttribute" }];
        base: { type: "Everything" };
        func: GroqPipeFunction;
        name: "global::order";
        type: "PipeFuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { dataset: Foo[] }>
      >().toStrictEqual<Foo[]>();
    });
  });
});
