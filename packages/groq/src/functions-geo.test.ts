import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
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
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Geo, Parse } from ".";
import type { ScopeFromPartialContext } from "./internal";

describe("geojson", () => {
  it.failing("geo(false)", async () => {
    const query = "geo(false)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("geo($param) (with Point)", async () => {
    const query = "geo($param)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("geo($param) (with MultiPoint)", async () => {
    const query = "geo($param)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("geo($param) (with LineString)", async () => {
    const query = "geo($param)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("geo($param) (with MultiLineString)", async () => {
    const query = "geo($param)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("geo($param) (with Polygon)", async () => {
    const query = "geo($param)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("geo($param) (with MultiPolygon)", async () => {
    const query = "geo($param)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("geo($param) (with GeometryCollection)", async () => {
    const query = "geo($param)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("global::geo($param) (with GeometryCollection)", async () => {
    const query = "global::geo($param)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("geo::contains($param1,$param2)", async () => {
    const query = "geo::contains($param1,$param2)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("geo::intersects($param1,$param2)", async () => {
    const query = "geo::intersects($param1,$param2)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("geo::distance($param1,$param2)", async () => {
    const query = "geo::distance($param1,$param2)";

    // TODO https://github.com/sanity-io/groq-js/issues/141
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
        ScopeFromPartialContext<{
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });
});
