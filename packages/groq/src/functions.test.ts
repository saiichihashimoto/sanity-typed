import { describe, expect, it } from "@jest/globals";
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
import { evaluate, parse } from "groq-js";
import type { DateTime, GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type {
  ExecuteQuery,
  Geo,
  Parse,
  _ScopeFromPartialContext,
  _ScopeFromPartialScope,
} from ".";

describe("functions", () => {
  describe("global", () => {
    it.failing("after() (without delta)", async () => {
      const query = "after()";
      const tree = parse(query, { mode: "delta" });
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "after",
        type: "FuncCall",
      } as const;

      // TODO before() and after() create ContextNode
      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("after() (with null after)", async () => {
      const query = "after()";
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, { after: null, before: { _type: "foo" } })
      ).get();

      expect(result).toBeNull();
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: { after: null; before: { _type: "foo" } };
          }>
        >
      >().toStrictEqual<null>();
    });

    it("after()", async () => {
      const query = "after()";
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, { after: { _type: "foo" }, before: null })
      ).get();

      expect(result).toStrictEqual({ _type: "foo" });
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: { after: { _type: "foo" }; before: null };
          }>
        >
      >().toStrictEqual<{ _type: "foo" }>();
    });

    it("global::after()", async () => {
      const query = "global::after()";
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, { after: { _type: "foo" }, before: null })
      ).get();

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "after",
        type: "FuncCall",
      } as const;

      // expect(tree).toStrictEqual({
      //   ...desiredTree,
      //   func: expect.any(Function),
      // });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual({ _type: "foo" });
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: { after: { _type: "foo" }; before: null };
          }>
        >
      >().toStrictEqual<{ _type: "foo" }>();
    });

    it("before() (without delta)", async () => {
      const query = "before()";
      const tree = parse(query, { mode: "delta" });
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "before",
        type: "FuncCall",
      } as const;

      // expect(tree).toStrictEqual({
      //   ...desiredTree,
      //   func: expect.any(Function),
      // });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("before() (with null before)", async () => {
      const query = "before()";
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, { after: { _type: "foo" }, before: null })
      ).get();

      expect(result).toBeNull();
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: { after: { _type: "foo" }; before: null };
          }>
        >
      >().toStrictEqual<null>();
    });

    it("before()", async () => {
      const query = "before()";
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, { after: null, before: { _type: "foo" } })
      ).get();

      expect(result).toStrictEqual({ _type: "foo" });
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: { after: null; before: { _type: "foo" } };
          }>
        >
      >().toStrictEqual<{ _type: "foo" }>();
    });

    it("global::before()", async () => {
      const query = "global::before()";
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, { after: null, before: { _type: "foo" } })
      ).get();

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "before",
        type: "FuncCall",
      } as const;

      // expect(tree).toStrictEqual({
      //   ...desiredTree,
      //   func: expect.any(Function),
      // });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual({ _type: "foo" });
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: { after: null; before: { _type: "foo" } };
          }>
        >
      >().toStrictEqual<{ _type: "foo" }>();
    });

    it("coalesce()", async () => {
      const query = "coalesce()";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("coalesce(1)", async () => {
      const query = "coalesce(1)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: 1 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<1>();
    });

    it("coalesce(null)", async () => {
      const query = "coalesce(null)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: null }],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("coalesce(1,null)", async () => {
      const query = "coalesce(1,null)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: 1 },
          { type: "Value", value: null },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<1>();
    });

    it("coalesce(null,1)", async () => {
      const query = "coalesce(null,1)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: null },
          { type: "Value", value: 1 },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<1>();
    });

    it("coalesce(key,2)", async () => {
      const query = "coalesce(key,2)";
      const tree = parse(query);
      const result = await (await evaluate(tree, { root: { key: 1 } })).get();

      const desiredTree = {
        args: [
          { name: "key", type: "AccessAttribute" },
          { type: "Value", value: 2 },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(1);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialScope<{ this: { key: 1 | null } }>
        >
      >().toStrictEqual<1 | 2>();
    });

    it("global::coalesce(key,2)", async () => {
      const query = "global::coalesce(key,2)";
      const tree = parse(query);
      const result = await (await evaluate(tree, { root: { key: 1 } })).get();

      const desiredTree = {
        args: [
          { name: "key", type: "AccessAttribute" },
          { type: "Value", value: 2 },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(1);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialScope<{ this: { key: 1 | null } }>
        >
      >().toStrictEqual<1 | 2>();
    });

    it("count(5)", async () => {
      const query = "count(5)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: 5 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "count",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("count([1,2,3,4])", async () => {
      const query = "count([1,2,3,4])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 2 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 4 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "count",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(4);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<4>();
    });

    it("global::count([1,2,3,4])", async () => {
      const query = "global::count([1,2,3,4])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 2 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 4 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "count",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(4);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<4>();
    });

    it("dateTime(false)", async () => {
      const query = "dateTime(false)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: false }],
        func: (() => {}) as unknown as GroqFunction,
        name: "dateTime",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('dateTime("2023-08-29T03:16:25.883Z")', async () => {
      const query = 'dateTime("2023-08-29T03:16:25.883Z")';
      const tree = parse(query);
      // TODO https://github.com/sanity-io/groq-js/issues/144

      const desiredTree = {
        args: [{ type: "Value", value: "2023-08-29T03:16:25.883Z" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "dateTime",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expectType<ExecuteQuery<typeof query>>().toStrictEqual<DateTime>();
    });

    it("dateTime($param) (with DateTime)", async () => {
      const query = "dateTime($param)";
      const tree = parse(query);
      // TODO https://github.com/sanity-io/groq-js/issues/144

      const desiredTree = {
        args: [{ name: "param", type: "Parameter" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "dateTime",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: DateTime } }>
        >
      >().toStrictEqual<DateTime>();
    });

    it("global::dateTime($param) (with DateTime)", async () => {
      const query = "global::dateTime($param)";
      const tree = parse(query);
      // TODO https://github.com/sanity-io/groq-js/issues/144

      const desiredTree = {
        args: [{ name: "param", type: "Parameter" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "dateTime",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: DateTime } }>
        >
      >().toStrictEqual<DateTime>();
    });

    it("defined(null)", async () => {
      const query = "defined(null)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: null }],
        func: (() => {}) as unknown as GroqFunction,
        name: "defined",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("defined(5)", async () => {
      const query = "defined(5)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: 5 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "defined",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("global::defined(5)", async () => {
      const query = "global::defined(5)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: 5 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "defined",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("length(10)", async () => {
      const query = "length(10)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: 10 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "length",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("length([null,null,null])", async () => {
      const query = "length([null,null,null])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "length",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>()
        // TODO toStrictEqual
        .toBeAssignableTo<WritableDeep<typeof desiredTree>>();

      expect(result).toBe(3);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<3>();
    });

    it('length("string")', async () => {
      const query = 'length("string")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: "string" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "length",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(6);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it('global::length("string")', async () => {
      const query = 'global::length("string")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: "string" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "length",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(6);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("now()", async () => {
      const query = "now()";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, {
          timestamp: new Date("2023-08-29T03:25:14.355Z"),
        })
      ).get();

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "now",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("2023-08-29T03:25:14.355Z");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<string>();
    });

    it("global::now()", async () => {
      const query = "global::now()";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, {
          timestamp: new Date("2023-08-29T03:25:14.355Z"),
        })
      ).get();

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "now",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("2023-08-29T03:25:14.355Z");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<string>();
    });

    it.failing("operation() (without delta)", async () => {
      const query = "operation()";
      // TODO https://github.com/sanity-io/groq-js/issues/140
      const tree = parse(query, { mode: "delta" });
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "operation",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toBeNever();
    });

    it.failing("operation() (with create)", async () => {
      const query = "operation()";
      // TODO https://github.com/sanity-io/groq-js/issues/140
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, { after: { _type: "foo" }, before: null })
      ).get();

      expect(result).toBe("create");
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: { after: { _type: "foo" }; before: null };
          }>
        >
      >().toStrictEqual<"create">();
    });

    it.failing("operation() (with delete)", async () => {
      const query = "operation()";
      // TODO https://github.com/sanity-io/groq-js/issues/140
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, { after: null, before: { _type: "foo" } })
      ).get();

      expect(result).toBe("delete");
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: { after: null; before: { _type: "foo" } };
          }>
        >
      >().toStrictEqual<"delete">();
    });

    it.failing("operation() (with update)", async () => {
      const query = "operation()";
      // TODO https://github.com/sanity-io/groq-js/issues/140
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, {
          after: { _type: "foo" },
          before: { _type: "foo" },
        })
      ).get();

      expect(result).toBe("update");
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: { after: { _type: "foo" }; before: { _type: "foo" } };
          }>
        >
      >().toStrictEqual<"update">();
    });

    it.failing("global::operation()", async () => {
      const query = "global::operation()";
      // TODO https://github.com/sanity-io/groq-js/issues/140
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, {
          after: { _type: "foo" },
          before: { _type: "foo" },
        })
      ).get();

      expect(result).toBe("update");
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: { after: { _type: "foo" }; before: { _type: "foo" } };
          }>
        >
      >().toStrictEqual<"update">();
    });

    it("references([])", async () => {
      const query = "references([])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ elements: [], type: "Array" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "references",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it('references("id")', async () => {
      const query = 'references("id")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: "id" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "references",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });

    it('references("id",["id2"])', async () => {
      const query = 'references("id",["id2"])';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: "id" },
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: "id2" },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "references",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });

    it('global::references("id",["id2"])', async () => {
      const query = 'global::references("id",["id2"])';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: "id" },
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: "id2" },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "references",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });

    it("round(3.14)", async () => {
      const query = "round(3.14)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: 3.14 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "round",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(3);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("round(3.14,1)", async () => {
      const query = "round(3.14,1)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: 3.14 },
          { type: "Value", value: 1 },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "round",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(3.1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("global::round(3.14,1)", async () => {
      const query = "global::round(3.14,1)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: 3.14 },
          { type: "Value", value: 1 },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "round",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(3.1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("string(true)", async () => {
      const query = "string(true)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: true }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("true");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"true">();
    });

    it("string(false)", async () => {
      const query = "string(false)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: false }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("false");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"false">();
    });

    it('string("a string")', async () => {
      const query = 'string("a string")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: "a string" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("a string");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"a string">();
    });

    it("string(3.14)", async () => {
      const query = "string(3.14)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: 3.14 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("3.14");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"3.14">();
    });

    it("string([])", async () => {
      const query = "string([])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ elements: [], type: "Array" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("global::string(3.14)", async () => {
      const query = "global::string(3.14)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: 3.14 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("3.14");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"3.14">();
    });

    it('lower("String")', async () => {
      const query = 'lower("String")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: "String" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "lower",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("string");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"string">();
    });

    it('global::lower("String")', async () => {
      const query = 'global::lower("String")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: "String" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "lower",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("string");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"string">();
    });

    it('upper("String")', async () => {
      const query = 'upper("String")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: "String" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "upper",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("STRING");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"STRING">();
    });

    it('global::upper("String")', async () => {
      const query = 'global::upper("String")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: "String" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "upper",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("STRING");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"STRING">();
    });
  });

  // TODO https://github.com/sanity-io/groq-js/issues/145

  describe("dateTime", () => {
    it.failing("dateTime::now()", async () => {
      const query = "dateTime::now()";
      const tree = parse(query);
      // TODO https://github.com/sanity-io/groq-js/issues/144
      // TODO https://github.com/sanity-io/groq-js/issues/143

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "dateTime::now",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expectType<ExecuteQuery<typeof query>>().toStrictEqual<DateTime>();
    });
  });

  describe("array", () => {
    it('array::join(false,",")', async () => {
      const query = 'array::join(false,",")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: false },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::join",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "join",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("array::join([],false)", async () => {
      const query = "array::join([],false)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { elements: [], type: "Array" },
          { type: "Value", value: false },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::join",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "join",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('array::join([],",")', async () => {
      const query = 'array::join([],",")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { elements: [], type: "Array" },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::join",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "join",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"">();
    });

    it('array::join([5],",")', async () => {
      const query = 'array::join([5],",")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 5 },
              },
            ],
            type: "Array",
          },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::join",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "join",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("5");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"5">();
    });

    it('array::join([{}],",")', async () => {
      const query = 'array::join([{}],",")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { attributes: [], type: "Object" },
              },
            ],
            type: "Array",
          },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::join",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "join",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('array::join([5,true,"foo"],",")', async () => {
      const query = 'array::join([5,true,"foo"],",")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 5 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: true },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: "foo" },
              },
            ],
            type: "Array",
          },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::join",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "join",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("5,true,foo");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<string>();
    });

    it('array::join($param,",")', async () => {
      const query = 'array::join($param,",")';
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: [1, 2] } })
      ).get();

      const desiredTree = {
        args: [
          { name: "param", type: "Parameter" },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::join",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "join",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("1,2");
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: (1 | 2)[] } }>
        >
      >().toStrictEqual<string>();
    });

    it('array::join($param,",") (with {})', async () => {
      const query = 'array::join($param,",")';
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: [1, 2, {}] } })
      ).get();

      const desiredTree = {
        args: [
          { name: "param", type: "Parameter" },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::join",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "join",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: { param: (1 | 2 | { [key: string]: never })[] };
          }>
        >
      >().toStrictEqual<null>();
    });

    it("array::compact(false)", async () => {
      const query = "array::compact(false)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: false }],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::compact",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "compact",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("array::compact([])", async () => {
      const query = "array::compact([])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ elements: [], type: "Array" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::compact",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "compact",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual([]);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<[]>();
    });

    it("array::compact([1,null,2])", async () => {
      const query = "array::compact([1,null,2])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 2 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::compact",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "compact",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual([1, 2]);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<[1, 2]>();
    });

    it("array::compact($param)", async () => {
      const query = "array::compact($param)";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: [1, 2, null] } })
      ).get();

      const desiredTree = {
        args: [{ name: "param", type: "Parameter" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::compact",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "compact",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual([1, 2]);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: (1 | 2 | null)[] } }>
        >
      >().toStrictEqual<(1 | 2)[]>();
    });

    it("array::compact($param) (only null)", async () => {
      const query = "array::compact($param)";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: [null] } })
      ).get();

      expectType<Parse<typeof query>>().toStrictEqual<{
        args: [{ name: "param"; type: "Parameter" }];
        func: GroqFunction;
        name: "array::compact";
        type: "FuncCall";
      }>();

      const desiredTree = {
        args: [{ name: "param", type: "Parameter" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::compact",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "compact",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual([]);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: null[] } }>
        >
      >().toStrictEqual<[]>();
    });

    it("array::unique(false)", async () => {
      const query = "array::unique(false)";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ type: "Value", value: false }],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::unique",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "unique",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("array::unique([])", async () => {
      const query = "array::unique([])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [{ elements: [], type: "Array" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::unique",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "unique",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual([]);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<[]>();
    });

    it("array::unique([1,2,1])", async () => {
      const query = "array::unique([1,2,1])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 2 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::unique",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "unique",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual([1, 2]);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<[1, 2]>();
    });

    it("array::unique([{},{}])", async () => {
      const query = "array::unique([{},{}])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { attributes: [], type: "Object" },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { attributes: [], type: "Object" },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::unique",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "unique",
      });
      expectType<Parse<typeof query>>()
        // TODO toStrictEqual
        .toBeAssignableTo<WritableDeep<typeof desiredTree>>();

      expect(result).toStrictEqual([{}, {}]);
      expectType<ExecuteQuery<typeof query>>()
        // TODO toStrictEqual
        .toBeAssignableTo<[{ [x: string]: never }, { [x: string]: never }]>();
    });

    it("array::unique($param)", async () => {
      const query = "array::unique($param)";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: [1, 2, 1, 2] } })
      ).get();

      const desiredTree = {
        args: [{ name: "param", type: "Parameter" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "array::unique",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "unique",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual([1, 2]);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: [1, 2, 1, 2] } }>
        >
      >().toStrictEqual<[1, 2]>();
    });
  });

  describe("string", () => {
    it('string::split("this is a string","not in there")', async () => {
      const query = 'string::split("this is a string","not in there")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: "this is a string" },
          { type: "Value", value: "not in there" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "string::split",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "split",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual(["this is a string"]);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        ["this is a string"]
      >();
    });

    it('string::split("this is a string"," ")', async () => {
      const query = 'string::split("this is a string"," ")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: "this is a string" },
          { type: "Value", value: " " },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "string::split",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "split",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual(["this", "is", "a", "string"]);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        ["this", "is", "a", "string"]
      >();
    });

    it('string::split(" this is a string "," ")', async () => {
      const query = 'string::split(" this is a string "," ")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: " this is a string " },
          { type: "Value", value: " " },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "string::split",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "split",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual(["", "this", "is", "a", "string", ""]);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        ["", "this", "is", "a", "string", ""]
      >();
    });

    it('string::split("test","")', async () => {
      const query = 'string::split("test","")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: "test" },
          { type: "Value", value: "" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "string::split",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "split",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual(["t", "e", "s", "t"]);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        ["t", "e", "s", "t"]
      >();
    });

    it('string::split($param,"")', async () => {
      const query = 'string::split($param,"")';
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: "test" } })
      ).get();

      const desiredTree = {
        args: [
          { name: "param", type: "Parameter" },
          { type: "Value", value: "" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "string::split",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "split",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual(["t", "e", "s", "t"]);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: string } }>
        >
      >().toStrictEqual<string[]>();
    });

    it('string::split("this is a string",$param)', async () => {
      const query = 'string::split("this is a string",$param)';
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: " " } })
      ).get();

      const desiredTree = {
        args: [
          { type: "Value", value: "this is a string" },
          { name: "param", type: "Parameter" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "string::split",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "split",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual(["this", "is", "a", "string"]);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: string } }>
        >
      >().toStrictEqual<string[]>();
    });

    it('string::startsWith("A String","A Str")', async () => {
      const query = 'string::startsWith("A String","A Str")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: "A String" },
          { type: "Value", value: "A Str" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "string::startsWith",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "startsWith",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it('string::startsWith("A String","O Str")', async () => {
      const query = 'string::startsWith("A String","O Str")';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          { type: "Value", value: "A String" },
          { type: "Value", value: "O Str" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "string::startsWith",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "startsWith",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });
  });

  describe("math", () => {
    it("math::sum([1,2,3])", async () => {
      const query = "math::sum([1,2,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 2 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::sum",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "sum",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(6);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::sum([1,null,3])", async () => {
      const query = "math::sum([1,null,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::sum",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "sum",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(4);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::sum([1,false,3])", async () => {
      const query = "math::sum([1,false,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: false },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::sum",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "sum",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::sum([null])", async () => {
      const query = "math::sum([null])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::sum",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "sum",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(0);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<0>();
    });

    it("math::sum([])", async () => {
      const query = "math::sum([])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::sum",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "sum",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(0);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<0>();
    });

    it("math::avg([1,2,3])", async () => {
      const query = "math::avg([1,2,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 2 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::avg",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "avg",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(2);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::avg([1,null,3])", async () => {
      const query = "math::avg([1,null,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::avg",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "avg",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(2);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::avg([1,false,3])", async () => {
      const query = "math::avg([1,false,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: false },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::avg",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "avg",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::avg([null])", async () => {
      const query = "math::avg([null])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::avg",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "avg",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::avg([])", async () => {
      const query = "math::avg([])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::avg",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "avg",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::min([1,2,3])", async () => {
      const query = "math::min([1,2,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 2 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::min",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "min",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::min([1,null,3])", async () => {
      const query = "math::min([1,null,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::min",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "min",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::min([1,false,3])", async () => {
      const query = "math::min([1,false,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: false },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::min",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "min",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::min([null])", async () => {
      const query = "math::min([null])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::min",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "min",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::min([])", async () => {
      const query = "math::min([])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::min",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "min",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::max([1,2,3])", async () => {
      const query = "math::max([1,2,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 2 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::max",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "max",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(3);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::max([1,null,3])", async () => {
      const query = "math::max([1,null,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::max",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "max",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(3);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("math::max([1,false,3])", async () => {
      const query = "math::max([1,false,3])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 1 },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: false },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: 3 },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::max",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "max",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::max([null])", async () => {
      const query = "math::max([null])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
            ],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::max",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "max",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it("math::max([])", async () => {
      const query = "math::max([])";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        args: [
          {
            elements: [],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "math::max",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "max",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });
  });

  describe("extensions", () => {
    describe("portable text extension", () => {
      // TODO https://github.com/sanity-io/groq-js/issues/142
      it("pt(false)", async () => {
        const query = "pt(false)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ type: "Value"; value: false }];
          func: GroqFunction;
          name: "pt";
          type: "FuncCall";
        }>();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("pt($param) (with PortableTextBlock)", async () => {
        const query = "pt($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "pt";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: { param: PortableTextBlock };
            }>
          >
        >().toStrictEqual<PortableTextBlock>();
      });

      it("pt($param) (with PortableTextBlock[])", async () => {
        const query = "pt($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "pt";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: { param: PortableTextBlock[] };
            }>
          >
        >().toStrictEqual<PortableTextBlock[]>();
      });

      it("global::pt($param) (with PortableTextBlock[])", async () => {
        const query = "global::pt($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "pt";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: { param: PortableTextBlock[] };
            }>
          >
        >().toStrictEqual<PortableTextBlock[]>();
      });

      it("pt::text(false)", async () => {
        const query = "pt::text(false)";
        const tree = parse(query);
        const result = await (await evaluate(tree)).get();

        const desiredTree = {
          args: [{ type: "Value", value: false }],
          func: (() => {}) as unknown as GroqFunction,
          name: "pt::text",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...desiredTree,
          func: expect.any(Function),
          name: "text",
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof desiredTree>
        >();

        expect(result).toBeNull();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("pt::text($param) (with PortableTextBlock)", async () => {
        const query = "pt::text($param)";
        const tree = parse(query);
        const result = await (
          await evaluate(tree, {
            params: {
              param: {
                _type: "block",
                children: [{ _type: "span", text: "foo" }],
              },
            },
          })
        ).get();

        const desiredTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "pt::text",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...desiredTree,
          func: expect.any(Function),
          name: "text",
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof desiredTree>
        >();

        expect(result).toBe("foo");
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: { param: PortableTextBlock };
            }>
          >
        >().toStrictEqual<string>();
      });

      it("pt::text($param) (with PortableTextBlock[])", async () => {
        const query = "pt::text($param)";
        const tree = parse(query);
        const result = await (
          await evaluate(tree, {
            params: {
              param: [
                {
                  _type: "block",
                  children: [{ _type: "span", text: "foo" }],
                },
                {
                  _type: "block",
                  children: [{ _type: "span", text: "bar" }],
                },
              ],
            },
          })
        ).get();

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "pt::text";
          type: "FuncCall";
        }>();

        const desiredTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "pt::text",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...desiredTree,
          func: expect.any(Function),
          name: "text",
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof desiredTree>
        >();

        expect(result).toBe("foo\n\nbar");
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: { param: PortableTextBlock[] };
            }>
          >
        >().toStrictEqual<string>();
      });
    });

    describe("geojson", () => {
      // TODO https://github.com/sanity-io/groq-js/issues/141
      it("geo(false)", async () => {
        const query = "geo(false)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ type: "Value"; value: false }];
          func: GroqFunction;
          name: "geo";
          type: "FuncCall";
        }>();
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
      });

      it("geo($param) (with Position)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{ parameters: { param: Position } }>
          >
        >().toStrictEqual<Position>();
      });

      it("geo($param) (with Point)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{ parameters: { param: Point } }>
          >
        >().toStrictEqual<Point>();
      });

      it("geo($param) (with MultiPoint)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{ parameters: { param: MultiPoint } }>
          >
        >().toStrictEqual<MultiPoint>();
      });

      it("geo($param) (with LineString)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{ parameters: { param: LineString } }>
          >
        >().toStrictEqual<LineString>();
      });

      it("geo($param) (with MultiLineString)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{ parameters: { param: MultiLineString } }>
          >
        >().toStrictEqual<MultiLineString>();
      });

      it("geo($param) (with Polygon)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{ parameters: { param: Polygon } }>
          >
        >().toStrictEqual<Polygon>();
      });

      it("geo($param) (with MultiPolygon)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{ parameters: { param: MultiPolygon } }>
          >
        >().toStrictEqual<MultiPolygon>();
      });

      it("geo($param) (with GeometryCollection)", () => {
        const query = "geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: { param: GeometryCollection };
            }>
          >
        >().toStrictEqual<GeometryCollection>();
      });

      it("global::geo($param) (with GeometryCollection)", () => {
        const query = "global::geo($param)";

        expectType<Parse<typeof query>>().toStrictEqual<{
          args: [{ name: "param"; type: "Parameter" }];
          func: GroqFunction;
          name: "geo";
          type: "FuncCall";
        }>();
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: { param: GeometryCollection };
            }>
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
            _ScopeFromPartialContext<{
              parameters: { param1: Geo; param2: Geo };
            }>
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
            _ScopeFromPartialContext<{
              parameters: { param1: Geo; param2: Geo };
            }>
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
            _ScopeFromPartialContext<{
              parameters: { param1: Point; param2: Point };
            }>
          >
        >().toStrictEqual<number>();
      });
    });
  });

  describe("sanity", () => {
    it("sanity::projectId()", async () => {
      const query = "sanity::projectId()";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, {
          sanity: { dataset: "dataset", projectId: "projectId" },
        })
      ).get();

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "sanity::projectId",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "projectId",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("projectId");
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            client: { dataset: "dataset"; projectId: "projectId" };
          }>
        >
      >().toStrictEqual<"projectId">();
    });

    it("sanity::dataset()", async () => {
      const query = "sanity::dataset()";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, {
          sanity: { dataset: "dataset", projectId: "projectId" },
        })
      ).get();

      const desiredTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "sanity::dataset",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...desiredTree,
        func: expect.any(Function),
        name: "dataset",
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("dataset");
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            client: { dataset: "dataset"; projectId: "projectId" };
          }>
        >
      >().toStrictEqual<"dataset">();
    });
  });
});
