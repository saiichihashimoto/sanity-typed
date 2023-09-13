import { describe, expect, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { _sanityConfigToZods } from ".";

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
              of: [
                defineArrayMember({
                  type: "datetime",
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

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
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        _type: "foo",
        bar: "2023-09-12T20:01:36.945Z",
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
    });
  });

  describe("defineType", () => {
    it("builds parser for string", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "datetime",
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

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
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "datetime",
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

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
      const zods = _sanityConfigToZods(config);

      expect(() => zods.foo.parse("2023-09-12T20:01:36.944Z")).toThrow(
        "Datetime must be greater than or equal to 2023-09-12T20:01:36.945Z"
      );
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
      const zods = _sanityConfigToZods(config);

      expect(() => zods.foo.parse("2023-09-12T20:01:36.946Z")).toThrow(
        "Datetime must be less than or equal to 2023-09-12T20:01:36.945Z"
      );
    });

    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/285
    it.todo("custom(fn)");
  });
});
