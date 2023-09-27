import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { GroqPipeFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";
import type { ScopeFromPartialContext } from "./internal";

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
          ScopeFromPartialContext<{
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
          ScopeFromPartialContext<{
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
          ScopeFromPartialContext<{
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
          ScopeFromPartialContext<{
            dataset: WritableDeep<typeof dataset>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });
  });

  it("false|score(foo>1)", async () => {
    const query = "false|score(foo>1)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        {
          left: { name: "foo", type: "AccessAttribute" },
          op: ">",
          right: { type: "Value", value: 1 },
          type: "OpCall",
        },
      ],
      base: { type: "Value", value: false },
      func: (() => {}) as unknown as GroqPipeFunction,
      name: "score",
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

  it("*|score(foo>1) (primitives)", async () => {
    const query = "*|score(foo>1)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        {
          left: { name: "foo", type: "AccessAttribute" },
          op: ">",
          right: { type: "Value", value: 1 },
          type: "OpCall",
        },
      ],
      base: { type: "Everything" },
      func: (() => {}) as unknown as GroqPipeFunction,
      name: "score",
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

    const expectedResult = [] as never[];

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("*|score(foo>1) (objects)", async () => {
    const query = "*|score(foo>1)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        {
          left: { name: "foo", type: "AccessAttribute" },
          op: ">",
          right: { type: "Value", value: 1 },
          type: "OpCall",
        },
      ],
      base: { type: "Everything" },
      func: (() => {}) as unknown as GroqPipeFunction,
      name: "score",
      type: "PipeFuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ foo: 2 }, { foo: 3 }] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [
      { _score: 1, foo: 2 },
      { _score: 1, foo: 3 },
    ] as ({ _score: number; foo: 2 } | { _score: number; foo: 3 })[];

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toEqual<WritableDeep<typeof expectedResult>>();
  });

  it("boost(foo>2,5)", async () => {
    const query = "boost(foo>2,5)";

    expect(() => parse(query)).toThrow("unexpected boost");
    // TODO
    // expectType<Parse<typeof query>>().toStrictEqual<never>();

    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });

  it("*|score(foo>1,boost(foo>2,5))", async () => {
    const query = "*|score(foo>1,boost(foo>2,5))";

    const tree = parse(query);

    const expectedTree = {
      args: [
        {
          left: { name: "foo", type: "AccessAttribute" },
          op: ">",
          right: { type: "Value", value: 1 },
          type: "OpCall",
        },
        {
          args: [
            {
              left: { name: "foo", type: "AccessAttribute" },
              op: ">",
              right: { type: "Value", value: 2 },
              type: "OpCall",
            },
            { type: "Value", value: 5 },
          ],
          func: (() => {}) as unknown as GroqPipeFunction,
          name: "boost",
          namespace: "global",
          type: "FuncCall",
        },
      ],
      base: { type: "Everything" },
      func: (() => {}) as unknown as GroqPipeFunction,
      name: "score",
      type: "PipeFuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      args: [
        expectedTree.args[0],
        {
          ...expectedTree.args[1],
          func: expect.any(Function),
        },
      ],
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ foo: 2 }, { foo: 3 }] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [
      { _score: 7, foo: 3 },
      { _score: 1, foo: 2 },
    ] as ({ _score: number; foo: 2 } | { _score: number; foo: 3 })[];

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toEqual<WritableDeep<typeof expectedResult>>();
  });

  it("*|global::score(foo>1)", async () => {
    const query = "*|global::score(foo>1)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        {
          left: { name: "foo", type: "AccessAttribute" },
          op: ">",
          right: { type: "Value", value: 1 },
          type: "OpCall",
        },
      ],
      base: { type: "Everything" },
      func: (() => {}) as unknown as GroqPipeFunction,
      name: "score",
      type: "PipeFuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ foo: 2 }, { foo: 3 }] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [
      { _score: 1, foo: 2 },
      { _score: 1, foo: 3 },
    ] as ({ _score: number; foo: 2 } | { _score: number; foo: 3 })[];

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toEqual<WritableDeep<typeof expectedResult>>();
  });
});
