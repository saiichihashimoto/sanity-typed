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
  "string %p",
  ({ seed }) => {
    describe("defineArrayMember", () => {
      it("mocks string", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "array",
                of: [defineArrayMember({ type: "string" })],
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

      it("mocks literal string from list", () => {
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
                    type: "string",
                    options: { list: ["foo", { title: "Bar", value: "bar" }] },
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
      it("mocks string", () => {
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
                    type: "string",
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

      it("mocks literal string from list", () => {
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
                    type: "string",
                    validation: (Rule) => Rule.required(),
                    options: { list: ["foo", { title: "Bar", value: "bar" }] },
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
      it("mocks string", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: { types: [defineType({ name: "foo", type: "string" })] },
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

      it("mocks literal string from list", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                options: { list: ["foo", { title: "Bar", value: "bar" }] },
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
      it("min(minLength)", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) => Rule.min(21),
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
                    type: "string",
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

      it("max(maxLength)", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) => Rule.max(4),
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
                    type: "string",
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

      it("length(exactLength)", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) => Rule.length(1),
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

      it("length(valueOfField())", () => {
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
                    type: "string",
                    validation: (Rule) =>
                      Rule.required().length(Rule.valueOfField("baz")),
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

      it("uppercase()", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) => Rule.uppercase(),
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

      it("lowercase()", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) => Rule.lowercase(),
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

      it("email()", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) => Rule.email(),
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

      it("regex(pattern)", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) => Rule.regex(/^(bar)+$/),
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

      it("regex(pattern, { name })", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) => Rule.regex(/^(bar)+$/, { name: "bar" }),
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

      it("regex(pattern, name)", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) => Rule.regex(/^(bar)+$/, "bar"),
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

      it.failing("regex(pattern, { invert })", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) => Rule.regex(/^(bar)+$/, { invert: true }),
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

        // TODO https://github.com/saiichihashimoto/sanity-typed/issues/613
        expect(zods.foo.parse(fake)).toStrictEqual(fake);
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it.failing("regex(pattern, name, { invert })", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              defineType({
                name: "foo",
                type: "string",
                validation: (Rule) =>
                  Rule.regex(/^(bar)+$/, "bar", { invert: true }),
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

        // TODO https://github.com/saiichihashimoto/sanity-typed/issues/613
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
              customFaker(
                defineType({ name: "foo", type: "string" }),
                () => "foo"
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
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
        expect(fake).toBe("foo");
      });
    });
  }
);
