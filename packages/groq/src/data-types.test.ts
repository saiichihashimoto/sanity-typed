import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { ReadonlyDeep } from "type-fest";

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
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      type: "Value",
      value: null,
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBeNull();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
  });

  it("true", async () => {
    const query = "true";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      type: "Value",
      value: true,
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(true);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
  });

  it("false", async () => {
    const query = "false";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      type: "Value",
      value: false,
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(false);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
  });

  it("5.6", async () => {
    const query = "5.6";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      type: "Value",
      value: 5.6,
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe(5.6);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<5.6>();
  });

  it('"double quoted string"', async () => {
    const query = '"double quoted string"';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      type: "Value",
      value: "double quoted string",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe("double quoted string");
    expectType<
      ExecuteQuery<typeof query>
    >().toStrictEqual<"double quoted string">();
  });

  it('"double\\" \\"quoted\\" \\"string\\""', async () => {
    const query = '"double\\" \\"quoted\\" \\"string\\""';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      type: "Value",
      value: 'double" "quoted" "string"',
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe('double" "quoted" "string"');
    expectType<
      ExecuteQuery<typeof query>
    >().toStrictEqual<'double" "quoted" "string"'>();
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
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      type: "Value",
      value: "single quoted string",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe("single quoted string");
    expectType<
      ExecuteQuery<typeof query>
    >().toStrictEqual<"single quoted string">();
  });

  it("'single\\' \\'quoted\\' \\'string'", async () => {
    const query = "'single\\' \\'quoted\\' \\'string'";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      type: "Value",
      value: "single' 'quoted' 'string",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toBe("single' 'quoted' 'string");
    expectType<
      ExecuteQuery<typeof query>
    >().toStrictEqual<"single' 'quoted' 'string">();
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
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      elements: [],
      type: "Array",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[]>();
  });

  it("[true]", async () => {
    const query = "[true]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      elements: [
        {
          isSplat: false,
          type: "ArrayElement",
          value: { type: "Value", value: true },
        },
      ],
      type: "Array",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([true]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true]>();
  });

  it("[true,]", async () => {
    const query = "[true,]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      elements: [
        {
          isSplat: false,
          type: "ArrayElement",
          value: { type: "Value", value: true },
        },
      ],
      type: "Array",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([true]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true]>();
  });

  it("[true,false]", async () => {
    const query = "[true,false]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([true, false]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
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
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([
      null,
      true,
      false,
      5.6,
      "double quoted string",
      "single quoted string",
    ]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      [null, true, false, 5.6, "double quoted string", "single quoted string"]
    >();
  });

  it("[...[null]]", async () => {
    const query = "[...[null]]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual([null]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[null]>();
  });

  it("[[null,null],[null,null]]", async () => {
    const query = "[[null,null],[null,null]]";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>()
      // TODO toStrictEqual
      .toBeAssignableTo<typeof desiredTree>();

    expect(result).toStrictEqual([
      [null, null],
      [null, null],
    ]);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      [[null, null], [null, null]]
    >();
  });

  it("{}", async () => {
    const query = "{}";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      attributes: [],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({});
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      NonNullable<unknown>
    >();
  });

  it('{"foo":"bar"}', async () => {
    const query = '{"foo":"bar"}';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      attributes: [
        {
          name: "foo",
          type: "ObjectAttributeValue",
          value: { type: "Value", value: "bar" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ foo: "bar" });
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ foo: "bar" }>();
  });

  it('{"foo":"bar",}', async () => {
    const query = '{"foo":"bar",}';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      attributes: [
        {
          name: "foo",
          type: "ObjectAttributeValue",
          value: { type: "Value", value: "bar" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ foo: "bar" });
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ foo: "bar" }>();
  });

  it('{"foo":"bar","baz":"qux"}', async () => {
    const query = '{"foo":"bar","baz":"qux"}';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({
      baz: "qux",
      foo: "bar",
    });
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{
      baz: "qux";
      foo: "bar";
    }>();
  });

  it("{foo}", async () => {
    const query = "{foo}";
    const tree = parse(query);
    const result = await (await evaluate(tree, { root: { foo: "bar" } })).get();

    const desiredTree = {
      attributes: [
        {
          name: "foo",
          type: "ObjectAttributeValue",
          value: { name: "foo", type: "AccessAttribute" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ foo: "bar" });
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: { foo: "bar" } }>
      >
    >().toStrictEqual<{ foo: "bar" }>();
  });

  it("{foo,}", async () => {
    const query = "{foo,}";
    const tree = parse(query);
    const result = await (await evaluate(tree, { root: { foo: "bar" } })).get();

    const desiredTree = {
      attributes: [
        {
          name: "foo",
          type: "ObjectAttributeValue",
          value: { name: "foo", type: "AccessAttribute" },
        },
      ],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ foo: "bar" });
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: { foo: "bar" } }>
      >
    >().toStrictEqual<{ foo: "bar" }>();
  });

  it("{foo,baz}", async () => {
    const query = "{foo,baz}";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { root: { baz: "qux", foo: "bar" } })
    ).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ baz: "qux", foo: "bar" });
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: { baz: "qux"; foo: "bar" } }>
      >
    >().toStrictEqual<{ baz: "qux"; foo: "bar" }>();
  });

  it('{...{"foo":"bar"}}', async () => {
    const query = '{...{"foo":"bar"}}';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ foo: "bar" });
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ foo: "bar" }>();
  });

  it('{...{"foo":"bar"},}', async () => {
    const query = '{...{"foo":"bar"},}';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ foo: "bar" });
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ foo: "bar" }>();
  });

  it('{...{"foo":"bar"},...{"baz":"qux"}}', async () => {
    const query = '{...{"foo":"bar"},...{"baz":"qux"}}';
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({
      baz: "qux",
      foo: "bar",
    });
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{
      baz: "qux";
      foo: "bar";
    }>();
  });

  it("{...}", async () => {
    const query = "{...}";
    const tree = parse(query);
    const result = await (await evaluate(tree, { root: { foo: "bar" } })).get();

    const desiredTree = {
      attributes: [{ type: "ObjectSplat", value: { type: "This" } }],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ foo: "bar" });
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: { foo: "bar" } }>
      >
    >().toStrictEqual<{ foo: "bar" }>();
  });

  it("{...,}", async () => {
    const query = "{...,}";
    const tree = parse(query);
    const result = await (await evaluate(tree, { root: { foo: "bar" } })).get();

    const desiredTree = {
      attributes: [{ type: "ObjectSplat", value: { type: "This" } }],
      type: "Object",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ foo: "bar" });
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: { foo: "bar" } }>
      >
    >().toStrictEqual<{ foo: "bar" }>();
  });

  it('{...,"baz":"qux"}', async () => {
    const query = '{...,"baz":"qux"}';
    const tree = parse(query);
    const result = await (await evaluate(tree, { root: { foo: "bar" } })).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<ReadonlyDeep<Parse<typeof query>>>().toStrictEqual<
      typeof desiredTree
    >();

    expect(result).toStrictEqual({ baz: "qux", foo: "bar" });
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialScope<{ this: { foo: "bar" } }>
      >
    >().toStrictEqual<{ baz: "qux"; foo: "bar" }>();
  });
});
