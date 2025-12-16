import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";
import type { ScopeFromPartialContext } from "./internal";

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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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
        ScopeFromPartialContext<{ parameters: WritableDeep<typeof params> }>
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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
        ScopeFromPartialContext<{ parameters: WritableDeep<typeof params> }>
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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
        ScopeFromPartialContext<{ parameters: WritableDeep<typeof params> }>
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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
        ScopeFromPartialContext<{ parameters: WritableDeep<typeof params> }>
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
    expectType<Parse<typeof query>>()
      // TODO https://github.com/saiichihashimoto/sanity-typed/issues/339
      .toBeAssignableTo<WritableDeep<typeof expectedTree>>();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [{}, {}] as [
      NonNullable<unknown>,
      NonNullable<unknown>,
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

    expect(tree).toStrictEqual({ ...expectedTree, func: expect.any(Function) });
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
        ScopeFromPartialContext<{ parameters: WritableDeep<typeof params> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });
});
