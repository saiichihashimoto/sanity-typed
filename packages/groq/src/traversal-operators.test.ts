import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";
import type {
  ScopeFromPartialContext,
  ScopeFromPartialScope,
} from "./internal";

describe("traversal operators", () => {
  it("foo.bar", async () => {
    const query = "foo.bar";

    const tree = parse(query);

    const expectedTree = {
      base: { name: "foo", type: "AccessAttribute" },
      name: "bar",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { foo: { bar: "bar" } } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = "bar";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialScope<{
          this: WritableDeep<typeof root>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("foo.bar.baz", async () => {
    const query = "foo.bar.baz";

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: { name: "foo", type: "AccessAttribute" },
        name: "bar",
        type: "AccessAttribute",
      },
      name: "baz",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { foo: { bar: { baz: "baz" } } } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = "baz";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialScope<{
          this: WritableDeep<typeof root>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it('foo["bar"]', async () => {
    const query = 'foo["bar"]';

    const tree = parse(query);

    const expectedTree = {
      base: { name: "foo", type: "AccessAttribute" },
      name: "bar",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { foo: { bar: "bar" } } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = "bar";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialScope<{
          this: WritableDeep<typeof root>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it('foo["bar"]["baz"]', async () => {
    const query = 'foo["bar"]["baz"]';

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: { name: "foo", type: "AccessAttribute" },
        name: "bar",
        type: "AccessAttribute",
      },
      name: "baz",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { foo: { bar: { baz: "baz" } } } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = "baz";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialScope<{
          this: WritableDeep<typeof root>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("*.key", async () => {
    const query = "*.key";

    const tree = parse(query);

    const expectedTree = {
      base: { type: "Everything" },
      expr: {
        base: { type: "This" },
        name: "key",
        type: "AccessAttribute",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ key: "foo" }, { key: "bar" }] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = ["foo", "bar"] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it('*["key"]', async () => {
    const query = '*["key"]';

    const tree = parse(query);

    const expectedTree = {
      base: { type: "Everything" },
      expr: {
        base: { type: "This" },
        name: "key",
        type: "AccessAttribute",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ key: "foo" }, { key: "bar" }] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = ["foo", "bar"] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("[true,false][1]", async () => {
    const query = "[true,false][1]";

    const tree = parse(query);

    const expectedTree = {
      base: {
        elements: [
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: true },
          },
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: false },
          },
        ],
        type: "Array",
      },
      index: 1,
      type: "AccessElement",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
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

  it("*[1]", async () => {
    const query = "*[1]";

    const tree = parse(query);

    const expectedTree = {
      base: { type: "Everything" },
      index: 1,
      type: "AccessElement",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ _type: "foo" }, { _type: "bar" }] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = { _type: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("*[1] (unclear dataset)", async () => {
    const query = "*[1]";

    const tree = parse(query);

    const expectedTree = {
      base: { type: "Everything" },
      index: 1,
      type: "AccessElement",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ _type: "foo" as const }, { _type: "bar" as const }];

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = { _type: "bar" } as (typeof dataset)[number] | null;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("[[[5]]][0][0][0]", async () => {
    const query = "[[[5]]][0][0][0]";

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: {
          base: {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: {
                  elements: [
                    {
                      isSplat: false,
                      type: "ArrayElement",
                      value: {
                        elements: [
                          {
                            isSplat: false,
                            type: "ArrayElement",
                            value: { type: "Value", value: 5 },
                          },
                        ],
                        type: "Array",
                      },
                    },
                  ],
                  type: "Array",
                },
              },
            ],
            type: "Array",
          },
          index: 0,
          type: "AccessElement",
        },
        index: 0,
        type: "AccessElement",
      },
      index: 0,
      type: "AccessElement",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 5;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("[true,false][0..1]", async () => {
    const query = "[true,false][0..1]";

    const tree = parse(query);

    const expectedTree = {
      base: {
        elements: [
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: true },
          },
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: false },
          },
        ],
        type: "Array",
      },
      isInclusive: true,
      left: 0,
      right: 1,
      type: "Slice",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [true, false] as boolean[];

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("[true,false][0...2]", async () => {
    const query = "[true,false][0...2]";

    const tree = parse(query);

    const expectedTree = {
      base: {
        elements: [
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: true },
          },
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: false },
          },
        ],
        type: "Array",
      },
      isInclusive: false,
      left: 0,
      right: 2,
      type: "Slice",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [true, false] as boolean[];

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("*[0..10][1...9][3..4]", async () => {
    const query = "*[0..10][1...9][3..4]";

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: {
          base: { type: "Everything" },
          isInclusive: true,
          left: 0,
          right: 10,
          type: "Slice",
        },
        isInclusive: false,
        left: 1,
        right: 9,
        type: "Slice",
      },
      isInclusive: true,
      left: 3,
      right: 4,
      type: "Slice",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [4, 5] as (typeof dataset)[number][];

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it.failing("false[true]", async () => {
    const query = "false[true]";

    const tree = parse(query);

    const expectedTree = {
      base: { type: "Value", value: false },
      expr: { type: "Value", value: true },
      type: "Filter",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = false;

    // TODO https://github.com/sanity-io/groq-js/issues/146
    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("[true,false][true]", async () => {
    const query = "[true,false][true]";

    const tree = parse(query);

    const expectedTree = {
      base: {
        elements: [
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: true },
          },
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: false },
          },
        ],
        type: "Array",
      },
      expr: { type: "Value", value: true },
      type: "Filter",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [true, false] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("[true,false][false]", async () => {
    const query = "[true,false][false]";

    const tree = parse(query);

    const expectedTree = {
      base: {
        elements: [
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: true },
          },
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: false },
          },
        ],
        type: "Array",
      },
      expr: { type: "Value", value: false },
      type: "Filter",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
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

  it("[true,false][true][true][true]", async () => {
    const query = "[true,false][true][true][true]";

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: {
          base: {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: true },
              },
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: false },
              },
            ],
            type: "Array",
          },
          expr: { type: "Value", value: true },
          type: "Filter",
        },
        expr: { type: "Value", value: true },
        type: "Filter",
      },
      expr: { type: "Value", value: true },
      type: "Filter",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [true, false] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("*[true]", async () => {
    const query = "*[true]";

    const tree = parse(query);

    const expectedTree = {
      base: { type: "Everything" },
      expr: { type: "Value", value: true },
      type: "Filter",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ _type: "foo" }, { _type: "bar" }] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [{ _type: "foo" }, { _type: "bar" }] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it('*[_type=="foo"]', async () => {
    const query = '*[_type=="foo"]';

    const tree = parse(query);

    const expectedTree = {
      base: { type: "Everything" },
      expr: {
        left: { name: "_type", type: "AccessAttribute" },
        op: "==",
        right: { type: "Value", value: "foo" },
        type: "OpCall",
      },
      type: "Filter",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ _type: "foo" }, { _type: "bar" }] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [{ _type: "foo" }] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it('*[_type!="bar"][_type!="baz"][_type=="foo"]', async () => {
    const query = '*[_type!="bar"][_type!="baz"][_type=="foo"]';

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: {
          base: { type: "Everything" },
          expr: {
            left: { name: "_type", type: "AccessAttribute" },
            op: "!=",
            right: { type: "Value", value: "bar" },
            type: "OpCall",
          },
          type: "Filter",
        },
        expr: {
          left: { name: "_type", type: "AccessAttribute" },
          op: "!=",
          right: { type: "Value", value: "baz" },
          type: "OpCall",
        },
        type: "Filter",
      },
      expr: {
        left: { name: "_type", type: "AccessAttribute" },
        op: "==",
        right: { type: "Value", value: "foo" },
        type: "OpCall",
      },
      type: "Filter",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [
      { _type: "foo" },
      { _type: "bar" },
      { _type: "baz" },
    ] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [{ _type: "foo" }] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("[true,false][]", async () => {
    const query = "[true,false][]";

    const tree = parse(query);

    const expectedTree = {
      base: {
        elements: [
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: true },
          },
          {
            isSplat: false,
            type: "ArrayElement",
            value: { type: "Value", value: false },
          },
        ],
        type: "Array",
      },
      type: "ArrayCoerce",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [true, false] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("*[]", async () => {
    const query = "*[]";

    const tree = parse(query);

    const expectedTree = {
      base: { type: "Everything" },
      type: "ArrayCoerce",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [{ _type: "foo" }, { _type: "bar" }] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [{ _type: "foo" }, { _type: "bar" }] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("false[]", async () => {
    const query = "false[]";

    const tree = parse(query);

    const expectedTree = {
      base: { type: "Value", value: false },
      type: "ArrayCoerce",
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

  it('{"key":"value"}{key}', async () => {
    const query = '{"key":"value"}{key}';

    const tree = parse(query);

    const expectedTree = {
      base: {
        attributes: [
          {
            name: "key",
            type: "ObjectAttributeValue",
            value: { type: "Value", value: "value" },
          },
        ],
        type: "Object",
      },
      expr: {
        attributes: [
          {
            name: "key",
            type: "ObjectAttributeValue",
            value: { name: "key", type: "AccessAttribute" },
          },
        ],
        type: "Object",
      },
      type: "Projection",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = { key: "value" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('{"key":"value"}|{key}', async () => {
    const query = '{"key":"value"}|{key}';

    const tree = parse(query);

    const expectedTree = {
      base: {
        attributes: [
          {
            name: "key",
            type: "ObjectAttributeValue",
            value: { type: "Value", value: "value" },
          },
        ],
        type: "Object",
      },
      expr: {
        attributes: [
          {
            name: "key",
            type: "ObjectAttributeValue",
            value: { name: "key", type: "AccessAttribute" },
          },
        ],
        type: "Object",
      },
      type: "Projection",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = { key: "value" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('[{"key":"value"}]{key}', async () => {
    const query = '[{"key":"value"}]{key}';

    const tree = parse(query);

    const expectedTree = {
      base: {
        elements: [
          {
            isSplat: false,
            type: "ArrayElement",
            value: {
              attributes: [
                {
                  name: "key",
                  type: "ObjectAttributeValue",
                  value: { type: "Value", value: "value" },
                },
              ],
              type: "Object",
            },
          },
        ],
        type: "Array",
      },
      expr: {
        base: {
          type: "This",
        },
        expr: {
          attributes: [
            {
              name: "key",
              type: "ObjectAttributeValue",
              value: { name: "key", type: "AccessAttribute" },
            },
          ],
          type: "Object",
        },
        type: "Projection",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [{ key: "value" }] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('[{"key":"value"}]|{key}', async () => {
    const query = '[{"key":"value"}]|{key}';

    const tree = parse(query);

    const expectedTree = {
      base: {
        elements: [
          {
            isSplat: false,
            type: "ArrayElement",
            value: {
              attributes: [
                {
                  name: "key",
                  type: "ObjectAttributeValue",
                  value: { type: "Value", value: "value" },
                },
              ],
              type: "Object",
            },
          },
        ],
        type: "Array",
      },
      expr: {
        base: {
          type: "This",
        },
        expr: {
          attributes: [
            {
              name: "key",
              type: "ObjectAttributeValue",
              value: { name: "key", type: "AccessAttribute" },
            },
          ],
          type: "Object",
        },
        type: "Projection",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [{ key: "value" }] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('*[_type == "foo"]{name}', async () => {
    const query = '*[_type == "foo"]{name}';

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: { type: "Everything" },
        expr: {
          left: {
            name: "_type",
            type: "AccessAttribute",
          },
          op: "==",
          right: {
            type: "Value",
            value: "foo",
          },
          type: "OpCall",
        },
        type: "Filter",
      },
      expr: {
        base: { type: "This" },
        expr: {
          attributes: [
            {
              name: "name",
              type: "ObjectAttributeValue",
              value: {
                name: "name",
                type: "AccessAttribute",
              },
            },
          ],
          type: "Object",
        },
        type: "Projection",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [
      { _type: "foo", name: "foo" },
      { _type: "bar", name: "bar" },
    ] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [{ name: "foo" }] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("@[]{name} (with optional name)", async () => {
    const query = "@[]{name}";

    const tree = parse(query);

    const expectedTree = {
      base: { base: { type: "This" }, type: "ArrayCoerce" },
      expr: {
        base: { type: "This" },
        expr: {
          attributes: [
            {
              name: "name",
              type: "ObjectAttributeValue",
              value: { name: "name", type: "AccessAttribute" },
            },
          ],
          type: "Object",
        },
        type: "Projection",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = [
      { _type: "foo", name: "foo" },
      { _type: "foo" },
      { _type: "foo" } as { _type: "foo"; name?: string },
    ] as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = [
      { name: "foo" },
      { name: null },
      { name: null as string | null },
    ] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialScope<{
          this: WritableDeep<typeof root>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("$param->", async () => {
    const query = "$param->";

    const tree = parse(query);

    const expectedTree = {
      base: { name: "param", type: "Parameter" },
      type: "Deref",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = {
      param: { _type: "reference", _ref: "foo" },
    } as const;

    const dataset = [
      { _id: "foo", _type: "foo", value: "foo" },
      { _id: "bar", _type: "bar", value: "bar" },
    ] as const;

    const result = await (await evaluate(tree, { dataset, params })).get();

    const expectedResult = { _id: "foo", _type: "foo", value: "foo" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("$param->value", async () => {
    const query = "$param->value";

    const tree = parse(query);

    const expectedTree = {
      base: { base: { name: "param", type: "Parameter" }, type: "Deref" },
      name: "value",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = {
      param: { _type: "reference", _ref: "foo" },
    } as const;

    const dataset = [
      { _id: "foo", _type: "foo", value: "foo" },
      { _id: "bar", _type: "bar", value: "bar" },
    ] as const;

    const result = await (await evaluate(tree, { dataset, params })).get();

    const expectedResult = "foo";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("$param[]->value", async () => {
    const query = "$param[]->value";

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: {
          name: "param",
          type: "Parameter",
        },
        type: "ArrayCoerce",
      },
      expr: {
        base: {
          base: { type: "This" },
          type: "Deref",
        },
        name: "value",
        type: "AccessAttribute",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = {
      param: [
        { _type: "reference", _ref: "foo" },
        { _type: "reference", _ref: "bar" },
        { _type: "reference", _ref: "bar2" },
      ],
    } as const;

    const dataset = [
      { _id: "foo", _type: "foo", value: "foo" },
      { _id: "bar", _type: "bar", value: "bar" },
    ] as const;

    const result = await (await evaluate(tree, { dataset, params })).get();

    const expectedResult = ["foo", "bar", null] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("$param-> (weak)", async () => {
    const query = "$param->";

    const tree = parse(query);

    const expectedTree = {
      base: { name: "param", type: "Parameter" },
      type: "Deref",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = {
      param: { _type: "reference", _ref: "foo2", weak: true },
    } as const;

    const dataset = [
      { _id: "foo", _type: "foo", value: "foo" },
      { _id: "bar", _type: "bar", value: "bar" },
    ] as const;

    const result = await (await evaluate(tree, { dataset, params })).get();

    const expectedResult = null;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("$param->value (weak)", async () => {
    const query = "$param->value";

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: { name: "param", type: "Parameter" },
        type: "Deref",
      },
      name: "value",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = {
      param: { _type: "reference", _ref: "foo2", weak: true },
    } as const;

    const dataset = [
      { _id: "foo", _type: "foo", value: "foo" },
      { _id: "bar", _type: "bar", value: "bar" },
    ] as const;

    const result = await (await evaluate(tree, { dataset, params })).get();

    const expectedResult = null;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("$param[]->value (weak)", async () => {
    const query = "$param[]->value";

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: {
          name: "param",
          type: "Parameter",
        },
        type: "ArrayCoerce",
      },
      expr: {
        base: {
          base: { type: "This" },
          type: "Deref",
        },
        name: "value",
        type: "AccessAttribute",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const params = {
      param: [
        { _type: "reference", _ref: "foo", weak: true },
        { _type: "reference", _ref: "bar", weak: true },
        { _type: "reference", _ref: "foo2", weak: true },
      ],
    } as const;

    const dataset = [
      { _id: "foo", _type: "foo", value: "foo" },
      { _id: "bar", _type: "bar", value: "bar" },
    ] as const;

    const result = await (await evaluate(tree, { dataset, params })).get();

    const expectedResult = ["foo", "bar", null] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
          parameters: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });
});
