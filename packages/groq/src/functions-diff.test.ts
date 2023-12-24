import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";

describe("diff", () => {
  // TODO https://github.com/sanity-io/groq-js/issues/160
  it.failing("diff::changedAny(foo,bar,title)", async () => {
    const query = "diff::changedAny(foo,bar,title)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing("diff::changedAny(foo,bar,(title))", async () => {
    const query = "diff::changedAny(foo,bar,(title))";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing("diff::changedAny(foo,bar,(title,description))", async () => {
    const query = "diff::changedAny(foo,bar,(title,description))";

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "diff",
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

  it.failing("diff::changedAny(foo,bar,title.description)", async () => {
    const query = "diff::changedAny(foo,bar,title.description)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing('diff::changedAny(foo,bar,title["description"])', async () => {
    const query = 'diff::changedAny(foo,bar,title["description"])';

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing("diff::changedAny(foo,bar,title[])", async () => {
    const query = "diff::changedAny(foo,bar,title[])";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing('diff::changedAny(foo,bar,title[_type=="foo"])', async () => {
    const query = 'diff::changedAny(foo,bar,title[_type=="foo"])';

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing("diff::changedAny(foo,bar,title.(description))", async () => {
    const query = "diff::changedAny(foo,bar,title.(description))";

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "diff",
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

  it.failing(
    "diff::changedAny(foo,bar,title.(description,description2))",
    async () => {
      const query =
        "diff::changedAny(foo,bar,title.(description,description2))";

      // TODO https://github.com/sanity-io/groq-js/issues/160
      const tree = parse(query);

      const expectedTree = {
        args: [
          { name: "foo", type: "AccessAttribute" },
          { name: "bar", type: "AccessAttribute" },
          { type: "Selector" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "changedAny",
        namespace: "diff",
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
    }
  );

  it.failing("diff::changedOnly(foo,bar,title)", async () => {
    const query = "diff::changedOnly(foo,bar,title)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing("diff::changedOnly(foo,bar,(title))", async () => {
    const query = "diff::changedOnly(foo,bar,(title))";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing("diff::changedOnly(foo,bar,(title,description))", async () => {
    const query = "diff::changedOnly(foo,bar,(title,description))";

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "diff",
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

  it.failing("diff::changedOnly(foo,bar,title.description)", async () => {
    const query = "diff::changedOnly(foo,bar,title.description)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing('diff::changedOnly(foo,bar,title["description"])', async () => {
    const query = 'diff::changedOnly(foo,bar,title["description"])';

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing("diff::changedOnly(foo,bar,title[])", async () => {
    const query = "diff::changedOnly(foo,bar,title[])";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing('diff::changedOnly(foo,bar,title[_type=="foo"])', async () => {
    const query = 'diff::changedOnly(foo,bar,title[_type=="foo"])';

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const result = await (await evaluate(tree)).get();

    const expectedResult = false as boolean;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it.failing("diff::changedOnly(foo,bar,title.(description))", async () => {
    const query = "diff::changedOnly(foo,bar,title.(description))";

    // TODO https://github.com/sanity-io/groq-js/issues/160
    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "diff",
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

  it.failing(
    "diff::changedOnly(foo,bar,title.(description,description2))",
    async () => {
      const query =
        "diff::changedOnly(foo,bar,title.(description,description2))";

      // TODO https://github.com/sanity-io/groq-js/issues/160
      const tree = parse(query);

      const expectedTree = {
        args: [
          { name: "foo", type: "AccessAttribute" },
          { name: "bar", type: "AccessAttribute" },
          { type: "Selector" },
        ],
        func: (() => {}) as unknown as GroqFunction,
        name: "changedOnly",
        namespace: "diff",
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
    }
  );
});
