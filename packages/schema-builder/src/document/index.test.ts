import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import { isFunction } from "lodash/fp";
import type { Merge } from "type-fest";
import { z } from "zod";

import { document } from ".";
import type { ParsedSanityDocument, SanityDocument } from ".";
import { boolean } from "../boolean";
import { sharedFields } from "../field";
import { string } from "../string";
import { expectType, mockRule } from "../test-utils";
import type { InferValue } from "../types";

describe("document", () => {
  it("builds a sanity config", () =>
    expect(
      document({
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
      type: "document",
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
      document({
        name: "foo",
        title: "Foo",
        fields: [
          {
            name: "foo",
            type: boolean(),
          },
        ],
      }).schema()
    ).toHaveProperty("title", "Foo"));

  it("parses into an document", () => {
    const type = document({
      name: "foo",
      fields: [
        {
          name: "foo",
          type: boolean(),
        },
      ],
    });

    const value = {
      _createdAt: "2022-06-03T03:24:55.395Z",
      _id: "2106a34f-315f-44bc-929b-bf8e9a3eba0d",
      _rev: "somerevstring",
      _type: "foo",
      _updatedAt: "2022-06-03T03:24:55.395Z",
      foo: true,
    } as InferValue<typeof type>;
    const parsedValue = type.parse(value);

    expectType<typeof value>().toStrictEqual<
      Merge<SanityDocument<"foo">, { foo: boolean }>
    >();
    expectType<typeof parsedValue>().toStrictEqual<
      Merge<ParsedSanityDocument<"foo">, { foo: boolean }>
    >();

    expect(parsedValue).toStrictEqual({
      ...value,
      _createdAt: new Date("2022-06-03T03:24:55.395Z"),
      _updatedAt: new Date("2022-06-03T03:24:55.395Z"),
    });
  });

  it("resolves into an object", () => {
    const type = document({
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

    const value = {
      _createdAt: "2022-06-03T03:24:55.395Z",
      _id: "2106a34f-315f-44bc-929b-bf8e9a3eba0d",
      _rev: "somerevstring",
      _type: "foo",
      _updatedAt: "2022-06-03T03:24:55.395Z",
      foo: true,
    } as InferValue<typeof type>;
    const resolvedValue = type.resolve(value);

    expectType<typeof value>().toStrictEqual<
      Merge<SanityDocument<"foo">, { foo: boolean }>
    >();
    expectType<typeof resolvedValue>().toStrictEqual<
      Merge<ParsedSanityDocument<"foo">, { foo: string }>
    >();

    expect(resolvedValue).toStrictEqual({
      ...value,
      _createdAt: new Date("2022-06-03T03:24:55.395Z"),
      _updatedAt: new Date("2022-06-03T03:24:55.395Z"),
      foo: "foo",
    });
  });

  it("allows optional fields", () => {
    const type = document({
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
    const fooValidation = schema.fields[0]?.validation;

    (!isFunction(fooValidation) ? () => {} : fooValidation)(fooRule);

    expect(fooRule.required).toHaveBeenCalledWith();

    const barRule = mockRule();
    const barValidation = schema.fields[1]?.validation;

    (!isFunction(barValidation) ? () => {} : barValidation)(barRule);

    expect(barRule.required).not.toHaveBeenCalledWith();

    const value = {
      _createdAt: "2022-06-03T03:24:55.395Z",
      _id: "2106a34f-315f-44bc-929b-bf8e9a3eba0d",
      _rev: "somerevstring",
      _type: "foo",
      _updatedAt: "2022-06-03T03:24:55.395Z",
      foo: true,
    } as InferValue<typeof type>;
    const parsedValue = type.parse(value);

    expectType<typeof value>().toStrictEqual<
      Merge<SanityDocument<"foo">, { bar?: string | undefined; foo: boolean }>
    >();
    expectType<typeof parsedValue>().toStrictEqual<
      Merge<
        ParsedSanityDocument<"foo">,
        { bar?: string | undefined; foo: boolean }
      >
    >();

    expect(parsedValue).toStrictEqual({
      ...value,
      _createdAt: new Date("2022-06-03T03:24:55.395Z"),
      _updatedAt: new Date("2022-06-03T03:24:55.395Z"),
    });
  });

  it("works with shared fields", () => {
    const fields = sharedFields([
      {
        name: "foo",
        type: boolean(),
      },
    ]);

    const type = document({
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

    expect(type.schema()).toHaveProperty("fields", [
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
  });

  it("mocks the field values", () => {
    const value = document({
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
    }).mock(faker);

    expect(value).toStrictEqual({
      _createdAt: expect.any(String),
      _id: expect.any(String),
      _rev: expect.any(String),
      _type: "foo",
      _updatedAt: expect.any(String),
      bar: expect.any(String),
      foo: expect.any(Boolean),
    });

    /* eslint-disable no-underscore-dangle -- Sanity fields have underscores */
    expect(new Date(value._createdAt).toString()).not.toBe("Invalid Date");
    expect(new Date(value._updatedAt).toString()).not.toBe("Invalid Date");
    z.string().uuid().parse(value._id);
    /* eslint-enable no-underscore-dangle */
  });

  it("allows defining the mocks", () =>
    expect([
      {
        _createdAt: "2022-06-03T03:24:55.395Z",
        _id: "2106a34f-315f-44bc-929b-bf8e9a3eba0d",
        _rev: "somerevstring",
        _type: "foo",
        _updatedAt: "2022-06-03T03:24:55.395Z",
        foo: true,
        bar: "foo",
      },
      {
        _createdAt: "2022-06-03T03:24:55.395Z",
        _id: "2106a34f-315f-44bc-929b-bf8e9a3eba0d",
        _rev: "somerevstring",
        _type: "foo",
        _updatedAt: "2022-06-03T03:24:55.395Z",
        foo: false,
        bar: "bar",
      },
    ] as const).toContainEqual(
      document({
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
            {
              _createdAt: "2022-06-03T03:24:55.395Z",
              _id: "2106a34f-315f-44bc-929b-bf8e9a3eba0d",
              _rev: "somerevstring",
              _type: "foo",
              _updatedAt: "2022-06-03T03:24:55.395Z",
              foo: true,
              bar: "foo",
            },
            {
              _createdAt: "2022-06-03T03:24:55.395Z",
              _id: "2106a34f-315f-44bc-929b-bf8e9a3eba0d",
              _rev: "somerevstring",
              _type: "foo",
              _updatedAt: "2022-06-03T03:24:55.395Z",
              foo: false,
              bar: "bar",
            },
          ] as const),
      }).mock(faker)
    ));

  it("sets preview.select", () =>
    expect(
      document({
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

  it("types prepare function", () => {
    const type = document({
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
          expectType<typeof selection>().toStrictEqual<
            Merge<
              SanityDocument<"foo">,
              { bar?: string; bleh: unknown; foo: string }
            >
          >();

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
      _createdAt: "2022-06-03T03:24:55.395Z",
      _id: "2106a34f-315f-44bc-929b-bf8e9a3eba0d",
      _rev: "somerevstring",
      _type: "foo",
      _updatedAt: "2022-06-03T03:24:55.395Z",
      bar: "someBar",
      foo: "someFoo",
    };

    expect(schema.preview?.prepare?.(value)).toStrictEqual({
      title: "someFoo",
      subtitle: "someBar",
    });
  });

  it("allows defining the zod", () => {
    const type = document({
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

    const value = {
      _createdAt: "2022-06-03T03:24:55.395Z",
      _id: "2106a34f-315f-44bc-929b-bf8e9a3eba0d",
      _rev: "somerevstring",
      _type: "foo",
      _updatedAt: "2022-06-03T03:24:55.395Z",
      foo: true,
    };
    const parsedValue = type.parse(value);

    expectType<typeof parsedValue>().toStrictEqual<
      [string, Date | string | 0 | 1][]
    >();

    expect(parsedValue).toStrictEqual(
      expect.arrayContaining([
        ["_createdAt", new Date("2022-06-03T03:24:55.395Z")],
        ["_id", "2106a34f-315f-44bc-929b-bf8e9a3eba0d"],
        ["_rev", "somerevstring"],
        ["_type", "foo"],
        ["_updatedAt", new Date("2022-06-03T03:24:55.395Z")],
        ["foo", 1],
      ])
    );
  });

  it("types custom validation", () => {
    const type = document({
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
            | {
                _createdAt: string;
                _id: string;
                _rev: string;
                _type: "foo";
                _updatedAt: string;
                bar: string;
                foo?: boolean | undefined;
              }
            | undefined
          >();

          return !value?.bar || "Needs an empty bar";
        }),
    });

    const rule = mockRule();

    type.schema().validation?.(rule);

    expect(rule.custom).toHaveBeenCalledWith(expect.any(Function));
  });
});
