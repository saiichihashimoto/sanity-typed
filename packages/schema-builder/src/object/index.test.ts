import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { object } from ".";
import { boolean } from "../boolean";
import { sharedFields } from "../field";
import { string } from "../string";
import { mockRule } from "../test-utils";
import type { InferValue } from "../types";

describe("object", () => {
  it("builds a sanity config", () =>
    expect(
      object({
        fields: [
          {
            name: "foo",
            type: boolean(),
          },
        ],
      }).schema()
    ).toStrictEqual({
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
      object({
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
    const type = object({
      fields: [
        {
          name: "foo",
          type: boolean(),
        },
      ],
    });

    const value = { foo: true } as InferValue<typeof type>;
    const parsedValue = type.parse(value);

    expectType<typeof value>().toStrictEqual<{ foo: boolean }>();
    expectType<typeof parsedValue>().toStrictEqual<{ foo: boolean }>();

    expect(parsedValue).toStrictEqual(value);
  });

  it("resolves into an object", () => {
    const type = object({
      fields: [
        {
          name: "foo",
          type: boolean({
            zodResolved: (zod) => zod.transform(() => "foo"),
          }),
        },
      ],
    });

    const value = { foo: true } as InferValue<typeof type>;
    const resolvedValue = type.resolve(value);

    expectType<typeof value>().toStrictEqual<{ foo: boolean }>();
    expectType<typeof resolvedValue>().toStrictEqual<{ foo: string }>();

    expect(resolvedValue).toStrictEqual({ foo: "foo" });
  });

  it("allows optional fields", () => {
    const type = object({
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

    const value = { foo: true } as InferValue<typeof type>;
    const parsedValue = type.parse(value);

    expectType<typeof value>().toStrictEqual<{
      bar?: string | undefined;
      foo: boolean;
    }>();
    expectType<typeof parsedValue>().toStrictEqual<{
      bar?: string | undefined;
      foo: boolean;
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

    const type = object({
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

    const value = { foo: true } as InferValue<typeof type>;
    const parsedValue = type.parse(value);

    expectType<typeof value>().toStrictEqual<{
      bar?: string | undefined;
      foo: boolean;
    }>();
    expectType<typeof parsedValue>().toStrictEqual<{
      bar?: string | undefined;
      foo: boolean;
    }>();

    expect(parsedValue).toStrictEqual(value);
  });

  it("mocks the field values", () =>
    expect(
      object({
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

      return { fields };
    };

    expect(object(objectDef()).mock(faker)).toStrictEqual(
      object(objectDef()).mock(faker)
    );
    expect(object(objectDef()).mock(faker, ".foo")).toStrictEqual(
      object(objectDef()).mock(faker, ".foo")
    );

    expect(object(objectDef()).mock(faker, ".foo")).not.toStrictEqual(
      object(objectDef()).mock(faker)
    );
    expect(object(objectDef()).mock(faker)).not.toStrictEqual(
      object(objectDef()).mock(faker, ".foo")
    );
  });

  it("allows defining the mocks", () =>
    expect([
      { foo: true, bar: "foo" },
      { foo: false, bar: "bar" },
    ]).toContainEqual(
      object({
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
            { foo: true, bar: "foo" },
            { foo: false, bar: "bar" },
          ]),
      }).mock(faker)
    ));

  it("sets preview.select", () =>
    expect(
      object({
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

  it("types prepare function", () => {
    const type = object({
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
      bar: "someBar",
      foo: "someFoo",
    };

    expect(schema.preview?.prepare?.(value)).toStrictEqual({
      title: "someFoo",
      subtitle: "someBar",
    });
  });

  it("allows defining the zod", () => {
    const type = object({
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

    const value = { foo: true };
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<[string, 0 | 1][]>();

    expect(parsedValue).toStrictEqual([["foo", 1]]);
  });

  it("types custom validation", () => {
    const type = object({
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
            { bar: string; foo?: boolean } | undefined
          >();

          return !value?.bar || "Needs an empty bar";
        }),
    });

    const rule = mockRule();

    type.schema().validation?.(rule);

    expect(rule.custom).toHaveBeenCalledWith(expect.any(Function));
  });
});
