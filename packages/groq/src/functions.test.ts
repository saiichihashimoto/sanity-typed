import { describe, it } from "@jest/globals";
import type { GroqFunction } from "groq-js";

import { expectType } from "@sanity-typed/test-utils";

import type { Context, ExecuteQuery, Parse, Scope } from ".";

describe("functions", () => {
  describe("array", () => {
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

    it("array::compact(*)", () => {
      const query = "array::compact(*)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Everything" }];
        func: GroqFunction;
        name: "array::compact";
        type: "FuncCall";
      }>();
      expectType<
        ExecuteQuery<typeof query, Context<(1 | 2 | null)[]>>
      >().toStrictEqual<(1 | 2)[]>();
    });

    it("array::compact(*) (only null)", () => {
      const query = "array::compact(*)";

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ type: "Everything" }];
        func: GroqFunction;
        name: "array::compact";
        type: "FuncCall";
      }>();
      expectType<ExecuteQuery<typeof query, Context<null[]>>>().toStrictEqual<
        []
      >();
    });
  });

  describe("global", () => {
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
        ExecuteQuery<typeof query, Scope<never, { key: 1 | null }, never>>
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
        ExecuteQuery<typeof query, Scope<never, { key: 1 | null }, never>>
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

      expectType<
        Parse<typeof query>
      >().toStrictEqual<// @ts-expect-error -- FIXME
      {
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

  describe("string", () => {
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
        ExecuteQuery<
          typeof query,
          Context<never, { dataset: "dataset"; projectId: "projectId" }>
        >
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
        ExecuteQuery<
          typeof query,
          Context<never, { dataset: "dataset"; projectId: "projectId" }>
        >
      >().toStrictEqual<"dataset">();
    });
  });
});
