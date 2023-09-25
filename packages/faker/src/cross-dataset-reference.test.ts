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

import { _sanityConfigToFaker } from ".";

describe("crossDatasetReference", () => {
  beforeEach(() => {
    faker.seed(0);
  });

  describe("defineArrayMember", () => {
    it("builds parser for CrossDatasetReferenceValue", () => {
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
                  type: "crossDatasetReference",
                  to: [],
                  dataset: "dataset",
                }),
              ],
            }),
          ],
        },
      });
      const sanityFaker = _sanityConfigToFaker(config, { faker });

      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<(typeof fake)[number]>().toStrictEqual<
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
                  name: "foo",
                  type: "crossDatasetReference",
                  to: [],
                  dataset: "dataset",
                }),
              ],
            }),
          ],
        },
      });
      const sanityFaker = _sanityConfigToFaker(config, { faker });

      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<(typeof fake)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });
  });

  describe("defineField", () => {
    it("builds parser for CrossDatasetReferenceValue", () => {
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
                  type: "crossDatasetReference",
                  validation: (Rule) => Rule.required(),
                  to: [],
                  dataset: "dataset",
                }),
              ],
            }),
          ],
        },
      });
      const sanityFaker = _sanityConfigToFaker(config, { faker });

      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<(typeof fake)["bar"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });
  });

  describe("defineType", () => {
    it("builds parser for CrossDatasetReferenceValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "crossDatasetReference",
              to: [],
              dataset: "dataset",
            }),
          ],
        },
      });
      const sanityFaker = _sanityConfigToFaker(config, { faker });

      const fake = sanityFaker.foo();

      const zods = sanityConfigToZods(config);

      expect(() => zods.foo.parse(fake)).not.toThrow();
      expectType<typeof fake>().toStrictEqual<
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
              type: "crossDatasetReference",
              to: [],
              dataset: "dataset",
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
      const sanityFaker = _sanityConfigToFaker(config, { faker });

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
