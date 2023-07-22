import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import type { DocumentValue } from "@sanity-typed/types";

import type { ExecuteQuery, Scope } from ".";

describe("groq", () => {
  it("null", () =>
    expectType<
      ExecuteQuery<"null", { [key: string]: never }>
    >().toStrictEqual<null>());

  it("true", () =>
    expectType<
      ExecuteQuery<"true", { [key: string]: never }>
    >().toStrictEqual<true>());

  it("false", () =>
    expectType<
      ExecuteQuery<"false", { [key: string]: never }>
    >().toStrictEqual<false>());

  it("-5.6", () =>
    expectType<
      ExecuteQuery<"-5.6", { [key: string]: never }>
    >().toStrictEqual<-5.6>());

  it('"double quoted string"', () =>
    expectType<
      ExecuteQuery<'"double quoted string"', { [key: string]: never }>
    >().toStrictEqual<"double quoted string">());

  it("'single quoted string'", () =>
    expectType<
      ExecuteQuery<"'single quoted string'", { [key: string]: never }>
    >().toStrictEqual<"single quoted string">());

  it("[]", () =>
    expectType<ExecuteQuery<"[]", { [key: string]: never }>>().toStrictEqual<
      []
    >());

  it("[null,true,false,-5.6,\"double quoted string\",'single quoted string']", () =>
    expectType<
      ExecuteQuery<
        "[null,true,false,-5.6,\"double quoted string\",'single quoted string']",
        { [key: string]: never }
      >
    >().toStrictEqual<
      [null, true, false, -5.6, "double quoted string", "single quoted string"]
    >());

  it("[...[null]]", () =>
    expectType<
      ExecuteQuery<"[...[null]]", { [key: string]: never }>
    >().toStrictEqual<[null]>());

  it("[[null,null],[null,null,null]]", () =>
    expectType<
      ExecuteQuery<"[[null,null],[null,null,null]]", { [key: string]: never }>
    >().toStrictEqual<[[null, null], [null, null, null]]>());

  it("@", () => {
    const UNIQUE_VALUE: unique symbol = Symbol("");

    expectType<
      ExecuteQuery<"@", Scope<never, typeof UNIQUE_VALUE, never>>
    >().toStrictEqual<typeof UNIQUE_VALUE>();
  });

  it("key", () => {
    const UNIQUE_VALUE: unique symbol = Symbol("");

    expectType<
      ExecuteQuery<"key", Scope<never, { key: typeof UNIQUE_VALUE }, never>>
    >().toStrictEqual<typeof UNIQUE_VALUE>();
  });

  it("*", () =>
    expectType<
      ExecuteQuery<
        "*",
        {
          bar: DocumentValue<"bar", never>;
          foo: DocumentValue<"foo", never>;
          qux: { _type: "qux" };
        }
      >
    >().toStrictEqual<
      (DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]
    >());

  it("^", () => {
    const UNIQUE_VALUE: unique symbol = Symbol("");

    expectType<
      ExecuteQuery<
        "^",
        Scope<never, never, Scope<never, typeof UNIQUE_VALUE, never>>
      >
    >().toStrictEqual<typeof UNIQUE_VALUE>();
  });

  it("^.^", () => {
    const UNIQUE_VALUE: unique symbol = Symbol("");

    expectType<
      ExecuteQuery<
        "^.^",
        Scope<
          never,
          never,
          Scope<never, never, Scope<never, typeof UNIQUE_VALUE, never>>
        >
      >
    >().toStrictEqual<typeof UNIQUE_VALUE>();
  });

  it("^.^.^", () => {
    const UNIQUE_VALUE: unique symbol = Symbol("");

    expectType<
      ExecuteQuery<
        "^.^.^",
        Scope<
          never,
          never,
          Scope<
            never,
            never,
            Scope<never, never, Scope<never, typeof UNIQUE_VALUE, never>>
          >
        >
      >
    >().toStrictEqual<typeof UNIQUE_VALUE>();
  });

  it("(*)", () =>
    expectType<
      ExecuteQuery<
        "(*)",
        {
          bar: DocumentValue<"bar", never>;
          foo: DocumentValue<"foo", never>;
          qux: { _type: "qux" };
        }
      >
    >().toStrictEqual<
      (DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]
    >());

  it("count(5)", () =>
    expectType<
      ExecuteQuery<"count(5)", { [key: string]: never }>
    >().toStrictEqual<null>());

  it("count([1,2,3,4])", () =>
    expectType<
      ExecuteQuery<"count([1,2,3,4])", { [key: string]: never }>
    >().toStrictEqual<4>());

  it("global::count([1,2,3,4])", () =>
    expectType<
      ExecuteQuery<"global::count([1,2,3,4])", { [key: string]: never }>
    >().toStrictEqual<4>());

  it("defined(null)", () =>
    expectType<
      ExecuteQuery<"defined(null)", { [key: string]: never }>
    >().toStrictEqual<false>());

  it("defined(5)", () =>
    expectType<
      ExecuteQuery<"defined(5)", { [key: string]: never }>
    >().toStrictEqual<true>());

  it("global::defined(5)", () =>
    expectType<
      ExecuteQuery<"global::defined(5)", { [key: string]: never }>
    >().toStrictEqual<true>());
});
