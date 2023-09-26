import { base, en } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";
import { sanityConfigToZods } from "@sanity-typed/zod";

import { _sanityConfigToFaker } from ".";

describe("number", () => {
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
              of: [
                defineArrayMember({
                  type: "number",
                }),
              ],
            }),
          ],
        },
      });
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
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
                  options: {
                    list: [1, { title: "Two", value: 2 }],
                  },
                }),
              ],
            }),
          ],
        },
      });
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
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
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
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
                  options: {
                    list: [1, { title: "Two", value: 2 }],
                  },
                }),
              ],
            }),
          ],
        },
      });
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
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
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "number",
            }),
          ],
        },
      });
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
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
              options: {
                list: [1, { title: "Two", value: 2 }],
              },
            }),
          ],
        },
      });
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
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
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
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
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
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
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
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
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
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
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
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
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
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
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
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
      const sanityFaker = _sanityConfigToFaker(config, {
        faker: { locale: [en, base] },
      });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/285
    it.todo("custom(fn)");
  });
});
