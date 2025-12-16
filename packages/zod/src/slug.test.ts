import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, SlugValue } from "@sanity-typed/types";

import { enableZod } from ".";
import { sanityConfigToZodsTyped } from "./internal";

const fields: Omit<SlugValue, "_type"> = { current: "current" };

describe("slug", () => {
  describe("defineArrayMember", () => {
    it("builds parser for SlugValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [defineArrayMember({ type: "slug" })],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [{ ...fields, _key: "key", _type: "slug" }];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
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
              of: [defineArrayMember({ name: "foo", type: "slug" })],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [{ ...fields, _key: "key", _type: "foo" }];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >();
    });
  });

  describe("defineField", () => {
    it("builds parser for SlugValue", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = { _type: "foo", bar: { ...fields, _type: "slug" } };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["bar"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });
  });

  describe("defineType", () => {
    it("builds parser for SlugValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: { types: [defineType({ name: "foo", type: "slug" })] },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = { ...fields, _type: "foo" };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("overwrites `_type` with defineArrayMember `name`", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({ name: "foo", type: "slug" }),
            defineType({
              name: "bar",
              type: "array",
              of: [defineArrayMember({ name: "bar", type: "foo" })],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [{ ...fields, _key: "key", _type: "bar" }];

      const parsed = zods.bar.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
      >();
    });
  });

  describe("validation", () => {
    it("custom(fn)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "slug",
              validation: (Rule) =>
                Rule.custom(() => "fail for no reason").custom(
                  enableZod(
                    (value) =>
                      value?.current !== "bar" || "value can't be `bar`"
                  )
                ),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(zods.foo.parse({ _type: "foo", current: "foo" })).toStrictEqual({
        _type: "foo",
        current: "foo",
      });
      expect(() => zods.foo.parse({ _type: "foo", current: "bar" })).toThrow(
        "value can't be `bar`"
      );
    });
  });
});
