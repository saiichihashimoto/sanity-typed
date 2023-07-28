import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";

describe("base case", () => {
  it('""', () => {
    const query = "";

    expectType<Parse<typeof query>>().toBeNever();
    expectType<ExecuteQuery<typeof query>>().toBeNever();
  });
});

describe("data types", () => {
  it("null", () => {
    const query = "null";

    expectType<Parse<typeof query>>().toStrictEqual<{
      type: "Value";
      value: null;
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
  });

  it("true", () => {
    const query = "true";

    expectType<Parse<typeof query>>().toStrictEqual<{
      type: "Value";
      value: true;
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
  });

  it("false", () => {
    const query = "false";

    expectType<Parse<typeof query>>().toStrictEqual<{
      type: "Value";
      value: false;
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
  });

  it("-5.6", () => {
    const query = "-5.6";

    expectType<Parse<typeof query>>().toStrictEqual<{
      type: "Value";
      value: -5.6;
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<-5.6>();
  });

  it('"double quoted string"', () => {
    const query = '"double quoted string"';

    expectType<Parse<typeof query>>().toStrictEqual<{
      type: "Value";
      value: "double quoted string";
    }>();
    expectType<
      ExecuteQuery<typeof query>
    >().toStrictEqual<"double quoted string">();
  });

  it('"double\\" \\"quoted\\" \\"string\\"', () => {
    const query = '"double\\" \\"quoted\\" \\"string\\"';

    expectType<Parse<typeof query>>().toStrictEqual<{
      type: "Value";
      value: 'double\\" \\"quoted\\" \\"string\\';
    }>();
    expectType<
      ExecuteQuery<typeof query>
    >().toStrictEqual<'double\\" \\"quoted\\" \\"string\\'>();
  });

  it('"double" "quoted" "string"', () => {
    const query = '"double" "quoted" "string"';

    expectType<Parse<typeof query>>().toBeNever();
    expectType<ExecuteQuery<typeof query>>().toBeNever();
  });

  it("'single quoted string'", () => {
    const query = "'single quoted string'";

    expectType<Parse<typeof query>>().toStrictEqual<{
      type: "Value";
      value: "single quoted string";
    }>();
    expectType<
      ExecuteQuery<typeof query>
    >().toStrictEqual<"single quoted string">();
  });

  it("'single\\' \\'quoted\\' \\'string'", () => {
    const query = "'single\\' \\'quoted\\' \\'string'";

    expectType<Parse<typeof query>>().toStrictEqual<{
      type: "Value";
      value: "single\\' \\'quoted\\' \\'string";
    }>();
    expectType<
      ExecuteQuery<typeof query>
    >().toStrictEqual<"single\\' \\'quoted\\' \\'string">();
  });

  it("'single' 'quoted' 'string'", () => {
    const query = "'single' 'quoted' 'string'";

    expectType<Parse<typeof query>>().toBeNever();
    expectType<ExecuteQuery<typeof query>>().toBeNever();
  });

  it("[]", () => {
    const query = "[]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      elements: [];
      type: "Array";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[]>();
  });

  it("[true]", () => {
    const query = "[true]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      elements: [
        {
          isSplat: false;
          type: "ArrayElement";
          value: { type: "Value"; value: true };
        }
      ];
      type: "Array";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true]>();
  });

  it("[true,]", () => {
    const query = "[true,]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      elements: [
        {
          isSplat: false;
          type: "ArrayElement";
          value: { type: "Value"; value: true };
        }
      ];
      type: "Array";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true]>();
  });

  it("[true,false]", () => {
    const query = "[true,false]";

    expectType<Parse<typeof query>>().toStrictEqual<{
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
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[true, false]>();
  });

  it("[1,[]", () => {
    const query = "[1,[]";

    expectType<Parse<typeof query>>().toBeNever();
    expectType<ExecuteQuery<typeof query>>().toBeNever();
  });

  it("[null,true,false,-5.6,\"double quoted string\",'single quoted string']", () => {
    const query =
      "[null,true,false,-5.6,\"double quoted string\",'single quoted string']";

    expectType<Parse<typeof query>>().toStrictEqual<{
      elements: [
        {
          isSplat: false;
          type: "ArrayElement";
          value: { type: "Value"; value: null };
        },
        {
          isSplat: false;
          type: "ArrayElement";
          value: { type: "Value"; value: true };
        },
        {
          isSplat: false;
          type: "ArrayElement";
          value: { type: "Value"; value: false };
        },
        {
          isSplat: false;
          type: "ArrayElement";
          value: { type: "Value"; value: -5.6 };
        },
        {
          isSplat: false;
          type: "ArrayElement";
          value: { type: "Value"; value: "double quoted string" };
        },
        {
          isSplat: false;
          type: "ArrayElement";
          value: { type: "Value"; value: "single quoted string" };
        }
      ];
      type: "Array";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      [null, true, false, -5.6, "double quoted string", "single quoted string"]
    >();
  });

  it("[...[null]]", () => {
    const query = "[...[null]]";

    expectType<Parse<typeof query>>().toStrictEqual<{
      elements: [
        {
          isSplat: true;
          type: "ArrayElement";
          value: {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              }
            ];
            type: "Array";
          };
        }
      ];
      type: "Array";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<[null]>();
  });

  it("[[null,null],[null,null]]", () => {
    const query = "[[null,null],[null,null]]";

    // FIXME
    expectType<Parse<typeof query>>().toStrictEqual<// @ts-expect-error -- FIXME
    {
      elements: [
        {
          isSplat: false;
          type: "ArrayElement";
          value: {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              }
            ];
            type: "Array";
          };
        },
        {
          isSplat: false;
          type: "ArrayElement";
          value: {
            elements: [
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              },
              {
                isSplat: false;
                type: "ArrayElement";
                value: { type: "Value"; value: null };
              }
            ];
            type: "Array";
          };
        }
      ];
      type: "Array";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      [[null, null], [null, null]]
    >();
  });

  it("{}", () => {
    const query = "{}";

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [];
      type: "Object";
    }>;
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{
      [x: string]: never;
    }>();
  });

  it('{"foo":"bar"}', () => {
    const query = '{"foo":"bar"}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [
        {
          name: "foo";
          type: "ObjectAttributeValue";
          value: { type: "Value"; value: "bar" };
        }
      ];
      type: "Object";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ foo: "bar" }>();
  });

  it('{"foo":"bar",}', () => {
    const query = '{"foo":"bar",}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [
        {
          name: "foo";
          type: "ObjectAttributeValue";
          value: { type: "Value"; value: "bar" };
        }
      ];
      type: "Object";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ foo: "bar" }>();
  });

  it('{"foo":"bar","baz":"qux"}', () => {
    const query = '{"foo":"bar","baz":"qux"}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [
        {
          name: "foo";
          type: "ObjectAttributeValue";
          value: { type: "Value"; value: "bar" };
        },
        {
          name: "baz";
          type: "ObjectAttributeValue";
          value: { type: "Value"; value: "qux" };
        }
      ];
      type: "Object";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{
      baz: "qux";
      foo: "bar";
    }>();
  });

  it("{foo}", () => {
    const query = "{foo}";

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [
        {
          name: "foo";
          type: "ObjectAttributeValue";
          value: { name: "foo"; type: "AccessAttribute" };
        }
      ];
      type: "Object";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: "bar" } }>
    >().toStrictEqual<{ foo: "bar" }>();
  });

  it("{foo,}", () => {
    const query = "{foo,}";

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [
        {
          name: "foo";
          type: "ObjectAttributeValue";
          value: { name: "foo"; type: "AccessAttribute" };
        }
      ];
      type: "Object";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: "bar" } }>
    >().toStrictEqual<{ foo: "bar" }>();
  });

  it("{foo,baz}", () => {
    const query = "{foo,baz}";

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [
        {
          name: "foo";
          type: "ObjectAttributeValue";
          value: { name: "foo"; type: "AccessAttribute" };
        },
        {
          name: "baz";
          type: "ObjectAttributeValue";
          value: { name: "baz"; type: "AccessAttribute" };
        }
      ];
      type: "Object";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { baz: "qux"; foo: "bar" } }>
    >().toStrictEqual<{ baz: "qux"; foo: "bar" }>();
  });

  it('{...{"foo":"bar"}}', () => {
    const query = '{...{"foo":"bar"}}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [
        {
          type: "ObjectSplat";
          value: {
            attributes: [
              {
                name: "foo";
                type: "ObjectAttributeValue";
                value: { type: "Value"; value: "bar" };
              }
            ];
            type: "Object";
          };
        }
      ];
      type: "Object";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ foo: "bar" }>();
  });

  it('{...{"foo":"bar"},}', () => {
    const query = '{...{"foo":"bar"},}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [
        {
          type: "ObjectSplat";
          value: {
            attributes: [
              {
                name: "foo";
                type: "ObjectAttributeValue";
                value: { type: "Value"; value: "bar" };
              }
            ];
            type: "Object";
          };
        }
      ];
      type: "Object";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{ foo: "bar" }>();
  });

  it('{...{"foo":"bar"},...{"baz":"qux"}}', () => {
    const query = '{...{"foo":"bar"},...{"baz":"qux"}}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [
        {
          type: "ObjectSplat";
          value: {
            attributes: [
              {
                name: "foo";
                type: "ObjectAttributeValue";
                value: { type: "Value"; value: "bar" };
              }
            ];
            type: "Object";
          };
        },
        {
          type: "ObjectSplat";
          value: {
            attributes: [
              {
                name: "baz";
                type: "ObjectAttributeValue";
                value: { type: "Value"; value: "qux" };
              }
            ];
            type: "Object";
          };
        }
      ];
      type: "Object";
    }>();
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<{
      baz: "qux";
      foo: "bar";
    }>();
  });

  it("{...}", () => {
    const query = "{...}";

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [{ type: "ObjectSplat"; value: { type: "This" } }];
      type: "Object";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: "bar" } }>
    >().toStrictEqual<{ foo: "bar" }>();
  });

  it("{...,}", () => {
    const query = "{...,}";

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [{ type: "ObjectSplat"; value: { type: "This" } }];
      type: "Object";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: "bar" } }>
    >().toStrictEqual<{ foo: "bar" }>();
  });

  it('{...,"baz":"qux"}', () => {
    const query = '{...,"baz":"qux"}';

    expectType<Parse<typeof query>>().toStrictEqual<{
      attributes: [
        { type: "ObjectSplat"; value: { type: "This" } },
        {
          name: "baz";
          type: "ObjectAttributeValue";
          value: { type: "Value"; value: "qux" };
        }
      ];
      type: "Object";
    }>();
    expectType<
      ExecuteQuery<typeof query, { this: { foo: "bar" } }>
    >().toStrictEqual<{ baz: "qux"; foo: "bar" }>();
  });
});
