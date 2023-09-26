import { base, en } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";

import { _sanityConfigToFaker } from ".";

describe("consistency", () => {
  it("mocks identical documents each time", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "bar",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    });
    const sanityFaker1 = _sanityConfigToFaker(config, {
      faker: { locale: [en, base] },
    });
    const sanityFaker2 = _sanityConfigToFaker(config, {
      faker: { locale: [en, base] },
    });

    expect(sanityFaker1.foo()).toStrictEqual(sanityFaker2.foo());
    expect(sanityFaker1.foo()).toStrictEqual(sanityFaker2.foo());
    expect(sanityFaker1.foo()).toStrictEqual(sanityFaker2.foo());
  });

  it("mocks identical documents regardless of other types", () => {
    const config1 = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "bar",
            type: "boolean",
          }),
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "bar",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    });
    const sanityFaker1 = _sanityConfigToFaker(config1, {
      faker: { locale: [en, base] },
    });

    const config2 = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "bar",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
          defineType({
            name: "baz",
            type: "number",
          }),
        ],
      },
    });
    const sanityFaker2 = _sanityConfigToFaker(config2, {
      faker: { locale: [en, base] },
    });

    sanityFaker1.bar();
    sanityFaker2.baz();
    expect(sanityFaker1.foo()).toStrictEqual(sanityFaker2.foo());
    sanityFaker1.bar();
    sanityFaker2.baz();
    sanityFaker1.bar();
    sanityFaker2.baz();
    expect(sanityFaker1.foo()).toStrictEqual(sanityFaker2.foo());
    expect(sanityFaker1.foo()).toStrictEqual(sanityFaker2.foo());
  });

  it("mocks identical values regardless of other fields", () => {
    const config1 = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "baz",
                type: "boolean",
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "bar",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    });
    const sanityFaker1 = _sanityConfigToFaker(config1, {
      faker: { locale: [en, base] },
    });

    const config2 = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "bar",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "qux",
                type: "number",
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    });
    const sanityFaker2 = _sanityConfigToFaker(config2, {
      faker: { locale: [en, base] },
    });

    expect(sanityFaker1.foo().bar).toStrictEqual(sanityFaker2.foo().bar);
    expect(sanityFaker1.foo().bar).toStrictEqual(sanityFaker2.foo().bar);
    expect(sanityFaker1.foo().bar).toStrictEqual(sanityFaker2.foo().bar);
  });

  it("mocks different values if nested differently", () => {
    const config1 = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "bar",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    });
    const sanityFaker1 = _sanityConfigToFaker(config1, {
      faker: { locale: [en, base] },
    });

    const config2 = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "baz",
            type: "document",
            fields: [
              defineField({
                name: "bar",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    });
    const sanityFaker2 = _sanityConfigToFaker(config2, {
      faker: { locale: [en, base] },
    });

    expect(sanityFaker1.foo().bar).not.toStrictEqual(sanityFaker2.baz().bar);
    expect(sanityFaker1.foo().bar).not.toStrictEqual(sanityFaker2.baz().bar);
    expect(sanityFaker1.foo().bar).not.toStrictEqual(sanityFaker2.baz().bar);
  });

  it("mocks different values if nested in array", () => {
    const config1 = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "bar",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    });
    const sanityFaker1 = _sanityConfigToFaker(config1, {
      faker: { locale: [en, base] },
    });

    const config2 = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "bar",
                type: "array",
                validation: (Rule) => Rule.required(),
                of: [
                  defineArrayMember({
                    type: "string",
                    validation: (Rule) => Rule.required(),
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });
    const sanityFaker2 = _sanityConfigToFaker(config2, {
      faker: { locale: [en, base] },
    });

    expect(sanityFaker1.foo().bar).not.toStrictEqual(sanityFaker2.foo().bar[0]);
    expect(sanityFaker1.foo().bar).not.toStrictEqual(sanityFaker2.foo().bar[0]);
    expect(sanityFaker1.foo().bar).not.toStrictEqual(sanityFaker2.foo().bar[0]);
  });
});
