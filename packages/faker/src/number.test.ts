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
  "number %p",
  ({ seed }) => {
    describe("defineArrayMember", () => {
      it("mocks number", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [defineArrayMember({ type: "number" })],
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
        expectType<(typeof fake)[number]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("mocks literal number from list", () => {
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
                    type: "number",
                    options: { list: [1, { title: "Two", value: 2 }] },
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
        expectType<(typeof fake)[number]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });
    });

    describe("defineField", () => {
      it("mocks number", () => {
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
                    type: "number",
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
        expectType<(typeof fake)["bar"]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]["bar"]
        >();
      });

      it("mocks literal number from list", () => {
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
                    type: "number",
                    validation: (Rule) => Rule.required(),
                    options: { list: [1, { title: "Two", value: 2 }] },
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
        expectType<(typeof fake)["bar"]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]["bar"]
        >();
      });
    });

    describe("defineType", () => {
      it("mocks number", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: { types: [defineType({ name: "foo", type: "number" })] },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("mocks literal number from list", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "number",
                options: { list: [1, { title: "Two", value: 2 }] },
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
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });
    });

    describe("validation", () => {
      it("min(minNumber)", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "number",
                validation: (Rule) => Rule.min(1),
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
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("min(valueOfField())", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "bar",
                type: "object",
                fields: [
                  defineField({
                    name: "baz",
                    type: "number",
                    validation: (Rule) => Rule.required(),
                  }),
                  defineField({
                    name: "foo",
                    type: "number",
                    validation: (Rule) =>
                      Rule.required().min(Rule.valueOfField("baz")),
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

        const fake = sanityFaker.bar();

        const zods = sanityConfigToZods(config);

        // TODO https://github.com/saiichihashimoto/sanity-typed/issues/517
        expect(zods.bar.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["bar"]
        >();
      });

      it("max(maxNumber)", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "number",
                validation: (Rule) => Rule.max(1),
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
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("max(valueOfField())", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "bar",
                type: "object",
                fields: [
                  defineField({
                    name: "baz",
                    type: "number",
                    validation: (Rule) => Rule.required(),
                  }),
                  defineField({
                    name: "foo",
                    type: "number",
                    validation: (Rule) =>
                      Rule.required().max(Rule.valueOfField("baz")),
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

        const fake = sanityFaker.bar();

        const zods = sanityConfigToZods(config);

        // TODO https://github.com/saiichihashimoto/sanity-typed/issues/517
        expect(zods.bar.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["bar"]
        >();
      });

      it("lessThan(limit)", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "number",
                validation: (Rule) => Rule.lessThan(1),
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
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("lessThan(valueOfField())", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "bar",
                type: "object",
                fields: [
                  defineField({
                    name: "baz",
                    type: "number",
                    validation: (Rule) => Rule.required(),
                  }),
                  defineField({
                    name: "foo",
                    type: "number",
                    validation: (Rule) =>
                      Rule.required().lessThan(Rule.valueOfField("baz")),
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

        const fake = sanityFaker.bar();

        const zods = sanityConfigToZods(config);

        // TODO https://github.com/saiichihashimoto/sanity-typed/issues/517
        expect(zods.bar.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["bar"]
        >();
      });

      it("greaterThan(limit)", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "number",
                validation: (Rule) => Rule.greaterThan(1),
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
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("greaterThan(valueOfField())", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "bar",
                type: "object",
                fields: [
                  defineField({
                    name: "baz",
                    type: "number",
                    validation: (Rule) => Rule.required(),
                  }),
                  defineField({
                    name: "foo",
                    type: "number",
                    validation: (Rule) =>
                      Rule.required().greaterThan(Rule.valueOfField("baz")),
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

        const fake = sanityFaker.bar();

        const zods = sanityConfigToZods(config);

        // TODO https://github.com/saiichihashimoto/sanity-typed/issues/517
        expect(zods.bar.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["bar"]
        >();
      });

      it("integer()", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "number",
                validation: (Rule) => Rule.integer(),
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
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("precision(limit)", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "number",
                validation: (Rule) => Rule.precision(3),
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
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("precision(valueOfField())", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "bar",
                type: "object",
                fields: [
                  defineField({
                    name: "baz",
                    type: "number",
                    validation: (Rule) => Rule.required(),
                  }),
                  defineField({
                    name: "foo",
                    type: "number",
                    validation: (Rule) =>
                      Rule.required().precision(Rule.valueOfField("baz")),
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

        const fake = sanityFaker.bar();

        const zods = sanityConfigToZods(config);

        // TODO https://github.com/saiichihashimoto/sanity-typed/issues/517
        expect(zods.bar.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["bar"]
        >();
      });

      it("positive()", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "number",
                validation: (Rule) => Rule.positive(),
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
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("negative()", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "number",
                validation: (Rule) => Rule.negative(),
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
        expectType<typeof fake>().toStrictEqual<
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
              customFaker(defineType({ name: "foo", type: "number" }), () => 0),
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
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
        expect(fake).toBe(0);
      });
    });
  }
);
