import { base, en } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";
import { sanityConfigToZods } from "@sanity-typed/zod";

import { customFaker } from ".";
import { sanityConfigToFakerTyped } from "./internal";

describe.each(Array.from({ length: 5 }).map((_, seed) => [{ seed }]))(
  "image %p",
  ({ seed }) => {
    it("mocks ImageAsset automatically", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [],
        },
      });
      const sanityFaker = sanityConfigToFakerTyped(config, {
        seed,
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker["sanity.imageAsset"]();

      const zods = sanityConfigToZods(config);

      expect(zods["sanity.imageAsset"].parse(fake)).toStrictEqual(fake);
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["sanity.imageAsset"]
      >();
    });

    describe("defineArrayMember", () => {
      it("mocks ImageValue", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "image",
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)[number]>().toEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("overwrites `_type` with `name`", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [
                  defineArrayMember({
                    name: "bar",
                    type: "image",
                    fields: [
                      defineField({
                        name: "bar",
                        type: "boolean",
                      }),
                      defineField({
                        name: "tar",
                        type: "number",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)[number]>().toEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("adds hotspot fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "image",
                    options: {
                      hotspot: true,
                    },
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)[number]>().toEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("mocks ImageValue with fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "image",
                    fields: [
                      defineField({
                        name: "bar",
                        type: "boolean",
                      }),
                      defineField({
                        name: "tar",
                        type: "number",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)[number]>().toEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("mocks required fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "image",
                    fields: [
                      defineField({
                        name: "bar",
                        type: "boolean",
                        validation: (Rule) => Rule.required(),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)[number]>().toEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("mocks nested objects", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "image",
                    fields: [
                      defineField({
                        name: "bar",
                        type: "object",
                        validation: (Rule) => Rule.required(),
                        fields: [
                          defineField({
                            name: "tar",
                            type: "number",
                            validation: (Rule) => Rule.required(),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)[number]>().toEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });
    });

    describe("defineField", () => {
      it("mocks ImageValue", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "object",
                fields: [
                  defineField({
                    name: "bar",
                    type: "image",
                    validation: (Rule) => Rule.required(),
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)["bar"]>().toEqual<
          InferSchemaValues<typeof config>["foo"]["bar"]
        >();
      });

      it("adds hotspot fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "object",
                fields: [
                  defineField({
                    name: "bar",
                    type: "image",
                    validation: (Rule) => Rule.required(),
                    options: {
                      hotspot: true,
                    },
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)["bar"]>().toEqual<
          InferSchemaValues<typeof config>["foo"]["bar"]
        >();
      });

      it("mocks ImageValue with fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "object",
                fields: [
                  defineField({
                    name: "bar",
                    type: "image",
                    validation: (Rule) => Rule.required(),
                    fields: [
                      defineField({
                        name: "bar",
                        type: "boolean",
                      }),
                      defineField({
                        name: "tar",
                        type: "number",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)["bar"]>().toEqual<
          InferSchemaValues<typeof config>["foo"]["bar"]
        >();
      });

      it("mocks required fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "object",
                fields: [
                  defineField({
                    name: "bar",
                    type: "image",
                    validation: (Rule) => Rule.required(),
                    fields: [
                      defineField({
                        name: "bar",
                        type: "boolean",
                        validation: (Rule) => Rule.required(),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)["bar"]>().toEqual<
          InferSchemaValues<typeof config>["foo"]["bar"]
        >();
      });

      it("mocks nested objects", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "object",
                fields: [
                  defineField({
                    name: "bar",
                    type: "image",
                    validation: (Rule) => Rule.required(),
                    fields: [
                      defineField({
                        name: "bar",
                        type: "object",
                        validation: (Rule) => Rule.required(),
                        fields: [
                          defineField({
                            name: "tar",
                            type: "number",
                            validation: (Rule) => Rule.required(),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<(typeof fake)["bar"]>().toEqual<
          InferSchemaValues<typeof config>["foo"]["bar"]
        >();
      });
    });

    describe("defineType", () => {
      it("mocks ImageValue", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "image",
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("overwrites `_type` with defineArrayMember `name`", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "image",
                fields: [
                  defineField({
                    name: "bar",
                    type: "boolean",
                  }),
                  defineField({
                    name: "tar",
                    type: "number",
                  }),
                ],
              }),
              defineType({
                name: "bar",
                type: "array",
                of: [
                  defineArrayMember({
                    name: "bar",
                    type: "foo",
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("adds hotspot fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "image",
                options: {
                  hotspot: true,
                },
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("mocks ImageValue with fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "image",
                fields: [
                  defineField({
                    name: "bar",
                    type: "boolean",
                  }),
                  defineField({
                    name: "tar",
                    type: "number",
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("mocks required fields", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "image",
                fields: [
                  defineField({
                    name: "bar",
                    type: "boolean",
                    validation: (Rule) => Rule.required(),
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("mocks nested objects", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "image",
                fields: [
                  defineField({
                    name: "bar",
                    type: "object",
                    validation: (Rule) => Rule.required(),
                    fields: [
                      defineField({
                        name: "tar",
                        type: "number",
                        validation: (Rule) => Rule.required(),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });
    });

    describe("customMock", () => {
      it("overrides mock", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              customFaker(
                defineType({
                  name: "foo",
                  type: "image",
                }),
                (faker, previous) => ({
                  ...previous,
                  asset: {
                    ...previous.asset,
                    _ref: "foo",
                  },
                })
              ),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
        expect(fake).toHaveProperty("asset._ref", "foo");
      });
    });
  }
);
