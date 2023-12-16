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

describe("number", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [1];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [1];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        _type: "foo",
        bar: 1,
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["bar"]>().toStrictEqual<
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        _type: "foo",
        bar: 1,
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["bar"]>().toStrictEqual<
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = 1;

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = 1;

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
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
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse(0)).toThrow(
        "Number must be greater than or equal to 1"
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
                  type: "number",
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
          baz: 1,
          foo: 0,
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .toStrictEqual({
          _type: "bar",
          baz: 1,
          foo: 0,
        });
    });

    it("max(maxNumber)", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse(2)).toThrow(
        "Number must be less than or equal to 1"
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
                  type: "number",
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
          baz: 1,
          foo: 2,
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .toStrictEqual({
          _type: "bar",
          baz: 1,
          foo: 2,
        });
    });

    it("lessThan(limit)", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse(1)).toThrow("Number must be less than 1");
    });

    it("lessThan(valueOfField())", () => {
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
                  type: "number",
                  validation: (Rule) =>
                    Rule.required().lessThan(Rule.valueOfField("baz")),
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
          baz: 1,
          foo: 1,
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .toStrictEqual({
          _type: "bar",
          baz: 1,
          foo: 1,
        });
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
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse(1)).toThrow("Number must be greater than 1");
    });

    it("greaterThan(valueOfField())", () => {
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
                  type: "number",
                  validation: (Rule) =>
                    Rule.required().greaterThan(Rule.valueOfField("baz")),
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
          baz: 1,
          foo: 1,
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .toStrictEqual({
          _type: "bar",
          baz: 1,
          foo: 1,
        });
    });

    it("integer()", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse(1.5)).toThrow(
        "Expected integer, received float"
      );
    });

    it("precision(limit)", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse(1.56)).toThrow(
        "Number must be a multiple of 0.1"
      );
    });

    it("precision(valueOfField())", () => {
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
                  type: "number",
                  validation: (Rule) =>
                    Rule.required().precision(Rule.valueOfField("baz")),
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
          baz: 1,
          foo: 1.56,
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .toStrictEqual({
          _type: "bar",
          baz: 1,
          foo: 1.56,
        });
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
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse(-1)).toThrow(
        "Number must be greater than or equal to 0"
      );
      expect(zods.foo.parse(0)).toBe(0);
    });

    it("negative()", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse(1)).toThrow("Number must be less than 0");
      expect(() => zods.foo.parse(0)).toThrow("Number must be less than 0");
    });

    it("custom(fn)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "number",
              validation: (Rule) =>
                Rule.custom(() => "fail for no reason").custom(
                  enableZod((value) => value !== 2 || "value can't be `2`")
                ),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(zods.foo.parse(1)).toBe(1);
      expect(() => zods.foo.parse(2)).toThrow("value can't be `2`");
    });
  });
});
