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

describe("string", () => {
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
                  type: "string",
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = ["foo"];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });

    it("builds parser for literal string from list", () => {
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
                  type: "string",
                  options: {
                    list: ["foo", { title: "Bar", value: "bar" }],
                  },
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = ["foo"];

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
                  type: "string",
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
        bar: "foo",
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["bar"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >();
    });

    it("builds parser for literal string from list", () => {
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
                  type: "string",
                  validation: (Rule) => Rule.required(),
                  options: {
                    list: ["foo", { title: "Bar", value: "bar" }],
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
        bar: "foo",
      };

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
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = "foo";

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("builds parser for literal string from list", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              options: {
                list: ["foo", { title: "Bar", value: "bar" }],
              },
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = "foo";

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });
  });

  describe("validation", () => {
    it("min(minLength)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) => Rule.min(4),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("")).toThrow(
        "String must contain at least 4 character(s)"
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
                  type: "string",
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
          baz: 4,
          foo: "",
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .toStrictEqual({
          _type: "bar",
          baz: 4,
          foo: "",
        });
    });

    it("max(maxLength)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) => Rule.max(1),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("fo")).toThrow(
        "String must contain at most 1 character(s)"
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
                  type: "string",
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
          foo: "fo",
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .toStrictEqual({
          _type: "bar",
          baz: 1,
          foo: "fo",
        });
    });

    it("length(exactLength)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) => Rule.length(1),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("")).toThrow(
        "String must contain exactly 1 character(s)"
      );
      expect(() => zods.foo.parse("fo")).toThrow(
        "String must contain exactly 1 character(s)"
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
                  type: "string",
                  validation: (Rule) =>
                    Rule.required().length(Rule.valueOfField("baz")),
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
          foo: "",
        })
      ) // TODO https://github.com/saiichihashimoto/sanity-typed/issues/516
        .toStrictEqual({
          _type: "bar",
          baz: 1,
          foo: "",
        });
    });

    it("uppercase()", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) => Rule.uppercase(),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("foo")).toThrow(
        "Must be all uppercase letters"
      );
    });

    it("lowercase()", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) => Rule.lowercase(),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("FOO")).toThrow(
        "Must be all lowercase letters"
      );
    });

    it("email()", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) => Rule.email(),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("foo")).toThrow("Invalid email");
    });

    it("regex(pattern)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) => Rule.regex(/^(bar)+$/),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("foo")).toThrow(
        "Does not match /^(bar)+$/-pattern"
      );
    });

    it("regex(pattern, { name })", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) => Rule.regex(/^(bar)+$/, { name: "bar" }),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("foo")).toThrow("Does not match bar-pattern");
    });

    it("regex(pattern, name)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) => Rule.regex(/^(bar)+$/, "bar"),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("foo")).toThrow("Does not match bar-pattern");
    });

    it("regex(pattern, { invert })", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) => Rule.regex(/^(bar)+$/, { invert: true }),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(zods.foo.parse("foo")).toBe("foo");
      expect(() => zods.foo.parse("bar")).toThrow(
        "Should not match /^(bar)+$/-pattern"
      );
    });

    it("regex(pattern, name, { invert })", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) =>
                Rule.regex(/^(bar)+$/, "bar", { invert: true }),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(zods.foo.parse("foo")).toBe("foo");
      expect(() => zods.foo.parse("bar")).toThrow(
        "Should not match bar-pattern"
      );
    });

    it("custom(fn)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              validation: (Rule) =>
                Rule.custom(() => "fail for no reason").custom(
                  enableZod(
                    (value) => value !== "bar" || "value can't be `bar`"
                  )
                ),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(zods.foo.parse("foo")).toBe("foo");
      expect(() => zods.foo.parse("bar")).toThrow("value can't be `bar`");
    });
  });
});
