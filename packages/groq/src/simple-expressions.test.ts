import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";

const FOO: unique symbol = Symbol("foo");
type Foo = typeof FOO;

describe("simple expressions", () => {
  it("@", () => {
    const query = "@";

    expectType<Parse<typeof query>>().toStrictEqual<{ type: "This" }>;
    expectType<
      ExecuteQuery<typeof query, { this: Foo }>
    >().toStrictEqual<Foo>();
  });

  it("key", () => {
    const query = "key";

    expectType<Parse<typeof query>>().toStrictEqual<{
      name: "key";
      type: "AccessAttribute";
    }>;
    expectType<
      ExecuteQuery<typeof query, { this: { key: Foo } }>
    >().toStrictEqual<Foo>();
  });

  it("*", () => {
    const query = "*";

    expectType<Parse<typeof query>>().toStrictEqual<{ type: "Everything" }>();
    expectType<
      ExecuteQuery<
        typeof query,
        { dataset: ({ _type: "bar" } | { _type: "foo" })[] }
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
      ExecuteQuery<
        typeof query,
        { parent: { context: never; parent: null; this: Foo } }
      >
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
        {
          parent: {
            context: never;
            parent: { context: never; parent: null; this: Foo };
            this: Foo;
          };
        }
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
        {
          parent: {
            context: never;
            parent: {
              context: never;
              parent: { context: never; parent: null; this: Foo };
              this: Foo;
            };
            this: Foo;
          };
        }
      >
    >().toStrictEqual<Foo>();
  });
});
