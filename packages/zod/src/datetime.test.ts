import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { enableZod } from ".";
import { sanityConfigToZodsTyped } from "./internal";

describe("datetime", () => {
  describe("defineArrayMember", () => {
    it("builds parser for string", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [defineArrayMember({ type: "datetime" })],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = ["2023-09-12T20:01:36.945Z"];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });
  });

  describe("defineField", () => {
    it("builds parser for string", () => {
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
                  type: "datetime",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = { _type: "foo", bar: "2023-09-12T20:01:36.945Z" };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["bar"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });
  });

  describe("defineType", () => {
    it("builds parser for string", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: { types: [defineType({ name: "foo", type: "datetime" })] },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = "2023-09-12T20:01:36.945Z";

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });
  });

  describe("validation", () => {
    it("requires datetime", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: { types: [defineType({ name: "foo", type: "datetime" })] },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("foo")).toThrow("Invalid datetime");
    });

    it("min(minDate)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "datetime",
              validation: (Rule) => Rule.min("2023-09-12T20:01:36.945Z"),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("2023-09-12T20:01:36.944Z")).toThrow(
        "Datetime must be greater than or equal to 2023-09-12T20:01:36.945Z"
      );
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
                  type: "datetime",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "foo",
                  type: "datetime",
                  validation: (Rule) =>
                    Rule.required().min(Rule.valueOfField("baz")),
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(
        zods.bar.parse({
          _type: "bar",
          baz: "2023-09-12T20:01:36.945Z",
          foo: "2023-09-12T20:01:36.944Z",
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .toStrictEqual({
          _type: "bar",
          baz: "2023-09-12T20:01:36.945Z",
          foo: "2023-09-12T20:01:36.944Z",
        });
    });

    it("max(maxDate)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "datetime",
              validation: (Rule) => Rule.max("2023-09-12T20:01:36.945Z"),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("2023-09-12T20:01:36.946Z")).toThrow(
        "Datetime must be less than or equal to 2023-09-12T20:01:36.945Z"
      );
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
                  type: "datetime",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "foo",
                  type: "datetime",
                  validation: (Rule) =>
                    Rule.required().max(Rule.valueOfField("baz")),
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(
        zods.bar.parse({
          _type: "bar",
          baz: "2023-09-12T20:01:36.945Z",
          foo: "2023-09-12T20:01:36.946Z",
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .toStrictEqual({
          _type: "bar",
          baz: "2023-09-12T20:01:36.945Z",
          foo: "2023-09-12T20:01:36.946Z",
        });
    });

    it("custom(fn)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "datetime",
              validation: (Rule) =>
                Rule.custom(() => "fail for no reason").custom(
                  enableZod(
                    (value) =>
                      value !== "2023-09-12T20:01:36.946Z"
                      || "value can't be `2023-09-12T20:01:36.946Z`"
                  )
                ),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(zods.foo.parse("2023-09-12T20:01:36.945Z")).toBe(
        "2023-09-12T20:01:36.945Z"
      );
      expect(() => zods.foo.parse("2023-09-12T20:01:36.946Z")).toThrow(
        "value can't be `2023-09-12T20:01:36.946Z`"
      );
    });
  });
});
