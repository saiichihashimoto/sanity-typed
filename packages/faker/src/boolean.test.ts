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

import { sanityConfigToFakerTyped } from "./internal";

describe("boolean", () => {
  describe("defineArrayMember", () => {
    it("mocks boolean", () => {
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
                  type: "boolean",
                }),
              ],
            }),
          ],
        },
      });
      const sanityFaker = sanityConfigToFakerTyped(config, {
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
    it("mocks boolean", () => {
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
                  type: "boolean",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      });
      const sanityFaker = sanityConfigToFakerTyped(config, {
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
    it("mocks boolean", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "boolean",
            }),
          ],
        },
      });
      const sanityFaker = sanityConfigToFakerTyped(config, {
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
    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/285
    it.todo("custom(fn)");
  });
});
