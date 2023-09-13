import { describe, expect, it } from "@jest/globals";
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
import { DateTime, evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
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
    it("after() (without delta)", async () => {
      const query = "after()";

      const tree = parse(query, { mode: "delta" });

      const expectedTree = {
        key: "after",
        type: "Context",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("after() (with null after)", async () => {
      const query = "after()";

      const tree = parse(query, { mode: "delta" });

      const delta = {
        after: null,
        before: { _type: "foo" },
      } as const;

      const result = await (await evaluate(tree, delta)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: WritableDeep<typeof delta>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("after()", async () => {
      const query = "after()";

      const tree = parse(query, { mode: "delta" });

      const delta = {
        after: { _type: "foo" },
        before: null,
      } as const;

      const result = await (await evaluate(tree, delta)).get();

      const expectedResult = { _type: "foo" } as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: WritableDeep<typeof delta>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("global::after()", async () => {
      const query = "global::after()";

      const tree = parse(query, { mode: "delta" });

      const expectedTree = {
        key: "after",
        type: "Context",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const delta = {
        after: { _type: "foo" },
        before: null,
      } as const;

      const result = await (await evaluate(tree, delta)).get();

      const expectedResult = { _type: "foo" } as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: WritableDeep<typeof delta>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("before() (without delta)", async () => {
      const query = "before()";

      const tree = parse(query, { mode: "delta" });

      const expectedTree = {
        key: "before",
        type: "Context",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("before() (with null before)", async () => {
      const query = "before()";

      const tree = parse(query, { mode: "delta" });

      const expectedTree = {
        key: "before",
        type: "Context",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const delta = {
        after: { _type: "foo" },
        before: null,
      } as const;

      const result = await (await evaluate(tree, delta)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: WritableDeep<typeof delta>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("before()", async () => {
      const query = "before()";

      const tree = parse(query, { mode: "delta" });

      const expectedTree = {
        key: "before",
        type: "Context",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const delta = {
        after: null,
        before: { _type: "foo" },
      } as const;

      const result = await (await evaluate(tree, delta)).get();

      const expectedResult = { _type: "foo" } as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: WritableDeep<typeof delta>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("global::before()", async () => {
      const query = "global::before()";

      const tree = parse(query, { mode: "delta" });

      const expectedTree = {
        key: "before",
        type: "Context",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const delta = {
        after: null,
        before: { _type: "foo" },
      } as const;

      const result = await (await evaluate(tree, delta)).get();

      const expectedResult = { _type: "foo" } as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: WritableDeep<typeof delta>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("coalesce()", async () => {
      const query = "coalesce()";

      const tree = parse(query);

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("coalesce(1)", async () => {
      const query = "coalesce(1)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: 1 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 1;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("coalesce(null)", async () => {
      const query = "coalesce(null)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: null }],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("coalesce(1,null)", async () => {
      const query = "coalesce(1,null)";

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: 1 },
          { type: "Value", value: null },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 1;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("coalesce(null,1)", async () => {
      const query = "coalesce(null,1)";

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: null },
          { type: "Value", value: 1 },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 1;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("coalesce(key,2)", async () => {
      const query = "coalesce(key,2)";

      const tree = parse(query);

      const expectedTree = {
        args: [
          { name: "key", type: "AccessAttribute" },
          { type: "Value", value: 2 },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const root = { key: 1 as 1 | null } as const;

      const result = await (await evaluate(tree, { root })).get();

      const expectedResult = 1 as 1 | 2;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialScope<{
            this: typeof root;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("global::coalesce(key,2)", async () => {
      const query = "global::coalesce(key,2)";

      const tree = parse(query);

      const expectedTree = {
        args: [
          { name: "key", type: "AccessAttribute" },
          { type: "Value", value: 2 },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "coalesce",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const root = { key: 1 as 1 | null } as const;

      const result = await (await evaluate(tree, { root })).get();

      const expectedResult = 1 as 1 | 2;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialScope<{
            this: typeof root;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("count(5)", async () => {
      const query = "count(5)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: 5 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "count",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("count([1,2,3,4])", async () => {
      const query = "count([1,2,3,4])";

      const tree = parse(query);

      const expectedTree = {
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
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 4;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("global::count([1,2,3,4])", async () => {
      const query = "global::count([1,2,3,4])";

      const tree = parse(query);

      const expectedTree = {
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
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 4;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("dateTime(false)", async () => {
      const query = "dateTime(false)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: false }],
        func: (() => {}) as unknown as GroqFunction,
        name: "dateTime",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('dateTime("2023-08-29T03:16:25.883Z")', async () => {
      const query = 'dateTime("2023-08-29T03:16:25.883Z")';

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: "2023-08-29T03:16:25.883Z" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "dateTime",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = new DateTime(new Date("2023-08-29T03:16:25.883Z"));

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("dateTime($param) (with DateTime)", async () => {
      const query = "dateTime($param)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ name: "param", type: "Parameter" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "dateTime",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: "2023-08-29T03:25:14.355Z" } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = new DateTime(new Date("2023-08-29T03:25:14.355Z"));

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("global::dateTime($param) (with DateTime)", async () => {
      const query = "global::dateTime($param)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ name: "param", type: "Parameter" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "dateTime",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: "2023-08-29T03:25:14.355Z" } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = new DateTime(new Date("2023-08-29T03:25:14.355Z"));

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("defined(null)", async () => {
      const query = "defined(null)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: null }],
        func: (() => {}) as unknown as GroqFunction,
        name: "defined",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("defined(5)", async () => {
      const query = "defined(5)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: 5 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "defined",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("global::defined(5)", async () => {
      const query = "global::defined(5)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: 5 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "defined",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("length(10)", async () => {
      const query = "length(10)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: 10 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "length",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("length([null,null,null])", async () => {
      const query = "length([null,null,null])";

      const tree = parse(query);

      const expectedTree = {
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
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>()
        // TODO https://github.com/saiichihashimoto/sanity-typed/issues/339
        .toBeAssignableTo<WritableDeep<typeof expectedTree>>();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 3;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('length("string")', async () => {
      const query = 'length("string")';

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: "string" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "length",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 6 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('global::length("string")', async () => {
      const query = 'global::length("string")';

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: "string" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "length",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 6 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("now()", async () => {
      const query = "now()";

      const tree = parse(query);

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "now",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const timestamp = new Date("2023-08-29T03:25:14.355Z");

      const result = await (await evaluate(tree, { timestamp })).get();

      const expectedResult = "2023-08-29T03:25:14.355Z" as string;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("global::now()", async () => {
      const query = "global::now()";

      const tree = parse(query);

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "now",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const timestamp = new Date("2023-08-29T03:25:14.355Z");

      const result = await (await evaluate(tree, { timestamp })).get();

      const expectedResult = "2023-08-29T03:25:14.355Z" as string;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("references([])", async () => {
      const query = "references([])";

      const tree = parse(query);

      const expectedTree = {
        args: [{ elements: [], type: "Array" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "references",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('references("id")', async () => {
      const query = 'references("id")';

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: "id" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "references",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('references("id",["id2"])', async () => {
      const query = 'references("id",["id2"])';

      const tree = parse(query);

      const expectedTree = {
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
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('global::references("id",["id2"])', async () => {
      const query = 'global::references("id",["id2"])';

      const tree = parse(query);

      const expectedTree = {
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
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("round(3.14)", async () => {
      const query = "round(3.14)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: 3.14 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "round",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 3 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("round(3.14,1)", async () => {
      const query = "round(3.14,1)";

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: 3.14 },
          { type: "Value", value: 1 },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "round",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 3.1 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("global::round(3.14,1)", async () => {
      const query = "global::round(3.14,1)";

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: 3.14 },
          { type: "Value", value: 1 },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "round",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 3.1 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("string(true)", async () => {
      const query = "string(true)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: true }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "true";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("string(false)", async () => {
      const query = "string(false)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: false }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "false";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('string("a string")', async () => {
      const query = 'string("a string")';

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: "a string" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "a string";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("string(3.14)", async () => {
      const query = "string(3.14)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: 3.14 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "3.14";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("string([])", async () => {
      const query = "string([])";

      const tree = parse(query);

      const expectedTree = {
        args: [{ elements: [], type: "Array" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("global::string(3.14)", async () => {
      const query = "global::string(3.14)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: 3.14 }],
        func: (() => {}) as unknown as GroqFunction,
        name: "string",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "3.14";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('lower("String")', async () => {
      const query = 'lower("String")';

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: "String" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "lower",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "string";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('global::lower("String")', async () => {
      const query = 'global::lower("String")';

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: "String" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "lower",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "string";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('upper("String")', async () => {
      const query = 'upper("String")';

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: "String" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "upper",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "STRING";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('global::upper("String")', async () => {
      const query = 'global::upper("String")';

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: "String" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "upper",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "STRING";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("identity()", async () => {
      const query = "identity()";

      const tree = parse(query);

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "identity",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const identity = "identity";

      const result = await (await evaluate(tree, { identity })).get();

      const expectedResult = "identity";

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            identity: typeof identity;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("global::identity()", async () => {
      const query = "global::identity()";

      const tree = parse(query);

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "identity",
        namespace: "global",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const identity = "identity";

      const result = await (await evaluate(tree, { identity })).get();

      const expectedResult = "identity";

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            identity: typeof identity;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });
  });

  describe("dateTime", () => {
    it("dateTime::now()", async () => {
      const query = "dateTime::now()";

      const tree = parse(query);

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "now",
        namespace: "dateTime",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const timestamp = new Date(0);

      const result = await (await evaluate(tree, { timestamp })).get();

      const expectedResult = new DateTime(timestamp);

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("delta", () => {
    it("delta::operation() (without delta)", async () => {
      const query = "delta::operation()";

      const tree = parse(query, { mode: "delta" });

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "operation",
        namespace: "delta",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const delta = {
        after: null,
        before: null,
      } as const;

      const result = await (await evaluate(tree, delta)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: WritableDeep<typeof delta>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("delta::operation() (with create)", async () => {
      const query = "delta::operation()";

      const tree = parse(query, { mode: "delta" });

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "operation",
        namespace: "delta",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const delta = {
        after: { _type: "foo" },
        before: null,
      } as const;

      const result = await (await evaluate(tree, delta)).get();

      const expectedResult = "create";

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: WritableDeep<typeof delta>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("delta::operation() (with delete)", async () => {
      const query = "delta::operation()";

      const tree = parse(query, { mode: "delta" });

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "operation",
        namespace: "delta",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const delta = {
        after: null,
        before: { _type: "foo" },
      } as const;

      const result = await (await evaluate(tree, delta)).get();

      const expectedResult = "delete";

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: WritableDeep<typeof delta>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("delta::operation() (with update)", async () => {
      const query = "delta::operation()";

      const tree = parse(query, { mode: "delta" });

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "operation",
        namespace: "delta",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const delta = {
        after: { _type: "foo" },
        before: { _type: "foo" },
      } as const;

      const result = await (await evaluate(tree, delta)).get();

      const expectedResult = "update";

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            delta: WritableDeep<typeof delta>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });
  });

  describe("array", () => {
    it('array::join(false,",")', async () => {
      const query = 'array::join(false,",")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: false },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "join",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("array::join([],false)", async () => {
      const query = "array::join([],false)";

      const tree = parse(query);

      const expectedTree = {
        args: [
          { elements: [], type: "Array" },
          { type: "Value", value: false },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "join",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('array::join([],",")', async () => {
      const query = 'array::join([],",")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { elements: [], type: "Array" },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "join",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('array::join([5],",")', async () => {
      const query = 'array::join([5],",")';

      const tree = parse(query);

      const expectedTree = {
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
        name: "join",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "5";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('array::join([{}],",")', async () => {
      const query = 'array::join([{}],",")';

      const tree = parse(query);

      const expectedTree = {
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
        name: "join",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('array::join([5,true,"foo"],",")', async () => {
      const query = 'array::join([5,true,"foo"],",")';

      const tree = parse(query);

      const expectedTree = {
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
        name: "join",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "5,true,foo";

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('array::join($param,",")', async () => {
      const query = 'array::join($param,",")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { name: "param", type: "Parameter" },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "join",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: [1, 2] } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = "1,2";

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it('array::join($param,",") (with {})', async () => {
      const query = 'array::join($param,",")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { name: "param", type: "Parameter" },
          { type: "Value", value: "," },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "join",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: [1, 2, {}] } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("array::compact(false)", async () => {
      const query = "array::compact(false)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: false }],
        func: (() => {}) as unknown as GroqFunction,
        name: "compact",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("array::compact([])", async () => {
      const query = "array::compact([])";

      const tree = parse(query);

      const expectedTree = {
        args: [{ elements: [], type: "Array" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "compact",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = [] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("array::compact([1,null,2])", async () => {
      const query = "array::compact([1,null,2])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "compact",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = [1, 2] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("array::compact($param)", async () => {
      const query = "array::compact($param)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ name: "param", type: "Parameter" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "compact",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: [1, 2, null] } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = [1, 2] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("array::compact($param) (only null)", async () => {
      const query = "array::compact($param)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ name: "param", type: "Parameter" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "compact",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: [null] } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = [] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("array::unique(false)", async () => {
      const query = "array::unique(false)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ type: "Value", value: false }],
        func: (() => {}) as unknown as GroqFunction,
        name: "unique",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("array::unique([])", async () => {
      const query = "array::unique([])";

      const tree = parse(query);

      const expectedTree = {
        args: [{ elements: [], type: "Array" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "unique",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = [] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("array::unique([1,2,1])", async () => {
      const query = "array::unique([1,2,1])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "unique",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = [1, 2] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("array::unique([{},{}])", async () => {
      const query = "array::unique([{},{}])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "unique",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>()
        // TODO https://github.com/saiichihashimoto/sanity-typed/issues/339
        .toBeAssignableTo<WritableDeep<typeof expectedTree>>();

      const result = await (await evaluate(tree)).get();

      const expectedResult = [{}, {}] as [
        NonNullable<unknown>,
        NonNullable<unknown>
      ];

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        typeof expectedResult
      >();
    });

    it("array::unique($param)", async () => {
      const query = "array::unique($param)";

      const tree = parse(query);

      const expectedTree = {
        args: [{ name: "param", type: "Parameter" }],
        func: (() => {}) as unknown as GroqFunction,
        name: "unique",
        namespace: "array",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: [1, 2, 1, 2] } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = [1, 2] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });
  });

  describe("string", () => {
    it('string::split("this is a string","not in there")', async () => {
      const query = 'string::split("this is a string","not in there")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: "this is a string" },
          { type: "Value", value: "not in there" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "split",
        namespace: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = ["this is a string"] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('string::split("this is a string"," ")', async () => {
      const query = 'string::split("this is a string"," ")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: "this is a string" },
          { type: "Value", value: " " },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "split",
        namespace: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = ["this", "is", "a", "string"] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('string::split(" this is a string "," ")', async () => {
      const query = 'string::split(" this is a string "," ")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: " this is a string " },
          { type: "Value", value: " " },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "split",
        namespace: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = ["", "this", "is", "a", "string", ""] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('string::split("test","")', async () => {
      const query = 'string::split("test","")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: "test" },
          { type: "Value", value: "" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "split",
        namespace: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = ["t", "e", "s", "t"] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('string::split($param,"")', async () => {
      const query = 'string::split($param,"")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { name: "param", type: "Parameter" },
          { type: "Value", value: "" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "split",
        namespace: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: "test" } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = ["t", "e", "s", "t"] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it('string::split("this is a string",$param)', async () => {
      const query = 'string::split("this is a string",$param)';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: "this is a string" },
          { name: "param", type: "Parameter" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "split",
        namespace: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: " " } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = ["this", "is", "a", "string"] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it('string::startsWith("A String","A Str")', async () => {
      const query = 'string::startsWith("A String","A Str")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: "A String" },
          { type: "Value", value: "A Str" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "startsWith",
        namespace: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('string::startsWith("A String","O Str")', async () => {
      const query = 'string::startsWith("A String","O Str")';

      const tree = parse(query);

      const expectedTree = {
        args: [
          { type: "Value", value: "A String" },
          { type: "Value", value: "O Str" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "startsWith",
        namespace: "string",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("math", () => {
    it("math::sum([1,2,3])", async () => {
      const query = "math::sum([1,2,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "sum",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 6 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::sum([1,null,3])", async () => {
      const query = "math::sum([1,null,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "sum",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 4 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::sum([1,false,3])", async () => {
      const query = "math::sum([1,false,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "sum",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::sum([null])", async () => {
      const query = "math::sum([null])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "sum",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 0;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::sum([])", async () => {
      const query = "math::sum([])";

      const tree = parse(query);

      const expectedTree = {
        args: [
          {
            elements: [],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "sum",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 0;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::avg([1,2,3])", async () => {
      const query = "math::avg([1,2,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "avg",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 2 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::avg([1,null,3])", async () => {
      const query = "math::avg([1,null,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "avg",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 2 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::avg([1,false,3])", async () => {
      const query = "math::avg([1,false,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "avg",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::avg([null])", async () => {
      const query = "math::avg([null])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "avg",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::avg([])", async () => {
      const query = "math::avg([])";

      const tree = parse(query);

      const expectedTree = {
        args: [
          {
            elements: [],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "avg",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::min([1,2,3])", async () => {
      const query = "math::min([1,2,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "min",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 1 as 1 | 2 | 3;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::min([1,null,3])", async () => {
      const query = "math::min([1,null,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "min",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 1 as 1 | 3;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::min([1,false,3])", async () => {
      const query = "math::min([1,false,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "min",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::min([null])", async () => {
      const query = "math::min([null])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "min",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::min([])", async () => {
      const query = "math::min([])";

      const tree = parse(query);

      const expectedTree = {
        args: [
          {
            elements: [],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "min",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::max([1,2,3])", async () => {
      const query = "math::max([1,2,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "max",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 3 as 1 | 2 | 3;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::max([1,null,3])", async () => {
      const query = "math::max([1,null,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "max",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 3 as 1 | 3;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::max([1,false,3])", async () => {
      const query = "math::max([1,false,3])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "max",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::max([null])", async () => {
      const query = "math::max([null])";

      const tree = parse(query);

      const expectedTree = {
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
        name: "max",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("math::max([])", async () => {
      const query = "math::max([])";

      const tree = parse(query);

      const expectedTree = {
        args: [
          {
            elements: [],
            type: "Array",
          },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "max",
        namespace: "math",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("extensions", () => {
    describe("portable text extension", () => {
      // TODO https://github.com/sanity-io/groq-js/issues/142
      it.failing("pt(false)", async () => {
        const query = "pt(false)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ type: "Value", value: false }],
          func: (() => {}) as unknown as GroqFunction,
          name: "pt",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it.failing("pt($param) (with PortableTextBlock)", async () => {
        const query = "pt($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "pt",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = {
          param: {
            _type: "block",
            children: [{ _type: "span", text: "foo" }],
          },
        } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = {
          _type: "block",
          children: [{ _type: "span", text: "foo" }],
        } as const;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("pt($param) (with PortableTextBlock[])", async () => {
        const query = "pt($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "pt",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = {
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
        } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = [
          {
            _type: "block",
            children: [{ _type: "span", text: "foo" }],
          },
          {
            _type: "block",
            children: [{ _type: "span", text: "bar" }],
          },
        ] as const;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("global::pt($param) (with PortableTextBlock[])", async () => {
        const query = "global::pt($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "pt",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = {
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
        } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = [
          {
            _type: "block",
            children: [{ _type: "span", text: "foo" }],
          },
          {
            _type: "block",
            children: [{ _type: "span", text: "bar" }],
          },
        ] as const;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("pt::text(false)", async () => {
        const query = "pt::text(false)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ type: "Value", value: false }],
          func: (() => {}) as unknown as GroqFunction,
          name: "text",
          namespace: "pt",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it("pt::text($param) (with PortableTextBlock)", async () => {
        const query = "pt::text($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "text",
          namespace: "pt",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = {
          param: {
            _type: "block",
            children: [{ _type: "span", text: "foo" }],
          },
        } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = "foo" as string;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it("pt::text($param) (with PortableTextBlock[])", async () => {
        const query = "pt::text($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "text",
          namespace: "pt",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = {
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
        } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = "foo\n\nbar" as string;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });
    });

    describe("geojson", () => {
      // TODO https://github.com/sanity-io/groq-js/issues/141
      it.failing("geo(false)", async () => {
        const query = "geo(false)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ type: "Value", value: false }],
          func: (() => {}) as unknown as GroqFunction,
          name: "geo",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const result = await (await evaluate(tree)).get();

        const expectedResult = null;

        expect(result).toStrictEqual(expectedResult);
        expectType<ExecuteQuery<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedResult>
        >();
      });

      it.failing("geo($param) (with Position)", async () => {
        const query = "geo($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "geo",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param: {} as Position } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = {} as Position;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("geo($param) (with Point)", async () => {
        const query = "geo($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "geo",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param: {} as Point } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = {} as Point;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("geo($param) (with MultiPoint)", async () => {
        const query = "geo($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "geo",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param: {} as MultiPoint } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = {} as MultiPoint;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("geo($param) (with LineString)", async () => {
        const query = "geo($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "geo",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param: {} as LineString } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = {} as LineString;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("geo($param) (with MultiLineString)", async () => {
        const query = "geo($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "geo",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param: {} as MultiLineString } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = {} as MultiLineString;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("geo($param) (with Polygon)", async () => {
        const query = "geo($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "geo",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param: {} as Polygon } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = {} as Polygon;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("geo($param) (with MultiPolygon)", async () => {
        const query = "geo($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "geo",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param: {} as MultiPolygon } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = {} as MultiPolygon;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("geo($param) (with GeometryCollection)", async () => {
        const query = "geo($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "geo",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param: {} as GeometryCollection } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = {} as GeometryCollection;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("global::geo($param) (with GeometryCollection)", async () => {
        const query = "global::geo($param)";

        const tree = parse(query);

        const expectedTree = {
          args: [{ name: "param", type: "Parameter" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "geo",
          namespace: "global",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param: {} as GeometryCollection } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = {} as GeometryCollection;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("geo::contains($param1,$param2)", async () => {
        const query = "geo::contains($param1,$param2)";

        const tree = parse(query);

        const expectedTree = {
          args: [
            { name: "param1", type: "Parameter" },
            { name: "param2", type: "Parameter" },
          ],
          func: (() => {}) as unknown as GroqFunction,
          name: "contains",
          namespace: "geo",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param1: {} as Geo, param2: {} as Geo } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = true as boolean;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("geo::intersects($param1,$param2)", async () => {
        const query = "geo::intersects($param1,$param2)";

        const tree = parse(query);

        const expectedTree = {
          args: [
            { name: "param1", type: "Parameter" },
            { name: "param2", type: "Parameter" },
          ],
          func: (() => {}) as unknown as GroqFunction,
          name: "intersects",
          namespace: "geo",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param1: {} as Geo, param2: {} as Geo } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = true as boolean;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });

      it.failing("geo::distance($param1,$param2)", async () => {
        const query = "geo::distance($param1,$param2)";

        const tree = parse(query);

        const expectedTree = {
          args: [
            { name: "param1", type: "Parameter" },
            { name: "param2", type: "Parameter" },
          ],
          func: (() => {}) as unknown as GroqFunction,
          name: "distance",
          namespace: "geo",
          type: "FuncCall",
        } as const;

        expect(tree).toStrictEqual({
          ...expectedTree,
          func: expect.any(Function),
        });
        expectType<Parse<typeof query>>().toStrictEqual<
          WritableDeep<typeof expectedTree>
        >();

        const params = { param1: {} as Point, param2: {} as Point } as const;

        const result = await (await evaluate(tree, { params })).get();

        const expectedResult = 0 as number;

        expect(result).toStrictEqual(expectedResult);
        expectType<
          ExecuteQuery<
            typeof query,
            _ScopeFromPartialContext<{
              parameters: WritableDeep<typeof params>;
            }>
          >
        >().toStrictEqual<WritableDeep<typeof expectedResult>>();
      });
    });
  });

  describe("sanity", () => {
    it("sanity::projectId()", async () => {
      const query = "sanity::projectId()";

      const tree = parse(query);

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "projectId",
        namespace: "sanity",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const client = { dataset: "dataset", projectId: "projectId" } as const;

      const result = await (await evaluate(tree, { sanity: client })).get();

      const expectedResult = "projectId";

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            client: WritableDeep<typeof client>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });

    it("sanity::dataset()", async () => {
      const query = "sanity::dataset()";

      const tree = parse(query);

      const expectedTree = {
        args: [],
        func: (() => {}) as unknown as GroqFunction,
        name: "dataset",
        namespace: "sanity",
        type: "FuncCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        func: expect.any(Function),
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const client = { dataset: "dataset", projectId: "projectId" } as const;

      const result = await (await evaluate(tree, { sanity: client })).get();

      const expectedResult = "dataset";

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            client: WritableDeep<typeof client>;
          }>
        >
      >().toStrictEqual<WritableDeep<typeof expectedResult>>();
    });
  });
});
