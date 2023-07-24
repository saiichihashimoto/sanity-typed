import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import type { DocumentValue } from "@sanity-typed/types";

import type { Context, ExecuteQuery, Scope } from ".";

const UNIQUE_VALUE: unique symbol = Symbol("");

describe("groq", () => {
  it("empty", () => expectType<never>().toStrictEqual<ExecuteQuery<"">>());

  it("null", () => expectType<ExecuteQuery<"null">>().toStrictEqual<null>());

  it("true", () => expectType<ExecuteQuery<"true">>().toStrictEqual<true>());

  it("false", () => expectType<ExecuteQuery<"false">>().toStrictEqual<false>());

  it("-5.6", () => expectType<ExecuteQuery<"-5.6">>().toStrictEqual<-5.6>());

  it('"double quoted string"', () =>
    expectType<
      ExecuteQuery<'"double quoted string"'>
    >().toStrictEqual<"double quoted string">());

  it('"double\\" \\"quoted\\" \\"string\\"', () =>
    expectType<
      ExecuteQuery<'"double\\" \\"quoted\\" \\"string\\"'>
    >().toStrictEqual<'double\\" \\"quoted\\" \\"string\\'>());

  it('"double" "quoted" "string"', () =>
    expectType<
      ExecuteQuery<'"double" "quoted" "string"'>
    >().toStrictEqual<never>());

  it("'single quoted string'", () =>
    expectType<
      ExecuteQuery<"'single quoted string'">
    >().toStrictEqual<"single quoted string">());

  it("'single\\' \\'quoted\\' \\'string'", () =>
    expectType<
      ExecuteQuery<"'single\\' \\'quoted\\' \\'string'">
    >().toStrictEqual<"single\\' \\'quoted\\' \\'string">());

  it("'single' 'quoted' 'string'", () =>
    expectType<
      ExecuteQuery<"'single' 'quoted' 'string'">
    >().toStrictEqual<never>());

  it("[]", () => expectType<ExecuteQuery<"[]">>().toStrictEqual<[]>());

  it("[null,true,false,-5.6,\"double quoted string\",'single quoted string']", () =>
    expectType<
      ExecuteQuery<"[null,true,false,-5.6,\"double quoted string\",'single quoted string']">
    >().toStrictEqual<
      [null, true, false, -5.6, "double quoted string", "single quoted string"]
    >());

  it("[true,]", () =>
    expectType<ExecuteQuery<"[true,]">>().toStrictEqual<[true]>());

  it("[1,notvalid]", () =>
    expectType<never>().toStrictEqual<ExecuteQuery<"[1,notvalid]">>());

  it("[...[null]]", () =>
    expectType<ExecuteQuery<"[...[null]]">>().toStrictEqual<[null]>());

  it("[[null,null],[null,null,null]]", () =>
    expectType<ExecuteQuery<"[[null,null],[null,null,null]]">>().toStrictEqual<
      [[null, null], [null, null, null]]
    >());

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
        Context<(DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]>
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

  it("(10)", () => expectType<ExecuteQuery<"(10)">>().toStrictEqual<10>());

  it("(((10)))", () =>
    expectType<ExecuteQuery<"(((10)))">>().toStrictEqual<10>());

  it("[true,false][0..1]", () =>
    expectType<ExecuteQuery<"[true,false][0..1]">>().toStrictEqual<
      [true, false]
    >());

  it("[true,false][0...2]", () =>
    expectType<ExecuteQuery<"[true,false][0...2]">>().toStrictEqual<
      [true, false]
    >());

  it("*[0..10][5...7][0..10][5...7]", () =>
    expectType<
      ExecuteQuery<
        "*[0..10][5...7][0..10][5...7]",
        Context<(DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]>
      >
    >().toStrictEqual<
      (DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]
    >());

  it("false[@]", () =>
    expectType<ExecuteQuery<"false[@]">>().toStrictEqual<false>());

  it("[true,false][@]", () =>
    expectType<ExecuteQuery<"[true,false][@]">>().toStrictEqual<[true]>());

  it("[true,false][@][@][@]", () =>
    expectType<ExecuteQuery<"[true,false][@][@][@]">>().toStrictEqual<
      [true]
    >());

  it("*[true]", () =>
    expectType<
      ExecuteQuery<
        "*[true]",
        Context<(DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]>
      >
    >().toStrictEqual<
      (DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]
    >());

  it('*[_type=="foo"]', () =>
    expectType<
      ExecuteQuery<
        '*[_type=="foo"]',
        Context<(DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]>
      >
    >().toStrictEqual<DocumentValue<"foo", never>[]>());

  it('*[_type!="bar"][_type!="qux"][_type=="foo"]', () =>
    expectType<
      ExecuteQuery<
        '*[_type!="bar"][_type!="qux"][_type=="foo"]',
        Context<
          (
            | DocumentValue<"bar", never>
            | DocumentValue<"foo", never>
            | DocumentValue<"qux", never>
          )[]
        >
      >
    >().toStrictEqual<DocumentValue<"foo", never>[]>());

  it("[true,false][]", () =>
    expectType<ExecuteQuery<"[true,false][]">>().toStrictEqual<
      [true, false]
    >());

  it("*[]", () =>
    expectType<
      ExecuteQuery<
        "*[]",
        Context<(DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]>
      >
    >().toStrictEqual<
      (DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]
    >());

  it("4==5", () => expectType<ExecuteQuery<"4==5">>().toStrictEqual<false>());

  it("4!=5", () => expectType<ExecuteQuery<"4!=5">>().toStrictEqual<true>());

  it("5==5", () => expectType<ExecuteQuery<"5==5">>().toStrictEqual<true>());

  it("5!=5", () => expectType<ExecuteQuery<"5!=5">>().toStrictEqual<false>());

  it("count(5)", () =>
    expectType<ExecuteQuery<"count(5)">>().toStrictEqual<null>());

  it("count([1,2,3,4])", () =>
    expectType<ExecuteQuery<"count([1,2,3,4])">>().toStrictEqual<4>());

  it("global::count([1,2,3,4])", () =>
    expectType<ExecuteQuery<"global::count([1,2,3,4])">>().toStrictEqual<4>());

  it("defined(null)", () =>
    expectType<ExecuteQuery<"defined(null)">>().toStrictEqual<false>());

  it("defined(5)", () =>
    expectType<ExecuteQuery<"defined(5)">>().toStrictEqual<true>());

  it("global::defined(5)", () =>
    expectType<ExecuteQuery<"global::defined(5)">>().toStrictEqual<true>());

  it("length(10)", () =>
    expectType<ExecuteQuery<"length(10)">>().toStrictEqual<null>());

  it("length([null,null,null])", () =>
    expectType<ExecuteQuery<"length([null,null,null])">>().toStrictEqual<3>());

  it('length("string")', () =>
    expectType<ExecuteQuery<'length("string")'>>().toStrictEqual<number>());

  it('global::length("string")', () =>
    expectType<
      ExecuteQuery<'global::length("string")'>
    >().toStrictEqual<number>());
});
