import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { PortableTextBlock } from "@portabletext-typed/types";

import type { ExecuteQuery, Parse } from ".";
import type { ScopeFromPartialContext } from "./internal";

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
        markDefs: [],
        style: "normal",
      } satisfies PortableTextBlock<any, any, any, any, any>,
    };

    const result = await (await evaluate(tree, { params })).get();

    const expectedResult = {
      _type: "block",
      children: [{ _type: "span", text: "foo" }],
      markDefs: [],
      style: "normal",
    } satisfies PortableTextBlock<any, any, any, any, any>;

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
          markDefs: [],
          style: "normal",
        },
        {
          _type: "block",
          children: [{ _type: "span", text: "bar" }],
          markDefs: [],
          style: "normal",
        },
      ] satisfies PortableTextBlock<any, any, any, any, any>[],
    };

    const result = await (await evaluate(tree, { params })).get();

    const expectedResult = [
      {
        _type: "block",
        children: [{ _type: "span", text: "foo" }],
        markDefs: [],
        style: "normal",
      },
      {
        _type: "block",
        children: [{ _type: "span", text: "bar" }],
        markDefs: [],
        style: "normal",
      },
    ] satisfies PortableTextBlock<any, any, any, any, any>[];

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
          markDefs: [],
          style: "normal",
        },
        {
          _type: "block",
          children: [{ _type: "span", text: "bar" }],
          markDefs: [],
          style: "normal",
        },
      ] satisfies PortableTextBlock<any, any, any, any, any>[],
    };

    const result = await (await evaluate(tree, { params })).get();

    const expectedResult = [
      {
        _type: "block",
        children: [{ _type: "span", text: "foo" }],
        markDefs: [],
        style: "normal",
      },
      {
        _type: "block",
        children: [{ _type: "span", text: "bar" }],
        markDefs: [],
        style: "normal",
      },
    ] satisfies PortableTextBlock<any, any, any, any, any>[];

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
        markDefs: [],
        style: "normal",
      } satisfies PortableTextBlock<any, any, any, any, any>,
    };

    const result = await (await evaluate(tree, { params })).get();

    const expectedResult = "foo" as string;

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
          markDefs: [],
          style: "normal",
        },
        {
          _type: "block",
          children: [{ _type: "span", text: "bar" }],
          markDefs: [],
          style: "normal",
        },
      ] satisfies PortableTextBlock<any, any, any, any, any>[],
    };

    const result = await (await evaluate(tree, { params })).get();

    const expectedResult = "foo\n\nbar" as string;

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
