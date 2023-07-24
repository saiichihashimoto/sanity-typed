import { describe, it } from "@jest/globals";
import type { Simplify } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { Context, ExecuteQuery, Scope } from ".";

const FOO: unique symbol = Symbol("foo");
type Foo = typeof FOO;

const BAR: unique symbol = Symbol("bar");
type Bar = typeof BAR;

const QUX: unique symbol = Symbol("qux");
type Qux = typeof QUX;

describe("groq", () => {
  it("empty", () => {
    expectType<never>().toStrictEqual<ExecuteQuery<"">>();
  });

  it("null", () => {
    expectType<ExecuteQuery<"null">>().toStrictEqual<null>();
  });

  it("true", () => {
    expectType<ExecuteQuery<"true">>().toStrictEqual<true>();
  });

  it("false", () => {
    expectType<ExecuteQuery<"false">>().toStrictEqual<false>();
  });

  it("-5.6", () => {
    type Result = ExecuteQuery<"-5.6">;

    expectType<Result>().toStrictEqual<-5.6>();
  });

  it('"double quoted string"', () => {
    expectType<
      ExecuteQuery<'"double quoted string"'>
    >().toStrictEqual<"double quoted string">();
  });

  it('"double\\" \\"quoted\\" \\"string\\"', () => {
    expectType<
      ExecuteQuery<'"double\\" \\"quoted\\" \\"string\\"'>
    >().toStrictEqual<'double\\" \\"quoted\\" \\"string\\'>();
  });

  it('"double" "quoted" "string"', () => {
    expectType<
      ExecuteQuery<'"double" "quoted" "string"'>
    >().toStrictEqual<never>();
  });

  it("'single quoted string'", () => {
    expectType<
      ExecuteQuery<"'single quoted string'">
    >().toStrictEqual<"single quoted string">();
  });

  it("'single\\' \\'quoted\\' \\'string'", () => {
    expectType<
      ExecuteQuery<"'single\\' \\'quoted\\' \\'string'">
    >().toStrictEqual<"single\\' \\'quoted\\' \\'string">();
  });

  it("'single' 'quoted' 'string'", () => {
    expectType<
      ExecuteQuery<"'single' 'quoted' 'string'">
    >().toStrictEqual<never>();
  });

  it("[]", () => {
    expectType<ExecuteQuery<"[]">>().toStrictEqual<[]>();
  });

  it("[null,true,false,-5.6,\"double quoted string\",'single quoted string']", () => {
    type Result =
      ExecuteQuery<"[null,true,false,-5.6,\"double quoted string\",'single quoted string']">;

    expectType<Result>().toStrictEqual<
      [null, true, false, -5.6, "double quoted string", "single quoted string"]
    >();
  });

  it("[true,]", () => {
    expectType<ExecuteQuery<"[true,]">>().toStrictEqual<[true]>();
  });

  it("[1,notvalid]", () => {
    expectType<never>().toStrictEqual<ExecuteQuery<"[1,notvalid]">>();
  });

  it("[...[null]]", () => {
    expectType<ExecuteQuery<"[...[null]]">>().toStrictEqual<[null]>();
  });

  it("[[null,null],[null,null,null]]", () => {
    expectType<ExecuteQuery<"[[null,null],[null,null,null]]">>().toStrictEqual<
      [[null, null], [null, null, null]]
    >();
  });

  it("@", () => {
    expectType<
      ExecuteQuery<"@", Scope<never, Foo, never>>
    >().toStrictEqual<Foo>();
  });

  it("key", () => {
    expectType<
      ExecuteQuery<"key", Scope<never, { key: Foo }, never>>
    >().toStrictEqual<Foo>();
  });

  it("*", () => {
    expectType<
      ExecuteQuery<"*", Context<({ _type: "bar" } | { _type: "foo" })[]>>
    >().toStrictEqual<({ _type: "bar" } | { _type: "foo" })[]>();
  });

  it("^", () => {
    expectType<
      ExecuteQuery<"^", Scope<never, never, Scope<never, Foo, never>>>
    >().toStrictEqual<Foo>();
  });

  it("^.^", () => {
    expectType<
      ExecuteQuery<
        "^.^",
        Scope<never, never, Scope<never, never, Scope<never, Foo, never>>>
      >
    >().toStrictEqual<Foo>();
  });

  it("^.^.^", () => {
    expectType<
      ExecuteQuery<
        "^.^.^",
        Scope<
          never,
          never,
          Scope<never, never, Scope<never, never, Scope<never, Foo, never>>>
        >
      >
    >().toStrictEqual<Foo>();
  });

  it("(10)", () => {
    expectType<ExecuteQuery<"(10)">>().toStrictEqual<10>();
  });

  it("(((10)))", () => {
    expectType<ExecuteQuery<"(((10)))">>().toStrictEqual<10>();
  });

  it("foo.bar", () => {
    expectType<
      ExecuteQuery<"foo.bar", Scope<never, { foo: { bar: Bar } }, never>>
    >().toStrictEqual<Bar>();
  });

  it('foo["bar"]', () => {
    expectType<
      ExecuteQuery<'foo["bar"]', Scope<never, { foo: { bar: Bar } }, never>>
    >().toStrictEqual<Bar>();
  });

  it("foo.bar.qux", () => {
    type Result = ExecuteQuery<
      "foo.bar.qux",
      Scope<never, { foo: { bar: { qux: Qux } } }, never>
    >;

    expectType<Result>().toStrictEqual<Qux>();
  });

  it('foo["bar"]["qux"]', () => {
    expectType<
      ExecuteQuery<
        'foo["bar"]["qux"]',
        Scope<never, { foo: { bar: { qux: Qux } } }, never>
      >
    >().toStrictEqual<Qux>();
  });

  it('foo.bar["qux"]', () => {
    expectType<
      ExecuteQuery<
        'foo.bar["qux"]',
        Scope<never, { foo: { bar: { qux: Qux } } }, never>
      >
    >().toStrictEqual<Qux>();
  });

  it('foo["bar"].qux', () => {
    expectType<
      ExecuteQuery<
        'foo["bar"]["qux"]',
        Scope<never, { foo: { bar: { qux: Qux } } }, never>
      >
    >().toStrictEqual<Qux>();
  });

  it("*.key", () => {
    expectType<
      ExecuteQuery<"*.key", Context<({ key: Bar } | { key: Foo })[]>>
    >().toStrictEqual<[Bar | Foo][]>();
  });

  it('*["key"]', () => {
    expectType<
      ExecuteQuery<'*["key"]', Context<({ key: Bar } | { key: Foo })[]>>
    >().toStrictEqual<[Bar | Foo][]>();
  });

  it("[true,false][1]", () => {
    expectType<ExecuteQuery<"[true,false][1]">>().toStrictEqual<false | true>();
  });

  it("*[1]", () => {
    type Result = Simplify<
      ExecuteQuery<"*[1]", Context<({ key: Bar } | { key: Foo })[]>>
    >;

    expectType<Result>().toStrictEqual<{ key: Bar } | { key: Foo }>();
  });

  it("[true,false][0..1]", () => {
    expectType<ExecuteQuery<"[true,false][0..1]">>().toStrictEqual<
      [true, false]
    >();
  });

  it("[true,false][0...2]", () => {
    expectType<ExecuteQuery<"[true,false][0...2]">>().toStrictEqual<
      [true, false]
    >();
  });

  it("*[0..10][5...7][0..10]", () => {
    type Result = ExecuteQuery<
      "*[0..10][5...7][0..10]",
      Context<({ _type: "bar" } | { _type: "foo" })[]>
    >;

    expectType<Result>().toStrictEqual<
      ({ _type: "bar" } | { _type: "foo" })[]
    >();
  });

  it("false[@]", () => {
    expectType<ExecuteQuery<"false[@]">>().toStrictEqual<false>();
  });

  it("[true,false][@]", () => {
    expectType<ExecuteQuery<"[true,false][@]">>().toStrictEqual<[true]>();
  });

  it("[true,false][@][@][@]", () => {
    expectType<ExecuteQuery<"[true,false][@][@][@]">>().toStrictEqual<[true]>();
  });

  it("*[true]", () => {
    type Result = ExecuteQuery<
      "*[true]",
      Context<({ _type: "bar" } | { _type: "foo" })[]>
    >;

    expectType<Result>().toStrictEqual<
      ({ _type: "bar" } | { _type: "foo" })[]
    >();
  });

  it('*[_type=="foo"]', () => {
    type Result = ExecuteQuery<
      '*[_type=="foo"]',
      Context<({ _type: "bar" } | { _type: "foo" })[]>
    >;

    expectType<Result>().toStrictEqual<{ _type: "foo" }[]>();
  });

  it('*[_type!="bar"][_type!="qux"][_type=="foo"]', () => {
    expectType<
      ExecuteQuery<
        '*[_type!="bar"][_type!="qux"][_type=="foo"]',
        Context<({ _type: "bar" } | { _type: "foo" } | { _type: "qux" })[]>
      >
    >().toStrictEqual<{ _type: "foo" }[]>();
  });

  it("[true,false][]", () => {
    expectType<ExecuteQuery<"[true,false][]">>().toStrictEqual<[true, false]>();
  });

  it("*[]", () => {
    expectType<
      ExecuteQuery<"*[]", Context<({ _type: "bar" } | { _type: "foo" })[]>>
    >().toStrictEqual<({ _type: "bar" } | { _type: "foo" })[]>();
  });

  it("4==5", () => {
    expectType<ExecuteQuery<"4==5">>().toStrictEqual<false>();
  });

  it("4!=5", () => {
    expectType<ExecuteQuery<"4!=5">>().toStrictEqual<true>();
  });

  it("5==5", () => {
    expectType<ExecuteQuery<"5==5">>().toStrictEqual<true>();
  });

  it("5!=5", () => {
    expectType<ExecuteQuery<"5!=5">>().toStrictEqual<false>();
  });

  it("count(5)", () => {
    expectType<ExecuteQuery<"count(5)">>().toStrictEqual<null>();
  });

  it("count([1,2,3,4])", () => {
    expectType<ExecuteQuery<"count([1,2,3,4])">>().toStrictEqual<4>();
  });

  it("global::count([1,2,3,4])", () => {
    expectType<ExecuteQuery<"global::count([1,2,3,4])">>().toStrictEqual<4>();
  });

  it("defined(null)", () => {
    expectType<ExecuteQuery<"defined(null)">>().toStrictEqual<false>();
  });

  it("defined(5)", () => {
    expectType<ExecuteQuery<"defined(5)">>().toStrictEqual<true>();
  });

  it("global::defined(5)", () => {
    expectType<ExecuteQuery<"global::defined(5)">>().toStrictEqual<true>();
  });

  it("length(10)", () => {
    expectType<ExecuteQuery<"length(10)">>().toStrictEqual<null>();
  });

  it("length([null,null,null])", () => {
    expectType<ExecuteQuery<"length([null,null,null])">>().toStrictEqual<3>();
  });

  it('length("string")', () => {
    expectType<ExecuteQuery<'length("string")'>>().toStrictEqual<number>();
  });

  it('global::length("string")', () => {
    expectType<
      ExecuteQuery<'global::length("string")'>
    >().toStrictEqual<number>();
  });
});
