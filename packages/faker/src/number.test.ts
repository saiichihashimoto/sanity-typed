import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";
import { sanityConfigToZods } from "@sanity-typed/zod";

import { sanityConfigToFaker } from ".";

describe("number", () => {
  beforeEach(() => {
    faker.seed(0);
  });

  describe("defineArrayMember", () => {
    it("builds parser for number", () => {
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
      const sanityFaker = sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<(typeof fake)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });

    it("builds parser for literal number from list", () => {
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
      const sanityFaker = sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<(typeof fake)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });
  });

  describe("defineField", () => {
    it("builds parser for number", () => {
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
      const sanityFaker = sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<(typeof fake)["bar"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });

    it("builds parser for literal number from list", () => {
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
      const sanityFaker = sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<(typeof fake)["bar"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });
  });

  describe("defineType", () => {
    it("builds parser for number", () => {
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
      const sanityFaker = sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("builds parser for literal number from list", () => {
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
      const sanityFaker = sanityConfigToFaker(config, { faker });

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
      const sanityFaker = sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it.failing("max(maxNumber)", () => {
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
      const sanityFaker = sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it.failing("lessThan(limit)", () => {
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
      const sanityFaker = sanityConfigToFaker(config, { faker });

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
      const sanityFaker = sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it.failing("integer()", () => {
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
      const sanityFaker = sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it.failing("precision(limit)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "number",
              validation: (Rule) => Rule.precision(1),
            }),
          ],
        },
      });
      const sanityFaker = sanityConfigToFaker(config, { faker });

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
      const sanityFaker = sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it.failing("negative()", () => {
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
      const sanityFaker = sanityConfigToFaker(config, { faker });

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
