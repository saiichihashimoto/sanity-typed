import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";
import type { ScopeFromPartialContext } from "./internal";

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
        ScopeFromPartialContext<{
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
        ScopeFromPartialContext<{
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
