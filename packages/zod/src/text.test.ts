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

describe("text", () => {
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
                  type: "text",
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

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
                  type: "text",
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        _type: "foo",
        bar: "foo",
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
              type: "text",
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

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
              type: "text",
              validation: (Rule) => Rule.min(1),
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      expect(() => zods.foo.parse("")).toThrow(
        "String must contain at least 1 character(s)"
      );
    });

    it("max(maxLength)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "text",
              validation: (Rule) => Rule.max(1),
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      expect(() => zods.foo.parse("fo")).toThrow(
        "String must contain at most 1 character(s)"
      );
    });

    it("length(exactLength)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "text",
              validation: (Rule) => Rule.length(1),
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      expect(() => zods.foo.parse("")).toThrow(
        "String must contain exactly 1 character(s)"
      );
      expect(() => zods.foo.parse("fo")).toThrow(
        "String must contain exactly 1 character(s)"
      );
    });

    it("uppercase()", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "text",
              validation: (Rule) => Rule.uppercase(),
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

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
              type: "text",
              validation: (Rule) => Rule.lowercase(),
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

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
              type: "text",
              validation: (Rule) => Rule.email(),
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

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
              type: "text",
              validation: (Rule) => Rule.regex(/^bar$/),
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      expect(() => zods.foo.parse("foo")).toThrow("Must match regex /^bar$/");
    });

    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/285
    it.todo("regex(pattern, { name })");

    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/285
    it.todo("regex(pattern, name)");

    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/285
    it.todo("regex(pattern, { invert })");

    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/285
    it.todo("regex(pattern, name, { invert })");

    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/285
    it.todo("custom(fn)");
  });
});
