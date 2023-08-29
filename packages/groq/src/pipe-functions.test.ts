import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { GroqPipeFunction } from "groq-js";
import type { ReadonlyDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse, _ScopeFromPartialContext } from ".";

const FOO: unique symbol = Symbol("foo");
type Foo = typeof FOO;

describe("pipe functions", () => {
  describe("global", () => {
    it("false|order(name)", async () => {
      const query = "false|order(name)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ name: "name", type: "AccessAttribute" }],
        base: { type: "Value", value: false },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("*|order(name)", async () => {
      const query = "*|order(name)";
      const tree = parse(query);
      const result = await (await evaluate(tree, { dataset: [FOO] })).get();

      const desiredTree = {
        args: [{ name: "name", type: "AccessAttribute" }],
        base: { type: "Everything" },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toStrictEqual([FOO]);
      expectType<
        ExecuteQuery<typeof query, _ScopeFromPartialContext<{ dataset: Foo[] }>>
      >().toStrictEqual<Foo[]>();
    });

    it("*|order(name asc)", async () => {
      const query = "*|order(name asc)";
      const tree = parse(query);
      const result = await (await evaluate(tree, { dataset: [FOO] })).get();

      const desiredTree = {
        args: [
          { base: { name: "name", type: "AccessAttribute" }, type: "Asc" },
        ],
        base: { type: "Everything" },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toStrictEqual([FOO]);
      expectType<
        ExecuteQuery<typeof query, _ScopeFromPartialContext<{ dataset: Foo[] }>>
      >().toStrictEqual<Foo[]>();
    });

    it("*|order(name desc)", async () => {
      const query = "*|order(name desc)";
      const tree = parse(query);
      const result = await (await evaluate(tree, { dataset: [FOO] })).get();

      const desiredTree = {
        args: [
          { base: { name: "name", type: "AccessAttribute" }, type: "Desc" },
        ],
        base: { type: "Everything" },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toStrictEqual([FOO]);
      expectType<
        ExecuteQuery<typeof query, _ScopeFromPartialContext<{ dataset: Foo[] }>>
      >().toStrictEqual<Foo[]>();
    });

    it("[1,2,3]|order(name)", async () => {
      const query = "[1,2,3]|order(name)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ name: "name", type: "AccessAttribute" }],
        base: {
          elements: [
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: 1 },
            },
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: 2 },
            },
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: 3 },
            },
          ],
          type: "Array",
        },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toStrictEqual([1, 2, 3]);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<(1 | 2 | 3)[]>();
    });

    it("*|global::order(name)", async () => {
      const query = "*|global::order(name)";
      const tree = parse(query);
      const result = await (await evaluate(tree, { dataset: [FOO] })).get();

      const desiredTree = {
        args: [{ name: "name", type: "AccessAttribute" }],
        base: { type: "Everything" },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
        typeof desiredTree
      >();

      expect(result).toStrictEqual([FOO]);
      expectType<
        ExecuteQuery<typeof query, _ScopeFromPartialContext<{ dataset: Foo[] }>>
      >().toStrictEqual<Foo[]>();
    });
  });
});
