import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import type { ReferenceValue } from "@sanity-typed/types";

import type { ExecuteQuery, Parse } from ".";

const FOO: unique symbol = Symbol("foo");
type Foo = typeof FOO;

const BAR: unique symbol = Symbol("bar");
type Bar = typeof BAR;

const BAZ: unique symbol = Symbol("baz");
type Baz = typeof BAZ;

describe("traversal operators", () => {
  it("foo.bar", () => {
    const query = "foo.bar";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { name: "foo"; type: "AccessAttribute" };
      name: "bar";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: { bar: Bar } } }>
    >().toStrictEqual<Bar>();
  });

  it("foo.bar.baz", () => {
    const query = "foo.bar.baz";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: { name: "foo"; type: "AccessAttribute" };
        name: "bar";
        type: "AccessAttribute";
      };
      name: "baz";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: { bar: { baz: Baz } } } }>
    >().toStrictEqual<Baz>();
  });

  it('foo["bar"]', () => {
    const query = 'foo["bar"]';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { name: "foo"; type: "AccessAttribute" };
      name: "bar";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: { bar: Bar } } }>
    >().toStrictEqual<Bar>();
  });

  it('foo["bar"]["baz"]', () => {
    const query = 'foo["bar"]["baz"]';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: { name: "foo"; type: "AccessAttribute" };
        name: "bar";
        type: "AccessAttribute";
      };
      name: "baz";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: { bar: { baz: Baz } } } }>
    >().toStrictEqual<Baz>();
  });

  it('foo.bar["baz"]', () => {
    const query = 'foo.bar["baz"]';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: { name: "foo"; type: "AccessAttribute" };
        name: "bar";
        type: "AccessAttribute";
      };
      name: "baz";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: { bar: { baz: Baz } } } }>
    >().toStrictEqual<Baz>();
  });

  it('foo["bar"].baz', () => {
    const query = 'foo["bar"].baz';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: { name: "foo"; type: "AccessAttribute" };
        name: "bar";
        type: "AccessAttribute";
      };
      name: "baz";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: { bar: { baz: Baz } } } }>
    >().toStrictEqual<Baz>();
  });

  it("*.key", () => {
    const query = "*.key";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "Everything" };
      name: "key";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<typeof query, { dataset: ({ key: Bar } | { key: Foo })[] }>
    >().toStrictEqual<(Bar | Foo)[]>();
  });

  it('*["key"]', () => {
    const query = '*["key"]';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "Everything" };
      name: "key";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<typeof query, { dataset: ({ key: Bar } | { key: Foo })[] }>
    >().toStrictEqual<(Bar | Foo)[]>();
  });

  it("[true,false][1]", () => {
    const query = "[true,false][1]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        elements: [
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: true };
          },
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: false };
          }
        ];
        type: "Array";
      };
      index: 1;
      type: "AccessElement";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<false | true>();
  });

  it("*[1]", () => {
    const query = "*[1]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "Everything" };
      index: 1;
      type: "AccessElement";
    }>();
    expectType<
      ExecuteQuery<typeof query, { dataset: ({ key: Bar } | { key: Foo })[] }>
    >().toStrictEqual<{ key: Bar } | { key: Foo }>();
  });

  it("[[[5]]][0][0][0]", () => {
    const query = "[[[5]]][0][0][0]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: {
          base: {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: {
                  elements: [
                    {
                      isSplat: false;
                      type: "ArrayElement";
                      value: {
                        elements: [
                          {
                            isSplat: false;
                            type: "ArrayElement";
                            value: { type: "Value"; value: 5 };
                          }
                        ];
                        type: "Array";
                      };
                    }
                  ];
                  type: "Array";
                };
              }
            ];
            type: "Array";
          };
          index: 0;
          type: "AccessElement";
        };
        index: 0;
        type: "AccessElement";
      };
      index: 0;
      type: "AccessElement";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<5>();
  });

  it("[true,false][0..1]", () => {
    const query = "[true,false][0..1]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        elements: [
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: true };
          },
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: false };
          }
        ];
        type: "Array";
      };
      isInclusive: true;
      left: 0;
      right: 1;
      type: "Slice";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("[true,false][0...2]", () => {
    const query = "[true,false][0...2]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        elements: [
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: true };
          },
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: false };
          }
        ];
        type: "Array";
      };
      isInclusive: false;
      left: 0;
      right: 2;
      type: "Slice";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("*[0..10][1...9][3..4]", () => {
    const query = "*[0..10][1...9][3..4]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: {
          base: { type: "Everything" };
          isInclusive: true;
          left: 0;
          right: 10;
          type: "Slice";
        };
        isInclusive: false;
        left: 1;
        right: 9;
        type: "Slice";
      };
      isInclusive: true;
      left: 3;
      right: 4;
      type: "Slice";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        { dataset: ({ _type: "bar" } | { _type: "foo" })[] }
      >
    >().toStrictEqual<({ _type: "bar" } | { _type: "foo" })[]>();
  });

  it("false[true]", () => {
    const query = "false[true]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "Value"; value: false };
      expr: { type: "Value"; value: true };
      type: "Filter";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
  });

  it("[true,false][true]", () => {
    const query = "[true,false][true]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        elements: [
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: true };
          },
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: false };
          }
        ];
        type: "Array";
      };
      expr: { type: "Value"; value: true };
      type: "Filter";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("[true,false][false]", () => {
    const query = "[true,false][false]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        elements: [
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: true };
          },
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: false };
          }
        ];
        type: "Array";
      };
      expr: { type: "Value"; value: false };
      type: "Filter";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[]>();
  });

  it("[true,false][true][true][true]", () => {
    const query = "[true,false][true][true][true]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: {
          base: {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: true };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: false };
              }
            ];
            type: "Array";
          };
          expr: { type: "Value"; value: true };
          type: "Filter";
        };
        expr: { type: "Value"; value: true };
        type: "Filter";
      };
      expr: { type: "Value"; value: true };
      type: "Filter";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("*[true]", () => {
    const query = "*[true]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "Everything" };
      expr: { type: "Value"; value: true };
      type: "Filter";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        { dataset: ({ _type: "bar" } | { _type: "foo" })[] }
      >
    >().toStrictEqual<({ _type: "bar" } | { _type: "foo" })[]>();
  });

  it('*[_type=="foo"]', () => {
    const query = '*[_type=="foo"]';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "Everything" };
      expr: {
        left: { name: "_type"; type: "AccessAttribute" };
        op: "==";
        right: { type: "Value"; value: "foo" };
        type: "OpCall";
      };
      type: "Filter";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        { dataset: ({ _type: "bar" } | { _type: "foo" })[] }
      >
    >().toStrictEqual<{ _type: "foo" }[]>();
  });

  it('*[_type!="bar"][_type!="baz"][_type=="foo"]', () => {
    const query = '*[_type!="bar"][_type!="baz"][_type=="foo"]';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: {
          base: { type: "Everything" };
          expr: {
            left: { name: "_type"; type: "AccessAttribute" };
            op: "!=";
            right: { type: "Value"; value: "bar" };
            type: "OpCall";
          };
          type: "Filter";
        };
        expr: {
          left: { name: "_type"; type: "AccessAttribute" };
          op: "!=";
          right: { type: "Value"; value: "baz" };
          type: "OpCall";
        };
        type: "Filter";
      };
      expr: {
        left: { name: "_type"; type: "AccessAttribute" };
        op: "==";
        right: { type: "Value"; value: "foo" };
        type: "OpCall";
      };
      type: "Filter";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        { dataset: ({ _type: "bar" } | { _type: "baz" } | { _type: "foo" })[] }
      >
    >().toStrictEqual<{ _type: "foo" }[]>();
  });

  it("[true,false][]", () => {
    const query = "[true,false][]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        elements: [
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: true };
          },
          {
            isSplat: false;
            type: "ArrayElement";
            value: { type: "Value"; value: false };
          }
        ];
        type: "Array";
      };
      type: "ArrayCoerce";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("*[]", () => {
    const query = "*[]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "Everything" };
      type: "ArrayCoerce";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        { dataset: ({ _type: "bar" } | { _type: "foo" })[] }
      >
    >().toStrictEqual<({ _type: "bar" } | { _type: "foo" })[]>();
  });

  it("false[]", () => {
    const query = "false[]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "Value"; value: false };
      type: "ArrayCoerce";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
  });

  it('{"key":"value"}{key}', () => {
    const query = '{"key":"value"}{key}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        attributes: [
          {
            name: "key";
            type: "ObjectAttributeValue";
            value: { type: "Value"; value: "value" };
          }
        ];
        type: "Object";
      };
      expr: {
        attributes: [
          {
            name: "key";
            type: "ObjectAttributeValue";
            value: { name: "key"; type: "AccessAttribute" };
          }
        ];
        type: "Object";
      };
      type: "Projection";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ key: "value" }>();
  });

  it('{"key":"value"}|{key}', () => {
    const query = '{"key":"value"}|{key}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        attributes: [
          {
            name: "key";
            type: "ObjectAttributeValue";
            value: { type: "Value"; value: "value" };
          }
        ];
        type: "Object";
      };
      expr: {
        attributes: [
          {
            name: "key";
            type: "ObjectAttributeValue";
            value: { name: "key"; type: "AccessAttribute" };
          }
        ];
        type: "Object";
      };
      type: "Projection";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ key: "value" }>();
  });

  it('[{"key":"value"}]{key}', () => {
    const query = '[{"key":"value"}]{key}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        elements: [
          {
            isSplat: false;
            type: "ArrayElement";
            value: {
              attributes: [
                {
                  name: "key";
                  type: "ObjectAttributeValue";
                  value: { type: "Value"; value: "value" };
                }
              ];
              type: "Object";
            };
          }
        ];
        type: "Array";
      };
      expr: {
        attributes: [
          {
            name: "key";
            type: "ObjectAttributeValue";
            value: { name: "key"; type: "AccessAttribute" };
          }
        ];
        type: "Object";
      };
      type: "Projection";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      [{ key: "value" }]
    >();
  });

  it('[{"key":"value"}]|{key}', () => {
    const query = '[{"key":"value"}]|{key}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        elements: [
          {
            isSplat: false;
            type: "ArrayElement";
            value: {
              attributes: [
                {
                  name: "key";
                  type: "ObjectAttributeValue";
                  value: { type: "Value"; value: "value" };
                }
              ];
              type: "Object";
            };
          }
        ];
        type: "Array";
      };
      expr: {
        attributes: [
          {
            name: "key";
            type: "ObjectAttributeValue";
            value: { name: "key"; type: "AccessAttribute" };
          }
        ];
        type: "Object";
      };
      type: "Projection";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      [{ key: "value" }]
    >();
  });

  it("@->", () => {
    const query = "@->";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "This" };
      type: "Deref";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        {
          context: {
            dataset: (
              | { _type: "bar"; value: Bar }
              | { _type: "foo"; value: Foo }
            )[];
          };
          this: ReferenceValue<"foo">;
        }
      >
    >().toStrictEqual<{ _type: "foo"; value: Foo }>();
  });

  it("@->value", () => {
    const query = "@->value";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { base: { type: "This" }; type: "Deref" };
      name: "value";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        {
          context: {
            dataset: (
              | { _type: "bar"; value: Bar }
              | { _type: "foo"; value: Foo }
            )[];
          };
          this: ReferenceValue<"foo">;
        }
      >
    >().toStrictEqual<Foo>();
  });

  it("@[]->value", () => {
    const query = "@[]->value";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: { base: { type: "This" }; type: "ArrayCoerce" };
        type: "Deref";
      };
      name: "value";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        {
          context: {
            dataset: (
              | { _type: "bar"; value: Bar }
              | { _type: "foo"; value: Foo }
            )[];
          };
          this: ReferenceValue<"foo">[];
        }
      >
    >().toStrictEqual<Foo[]>();
  });

  it("@-> (weak)", () => {
    const query = "@->";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { type: "This" };
      type: "Deref";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        {
          context: {
            dataset: (
              | { _type: "bar"; value: Bar }
              | { _type: "foo"; value: Foo }
            )[];
          };
          this: ReferenceValue<"foo"> & { weak: true };
        }
      >
    >().toStrictEqual<{ _type: "foo"; value: Foo } | null>();
  });

  it("@->value (weak)", () => {
    const query = "@->value";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: { base: { type: "This" }; type: "Deref" };
      name: "value";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        {
          context: {
            dataset: (
              | { _type: "bar"; value: Bar }
              | { _type: "foo"; value: Foo }
            )[];
          };
          this: ReferenceValue<"foo"> & { weak: true };
        }
      >
    >().toStrictEqual<Foo | null>();
  });

  it("@[]->value (weak)", () => {
    const query = "@[]->value";

    expectType<Parse<typeof query>>().toStrictEqual<{
      base: {
        base: { base: { type: "This" }; type: "ArrayCoerce" };
        type: "Deref";
      };
      name: "value";
      type: "AccessAttribute";
    }>();
    expectType<
      ExecuteQuery<
        typeof query,
        {
          context: {
            dataset: (
              | { _type: "bar"; value: Bar }
              | { _type: "foo"; value: Foo }
            )[];
          };
          this: (ReferenceValue<"foo"> & { weak: true })[];
        }
      >
    >().toStrictEqual<(Foo | null)[]>();
  });
});
