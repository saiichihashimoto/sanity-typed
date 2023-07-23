import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import type { DocumentValue } from "@sanity-typed/types";

import type { ExecuteQuery, Scope } from ".";

const UNIQUE_VALUE: unique symbol = Symbol("");

type Empty = { [key: string]: never };

describe("groq", () => {
  it("null", () =>
    expectType<ExecuteQuery<"null", Empty>>().toStrictEqual<null>());

  it("true", () =>
    expectType<ExecuteQuery<"true", Empty>>().toStrictEqual<true>());

  it("false", () =>
    expectType<ExecuteQuery<"false", Empty>>().toStrictEqual<false>());

  it("-5.6", () =>
    expectType<ExecuteQuery<"-5.6", Empty>>().toStrictEqual<-5.6>());

  it('"double quoted string"', () =>
    expectType<
      ExecuteQuery<'"double quoted string"', Empty>
    >().toStrictEqual<"double quoted string">());

  it("'single quoted string'", () =>
    expectType<
      ExecuteQuery<"'single quoted string'", Empty>
    >().toStrictEqual<"single quoted string">());

  it("[]", () => expectType<ExecuteQuery<"[]", Empty>>().toStrictEqual<[]>());

  it("[null,true,false,-5.6,\"double quoted string\",'single quoted string']", () =>
    expectType<
      ExecuteQuery<
        "[null,true,false,-5.6,\"double quoted string\",'single quoted string']",
        Empty
      >
    >().toStrictEqual<
      [null, true, false, -5.6, "double quoted string", "single quoted string"]
    >());

  it("[true,]", () =>
    expectType<ExecuteQuery<"[true,]", Empty>>().toStrictEqual<[true]>());

  it("[1,notvalid]", () =>
    expectType<never>().toStrictEqual<ExecuteQuery<"[1,notvalid]", Empty>>());

  it("[...[null]]", () =>
    expectType<ExecuteQuery<"[...[null]]", Empty>>().toStrictEqual<[null]>());

  it("[[null,null],[null,null,null]]", () =>
    expectType<
      ExecuteQuery<"[[null,null],[null,null,null]]", Empty>
    >().toStrictEqual<[[null, null], [null, null, null]]>());

  it("@", () =>
    expectType<
      ExecuteQuery<"@", Scope<never, typeof UNIQUE_VALUE, never>>
    >().toStrictEqual<typeof UNIQUE_VALUE>());

  it("key", () =>
    expectType<
      ExecuteQuery<"key", Scope<never, { key: typeof UNIQUE_VALUE }, never>>
    >().toStrictEqual<typeof UNIQUE_VALUE>());

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

  it("(10)", () =>
    expectType<ExecuteQuery<"(10)", Empty>>().toStrictEqual<10>());

  it("(((10)))", () =>
    expectType<ExecuteQuery<"(((10)))", Empty>>().toStrictEqual<10>());

  it("false[@]", () =>
    expectType<ExecuteQuery<"false[@]", Empty>>().toStrictEqual<false>());

  it("[true,false][@]", () =>
    expectType<ExecuteQuery<"[true,false][@]", Empty>>().toStrictEqual<
      [true]
    >());

  it("*[true]", () =>
    expectType<
      ExecuteQuery<
        "*[true]",
        {
          bar: DocumentValue<"bar", never>;
          foo: DocumentValue<"foo", never>;
          qux: { _type: "qux" };
        }
      >
    >().toStrictEqual<
      (DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]
    >());

  it('*[_type=="foo"]', () =>
    expectType<
      ExecuteQuery<
        '*[_type=="foo"]',
        {
          bar: DocumentValue<"bar", never>;
          foo: DocumentValue<"foo", never>;
          qux: { _type: "qux" };
        }
      >
    >().toStrictEqual<DocumentValue<"foo", never>[]>());

  it("4==5", () =>
    expectType<ExecuteQuery<"4==5", Empty>>().toStrictEqual<false>());

  it("4!=5", () =>
    expectType<ExecuteQuery<"4!=5", Empty>>().toStrictEqual<true>());

  it("5==5", () =>
    expectType<ExecuteQuery<"5==5", Empty>>().toStrictEqual<true>());

  it("5!=5", () =>
    expectType<ExecuteQuery<"5!=5", Empty>>().toStrictEqual<false>());

  it("count(5)", () =>
    expectType<ExecuteQuery<"count(5)", Empty>>().toStrictEqual<null>());

  it("count([1,2,3,4])", () =>
    expectType<ExecuteQuery<"count([1,2,3,4])", Empty>>().toStrictEqual<4>());

  it("global::count([1,2,3,4])", () =>
    expectType<
      ExecuteQuery<"global::count([1,2,3,4])", Empty>
    >().toStrictEqual<4>());

  it("defined(null)", () =>
    expectType<ExecuteQuery<"defined(null)", Empty>>().toStrictEqual<false>());

  it("defined(5)", () =>
    expectType<ExecuteQuery<"defined(5)", Empty>>().toStrictEqual<true>());

  it("global::defined(5)", () =>
    expectType<
      ExecuteQuery<"global::defined(5)", Empty>
    >().toStrictEqual<true>());

  it("length(10)", () =>
    expectType<ExecuteQuery<"length(10)", Empty>>().toStrictEqual<null>());

  it("length([null,null,null])", () =>
    expectType<
      ExecuteQuery<"length([null,null,null])", Empty>
    >().toStrictEqual<3>());

  it('length("string")', () =>
    expectType<
      ExecuteQuery<'length("string")', Empty>
    >().toStrictEqual<number>());

  it('global::length("string")', () =>
    expectType<
      ExecuteQuery<'global::length("string")', Empty>
    >().toStrictEqual<number>());
});
