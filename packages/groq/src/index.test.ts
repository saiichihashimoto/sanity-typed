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
  it('""', () => {
    expectType<never>().toStrictEqual<ExecuteQuery<"">>();
  });

  describe("data types", () => {
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
      expectType<never>().toStrictEqual<
        ExecuteQuery<'"double" "quoted" "string"'>
      >();
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
      expectType<never>().toStrictEqual<
        ExecuteQuery<"'single' 'quoted' 'string'">
      >();
    });

    it("[]", () => {
      expectType<ExecuteQuery<"[]">>().toStrictEqual<[]>();
    });

    it("[null,true,false,-5.6,\"double quoted string\",'single quoted string']", () => {
      type Result =
        ExecuteQuery<"[null,true,false,-5.6,\"double quoted string\",'single quoted string']">;

      expectType<Result>().toStrictEqual<
        [
          null,
          true,
          false,
          -5.6,
          "double quoted string",
          "single quoted string"
        ]
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
      expectType<
        ExecuteQuery<"[[null,null],[null,null,null]]">
      >().toStrictEqual<[[null, null], [null, null, null]]>();
    });
  });

  describe("simple expressions", () => {
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
  });

  describe("compound expressions", () => {
    it("(10)", () => {
      expectType<ExecuteQuery<"(10)">>().toStrictEqual<10>();
    });

    it("(((10)))", () => {
      expectType<ExecuteQuery<"(((10)))">>().toStrictEqual<10>();
    });
  });

  describe("traversal operators", () => {
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
      >().toStrictEqual<(Bar | Foo)[]>();
    });

    it('*["key"]', () => {
      expectType<
        ExecuteQuery<'*["key"]', Context<({ key: Bar } | { key: Foo })[]>>
      >().toStrictEqual<(Bar | Foo)[]>();
    });

    it("[true,false][1]", () => {
      expectType<ExecuteQuery<"[true,false][1]">>().toStrictEqual<
        false | true
      >();
    });

    it("*[1]", () => {
      type Result = Simplify<
        ExecuteQuery<"*[1]", Context<({ key: Bar } | { key: Foo })[]>>
      >;

      expectType<Result>().toStrictEqual<{ key: Bar } | { key: Foo }>();
    });

    it("[[[5]]][0][0][0]", () => {
      type Result = ExecuteQuery<"[[[5]]][0][0][0]">;

      expectType<Result>().toStrictEqual<5>();
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
      expectType<ExecuteQuery<"[true,false][@][@][@]">>().toStrictEqual<
        [true]
      >();
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
      expectType<ExecuteQuery<"[true,false][]">>().toStrictEqual<
        [true, false]
      >();
    });

    it("*[]", () => {
      expectType<
        ExecuteQuery<"*[]", Context<({ _type: "bar" } | { _type: "foo" })[]>>
      >().toStrictEqual<({ _type: "bar" } | { _type: "foo" })[]>();
    });
  });

  describe("operators", () => {
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
  });

  describe("functions", () => {
    describe("global", () => {
      it("coalesce()", () => {
        expectType<ExecuteQuery<"coalesce()">>().toStrictEqual<null>();
      });

      it("coalesce(1)", () => {
        expectType<ExecuteQuery<"coalesce(1)">>().toStrictEqual<1>();
      });

      it("coalesce(null)", () => {
        expectType<ExecuteQuery<"coalesce(null)">>().toStrictEqual<null>();
      });

      it("coalesce(1,null)", () => {
        expectType<ExecuteQuery<"coalesce(1,null)">>().toStrictEqual<1>();
      });

      it("coalesce(null,1)", () => {
        expectType<ExecuteQuery<"coalesce(null,1)">>().toStrictEqual<1>();
      });

      it("coalesce(key,2)", () => {
        type Result = ExecuteQuery<
          "coalesce(key,2)",
          Scope<never, { key: 1 | null }, never>
        >;

        expectType<Result>().toStrictEqual<1 | 2>();
      });

      it("global::coalesce(key,2)", () => {
        type Result = ExecuteQuery<
          "coalesce(key,2)",
          Scope<never, { key: 1 | null }, never>
        >;

        expectType<Result>().toStrictEqual<1 | 2>();
      });

      it("count(5)", () => {
        expectType<ExecuteQuery<"count(5)">>().toStrictEqual<null>();
      });

      it("count([1,2,3,4])", () => {
        expectType<ExecuteQuery<"count([1,2,3,4])">>().toStrictEqual<4>();
      });

      it("global::count([1,2,3,4])", () => {
        expectType<
          ExecuteQuery<"global::count([1,2,3,4])">
        >().toStrictEqual<4>();
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
        expectType<
          ExecuteQuery<"length([null,null,null])">
        >().toStrictEqual<3>();
      });

      it('length("string")', () => {
        expectType<ExecuteQuery<'length("string")'>>().toStrictEqual<number>();
      });

      it('global::length("string")', () => {
        expectType<
          ExecuteQuery<'global::length("string")'>
        >().toStrictEqual<number>();
      });

      it('lower("String")', () => {
        expectType<ExecuteQuery<'lower("String")'>>().toStrictEqual<"string">();
      });

      it('global::lower("String")', () => {
        expectType<
          ExecuteQuery<'global::lower("String")'>
        >().toStrictEqual<"string">();
      });

      it("now()", () => {
        expectType<ExecuteQuery<"now()">>().toStrictEqual<string>();
      });

      it("global::now()", () => {
        expectType<ExecuteQuery<"global::now()">>().toStrictEqual<string>();
      });

      it("round(3.14)", () => {
        expectType<ExecuteQuery<"round(3.14)">>().toStrictEqual<number>();
      });

      it("round(3.14,1)", () => {
        expectType<ExecuteQuery<"round(3.14,1)">>().toStrictEqual<number>();
      });

      it("global::round(3.14,1)", () => {
        expectType<
          ExecuteQuery<"global::round(3.14,1)">
        >().toStrictEqual<number>();
      });

      it("string(true)", () => {
        expectType<ExecuteQuery<"string(true)">>().toStrictEqual<"true">();
      });

      it("string(false)", () => {
        expectType<ExecuteQuery<"string(false)">>().toStrictEqual<"false">();
      });

      it('string("a string")', () => {
        expectType<
          ExecuteQuery<'string("a string")'>
        >().toStrictEqual<"a string">();
      });

      it("string(3.14)", () => {
        expectType<ExecuteQuery<"string(3.14)">>().toStrictEqual<"3.14">();
      });

      it("string([])", () => {
        expectType<ExecuteQuery<"string([])">>().toStrictEqual<null>();
      });

      it("global::string(3.14)", () => {
        expectType<
          ExecuteQuery<"global::string(3.14)">
        >().toStrictEqual<"3.14">();
      });

      it('upper("String")', () => {
        expectType<ExecuteQuery<'upper("String")'>>().toStrictEqual<"STRING">();
      });

      it('global::upper("String")', () => {
        expectType<
          ExecuteQuery<'global::upper("String")'>
        >().toStrictEqual<"STRING">();
      });
    });
  });
});
