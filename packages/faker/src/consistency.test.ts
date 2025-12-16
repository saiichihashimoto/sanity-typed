import { base, en } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";

import { sanityConfigToFakerTyped } from "./internal";

describe.each(Array.from({ length: 5 }).map((_, seed) => [{ seed }]))(
  "consistency %p",
  ({ seed }) => {
    it("mocks identical documents when re-instantiated", () => {
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
      const sanityFaker1 = sanityConfigToFakerTyped(config, {
        seed,
        faker: { locale: [en, base] },
      });
      const sanityFaker2 = sanityConfigToFakerTyped(config, {
        seed,
        faker: { locale: [en, base] },
      });

      expect(sanityFaker1.foo()).toStrictEqual(sanityFaker2.foo());
      expect(sanityFaker1.foo()).toStrictEqual(sanityFaker2.foo());
      expect(sanityFaker1.foo()).toStrictEqual(sanityFaker2.foo());
    });

    it("mocks identical documents when other types change", () => {
      const config1 = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({ name: "bar", type: "boolean" }),
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
      const sanityFaker1 = sanityConfigToFakerTyped(config1, {
        seed,
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
            defineType({ name: "baz", type: "number" }),
          ],
        },
      });
      const sanityFaker2 = sanityConfigToFakerTyped(config2, {
        seed,
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

    it("mocks identical values when other fields change", () => {
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
      const sanityFaker1 = sanityConfigToFakerTyped(config1, {
        seed,
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
      const sanityFaker2 = sanityConfigToFakerTyped(config2, {
        seed,
        faker: { locale: [en, base] },
      });

      expect(sanityFaker1.foo().bar).toStrictEqual(sanityFaker2.foo().bar);
      expect(sanityFaker1.foo().bar).toStrictEqual(sanityFaker2.foo().bar);
      expect(sanityFaker1.foo().bar).toStrictEqual(sanityFaker2.foo().bar);
    });

    it("mocks different values when the field path changes", () => {
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
      const sanityFaker1 = sanityConfigToFakerTyped(config1, {
        seed,
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
      const sanityFaker2 = sanityConfigToFakerTyped(config2, {
        seed,
        faker: { locale: [en, base] },
      });

      expect(sanityFaker1.foo().bar).not.toStrictEqual(sanityFaker2.baz().bar);
      expect(sanityFaker1.foo().bar).not.toStrictEqual(sanityFaker2.baz().bar);
      expect(sanityFaker1.foo().bar).not.toStrictEqual(sanityFaker2.baz().bar);
    });

    it("mocks different values when the field nests in an array", () => {
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
      const sanityFaker1 = sanityConfigToFakerTyped(config1, {
        seed,
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
      const sanityFaker2 = sanityConfigToFakerTyped(config2, {
        seed,
        faker: { locale: [en, base] },
      });

      expect(sanityFaker1.foo().bar).not.toStrictEqual(
        sanityFaker2.foo().bar[0]
      );
      expect(sanityFaker1.foo().bar).not.toStrictEqual(
        sanityFaker2.foo().bar[0]
      );
      expect(sanityFaker1.foo().bar).not.toStrictEqual(
        sanityFaker2.foo().bar[0]
      );
    });

    it("mocks different values when the seed changes", () => {
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
      const sanityFaker1 = sanityConfigToFakerTyped(config, {
        seed,
        faker: { locale: [en, base] },
      });
      const sanityFaker2 = sanityConfigToFakerTyped(config, {
        seed: seed + 1,
        faker: { locale: [en, base] },
      });

      expect(sanityFaker1.foo()).not.toStrictEqual(sanityFaker2.foo());
      expect(sanityFaker1.foo()).not.toStrictEqual(sanityFaker2.foo());
      expect(sanityFaker1.foo()).not.toStrictEqual(sanityFaker2.foo());
    });
  }
);
