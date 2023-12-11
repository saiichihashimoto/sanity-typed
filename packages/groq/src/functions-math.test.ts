import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";

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
