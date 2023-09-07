import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { WritableDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse, _ScopeFromPartialScope } from ".";

describe("base case", () => {
  it('""', async () => {
    const query = "";

    expect(() => parse(query)).toThrow();
    expectType<Parse<typeof query>>().toBeNever();

    expectType<ExecuteQuery<typeof query>>().toBeNever();
  });
});

describe("data types", () => {
  it("null", async () => {
    const query = "null";

    const tree = parse(query);

    const expectedTree = {
      type: "Value",
      value: null,
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

  it("true", async () => {
    const query = "true";

    const tree = parse(query);

    const expectedTree = {
      type: "Value",
      value: true,
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = true as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("false", async () => {
    const query = "false";

    const tree = parse(query);

    const expectedTree = {
      type: "Value",
      value: false,
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = false as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("5.6", async () => {
    const query = "5.6";

    const tree = parse(query);

    const expectedTree = {
      type: "Value",
      value: 5.6,
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 5.6 as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('"double quoted string"', async () => {
    const query = '"double quoted string"';

    const tree = parse(query);

    const expectedTree = {
      type: "Value",
      value: "double quoted string",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "double quoted string" as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('"double\\" \\"quoted\\" \\"string\\""', async () => {
    const query = '"double\\" \\"quoted\\" \\"string\\""';

    const tree = parse(query);

    const expectedTree = {
      type: "Value",
      value: 'double" "quoted" "string"',
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 'double" "quoted" "string"' as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('"double" "quoted" "string"', async () => {
    const query = '"double" "quoted" "string"';

    expect(() => parse(query)).toThrow();
    expectType<Parse<typeof query>>().toBeNever();

    expectType<ExecuteQuery<typeof query>>().toBeNever();
  });

  it("'single quoted string'", async () => {
    const query = "'single quoted string'";

    const tree = parse(query);

    const expectedTree = {
      type: "Value",
      value: "single quoted string",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "single quoted string" as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("'single\\' \\'quoted\\' \\'string'", async () => {
    const query = "'single\\' \\'quoted\\' \\'string'";

    const tree = parse(query);

    const expectedTree = {
      type: "Value",
      value: "single' 'quoted' 'string",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = "single' 'quoted' 'string" as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("'single' 'quoted' 'string'", async () => {
    const query = "'single' 'quoted' 'string'";

    expect(() => parse(query)).toThrow();
    expectType<Parse<typeof query>>().toBeNever();

    expectType<ExecuteQuery<typeof query>>().toBeNever();
  });

  it("[]", async () => {
    const query = "[]";

    const tree = parse(query);

    const expectedTree = {
      elements: [],
      type: "Array",
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

  it("[true]", async () => {
    const query = "[true]";

    const tree = parse(query);

    const expectedTree = {
      elements: [
        {
          isSplat: false,
          type: "ArrayElement",
          value: { type: "Value", value: true },
        },
      ],
      type: "Array",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [true] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("[true,]", async () => {
    const query = "[true,]";

    const tree = parse(query);

    const expectedTree = {
      elements: [
        {
          isSplat: false,
          type: "ArrayElement",
          value: { type: "Value", value: true },
        },
      ],
      type: "Array",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [true] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("[true,false]", async () => {
    const query = "[true,false]";

    const tree = parse(query);

    const expectedTree = {
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

  it("[1,[]", async () => {
    const query = "[1,[]";

    expect(() => parse(query)).toThrow();
    expectType<Parse<typeof query>>().toBeNever();

    expectType<ExecuteQuery<typeof query>>().toBeNever();
  });

  it("[null,true,false,5.6,\"double quoted string\",'single quoted string']", async () => {
    const query =
      "[null,true,false,5.6,\"double quoted string\",'single quoted string']";

    const tree = parse(query);

    const expectedTree = {
      elements: [
        {
          isSplat: false,
          type: "ArrayElement",
          value: { type: "Value", value: null },
        },
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
        {
          isSplat: false,
          type: "ArrayElement",
          value: { type: "Value", value: 5.6 },
        },
        {
          isSplat: false,
          type: "ArrayElement",
          value: { type: "Value", value: "double quoted string" },
        },
        {
          isSplat: false,
          type: "ArrayElement",
          value: { type: "Value", value: "single quoted string" },
        },
      ],
      type: "Array",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [
      null,
      true,
      false,
      5.6,
      "double quoted string",
      "single quoted string",
    ] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("[...[null]]", async () => {
    const query = "[...[null]]";

    const tree = parse(query);

    const expectedTree = {
      elements: [
        {
          isSplat: true,
          type: "ArrayElement",
          value: {
            elements: [
              {
                isSplat: false,
                type: "ArrayElement",
                value: { type: "Value", value: null },
              },
            ],
            type: "Array",
          },
        },
      ],
      type: "Array",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [null] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("[[null,null],[null,null]]", async () => {
    const query = "[[null,null],[null,null]]";

    const tree = parse(query);

    const expectedTree = {
      elements: [
        {
          isSplat: false,
          type: "ArrayElement",
          value: {
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
            ],
            type: "Array",
          },
        },
        {
          isSplat: false,
          type: "ArrayElement",
          value: {
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
            ],
            type: "Array",
          },
        },
      ],
      type: "Array",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>()
      // TODO toStrictEqual
      .toBeAssignableTo<WritableDeep<typeof expectedTree>>();

    const result = await (await evaluate(tree)).get();

    const expectedResult = [
      [null, null],
      [null, null],
    ] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("{}", async () => {
    const query = "{}";

    const tree = parse(query);

    const expectedTree = {
      attributes: [],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = {} as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('{"foo":"bar"}', async () => {
    const query = '{"foo":"bar"}';

    const tree = parse(query);

    const expectedTree = {
      attributes: [
        {
          name: "foo",
          type: "ObjectAttributeValue",
          value: { type: "Value", value: "bar" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = { foo: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('{"foo":"bar",}', async () => {
    const query = '{"foo":"bar",}';

    const tree = parse(query);

    const expectedTree = {
      attributes: [
        {
          name: "foo",
          type: "ObjectAttributeValue",
          value: { type: "Value", value: "bar" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = { foo: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('{"foo":"bar","baz":"qux"}', async () => {
    const query = '{"foo":"bar","baz":"qux"}';

    const tree = parse(query);

    const expectedTree = {
      attributes: [
        {
          name: "foo",
          type: "ObjectAttributeValue",
          value: { type: "Value", value: "bar" },
        },
        {
          name: "baz",
          type: "ObjectAttributeValue",
          value: { type: "Value", value: "qux" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = { baz: "qux", foo: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("{foo}", async () => {
    const query = "{foo}";

    const tree = parse(query);

    const expectedTree = {
      attributes: [
        {
          name: "foo",
          type: "ObjectAttributeValue",
          value: { name: "foo", type: "AccessAttribute" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { foo: "bar" } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = { foo: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: WritableDeep<typeof root> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("{foo,}", async () => {
    const query = "{foo,}";

    const tree = parse(query);

    const expectedTree = {
      attributes: [
        {
          name: "foo",
          type: "ObjectAttributeValue",
          value: { name: "foo", type: "AccessAttribute" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { foo: "bar" } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = { foo: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: WritableDeep<typeof root> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("{foo,baz}", async () => {
    const query = "{foo,baz}";

    const tree = parse(query);

    const expectedTree = {
      attributes: [
        {
          name: "foo",
          type: "ObjectAttributeValue",
          value: { name: "foo", type: "AccessAttribute" },
        },
        {
          name: "baz",
          type: "ObjectAttributeValue",
          value: { name: "baz", type: "AccessAttribute" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { baz: "qux", foo: "bar" } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = { baz: "qux", foo: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: WritableDeep<typeof root> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it('{...{"foo":"bar"}}', async () => {
    const query = '{...{"foo":"bar"}}';

    const tree = parse(query);

    const expectedTree = {
      attributes: [
        {
          type: "ObjectSplat",
          value: {
            attributes: [
              {
                name: "foo",
                type: "ObjectAttributeValue",
                value: { type: "Value", value: "bar" },
              },
            ],
            type: "Object",
          },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = { foo: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('{...{"foo":"bar"},}', async () => {
    const query = '{...{"foo":"bar"},}';

    const tree = parse(query);

    const expectedTree = {
      attributes: [
        {
          type: "ObjectSplat",
          value: {
            attributes: [
              {
                name: "foo",
                type: "ObjectAttributeValue",
                value: { type: "Value", value: "bar" },
              },
            ],
            type: "Object",
          },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = { foo: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it('{...{"foo":"bar"},...{"baz":"qux"}}', async () => {
    const query = '{...{"foo":"bar"},...{"baz":"qux"}}';

    const tree = parse(query);

    const expectedTree = {
      attributes: [
        {
          type: "ObjectSplat",
          value: {
            attributes: [
              {
                name: "foo",
                type: "ObjectAttributeValue",
                value: { type: "Value", value: "bar" },
              },
            ],
            type: "Object",
          },
        },
        {
          type: "ObjectSplat",
          value: {
            attributes: [
              {
                name: "baz",
                type: "ObjectAttributeValue",
                value: { type: "Value", value: "qux" },
              },
            ],
            type: "Object",
          },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = { foo: "bar", baz: "qux" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("{...}", async () => {
    const query = "{...}";

    const tree = parse(query);

    const expectedTree = {
      attributes: [{ type: "ObjectSplat", value: { type: "This" } }],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { foo: "bar" } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = { foo: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: WritableDeep<typeof root> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("{...,}", async () => {
    const query = "{...,}";

    const tree = parse(query);

    const expectedTree = {
      attributes: [{ type: "ObjectSplat", value: { type: "This" } }],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { foo: "bar" } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = { foo: "bar" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: WritableDeep<typeof root> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it('{...,"baz":"qux"}', async () => {
    const query = '{...,"baz":"qux"}';

    const tree = parse(query);

    const expectedTree = {
      attributes: [
        { type: "ObjectSplat", value: { type: "This" } },
        {
          name: "baz",
          type: "ObjectAttributeValue",
          value: { type: "Value", value: "qux" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const root = { foo: "bar" } as const;

    const result = await (await evaluate(tree, { root })).get();

    const expectedResult = { foo: "bar", baz: "qux" } as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: WritableDeep<typeof root> }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });
});
