import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";
import type { ScopeFromPartialContext } from "./internal";

describe("delta", () => {
  it("delta::changedAny(title) (without delta)", async () => {
    const query = "delta::changedAny(title)";

    expect(() => parse(query)).toThrow("Undefined function: changedAny");
    expectType<Parse<typeof query>>().toStrictEqual<never>();

    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });

  it("delta::changedAny(title)", async () => {
    const query = "delta::changedAny(title)";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = {
      args: [{ name: "title", type: "AccessAttribute" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "delta",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/194
      WritableDeep<typeof expectedTree>
    >();

    await expect(async () => evaluate(tree)).rejects.toThrow("not implemented");
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });

  it("delta::changedAny((title,description))", async () => {
    const query = "delta::changedAny((title,description))";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = {
      args: [
        {
          members: [{ name: "title", type: "AccessAttribute" }],
          type: "Tuple",
        },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "delta",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/194
      WritableDeep<typeof expectedTree>
    >();

    await expect(async () => evaluate(tree)).rejects.toThrow("not implemented");
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });

  it("delta::changedOnly(title) (without delta)", async () => {
    const query = "delta::changedOnly(title)";

    expect(() => parse(query)).toThrow("Undefined function: changedOnly");
    expectType<Parse<typeof query>>().toStrictEqual<never>();

    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });

  it("delta::changedOnly(title)", async () => {
    const query = "delta::changedOnly(title)";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = {
      args: [{ name: "title", type: "AccessAttribute" }],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "delta",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/194
      WritableDeep<typeof expectedTree>
    >();

    await expect(async () => evaluate(tree)).rejects.toThrow("not implemented");
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });

  it("delta::changedOnly((title,description))", async () => {
    const query = "delta::changedOnly((title,description))";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = {
      args: [
        {
          members: [{ name: "title", type: "AccessAttribute" }],
          type: "Tuple",
        },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "delta",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/194
      WritableDeep<typeof expectedTree>
    >();

    await expect(async () => evaluate(tree)).rejects.toThrow("not implemented");
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });

  it("delta::operation() (without delta)", async () => {
    const query = "delta::operation()";

    const tree = parse(query);

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "operation",
      namespace: "delta",
      type: "FuncCall",
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

  it("delta::operation() (without before or after)", async () => {
    const query = "delta::operation()";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "operation",
      namespace: "delta",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const delta = {
      after: null,
      before: null,
    } as const;

    const result = await (await evaluate(tree, delta)).get();

    const expectedResult = null;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          delta: WritableDeep<typeof delta>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("delta::operation() (with create)", async () => {
    const query = "delta::operation()";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "operation",
      namespace: "delta",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const delta = {
      after: { _type: "foo" },
      before: null,
    } as const;

    const result = await (await evaluate(tree, delta)).get();

    const expectedResult = "create";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          delta: WritableDeep<typeof delta>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("delta::operation() (with delete)", async () => {
    const query = "delta::operation()";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "operation",
      namespace: "delta",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const delta = {
      after: null,
      before: { _type: "foo" },
    } as const;

    const result = await (await evaluate(tree, delta)).get();

    const expectedResult = "delete";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          delta: WritableDeep<typeof delta>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("delta::operation() (with update)", async () => {
    const query = "delta::operation()";

    const tree = parse(query, { mode: "delta" });

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "operation",
      namespace: "delta",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const delta = {
      after: { _type: "foo" },
      before: { _type: "foo" },
    } as const;

    const result = await (await evaluate(tree, delta)).get();

    const expectedResult = "update";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          delta: WritableDeep<typeof delta>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });
});
