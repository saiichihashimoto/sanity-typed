import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";
import type { ScopeFromPartialContext } from "./internal";

describe("delta", () => {
  it("delta::operation() (without delta)", async () => {
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
