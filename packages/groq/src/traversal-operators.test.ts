import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { ReadonlyDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";
import type { ReferenceValue } from "@sanity-typed/types";

import type {
  ExecuteQuery,
  Parse,
  _ScopeFromPartialContext,
  _ScopeFromPartialScope,
} from ".";

const FOO: unique symbol = Symbol("foo");
type Foo = typeof FOO;

const BAR: unique symbol = Symbol("bar");
type Bar = typeof BAR;

const BAZ: unique symbol = Symbol("baz");
type Baz = typeof BAZ;

describe("traversal operators", () => {
  it("foo.bar", async () => {
    const query = "foo.bar";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { root: { foo: { bar: BAR } } })
    ).get();

    const desiredTree = {
      base: { name: "foo", type: "AccessAttribute" },
      name: "bar",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(BAR);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: { foo: { bar: Bar } } }>
      >
    >().toStrictEqual<Bar>();
  });

  it("foo.bar.baz", async () => {
    const query = "foo.bar.baz";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { root: { foo: { bar: { baz: BAZ } } } })
    ).get();

    const desiredTree = {
      base: {
        base: { name: "foo", type: "AccessAttribute" },
        name: "bar",
        type: "AccessAttribute",
      },
      name: "baz",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(BAZ);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: { foo: { bar: { baz: Baz } } } }>
      >
    >().toStrictEqual<Baz>();
  });

  it('foo["bar"]', async () => {
    const query = 'foo["bar"]';
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { root: { foo: { bar: BAR } } })
    ).get();

    const desiredTree = {
      base: { name: "foo", type: "AccessAttribute" },
      name: "bar",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(BAR);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: { foo: { bar: Bar } } }>
      >
    >().toStrictEqual<Bar>();
  });

  it('foo["bar"]["baz"]', async () => {
    const query = 'foo["bar"]["baz"]';
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { root: { foo: { bar: { baz: BAZ } } } })
    ).get();

    const desiredTree = {
      base: {
        base: { name: "foo", type: "AccessAttribute" },
        name: "bar",
        type: "AccessAttribute",
      },
      name: "baz",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(BAZ);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: { foo: { bar: { baz: Baz } } } }>
      >
    >().toStrictEqual<Baz>();
  });

  it("*.key", async () => {
    const query = "*.key";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { dataset: [{ key: BAR }, { key: FOO }] })
    ).get();

    const desiredTree = {
      base: { type: "Everything" },
      expr: {
        base: { type: "This" },
        name: "key",
        type: "AccessAttribute",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([BAR, FOO]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{ dataset: ({ key: Bar } | { key: Foo })[] }>
      >
    >().toStrictEqual<(Bar | Foo)[]>();
  });

  it('*["key"]', async () => {
    const query = '*["key"]';
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { dataset: [{ key: BAR }, { key: FOO }] })
    ).get();

    const desiredTree = {
      base: { type: "Everything" },
      expr: {
        base: { type: "This" },
        name: "key",
        type: "AccessAttribute",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([BAR, FOO]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{ dataset: ({ key: Bar } | { key: Foo })[] }>
      >
    >().toStrictEqual<(Bar | Foo)[]>();
  });

  it("[true,false][1]", async () => {
    const query = "[true,false][1]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(false);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
  });

  it("*[1]", async () => {
    const query = "*[1]";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { dataset: [{ key: BAR }, { key: FOO }] })
    ).get();

    const desiredTree = {
      base: { type: "Everything" },
      index: 1,
      type: "AccessElement",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ key: FOO });
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{ dataset: ({ key: Bar } | { key: Foo })[] }>
      >
    >().toStrictEqual<{ key: Bar } | { key: Foo }>();
  });

  it("[[[5]]][0][0][0]", async () => {
    const query = "[[[5]]][0][0][0]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(5);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<5>();
  });

  it("[true,false][0..1]", async () => {
    const query = "[true,false][0..1]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([true, false]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("[true,false][0...2]", async () => {
    const query = "[true,false][0...2]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([true, false]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("*[0..10][1...9][3..4]", async () => {
    const query = "*[0..10][1...9][3..4]";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { dataset: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] })
    ).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([4, 5]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)[];
        }>
      >
    >().toStrictEqual<(0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)[]>();
  });

  it.failing("false[true]", async () => {
    const query = "false[true]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      base: { type: "Value", value: false },
      expr: { type: "Value", value: true },
      type: "Filter",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    // TODO https://github.com/sanity-io/groq-js/issues/146
    expect(result).toBe(false);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
  });

  it("[true,false][true]", async () => {
    const query = "[true,false][true]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([true, false]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("[true,false][false]", async () => {
    const query = "[true,false][false]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[]>();
  });

  it("[true,false][true][true][true]", async () => {
    const query = "[true,false][true][true][true]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([true, false]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("*[true]", async () => {
    const query = "*[true]";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { dataset: [{ _type: "bar" }, { _type: "foo" }] })
    ).get();

    const desiredTree = {
      base: { type: "Everything" },
      expr: { type: "Value", value: true },
      type: "Filter",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([{ _type: "bar" }, { _type: "foo" }]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: ({ _type: "bar" } | { _type: "foo" })[];
        }>
      >
    >().toStrictEqual<({ _type: "bar" } | { _type: "foo" })[]>();
  });

  it('*[_type=="foo"]', async () => {
    const query = '*[_type=="foo"]';
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { dataset: [{ _type: "bar" }, { _type: "foo" }] })
    ).get();

    const desiredTree = {
      base: { type: "Everything" },
      expr: {
        left: { name: "_type", type: "AccessAttribute" },
        op: "==",
        right: { type: "Value", value: "foo" },
        type: "OpCall",
      },
      type: "Filter",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([{ _type: "foo" }]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: ({ _type: "bar" } | { _type: "foo" })[];
        }>
      >
    >().toStrictEqual<{ _type: "foo" }[]>();
  });

  it('*[_type!="bar"][_type!="baz"][_type=="foo"]', async () => {
    const query = '*[_type!="bar"][_type!="baz"][_type=="foo"]';
    const tree = parse(query);
    const result = await (
      await evaluate(tree, {
        dataset: [{ _type: "bar" }, { _type: "baz" }, { _type: "foo" }],
      })
    ).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([{ _type: "foo" }]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: ({ _type: "bar" } | { _type: "baz" } | { _type: "foo" })[];
        }>
      >
    >().toStrictEqual<{ _type: "foo" }[]>();
  });

  it("[true,false][]", async () => {
    const query = "[true,false][]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([true, false]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("*[]", async () => {
    const query = "*[]";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { dataset: [{ _type: "bar" }, { _type: "foo" }] })
    ).get();

    const desiredTree = {
      base: { type: "Everything" },
      type: "ArrayCoerce",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([{ _type: "bar" }, { _type: "foo" }]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: ({ _type: "bar" } | { _type: "foo" })[];
        }>
      >
    >().toStrictEqual<({ _type: "bar" } | { _type: "foo" })[]>();
  });

  it("false[]", async () => {
    const query = "false[]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      base: { type: "Value", value: false },
      type: "ArrayCoerce",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBeNull();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
  });

  it('{"key":"value"}{key}', async () => {
    const query = '{"key":"value"}{key}';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ key: "value" });
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ key: "value" }>();
  });

  it('{"key":"value"}|{key}', async () => {
    const query = '{"key":"value"}|{key}';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ key: "value" });
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ key: "value" }>();
  });

  it('[{"key":"value"}]{key}', async () => {
    const query = '[{"key":"value"}]{key}';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([{ key: "value" }]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      [{ key: "value" }]
    >();
  });

  it('[{"key":"value"}]|{key}', async () => {
    const query = '[{"key":"value"}]|{key}';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([{ key: "value" }]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      [{ key: "value" }]
    >();
  });

  it('*[_type == "foo"]{name}', async () => {
    const query = '*[_type == "foo"]{name}';
    const tree = parse(query);
    const dataset = [
      { _type: "foo", name: "Foo" },
      { _type: "bar", name: "Bar" },
    ] as const;
    const result = await (await evaluate(tree, { dataset })).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([{ name: "Foo" }]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: [
            { _type: "foo"; name: "Foo" },
            { _type: "bar"; name: "Bar" }
          ];
        }>
      >
    >().toStrictEqual<[{ name: "Foo" }]>();
  });

  it("$param->", async () => {
    const query = "$param->";
    const tree = parse(query);
    const dataset = [
      { _id: "bar", _type: "bar", value: BAR },
      { _id: "foo", _type: "foo", value: FOO },
    ] as const;
    const result = await (
      await evaluate(tree, {
        dataset,
        params: { param: { _type: "reference", _ref: "foo" } },
      })
    ).get();

    const desiredTree = {
      base: { name: "param", type: "Parameter" },
      type: "Deref",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ _id: "foo", _type: "foo", value: FOO });
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: (
            | { _id: "bar"; _type: "bar"; value: Bar }
            | { _id: "foo"; _type: "foo"; value: Foo }
          )[];
          parameters: { param: ReferenceValue<"foo"> };
        }>
      >
    >().toStrictEqual<{ _id: "foo"; _type: "foo"; value: Foo }>();
  });

  it("$param->value", async () => {
    const query = "$param->value";
    const tree = parse(query);
    const dataset = [
      { _id: "bar", _type: "bar", value: BAR },
      { _id: "foo", _type: "foo", value: FOO },
    ] as const;
    const result = await (
      await evaluate(tree, {
        dataset,
        params: { param: { _type: "reference", _ref: "foo" } },
      })
    ).get();

    const desiredTree = {
      base: { base: { name: "param", type: "Parameter" }, type: "Deref" },
      name: "value",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual(FOO);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: (
            | { _id: "bar"; _type: "bar"; value: Bar }
            | { _id: "foo"; _type: "foo"; value: Foo }
          )[];
          parameters: { param: ReferenceValue<"foo"> };
        }>
      >
    >().toStrictEqual<Foo>();
  });

  it("$param[]->value", async () => {
    const query = "$param[]->value";
    const tree = parse(query);
    const dataset = [
      { _id: "bar", _type: "bar", value: BAR },
      { _id: "foo", _type: "foo", value: FOO },
    ] as const;
    const result = await (
      await evaluate(tree, {
        dataset,
        params: { param: [{ _type: "reference", _ref: "foo" }] },
      })
    ).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([FOO]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: (
            | { _type: "bar"; value: Bar }
            | { _type: "foo"; value: Foo }
          )[];
          parameters: { param: ReferenceValue<"foo">[] };
        }>
      >
    >().toStrictEqual<Foo[]>();
  });

  it("$param-> (weak)", async () => {
    const query = "$param->";
    const tree = parse(query);
    const dataset = [
      { _id: "bar", _type: "bar", value: BAR },
      { _id: "foo", _type: "foo", value: FOO },
    ] as const;
    const result = await (
      await evaluate(tree, {
        dataset,
        params: { param: { _type: "reference", _ref: "foo", weak: true } },
      })
    ).get();

    const desiredTree = {
      base: { name: "param", type: "Parameter" },
      type: "Deref",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ _id: "foo", _type: "foo", value: FOO });
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: (
            | { _id: "bar"; _type: "bar"; value: Bar }
            | { _id: "foo"; _type: "foo"; value: Foo }
          )[];
          parameters: { param: ReferenceValue<"foo"> & { weak: true } };
        }>
      >
    >().toStrictEqual<{ _id: "foo"; _type: "foo"; value: Foo } | null>();
  });

  it("$param->value (weak)", async () => {
    const query = "$param->value";
    const tree = parse(query);
    const dataset = [
      { _id: "bar", _type: "bar", value: BAR },
      { _id: "foo", _type: "foo", value: FOO },
    ] as const;
    const result = await (
      await evaluate(tree, {
        dataset,
        params: { param: { _type: "reference", _ref: "foo", weak: true } },
      })
    ).get();

    const desiredTree = {
      base: { base: { name: "param", type: "Parameter" }, type: "Deref" },
      name: "value",
      type: "AccessAttribute",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual(FOO);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: (
            | { _id: "bar"; _type: "bar"; value: Bar }
            | { _id: "foo"; _type: "foo"; value: Foo }
          )[];
          parameters: { param: ReferenceValue<"foo"> & { weak: true } };
        }>
      >
    >().toStrictEqual<Foo | null>();
  });

  it("$param[]->value (weak)", async () => {
    const query = "$param[]->value";
    const tree = parse(query);
    const dataset = [{ _id: "bar", _type: "bar", value: BAR }] as const;
    const result = await (
      await evaluate(tree, {
        dataset,
        params: { param: [{ _type: "reference", _ref: "foo", weak: true }] },
      })
    ).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([null]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: (
            | { _type: "bar"; value: Bar }
            | { _type: "foo"; value: Foo }
          )[];
          parameters: {
            param: (ReferenceValue<"foo"> & { weak: true })[];
          };
        }>
      >
    >().toStrictEqual<(Foo | null)[]>();
  });
});
