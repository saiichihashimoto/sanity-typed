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

describe("slug", () => {
  describe("defineArrayMember", () => {
    it("mocks SlugValue", () => {
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
                  type: "slug",
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
                  type: "slug",
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
    it("mocks SlugValue", () => {
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
                  type: "slug",
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
    it("mocks SlugValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "slug",
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

    it("overwrites `_type` with defineArrayMember `name`", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "slug",
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
                type: "slug",
              }),
              (faker, previous) => ({
                ...previous,
                current: "foo",
              })
            ),
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
      expect(fake).toHaveProperty("current", "foo");
    });
  });
});
