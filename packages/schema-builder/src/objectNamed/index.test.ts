import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { objectNamed } from ".";
import { boolean } from "../boolean";
import { sharedFields } from "../field";
import { string } from "../string";
import { mockRule } from "../test-utils";
import type { InferValue } from "../types";

describe("object", () => {
  it("builds a sanity config", () =>
    expect(
      objectNamed({
        name: "foo",
        fields: [
          {
            name: "foo",
            type: boolean(),
          },
        ],
      }).schema()
    ).toStrictEqual({
      name: "foo",
      type: "object",
      preview: undefined,
      fields: [
        {
          name: "foo",
          type: "boolean",
          validation: expect.any(Function),
        },
      ],
    }));

  it("passes through schema values", () =>
    expect(
      objectNamed({
        name: "foo",
        fields: [
          {
            name: "foo",
            type: boolean(),
          },
        ],
        hidden: false,
      }).schema()
    ).toHaveProperty("hidden", false));

  it("parses into an object", () => {
    const type = objectNamed({
      name: "foo",
      fields: [
        {
          name: "foo",
          type: boolean(),
        },
      ],
    });

    const value = { _type: "foo", foo: true } as InferValue<typeof type>;
    const parsedValue = type.parse(value);

    expectType<typeof value>().toStrictEqual<{ _type: "foo"; foo: boolean }>();
    expectType<typeof parsedValue>().toStrictEqual<{
      _type: "foo";
      foo: boolean;
    }>();

    expect(parsedValue).toStrictEqual(value);
  });

  it("resolves into an object", () => {
    const type = objectNamed({
      name: "foo",
      fields: [
        {
          name: "foo",
          type: boolean({
            zodResolved: (zod) => zod.transform(() => "foo"),
          }),
        },
      ],
    });

    const value = { _type: "foo", foo: true } as InferValue<typeof type>;
    const resolvedValue = type.resolve(value);

    expectType<typeof value>().toStrictEqual<{ _type: "foo"; foo: boolean }>();
    expectType<typeof resolvedValue>().toStrictEqual<{
      _type: "foo";
      foo: string;
    }>();

    expect(resolvedValue).toStrictEqual({ _type: "foo", foo: "foo" });
  });

  it("allows optional fields", () => {
    const type = objectNamed({
      name: "foo",
      fields: [
        {
          name: "foo",
          type: boolean(),
        },
        {
          name: "bar",
          optional: true,
          type: string(),
        },
      ],
    });

    const schema = type.schema();

    expect(schema).toHaveProperty("fields", [
      {
        name: "foo",
        type: "boolean",
        validation: expect.any(Function),
      },
      {
        name: "bar",
        type: "string",
        validation: expect.any(Function),
      },
    ]);

    const fooRule = mockRule();

    schema.fields[0]?.validation?.(fooRule);

    expect(fooRule.required).toHaveBeenCalledWith();

    const barRule = mockRule();

    schema.fields[1]?.validation?.(barRule);

    expect(barRule.required).not.toHaveBeenCalledWith();

    const value = { _type: "foo", foo: true } as InferValue<typeof type>;
    const parsedValue = type.parse(value);

    expectType<typeof value>().toStrictEqual<{
      _type: "foo";
      bar?: string | undefined;
      foo: boolean;
    }>();
    expectType<typeof parsedValue>().toStrictEqual<{
      _type: "foo";
      bar?: string | undefined;
      foo: boolean;
    }>();

    expect(parsedValue).toStrictEqual(value);
  });

  it("makes a reference", () => {
    const type = objectNamed({
      name: "foo",
      fields: [{ name: "hello", type: string() }],
    });

    const type2 = objectNamed({
      name: "bar",
      fields: [{ name: "foo", type: type.namedType() }],
    });

    const schema = type2.schema();

    expect(schema.fields[0]).toStrictEqual({
      name: "foo",
      type: "foo",
      validation: expect.any(Function),
    });

    const value = {
      _type: "bar",
      foo: {
        _type: "foo",
        hello: "world",
      },
    } as InferValue<typeof type2>;
    const parsedValue = type2.parse(value);

    expectType<typeof value>().toStrictEqual<{
      _type: "bar";
      foo: { _type: "foo"; hello: string };
    }>();
    expectType<typeof parsedValue>().toStrictEqual<{
      _type: "bar";
      foo: { _type: "foo"; hello: string };
    }>();

    expect(parsedValue).toStrictEqual(value);
  });

  it("works with shared fields", () => {
    const fields = sharedFields([
      {
        name: "foo",
        type: boolean(),
      },
    ]);

    const type = objectNamed({
      name: "foo",
      fields: [
        ...fields,
        {
          name: "bar",
          optional: true,
          type: string(),
        },
      ],
    });

    const schema = type.schema();

    expect(schema).toHaveProperty("fields", [
      {
        name: "foo",
        type: "boolean",
        validation: expect.any(Function),
      },
      {
        name: "bar",
        type: "string",
        validation: expect.any(Function),
      },
    ]);

    const fooRule = mockRule();

    schema.fields[0]?.validation?.(fooRule);

    expect(fooRule.required).toHaveBeenCalledWith();

    const barRule = mockRule();

    schema.fields[1]?.validation?.(barRule);

    expect(barRule.required).not.toHaveBeenCalledWith();

    const value = { _type: "foo", foo: true } as InferValue<typeof type>;
    const parsedValue = type.parse(value);

    expectType<typeof value>().toStrictEqual<{
      _type: "foo";
      bar?: string | undefined;
      foo: boolean;
    }>();
    expectType<typeof parsedValue>().toStrictEqual<{
      _type: "foo";
      bar?: string | undefined;
      foo: boolean;
    }>();

    expect(parsedValue).toStrictEqual(value);
  });

  it("mocks the field values", () =>
    expect(
      objectNamed({
        name: "foo",
        fields: [
          {
            name: "foo",
            type: boolean(),
          },
          {
            name: "bar",
            type: string(),
          },
        ],
      }).mock(faker)
    ).toStrictEqual({
      _type: "foo",
      foo: expect.any(Boolean),
      bar: expect.any(String),
    }));

  it("mocks the same value with the same path", () => {
    const objectDef = () => {
      const field = {
        name: "foo",
        type: string(),
      };

      const fields: [typeof field] = [field];

      return { name: "foo", fields };
    };

    expect(objectNamed(objectDef()).mock(faker)).toStrictEqual(
      objectNamed(objectDef()).mock(faker)
    );
    expect(objectNamed(objectDef()).mock(faker, ".foo")).toStrictEqual(
      objectNamed(objectDef()).mock(faker, ".foo")
    );

    expect(objectNamed(objectDef()).mock(faker, ".foo")).not.toStrictEqual(
      objectNamed(objectDef()).mock(faker)
    );
    expect(objectNamed(objectDef()).mock(faker)).not.toStrictEqual(
      objectNamed(objectDef()).mock(faker, ".foo")
    );
  });

  it("allows defining the mocks", () =>
    expect([
      { _type: "foo", foo: true, bar: "foo" },
      { _type: "foo", foo: false, bar: "bar" },
    ]).toContainEqual(
      objectNamed({
        name: "foo",
        fields: [
          {
            name: "foo",
            type: boolean(),
          },
          {
            name: "bar",
            type: string(),
          },
        ],
        mock: (faker) =>
          faker.helpers.arrayElement([
            { _type: "foo", foo: true, bar: "foo" },
            { _type: "foo", foo: false, bar: "bar" },
          ] as const),
      }).mock(faker)
    ));

  it("sets preview.select", () =>
    expect(
      objectNamed({
        name: "foo",
        fields: [
          {
            name: "foo",
            type: boolean(),
          },
        ],
        preview: {
          select: {
            title: "someTitle",
            media: "someMedia",
          },
        },
      }).schema()
    ).toHaveProperty("preview", {
      select: {
        title: "someTitle",
        media: "someMedia",
      },
    }));

  it("allows a function selection value", () => {
    const type = objectNamed({
      name: "foo",
      fields: [
        {
          name: "foo",
          type: string(),
        },
        {
          name: "bar",
          optional: true,
          type: string(),
        },
      ],
      preview: {
        select: {
          bleh: "foo",
        },
        prepare: (selection) => {
          expectType<typeof selection>().toStrictEqual<{
            _type: "foo";
            bar?: string;
            bleh: unknown;
            foo: string;
          }>();

          const { foo, bar } = selection;

          return {
            title: foo,
            subtitle: bar,
          };
        },
      },
    });

    const schema = type.schema();

    const value = {
      _type: "foo",
      bar: "someBar",
      foo: "someFoo",
    };

    expect(schema.preview?.prepare?.(value)).toStrictEqual({
      title: "someFoo",
      subtitle: "someBar",
    });
  });

  it("allows defining the zod", () => {
    const type = objectNamed({
      name: "foo",
      fields: [
        {
          name: "foo",
          type: boolean({
            zod: (zod) => zod.transform((value) => (value ? 1 : 0)),
          }),
        },
      ],
      zod: (zod) => zod.transform((value) => Object.entries(value)),
    });

    const value = { _type: "foo", foo: true };

    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<[string, "foo" | 0 | 1][]>();

    expect(parsedValue).toStrictEqual(
      expect.arrayContaining([
        ["_type", "foo"],
        ["foo", 1],
      ])
    );
  });

  it("types custom validation", () => {
    const type = objectNamed({
      name: "foo",
      fields: [
        {
          name: "foo",
          optional: true,
          type: boolean(),
        },
        {
          name: "bar",
          type: string(),
        },
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          expectType<typeof value>().toStrictEqual<
            { _type: "foo"; bar: string; foo?: boolean } | undefined
          >();

          return !value?.bar || "Needs an empty bar";
        }),
    });

    const rule = mockRule();

    type.schema().validation?.(rule);

    expect(rule.custom).toHaveBeenCalledWith(expect.any(Function));
  });

  it("handles deep references", () => {
    const type = objectNamed({
      name: "type",
      title: "Title",
      fields: [
        {
          name: "value",
          title: "Value",
          type: string(),
        },
      ],
    });

    const value = {
      _type: "type",
      value: "foo",
    };

    const referencingType = objectNamed({
      name: "referencingType",
      title: "Referencing Title",
      fields: [
        {
          name: "value",
          title: "Values",
          type: type.namedType(),
        },
      ],
    });

    const referencingValue = {
      _type: "referencingType",
      value,
    } as InferValue<typeof referencingType>;

    const deepReferencingType = objectNamed({
      name: "deepReferencingType",
      title: "Deep Referencing Title",
      fields: [
        {
          name: "referencingValue",
          type: referencingType.namedType(),
        },
      ],
    });

    // TS2589: Type instantiation is excessively deep and possibly infinite.
    const deepReferencingValue = {
      _type: "deepReferencingType",
      referencingValue,
    } as InferValue<typeof deepReferencingType>;

    expectType<typeof referencingValue>().toStrictEqual<{
      _type: "referencingType";
      value: { _type: "type"; value: string };
    }>();
    expectType<typeof deepReferencingValue>().toStrictEqual<{
      _type: "deepReferencingType";
      referencingValue: {
        _type: "referencingType";
        value: { _type: "type"; value: string };
      };
    }>();

    expect(deepReferencingValue).toStrictEqual(
      deepReferencingType.parse(deepReferencingValue)
    );
  });
});
