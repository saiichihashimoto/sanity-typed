import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { DateTime, Path, evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";
import type {
  ScopeFromPartialContext,
  ScopeFromPartialScope,
} from "./internal";

describe("global", () => {
  it("after() (without delta)", async () => {
    const query = "after()";

    expect(() => parse(query)).toThrow("Undefined function: after");
    expectType<Parse<typeof query>>()
      // @ts-expect-error -- TODO Parse doesn't care about mode: "delta"
      .toStrictEqual<never>();

    expectType<ExecuteQuery<typeof query>>()
      // @ts-expect-error -- TODO Parse doesn't care about mode: "delta"
      .toStrictEqual<never>();
  });

  it("after() (without after)", async () => {
    const query = "after()";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = { key: "after", type: "Context" } as const;

    expect(tree).toStrictEqual(expectedTree);
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

  it("after() (with null after)", async () => {
    const query = "after()";

    const tree = parse(query, { mode: "delta" });

    const delta = { after: null, before: { _type: "foo" } } as const;

    const result = await (await evaluate(tree, delta)).get();

    const expectedResult = null;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ delta: WritableDeep<typeof delta> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("after()", async () => {
    const query = "after()";

    const tree = parse(query, { mode: "delta" });

    const delta = { after: { _type: "foo" }, before: null } as const;

    const result = await (await evaluate(tree, delta)).get();

    const expectedResult = { _type: "foo" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ delta: WritableDeep<typeof delta> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("global::after()", async () => {
    const query = "global::after()";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = { key: "after", type: "Context" } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const delta = { after: { _type: "foo" }, before: null } as const;

    const result = await (await evaluate(tree, delta)).get();

    const expectedResult = { _type: "foo" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ delta: WritableDeep<typeof delta> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("before() (without delta)", async () => {
    const query = "before()";

    expect(() => parse(query)).toThrow("Undefined function: before");
    expectType<Parse<typeof query>>()
      // @ts-expect-error -- TODO Parse doesn't care about mode: "delta"
      .toStrictEqual<never>();

    expectType<ExecuteQuery<typeof query>>()
      // @ts-expect-error -- TODO Parse doesn't care about mode: "delta"
      .toStrictEqual<never>();
  });

  it("before() (without before)", async () => {
    const query = "before()";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = { key: "before", type: "Context" } as const;

    expect(tree).toStrictEqual(expectedTree);
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

  it("before() (with null before)", async () => {
    const query = "before()";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = { key: "before", type: "Context" } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const delta = { after: { _type: "foo" }, before: null } as const;

    const result = await (await evaluate(tree, delta)).get();

    const expectedResult = null;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ delta: WritableDeep<typeof delta> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("before()", async () => {
    const query = "before()";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = { key: "before", type: "Context" } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const delta = { after: null, before: { _type: "foo" } } as const;

    const result = await (await evaluate(tree, delta)).get();

    const expectedResult = { _type: "foo" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ delta: WritableDeep<typeof delta> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("global::before()", async () => {
    const query = "global::before()";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = { key: "before", type: "Context" } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const delta = { after: null, before: { _type: "foo" } } as const;

    const result = await (await evaluate(tree, delta)).get();

    const expectedResult = { _type: "foo" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ delta: WritableDeep<typeof delta> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("coalesce()", async () => {
    const query = "coalesce()";

    const tree = parse(query);

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "coalesce",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

  it("coalesce(1)", async () => {
    const query = "coalesce(1)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: 1 }],
      func: (() => {}) as unknown as GroqFunction,
      name: "coalesce",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 1;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("coalesce(null)", async () => {
    const query = "coalesce(null)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: null }],
      func: (() => {}) as unknown as GroqFunction,
      name: "coalesce",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

  it("coalesce(1,null)", async () => {
    const query = "coalesce(1,null)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { type: "Value", value: 1 },
        { type: "Value", value: null },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "coalesce",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 1;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("coalesce(null,1)", async () => {
    const query = "coalesce(null,1)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { type: "Value", value: null },
        { type: "Value", value: 1 },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "coalesce",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 1;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("coalesce(key,2)", async () => {
    const query = "coalesce(key,2)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "key", type: "AccessAttribute" },
        { type: "Value", value: 2 },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "coalesce",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { key: 1 as 1 | null } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = 1 as 1 | 2;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<typeof query, ScopeFromPartialScope<{ this: typeof root }>>
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("global::coalesce(key,2)", async () => {
    const query = "global::coalesce(key,2)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "key", type: "AccessAttribute" },
        { type: "Value", value: 2 },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "coalesce",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { key: 1 as 1 | null } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = 1 as 1 | 2;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<typeof query, ScopeFromPartialScope<{ this: typeof root }>>
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("count(5)", async () => {
    const query = "count(5)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: 5 }],
      func: (() => {}) as unknown as GroqFunction,
      name: "count",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

  it("count([1,2,3,4])", async () => {
    const query = "count([1,2,3,4])";

    const tree = parse(query);

    const expectedTree = {
      args: [
        {
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
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: 4 },
            },
          ],
          type: "Array",
        },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "count",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 4;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("global::count([1,2,3,4])", async () => {
    const query = "global::count([1,2,3,4])";

    const tree = parse(query);

    const expectedTree = {
      args: [
        {
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
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: 4 },
            },
          ],
          type: "Array",
        },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "count",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 4;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("dateTime(false)", async () => {
    const query = "dateTime(false)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: false }],
      func: (() => {}) as unknown as GroqFunction,
      name: "dateTime",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

  it('dateTime("2023-08-29T03:16:25.883Z")', async () => {
    const query = 'dateTime("2023-08-29T03:16:25.883Z")';

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "2023-08-29T03:16:25.883Z" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "dateTime",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = new DateTime(new Date("2023-08-29T03:16:25.883Z"));

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("dateTime($param) (with DateTime)", async () => {
    const query = "dateTime($param)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ name: "param", type: "Parameter" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "dateTime",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = { param: "2023-08-29T03:25:14.355Z" } as const;

    const result = await (await evaluate(tree, { params })).get();

    const expectedResult = new DateTime(new Date("2023-08-29T03:25:14.355Z"));

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ parameters: WritableDeep<typeof params> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("global::dateTime($param) (with DateTime)", async () => {
    const query = "global::dateTime($param)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ name: "param", type: "Parameter" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "dateTime",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = { param: "2023-08-29T03:25:14.355Z" } as const;

    const result = await (await evaluate(tree, { params })).get();

    const expectedResult = new DateTime(new Date("2023-08-29T03:25:14.355Z"));

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ parameters: WritableDeep<typeof params> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("defined(null)", async () => {
    const query = "defined(null)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: null }],
      func: (() => {}) as unknown as GroqFunction,
      name: "defined",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("defined(5)", async () => {
    const query = "defined(5)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: 5 }],
      func: (() => {}) as unknown as GroqFunction,
      name: "defined",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("global::defined(5)", async () => {
    const query = "global::defined(5)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: 5 }],
      func: (() => {}) as unknown as GroqFunction,
      name: "defined",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("length(10)", async () => {
    const query = "length(10)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: 10 }],
      func: (() => {}) as unknown as GroqFunction,
      name: "length",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

  it("length([null,null,null])", async () => {
    const query = "length([null,null,null])";

    const tree = parse(query);

    const expectedTree = {
      args: [
        {
          elements: [
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: null },
            },
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: null },
            },
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: null },
            },
          ],
          type: "Array",
        },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "length",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>()
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/339
      .toBeAssignableTo<WritableDeep<typeof expectedTree>>();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 3;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('length("string")', async () => {
    const query = 'length("string")';

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "string" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "length",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 6 as number;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('global::length("string")', async () => {
    const query = 'global::length("string")';

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "string" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "length",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 6 as number;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("now()", async () => {
    const query = "now()";

    const tree = parse(query);

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "now",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const timestamp = new Date("2023-08-29T03:25:14.355Z");

    const result = await (await evaluate(tree, { timestamp })).get();

    const expectedResult = "2023-08-29T03:25:14.355Z" as string;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("global::now()", async () => {
    const query = "global::now()";

    const tree = parse(query);

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "now",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const timestamp = new Date("2023-08-29T03:25:14.355Z");

    const result = await (await evaluate(tree, { timestamp })).get();

    const expectedResult = "2023-08-29T03:25:14.355Z" as string;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("references([])", async () => {
    const query = "references([])";

    const tree = parse(query);

    const expectedTree = {
      args: [{ elements: [], type: "Array" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "references",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('references("id")', async () => {
    const query = 'references("id")';

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "id" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "references",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('references("id",["id2"])', async () => {
    const query = 'references("id",["id2"])';

    const tree = parse(query);

    const expectedTree = {
      args: [
        { type: "Value", value: "id" },
        {
          elements: [
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: "id2" },
            },
          ],
          type: "Array",
        },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "references",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('global::references("id",["id2"])', async () => {
    const query = 'global::references("id",["id2"])';

    const tree = parse(query);

    const expectedTree = {
      args: [
        { type: "Value", value: "id" },
        {
          elements: [
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: "id2" },
            },
          ],
          type: "Array",
        },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "references",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("select()", async () => {
    const query = "select()";

    const tree = parse(query);

    const expectedTree = { alternatives: [], type: "Select" } as const;

    expect(tree).toStrictEqual(expectedTree);
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

  it("select(1)", async () => {
    const query = "select(1)";

    const tree = parse(query);

    const expectedTree = {
      alternatives: [],
      fallback: { type: "Value", value: 1 },
      type: "Select",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 1;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("select(true=>1,2)", async () => {
    const query = "select(true=>1,2)";

    const tree = parse(query);

    const expectedTree = {
      alternatives: [
        {
          condition: { type: "Value", value: true },
          type: "SelectAlternative",
          value: { type: "Value", value: 1 },
        },
      ],
      fallback: { type: "Value", value: 2 },
      type: "Select",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 1;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("select(false=>1,2)", async () => {
    const query = "select(false=>1,2)";

    const tree = parse(query);

    const expectedTree = {
      alternatives: [
        {
          condition: { type: "Value", value: false },
          type: "SelectAlternative",
          value: { type: "Value", value: 1 },
        },
      ],
      fallback: { type: "Value", value: 2 },
      type: "Select",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 2;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("select($param=>1,2)", async () => {
    const query = "select($param=>1,2)";

    const tree = parse(query);

    const expectedTree = {
      alternatives: [
        {
          condition: { name: "param", type: "Parameter" },
          type: "SelectAlternative",
          value: { type: "Value", value: 1 },
        },
      ],
      fallback: { type: "Value", value: 2 },
      type: "Select",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = { param: false };

    const result = await (await evaluate(tree, { params })).get();

    const expectedResult = 2 as 1 | 2;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ parameters: WritableDeep<typeof params> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("select($param1=>1,$param2=>2,$param3=>3,4)", async () => {
    const query = "select($param1=>1,$param2=>2,$param3=>3,4)";

    const tree = parse(query);

    const expectedTree = {
      alternatives: [
        {
          condition: { name: "param1", type: "Parameter" },
          type: "SelectAlternative",
          value: { type: "Value", value: 1 },
        },
        {
          condition: { name: "param2", type: "Parameter" },
          type: "SelectAlternative",
          value: { type: "Value", value: 2 },
        },
        {
          condition: { name: "param3", type: "Parameter" },
          type: "SelectAlternative",
          value: { type: "Value", value: 3 },
        },
      ],
      fallback: { type: "Value", value: 4 },
      type: "Select",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = { param1: false, param2: false, param3: false };

    const result = await (await evaluate(tree, { params })).get();

    const expectedResult = 4 as 1 | 2 | 3 | 4;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ parameters: WritableDeep<typeof params> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("round(3.14)", async () => {
    const query = "round(3.14)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: 3.14 }],
      func: (() => {}) as unknown as GroqFunction,
      name: "round",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 3 as number;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("round(3.14,1)", async () => {
    const query = "round(3.14,1)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { type: "Value", value: 3.14 },
        { type: "Value", value: 1 },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "round",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 3.1 as number;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("global::round(3.14,1)", async () => {
    const query = "global::round(3.14,1)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { type: "Value", value: 3.14 },
        { type: "Value", value: 1 },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "round",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 3.1 as number;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("string(true)", async () => {
    const query = "string(true)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: true }],
      func: (() => {}) as unknown as GroqFunction,
      name: "string",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "true";

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("string(false)", async () => {
    const query = "string(false)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: false }],
      func: (() => {}) as unknown as GroqFunction,
      name: "string",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "false";

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('string("a string")', async () => {
    const query = 'string("a string")';

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "a string" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "string",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "a string";

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("string(3.14)", async () => {
    const query = "string(3.14)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: 3.14 }],
      func: (() => {}) as unknown as GroqFunction,
      name: "string",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "3.14";

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("string([])", async () => {
    const query = "string([])";

    const tree = parse(query);

    const expectedTree = {
      args: [{ elements: [], type: "Array" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "string",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

  it("global::string(3.14)", async () => {
    const query = "global::string(3.14)";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: 3.14 }],
      func: (() => {}) as unknown as GroqFunction,
      name: "string",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "3.14";

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('lower("String")', async () => {
    const query = 'lower("String")';

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "String" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "lower",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "string";

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('global::lower("String")', async () => {
    const query = 'global::lower("String")';

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "String" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "lower",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "string";

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('upper("String")', async () => {
    const query = 'upper("String")';

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "String" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "upper",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "STRING";

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('global::upper("String")', async () => {
    const query = 'global::upper("String")';

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "String" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "upper",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "STRING";

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("identity()", async () => {
    const query = "identity()";

    const tree = parse(query);

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "identity",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const identity = "identity";

    const result = await (await evaluate(tree, { identity })).get();

    const expectedResult = "identity";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ identity: typeof identity }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("global::identity()", async () => {
    const query = "global::identity()";

    const tree = parse(query);

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "identity",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const identity = "identity";

    const result = await (await evaluate(tree, { identity })).get();

    const expectedResult = "identity";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{ identity: typeof identity }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("path('a')", async () => {
    const query = "path('a')";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "a" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "path",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = new Path("a");

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      typeof expectedResult
    >();
  });

  it("path('a.*')", async () => {
    const query = "path('a.*')";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "a.*" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "path",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = new Path("a.*");

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      typeof expectedResult
    >();
  });

  it("path('a.**')", async () => {
    const query = "path('a.**')";

    const tree = parse(query);

    const expectedTree = {
      args: [{ type: "Value", value: "a.**" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "path",
      namespace: "global",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = new Path("a.**");

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      typeof expectedResult
    >();
  });
});
