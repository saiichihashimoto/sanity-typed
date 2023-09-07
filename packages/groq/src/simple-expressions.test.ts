import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { WritableDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type {
  ExecuteQuery,
  Parse,
  _ScopeFromPartialContext,
  _ScopeFromPartialScope,
} from ".";

describe("simple expressions", () => {
  it("@", async () => {
    const query = "@";

    const tree = parse(query);

    const expectedTree = { type: "This" } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = "foo";

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = "foo";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<typeof query, _ScopeFromPartialScope<{ this: typeof root }>>
    >().toStrictEqual<typeof expectedResult>();
  });

  it("key", async () => {
    const query = "key";

    const tree = parse(query);

    const expectedTree = {
      name: "key",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { key: "foo" } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = "foo";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: WritableDeep<typeof root> }>
      >
    >().toStrictEqual<typeof expectedResult>();
  });

  it("*", async () => {
    const query = "*";

    const tree = parse(query);

    const expectedTree = { type: "Everything" } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ _type: "bar" }, { _type: "foo" }] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = dataset;

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

  it("^", async () => {
    const query = "^";

    const tree = parse(query);

    const expectedTree = {
      n: 1,
      type: "Parent",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const expectedResult = "foo";

    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{
          parent: _ScopeFromPartialScope<{
            this: "foo";
          }>;
        }>
      >
    >().toStrictEqual<typeof expectedResult>();
  });

  it("^.^", async () => {
    const query = "^.^";

    const tree = parse(query);

    const expectedTree = {
      n: 2,
      type: "Parent",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const expectedResult = "foo";

    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{
          parent: _ScopeFromPartialScope<{
            parent: _ScopeFromPartialScope<{
              this: "foo";
            }>;
          }>;
        }>
      >
    >().toStrictEqual<typeof expectedResult>();
  });

  it("^.^.^", async () => {
    const query = "^.^.^";

    const tree = parse(query);

    const expectedTree = {
      n: 3,
      type: "Parent",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const expectedResult = "foo";

    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{
          parent: _ScopeFromPartialScope<{
            parent: _ScopeFromPartialScope<{
              parent: _ScopeFromPartialScope<{
                this: "foo";
              }>;
            }>;
          }>;
        }>
      >
    >().toStrictEqual<typeof expectedResult>();
  });

  it("$param", async () => {
    const query = "$param";

    const tree = parse(query);

    const expectedTree = {
      name: "param",
      type: "Parameter",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = { param: "foo" } as const;

    const result = await (await evaluate(tree, { params })).get();

    const expectedResult = "foo";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<typeof expectedResult>();
  });
});
