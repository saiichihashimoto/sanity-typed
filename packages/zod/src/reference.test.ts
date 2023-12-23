import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, ReferenceValue } from "@sanity-typed/types";

import { enableZod } from ".";
import { sanityConfigToZodsTyped } from "./internal";

const fields: Omit<ReferenceValue<"other">, symbol | "_type"> = { _ref: "foo" };

describe("reference", () => {
  describe("defineArrayMember", () => {
    it("builds parser for ReferenceValue", () => {
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
                  type: "reference",
                  to: [{ type: "other" }],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "reference",
        },
      ];

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
              of: [
                defineArrayMember({
                  name: "foo",
                  type: "reference",
                  to: [{ type: "other" }],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "foo",
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >();
    });

    it("adds weak fields", () => {
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
                  type: "reference",
                  weak: true,
                  to: [{ type: "other" }],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "reference",
          _weak: true,
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });
  });

  describe("defineField", () => {
    it("builds parser for ReferenceValue", () => {
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
                  type: "reference",
                  validation: (Rule) => Rule.required(),
                  to: [{ type: "other" }],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        _type: "foo",
        bar: {
          ...fields,
          _type: "reference",
        },
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["bar"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });

    it("adds weak fields", () => {
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
                  type: "reference",
                  weak: true,
                  validation: (Rule) => Rule.required(),
                  to: [{ type: "other" }],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        _type: "foo",
        bar: {
          ...fields,
          _type: "reference",
          _weak: true,
        },
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["bar"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });
  });

  describe("defineType", () => {
    it("builds parser for ReferenceValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "reference",
              to: [{ type: "other" }],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        ...fields,
        _type: "foo",
      };

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
            defineType({
              name: "foo",
              type: "reference",
              to: [{ type: "other" }],
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "bar",
        },
      ];

      const parsed = zods.bar.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
      >();
    });

    it("adds weak fields", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "reference",
              weak: true,
              to: [{ type: "other" }],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        ...fields,
        _type: "foo",
        _weak: true,
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
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
              type: "reference",
              weak: true,
              to: [{ type: "other" }],
              validation: (Rule) =>
                Rule.custom(() => "fail for no reason").custom(
                  enableZod((value) => !value?._weak || "value can't be _weak")
                ),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(zods.foo.parse({ ...fields, _type: "foo" })).toStrictEqual({
        ...fields,
        _type: "foo",
      });
      expect(() =>
        zods.foo.parse({ ...fields, _type: "foo", _weak: true })
      ).toThrow("value can't be _weak");
    });
  });
});
