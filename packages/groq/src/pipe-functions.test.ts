import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { GroqPipeFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse, _ScopeFromPartialContext } from ".";

describe("pipe functions", () => {
  describe("global", () => {
    it("false|order(name)", async () => {
      const query = "false|order(name)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ name: "name", type: "AccessAttribute" }],
        base: { type: "Value", value: false },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("*|order(name)", async () => {
      const query = "*|order(name)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ name: "name", type: "AccessAttribute" }],
        base: { type: "Everything" },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const dataset = ["foo", "bar"] as const;

      const result = await (await evaluate(tree, { dataset })).get();

      const expectedResult = ["foo", "bar"] as ["bar" | "foo", "bar" | "foo"];

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            dataset: WritableDeep<typeof dataset>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("*|order(name asc)", async () => {
      const query = "*|order(name asc)";

      const tree = parse(query);

      const expectedTree = {
        args: [
          { base: { name: "name", type: "AccessAttribute" }, type: "Asc" },
        ],
        base: { type: "Everything" },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const dataset = ["foo", "bar"] as const;

      const result = await (await evaluate(tree, { dataset })).get();

      const expectedResult = ["foo", "bar"] as ["bar" | "foo", "bar" | "foo"];

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            dataset: WritableDeep<typeof dataset>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("*|order(name desc)", async () => {
      const query = "*|order(name desc)";

      const tree = parse(query);

      const expectedTree = {
        args: [
          { base: { name: "name", type: "AccessAttribute" }, type: "Desc" },
        ],
        base: { type: "Everything" },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const dataset = ["foo", "bar"] as const;

      const result = await (await evaluate(tree, { dataset })).get();

      const expectedResult = ["foo", "bar"] as ["bar" | "foo", "bar" | "foo"];

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            dataset: WritableDeep<typeof dataset>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("[1,2,3]|order(name)", async () => {
      const query = "[1,2,3]|order(name)";

      const tree = parse(query);

      const expectedTree = {
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
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = [1, 2, 3] as [1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3];

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("*|global::order(name)", async () => {
      const query = "*|global::order(name)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ name: "name", type: "AccessAttribute" }],
        base: { type: "Everything" },
        func: (() => {}) as unknown as GroqPipeFunction,
        name: "order",
        type: "PipeFuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const dataset = ["foo", "bar"] as const;

      const result = await (await evaluate(tree, { dataset })).get();

      const expectedResult = ["foo", "bar"] as ["bar" | "foo", "bar" | "foo"];

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            dataset: WritableDeep<typeof dataset>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });
  });
});
