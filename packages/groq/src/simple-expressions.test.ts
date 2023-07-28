import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import type { Context, ExecuteQuery, Parse, Scope } from ".";

const FOO: unique symbol = Symbol("foo");
type Foo = typeof FOO;

describe("simple expressions", () => {
  it("@", () => {
    const query = "@";

    expectType<Parse<typeof query>>().toStrictEqual<{ type: "This" }>;
    expectType<
      ExecuteQuery<typeof query, Scope<never, Foo, never>>
    >().toStrictEqual<Foo>();
  });

  it("key", () => {
    const query = "key";

    expectType<Parse<typeof query>>().toStrictEqual<{
      name: "key";
      type: "AccessAttribute";
    }>;
    expectType<
      ExecuteQuery<typeof query, Scope<never, { key: Foo }, never>>
    >().toStrictEqual<Foo>();
  });

  it("*", () => {
    const query = "*";

    expectType<Parse<typeof query>>().toStrictEqual<{ type: "Everything" }>();
    expectType<
      ExecuteQuery<
        typeof query,
        Context<({ _type: "bar" } | { _type: "foo" })[]>
      >
    >().toStrictEqual<({ _type: "bar" } | { _type: "foo" })[]>();
  });

  it("^", () => {
    const query = "^";

    expectType<Parse<typeof query>>().toStrictEqual<{
      n: 1;
      type: "Parent";
    }>();
    expectType<
      ExecuteQuery<typeof query, Scope<never, never, Scope<never, Foo, never>>>
    >().toStrictEqual<Foo>();
  });

  it("^.^", () => {
    const query = "^.^";

    expectType<Parse<typeof query>>().toStrictEqual<{
      n: 2;
      type: "Parent";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        Scope<never, never, Scope<never, never, Scope<never, Foo, never>>>
      >
    >().toStrictEqual<Foo>();
  });

  it("^.^.^", () => {
    const query = "^.^.^";

    expectType<Parse<typeof query>>().toStrictEqual<{
      n: 3;
      type: "Parent";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        Scope<
          never,
          never,
          Scope<never, never, Scope<never, never, Scope<never, Foo, never>>>
        >
      >
    >().toStrictEqual<Foo>();
  });
});
