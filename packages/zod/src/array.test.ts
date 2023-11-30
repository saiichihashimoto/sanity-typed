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

describe("array", () => {
  describe("defineField", () => {
    it("builds parser for array of members", () => {
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
                  type: "array",
                  validation: (Rule) => Rule.required(),
                  of: [defineArrayMember({ type: "boolean" })],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        _type: "foo",
        bar: [true],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["bar"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });

    it("infers unions if there are multiple members", () => {
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
                  type: "array",
                  validation: (Rule) => Rule.required(),
                  of: [
                    defineArrayMember({ type: "boolean" }),
                    defineArrayMember({ type: "string" }),
                  ],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        _type: "foo",
        bar: [true, "foo"],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["bar"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });

    it("infers unions with objects", () => {
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
                  type: "array",
                  validation: (Rule) => Rule.required(),
                  of: [
                    defineArrayMember({
                      type: "object",
                      name: "bar",
                      fields: [
                        defineField({
                          name: "bar",
                          type: "boolean",
                          validation: (Rule) => Rule.required(),
                        }),
                      ],
                    }),
                    defineArrayMember({
                      type: "object",
                      name: "qux",
                      fields: [
                        defineField({
                          name: "qux",
                          type: "boolean",
                          validation: (Rule) => Rule.required(),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        _type: "foo",
        bar: [
          { _key: "key", _type: "bar", bar: true },
          { _key: "key", _type: "qux", qux: true },
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["bar"]>().toEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });
  });

  describe("defineType", () => {
    it("builds parser for array of members", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [defineArrayMember({ type: "boolean" })],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [true];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("infers unions if there are multiple members", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [
                defineArrayMember({ type: "boolean" }),
                defineArrayMember({ type: "string" }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [true, "foo"];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("infers unions with objects", () => {
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
                  type: "object",
                  name: "bar",
                  fields: [
                    defineField({
                      name: "bar",
                      type: "boolean",
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                }),
                defineArrayMember({
                  type: "object",
                  name: "qux",
                  fields: [
                    defineField({
                      name: "qux",
                      type: "boolean",
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [
        { _key: "key", _type: "bar", bar: true },
        { _key: "key", _type: "qux", qux: true },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });
  });

  describe("validation", () => {
    it("unique()", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              validation: (Rule) => Rule.unique(),
              of: [
                defineArrayMember({
                  type: "object",
                  name: "bar",
                  fields: [
                    defineField({
                      name: "bar",
                      type: "boolean",
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() =>
        zods.foo.parse([
          {
            _key: "key1",
            _type: "bar",
            bar: true,
          },
          {
            _key: "key2",
            _type: "bar",
            bar: true,
          },
        ])
      ).toThrow("Can't contain duplicates");
    });

    it("min(minLength)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              validation: (Rule) => Rule.min(4),
              of: [defineArrayMember({ type: "boolean" })],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse([])).toThrow(
        "Array must contain at least 4 element(s)"
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
                  type: "number",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "foo",
                  type: "array",
                  validation: (Rule) =>
                    Rule.required().min(Rule.valueOfField("baz")),
                  of: [defineArrayMember({ type: "boolean" })],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() =>
        zods.bar.parse({
          _type: "bar",
          baz: 4,
          foo: [],
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .not.toThrow();
    });

    it("max(maxLength)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              validation: (Rule) => Rule.max(1),
              of: [defineArrayMember({ type: "boolean" })],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse([true, false])).toThrow(
        "Array must contain at most 1 element(s)"
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
                  type: "number",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "foo",
                  type: "array",
                  validation: (Rule) =>
                    Rule.required().max(Rule.valueOfField("baz")),
                  of: [defineArrayMember({ type: "boolean" })],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() =>
        zods.bar.parse({
          _type: "bar",
          baz: 1,
          foo: [true, false],
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .not.toThrow();
    });

    it("length(exactLength)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              validation: (Rule) => Rule.length(1),
              of: [defineArrayMember({ type: "boolean" })],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse([])).toThrow(
        "Array must contain exactly 1 element(s)"
      );
      expect(() => zods.foo.parse([true, false])).toThrow(
        "Array must contain exactly 1 element(s)"
      );
    });

    it("length(valueOfField())", () => {
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
                  type: "number",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "foo",
                  type: "array",
                  validation: (Rule) =>
                    Rule.required().length(Rule.valueOfField("baz")),
                  of: [defineArrayMember({ type: "boolean" })],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() =>
        zods.bar.parse({
          _type: "bar",
          baz: 1,
          foo: [],
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .not.toThrow();
    });

    it("custom(fn)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              validation: (Rule) =>
                Rule.custom(() => "fail for no reason").custom(
                  enableZod(
                    (value) =>
                      !value?.length ||
                      value[0] === true ||
                      "first value must be `true`"
                  )
                ),
              of: [defineArrayMember({ type: "boolean" })],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse([true, false, true])).not.toThrow();
      expect(() => zods.foo.parse([false, true])).toThrow(
        "first value must be `true`"
      );
    });
  });
});
