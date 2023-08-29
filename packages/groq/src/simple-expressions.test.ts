import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { ReadonlyDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type {
  ExecuteQuery,
  Parse,
  _ScopeFromPartialContext,
  _ScopeFromPartialScope,
} from ".";

const FOO: unique symbol = Symbol("foo");
type Foo = typeof FOO;

describe("simple expressions", () => {
  it("@", async () => {
    const query = "@";
    const tree = parse(query);
    const result = await (await evaluate(tree, { root: FOO })).get();

    const desiredTree = { type: "This" } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(FOO);
    expectType<
      ExecuteQuery<typeof query, _ScopeFromPartialScope<{ this: Foo }>>
    >().toStrictEqual<Foo>();
  });

  it("key", async () => {
    const query = "key";
    const tree = parse(query);
    const result = await (await evaluate(tree, { root: { key: FOO } })).get();

    const desiredTree = {
      name: "key",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(FOO);
    expectType<
      ExecuteQuery<typeof query, _ScopeFromPartialScope<{ this: { key: Foo } }>>
    >().toStrictEqual<Foo>();
  });

  it("*", async () => {
    const query = "*";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { dataset: [{ _type: "bar" }, { _type: "foo" }] })
    ).get();

    const desiredTree = { type: "Everything" } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([{ _type: "bar" }, { _type: "foo" }]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: ({ _type: "bar" } | { _type: "foo" })[];
        }>
      >
    >().toStrictEqual<({ _type: "bar" } | { _type: "foo" })[]>();
  });

  it("^", async () => {
    const query = "^";
    const tree = parse(query);

    const desiredTree = {
      n: 1,
      type: "Parent",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{
          parent: { context: never; parent: null; this: Foo };
        }>
      >
    >().toStrictEqual<Foo>();
  });

  it("^.^", async () => {
    const query = "^.^";
    const tree = parse(query);

    const desiredTree = {
      n: 2,
      type: "Parent",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{
          parent: {
            context: never;
            parent: { context: never; parent: null; this: Foo };
            this: Foo;
          };
        }>
      >
    >().toStrictEqual<Foo>();
  });

  it("^.^.^", async () => {
    const query = "^.^.^";
    const tree = parse(query);

    const desiredTree = {
      n: 3,
      type: "Parent",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{
          parent: {
            context: never;
            parent: {
              context: never;
              parent: { context: never; parent: null; this: Foo };
              this: Foo;
            };
            this: Foo;
          };
        }>
      >
    >().toStrictEqual<Foo>();
  });

  it("$param", async () => {
    const query = "$param";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { params: { param: FOO } })
    ).get();

    const desiredTree = {
      name: "param",
      type: "Parameter",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual(FOO);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{ parameters: { param: Foo } }>
      >
    >().toStrictEqual<Foo>();
  });
});
