import { describe, it } from "@jest/globals";
import type { PortableTextBlock } from "@portabletext/types";
import type {
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from "geojson";
import type { GroqFunction } from "groq-js";

import { expectType } from "@sanity-typed/test-utils";

import type { DateTime, ExecuteQuery, Geo, Parse } from ".";

describe("functions", () => {
  describe("global", () => {
    it("after() (without delta)", () => {
      const query = "after()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::after";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toBeNever();
    });

    it("after() (with null delta)", () => {
      const query = "after()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::after";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query, { delta: null }>>().toBeNever();
    });

    it("after() (with null after)", () => {
      const query = "after()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::after";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { delta: { after: null; before: { _type: "foo" } } }
        >
      >().toStrictEqual<null>();
    });

    it("after()", () => {
      const query = "after()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::after";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { delta: { after: { _type: "foo" }; before: null } }
        >
      >().toStrictEqual<{ _type: "foo" }>();
    });

    it("global::after()", () => {
      const query = "global::after()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::after";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { delta: { after: { _type: "foo" }; before: null } }
        >
      >().toStrictEqual<{ _type: "foo" }>();
    });

    it("before() (without delta)", () => {
      const query = "before()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::before";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toBeNever();
    });

    it("before() (with null delta)", () => {
      const query = "before()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::before";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query, { delta: null }>>().toBeNever();
    });

    it("before() (with null before)", () => {
      const query = "before()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::before";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { delta: { after: { _type: "foo" }; before: null } }
        >
      >().toStrictEqual<null>();
    });

    it("before()", () => {
      const query = "before()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::before";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { delta: { after: null; before: { _type: "foo" } } }
        >
      >().toStrictEqual<{ _type: "foo" }>();
    });

    it("global::before()", () => {
      const query = "global::before()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::before";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { delta: { after: null; before: { _type: "foo" } } }
        >
      >().toStrictEqual<{ _type: "foo" }>();
    });

    it("coalesce()", () => {
      const query = "coalesce()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::coalesce";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("coalesce(1)", () => {
      const query = "coalesce(1)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 1 }];
        func: GroqFunction;
        name: "global::coalesce";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<1>();
    });

    it("coalesce(null)", () => {
      const query = "coalesce(null)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: null }];
        func: GroqFunction;
        name: "global::coalesce";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("coalesce(1,null)", () => {
      const query = "coalesce(1,null)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 1 }, { type: "Value"; value: null }];
        func: GroqFunction;
        name: "global::coalesce";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<1>();
    });

    it("coalesce(null,1)", () => {
      const query = "coalesce(null,1)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: null }, { type: "Value"; value: 1 }];
        func: GroqFunction;
        name: "global::coalesce";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<1>();
    });

    it("coalesce(key,2)", () => {
      const query = "coalesce(key,2)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { name: "key"; type: "AccessAttribute" },
          { type: "Value"; value: 2 }
        ];
        func: GroqFunction;
        name: "global::coalesce";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { this: { key: 1 | null } }>
      >().toStrictEqual<1 | 2>();
    });

    it("global::coalesce(key,2)", () => {
      const query = "global::coalesce(key,2)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { name: "key"; type: "AccessAttribute" },
          { type: "Value"; value: 2 }
        ];
        func: GroqFunction;
        name: "global::coalesce";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { this: { key: 1 | null } }>
      >().toStrictEqual<1 | 2>();
    });

    it("count(5)", () => {
      const query = "count(5)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 5 }];
        func: GroqFunction;
        name: "global::count";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("count([1,2,3,4])", () => {
      const query = "count([1,2,3,4])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 2 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 4 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "global::count";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<4>();
    });

    it("global::count([1,2,3,4])", () => {
      const query = "global::count([1,2,3,4])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 2 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 4 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "global::count";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<4>();
    });

    it("dateTime(false)", () => {
      const query = "dateTime(false)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: false }];
        func: GroqFunction;
        name: "global::dateTime";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('dateTime("some date")', () => {
      const query = 'dateTime("some date")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: "some date" }];
        func: GroqFunction;
        name: "global::dateTime";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        DateTime<"some date">
      >();
    });

    it("dateTime($param) (with DateTime)", () => {
      const query = "dateTime($param)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ name: "param"; type: "Parameter" }];
        func: GroqFunction;
        name: "global::dateTime";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { parameters: { param: DateTime<"some date"> } }
        >
      >().toStrictEqual<DateTime<"some date">>();
    });

    it("global::dateTime($param) (with DateTime)", () => {
      const query = "global::dateTime($param)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ name: "param"; type: "Parameter" }];
        func: GroqFunction;
        name: "global::dateTime";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { parameters: { param: DateTime<"some date"> } }
        >
      >().toStrictEqual<DateTime<"some date">>();
    });

    it("defined(null)", () => {
      const query = "defined(null)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: null }];
        func: GroqFunction;
        name: "global::defined";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("defined(5)", () => {
      const query = "defined(5)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 5 }];
        func: GroqFunction;
        name: "global::defined";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("global::defined(5)", () => {
      const query = "global::defined(5)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 5 }];
        func: GroqFunction;
        name: "global::defined";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("length(10)", () => {
      const query = "length(10)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 10 }];
        func: GroqFunction;
        name: "global::length";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("length([null,null,null])", () => {
      const query = "length([null,null,null])";

      expectType<Parse<typeof query>>()
        // FIXME toStrictEqual
        .toBeAssignableTo<{
          args: [
            {
              elements: [
                {
                  isSplat: false;
                  type: "ArrayElement";
                  value: { type: "Value"; value: null };
                },
                {
                  isSplat: false;
                  type: "ArrayElement";
                  value: { type: "Value"; value: null };
                },
                {
                  isSplat: false;
                  type: "ArrayElement";
                  value: { type: "Value"; value: null };
                }
              ];
              type: "Array";
            }
          ];
          func: GroqFunction;
          name: "global::length";
          type: "FuncCall";
        }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<3>();
    });

    it('length("string")', () => {
      const query = 'length("string")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: "string" }];
        func: GroqFunction;
        name: "global::length";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it('global::length("string")', () => {
      const query = 'global::length("string")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: "string" }];
        func: GroqFunction;
        name: "global::length";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("now()", () => {
      const query = "now()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::now";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<string>();
    });

    it("global::now()", () => {
      const query = "global::now()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::now";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<string>();
    });

    it("operation() (without delta)", () => {
      const query = "operation()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::operation";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toBeNever();
    });

    it("operation() (with null delta)", () => {
      const query = "operation()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::operation";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query, { delta: null }>>().toBeNever();
    });

    it("operation() (with create)", () => {
      const query = "operation()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::operation";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { delta: { after: { _type: "foo" }; before: null } }
        >
      >().toStrictEqual<"create">();
    });

    it("operation() (with delete)", () => {
      const query = "operation()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::operation";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { delta: { after: null; before: { _type: "foo" } } }
        >
      >().toStrictEqual<"delete">();
    });

    it("operation() (with update)", () => {
      const query = "operation()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::operation";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { delta: { after: { _type: "foo" }; before: { _type: "foo" } } }
        >
      >().toStrictEqual<"update">();
    });

    it("global::operation()", () => {
      const query = "global::operation()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "global::operation";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { delta: { after: { _type: "foo" }; before: { _type: "foo" } } }
        >
      >().toStrictEqual<"update">();
    });

    it("references([])", () => {
      const query = "references([])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ elements: []; type: "Array" }];
        func: GroqFunction;
        name: "global::references";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it('references("id")', () => {
      const query = 'references("id")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: "id" }];
        func: GroqFunction;
        name: "global::references";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });

    it('references("id",["id2"])', () => {
      const query = 'references("id",["id2"])';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { type: "Value"; value: "id" },
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: "id2" };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "global::references";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });

    it('global::references("id",["id2"])', () => {
      const query = 'global::references("id",["id2"])';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { type: "Value"; value: "id" },
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: "id2" };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "global::references";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });

    it("round(3.14)", () => {
      const query = "round(3.14)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 3.14 }];
        func: GroqFunction;
        name: "global::round";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("round(3.14,1)", () => {
      const query = "round(3.14,1)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 3.14 }, { type: "Value"; value: 1 }];
        func: GroqFunction;
        name: "global::round";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("global::round(3.14,1)", () => {
      const query = "global::round(3.14,1)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 3.14 }, { type: "Value"; value: 1 }];
        func: GroqFunction;
        name: "global::round";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("string(true)", () => {
      const query = "string(true)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: true }];
        func: GroqFunction;
        name: "global::string";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"true">();
    });

    it("string(false)", () => {
      const query = "string(false)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: false }];
        func: GroqFunction;
        name: "global::string";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"false">();
    });

    it('string("a string")', () => {
      const query = 'string("a string")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: "a string" }];
        func: GroqFunction;
        name: "global::string";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"a string">();
    });

    it("string(3.14)", () => {
      const query = "string(3.14)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 3.14 }];
        func: GroqFunction;
        name: "global::string";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"3.14">();
    });

    it("string([])", () => {
      const query = "string([])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ elements: []; type: "Array" }];
        func: GroqFunction;
        name: "global::string";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("global::string(3.14)", () => {
      const query = "global::string(3.14)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: 3.14 }];
        func: GroqFunction;
        name: "global::string";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"3.14">();
    });

    it('lower("String")', () => {
      const query = 'lower("String")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: "String" }];
        func: GroqFunction;
        name: "global::lower";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"string">();
    });

    it('global::lower("String")', () => {
      const query = 'global::lower("String")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: "String" }];
        func: GroqFunction;
        name: "global::lower";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"string">();
    });

    it('upper("String")', () => {
      const query = 'upper("String")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: "String" }];
        func: GroqFunction;
        name: "global::upper";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"STRING">();
    });

    it('global::upper("String")', () => {
      const query = 'global::upper("String")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: "String" }];
        func: GroqFunction;
        name: "global::upper";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"STRING">();
    });
  });

  describe("dateTime", () => {
    it("dateTime::now()", () => {
      const query = "dateTime::now()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "dateTime::now";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        DateTime<string>
      >();
    });
  });

  describe("array", () => {
    it('array::join(false,",")', () => {
      const query = 'array::join(false,",")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: false }, { type: "Value"; value: "," }];
        func: GroqFunction;
        name: "array::join";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("array::join([],false)", () => {
      const query = "array::join([],false)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { elements: []; type: "Array" },
          { type: "Value"; value: false }
        ];
        func: GroqFunction;
        name: "array::join";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('array::join([],",")', () => {
      const query = 'array::join([],",")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ elements: []; type: "Array" }, { type: "Value"; value: "," }];
        func: GroqFunction;
        name: "array::join";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"">();
    });

    it('array::join([5],",")', () => {
      const query = 'array::join([5],",")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 5 };
              }
            ];
            type: "Array";
          },
          { type: "Value"; value: "," }
        ];
        func: GroqFunction;
        name: "array::join";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"5">();
    });

    it('array::join([{}],",")', () => {
      const query = 'array::join([{}],",")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { attributes: []; type: "Object" };
              }
            ];
            type: "Array";
          },
          { type: "Value"; value: "," }
        ];
        func: GroqFunction;
        name: "array::join";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('array::join([5,true,"foo"],",")', () => {
      const query = 'array::join([5,true,"foo"],",")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 5 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: true };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: "foo" };
              }
            ];
            type: "Array";
          },
          { type: "Value"; value: "," }
        ];
        func: GroqFunction;
        name: "array::join";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query>
      >().not.toStrictEqual<// FIXME This SHOULD be what returns, but it hits the maximum call stack
      "5,true,foo">();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<string>();
    });

    it('array::join($param,",")', () => {
      const query = 'array::join($param,",")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { name: "param"; type: "Parameter" },
          { type: "Value"; value: "," }
        ];
        func: GroqFunction;
        name: "array::join";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: (1 | 2)[] } }>
      >().toStrictEqual<string>();
    });

    it('array::join($param,",") (with {})', () => {
      const query = 'array::join($param,",")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { name: "param"; type: "Parameter" },
          { type: "Value"; value: "," }
        ];
        func: GroqFunction;
        name: "array::join";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { parameters: { param: (1 | 2 | { [key: string]: never })[] } }
        >
      >().toStrictEqual<null>();
    });

    it("array::compact(false)", () => {
      const query = "array::compact(false)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: false }];
        func: GroqFunction;
        name: "array::compact";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("array::compact([])", () => {
      const query = "array::compact([])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ elements: []; type: "Array" }];
        func: GroqFunction;
        name: "array::compact";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<[]>();
    });

    it("array::compact([1,null,2])", () => {
      const query = "array::compact([1,null,2])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 2 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "array::compact";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<[1, 2]>();
    });

    it("array::compact($param)", () => {
      const query = "array::compact($param)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ name: "param"; type: "Parameter" }];
        func: GroqFunction;
        name: "array::compact";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: (1 | 2 | null)[] } }>
      >().toStrictEqual<(1 | 2)[]>();
    });

    it("array::compact($param) (only null)", () => {
      const query = "array::compact($param)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ name: "param"; type: "Parameter" }];
        func: GroqFunction;
        name: "array::compact";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: null[] } }>
      >().toStrictEqual<[]>();
    });

    it("array::unique(false)", () => {
      const query = "array::unique(false)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: false }];
        func: GroqFunction;
        name: "array::unique";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("array::unique([])", () => {
      const query = "array::unique([])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ elements: []; type: "Array" }];
        func: GroqFunction;
        name: "array::unique";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<[]>();
    });

    it("array::unique([1,2,1])", () => {
      const query = "array::unique([1,2,1])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 2 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "array::unique";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<[1, 2]>();
    });

    it("array::unique([{},{}])", () => {
      const query = "array::unique([{},{}])";

      expectType<Parse<typeof query>>()
        // FIXME toStrictEqual
        .toBeAssignableTo<{
          args: [
            {
              elements: [
                {
                  isSplat: false;
                  type: "ArrayElement";
                  value: { attributes: []; type: "Object" };
                },
                {
                  isSplat: false;
                  type: "ArrayElement";
                  value: { attributes: []; type: "Object" };
                }
              ];
              type: "Array";
            }
          ];
          func: GroqFunction;
          name: "array::unique";
          type: "FuncCall";
        }>();
      expectType<ExecuteQuery<typeof query>>()
        // FIXME toStrictEqual
        .toBeAssignableTo<[{ [x: string]: never }, { [x: string]: never }]>();
    });

    it("array::unique($param)", () => {
      const query = "array::unique($param)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ name: "param"; type: "Parameter" }];
        func: GroqFunction;
        name: "array::unique";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: (1 | 1 | 2)[] } }>
      >().toStrictEqual<(1 | 2)[]>();
    });
  });

  describe("string", () => {
    it('string::split("this is a string","not in there")', () => {
      const query = 'string::split("this is a string","not in there")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { type: "Value"; value: "this is a string" },
          { type: "Value"; value: "not in there" }
        ];
        func: GroqFunction;
        name: "string::split";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        ["this is a string"]
      >();
    });

    it('string::split("this is a string"," ")', () => {
      const query = 'string::split("this is a string"," ")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { type: "Value"; value: "this is a string" },
          { type: "Value"; value: " " }
        ];
        func: GroqFunction;
        name: "string::split";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        ["this", "is", "a", "string"]
      >();
    });

    it('string::split(" this is a string "," ")', () => {
      const query = 'string::split(" this is a string "," ")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { type: "Value"; value: " this is a string " },
          { type: "Value"; value: " " }
        ];
        func: GroqFunction;
        name: "string::split";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        ["", "this", "is", "a", "string", ""]
      >();
    });

    it('string::split("test","")', () => {
      const query = 'string::split("test","")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Value"; value: "test" }, { type: "Value"; value: "" }];
        func: GroqFunction;
        name: "string::split";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        ["t", "e", "s", "t"]
      >();
    });

    it('string::split($param,"")', () => {
      const query = 'string::split($param,"")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { name: "param"; type: "Parameter" },
          { type: "Value"; value: "" }
        ];
        func: GroqFunction;
        name: "string::split";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: string } }>
      >().toStrictEqual<string[]>();
    });

    it('string::split("this is a string",$param)', () => {
      const query = 'string::split("this is a string",$param)';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { type: "Value"; value: "this is a string" },
          { name: "param"; type: "Parameter" }
        ];
        func: GroqFunction;
        name: "string::split";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: string } }>
      >().toStrictEqual<string[]>();
    });

    it('string::startsWith("A String","A Str")', () => {
      const query = 'string::startsWith("A String","A Str")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { type: "Value"; value: "A String" },
          { type: "Value"; value: "A Str" }
        ];
        func: GroqFunction;
        name: "string::startsWith";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it('string::startsWith("A String","O Str")', () => {
      const query = 'string::startsWith("A String","O Str")';

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          { type: "Value"; value: "A String" },
          { type: "Value"; value: "O Str" }
        ];
        func: GroqFunction;
        name: "string::startsWith";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });
  });

  describe("math", () => {
    it("math::sum([1,2,3])", () => {
      const query = "math::sum([1,2,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 2 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::sum";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::sum([1,null,3])", () => {
      const query = "math::sum([1,null,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::sum";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::sum([1,false,3])", () => {
      const query = "math::sum([1,false,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: false };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::sum";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::sum([null])", () => {
      const query = "math::sum([null])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::sum";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<0>();
    });

    it("math::sum([])", () => {
      const query = "math::sum([])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ elements: []; type: "Array" }];
        func: GroqFunction;
        name: "math::sum";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<0>();
    });

    it("math::avg([1,2,3])", () => {
      const query = "math::avg([1,2,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 2 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::avg";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::avg([1,null,3])", () => {
      const query = "math::avg([1,null,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::avg";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::avg([1,false,3])", () => {
      const query = "math::avg([1,false,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: false };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::avg";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::avg([null])", () => {
      const query = "math::avg([null])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::avg";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::avg([])", () => {
      const query = "math::avg([])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ elements: []; type: "Array" }];
        func: GroqFunction;
        name: "math::avg";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::min([1,2,3])", () => {
      const query = "math::min([1,2,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 2 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::min";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::min([1,null,3])", () => {
      const query = "math::min([1,null,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::min";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::min([1,false,3])", () => {
      const query = "math::min([1,false,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: false };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::min";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::min([null])", () => {
      const query = "math::min([null])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::min";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::min([])", () => {
      const query = "math::min([])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ elements: []; type: "Array" }];
        func: GroqFunction;
        name: "math::min";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::max([1,2,3])", () => {
      const query = "math::max([1,2,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 2 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::max";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::max([1,null,3])", () => {
      const query = "math::max([1,null,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::max";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::max([1,false,3])", () => {
      const query = "math::max([1,false,3])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 1 };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: false };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: 3 };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::max";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::max([null])", () => {
      const query = "math::max([null])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [
          {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              }
            ];
            type: "Array";
          }
        ];
        func: GroqFunction;
        name: "math::max";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::max([])", () => {
      const query = "math::max([])";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ elements: []; type: "Array" }];
        func: GroqFunction;
        name: "math::max";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });
  });

  describe("extensions", () => {
    describe("portable text extension", () => {
      it("pt(false)", () => {
        const query = "pt(false)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ type: "Value"; value: false }];
          func: GroqFunction;
          name: "global::pt";
          type: "FuncCall";
        }>();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("pt($param) (with PortableTextBlock)", () => {
        const query = "pt($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::pt";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            { parameters: { param: PortableTextBlock } }
          >
        >().toStrictEqual<PortableTextBlock>();
      });

      it("pt($param) (with PortableTextBlock[])", () => {
        const query = "pt($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::pt";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            { parameters: { param: PortableTextBlock[] } }
          >
        >().toStrictEqual<PortableTextBlock[]>();
      });

      it("global::pt($param) (with PortableTextBlock[])", () => {
        const query = "global::pt($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::pt";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            { parameters: { param: PortableTextBlock[] } }
          >
        >().toStrictEqual<PortableTextBlock[]>();
      });

      it("pt::text(false)", () => {
        const query = "pt::text(false)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ type: "Value"; value: false }];
          func: GroqFunction;
          name: "pt::text";
          type: "FuncCall";
        }>();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("pt::text($param) (with PortableTextBlock)", () => {
        const query = "pt::text($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "pt::text";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            { parameters: { param: PortableTextBlock } }
          >
        >().toStrictEqual<string>();
      });

      it("pt::text($param) (with PortableTextBlock[])", () => {
        const query = "pt::text($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "pt::text";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            { parameters: { param: PortableTextBlock[] } }
          >
        >().toStrictEqual<string>();
      });
    });

    describe("geojson", () => {
      it("geo(false)", () => {
        const query = "geo(false)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ type: "Value"; value: false }];
          func: GroqFunction;
          name: "global::geo";
          type: "FuncCall";
        }>();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("geo($param) (with Position)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<typeof query, { parameters: { param: Position } }>
        >().toStrictEqual<Position>();
      });

      it("geo($param) (with Point)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<typeof query, { parameters: { param: Point } }>
        >().toStrictEqual<Point>();
      });

      it("geo($param) (with MultiPoint)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<typeof query, { parameters: { param: MultiPoint } }>
        >().toStrictEqual<MultiPoint>();
      });

      it("geo($param) (with LineString)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<typeof query, { parameters: { param: LineString } }>
        >().toStrictEqual<LineString>();
      });

      it("geo($param) (with MultiLineString)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<typeof query, { parameters: { param: MultiLineString } }>
        >().toStrictEqual<MultiLineString>();
      });

      it("geo($param) (with Polygon)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<typeof query, { parameters: { param: Polygon } }>
        >().toStrictEqual<Polygon>();
      });

      it("geo($param) (with MultiPolygon)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<typeof query, { parameters: { param: MultiPolygon } }>
        >().toStrictEqual<MultiPolygon>();
      });

      it("geo($param) (with GeometryCollection)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            { parameters: { param: GeometryCollection } }
          >
        >().toStrictEqual<GeometryCollection>();
      });

      it("global::geo($param) (with GeometryCollection)", () => {
        const query = "global::geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "global::geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            { parameters: { param: GeometryCollection } }
          >
        >().toStrictEqual<GeometryCollection>();
      });

      it("geo::contains($param1,$param2)", () => {
        const query = "geo::contains($param1,$param2)";

        expectType<Parse<typeof query>>().toBeAssignableTo<{
          args: [
            { name: "param1"; type: "Parameter" },
            { name: "param2"; type: "Parameter" }
          ];
          func: GroqFunction;
          name: "geo::contains";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            { parameters: { param1: Geo; param2: Geo } }
          >
        >().toStrictEqual<boolean>();
      });

      it("geo::intersects($param1,$param2)", () => {
        const query = "geo::intersects($param1,$param2)";

        expectType<Parse<typeof query>>().toBeAssignableTo<{
          args: [
            { name: "param1"; type: "Parameter" },
            { name: "param2"; type: "Parameter" }
          ];
          func: GroqFunction;
          name: "geo::intersects";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            { parameters: { param1: Geo; param2: Geo } }
          >
        >().toStrictEqual<boolean>();
      });

      it("geo::distance($param1,$param2)", () => {
        const query = "geo::distance($param1,$param2)";

        expectType<Parse<typeof query>>().toBeAssignableTo<{
          args: [
            { name: "param1"; type: "Parameter" },
            { name: "param2"; type: "Parameter" }
          ];
          func: GroqFunction;
          name: "geo::distance";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            { parameters: { param1: Point; param2: Point } }
          >
        >().toStrictEqual<number>();
      });
    });
  });

  describe("sanity", () => {
    it("sanity::projectId()", () => {
      const query = "sanity::projectId()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "sanity::projectId";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { client: { projectId: "projectId" } }>
      >().toStrictEqual<"projectId">();
    });

    it("sanity::dataset()", () => {
      const query = "sanity::dataset()";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [];
        func: GroqFunction;
        name: "sanity::dataset";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, { client: { dataset: "dataset" } }>
      >().toStrictEqual<"dataset">();
    });
  });
});
