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

describe("url", () => {
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
                  type: "url",
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = ["https://google.com"];

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
                  type: "url",
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
        bar: "https://google.com",
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
              type: "url",
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = "https://google.com";

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });
  });

  describe("validation", () => {
    it("requires url", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "url",
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("foo")).toThrow("Not a valid URL");
      expect(() => zods.foo.parse("https://google.com")).not.toThrow();
      expect(() => zods.foo.parse("/relative")).toThrow("Not a valid URL");
      expect(() => zods.foo.parse("https://user:pass@google.com")).toThrow(
        "Username/password not allowed"
      );
      expect(() => zods.foo.parse("mailto:foo@bar.com")).toThrow(
        "Does not match allowed protocols/schemes"
      );
      expect(() => zods.foo.parse("tel:15555555555")).toThrow(
        "Does not match allowed protocols/schemes"
      );
    });

    it("uri({ allowRelative })", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "url",
              validation: (Rule) => Rule.uri({ allowRelative: true }),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("https://google.com")).not.toThrow();
      expect(() => zods.foo.parse("/relative")).not.toThrow();
    });

    it("uri({ relativeOnly })", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "url",
              validation: (Rule) => Rule.uri({ relativeOnly: true }),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("https://google.com")).toThrow(
        "Only relative URLs are allowed"
      );
      expect(() => zods.foo.parse("/relative")).not.toThrow();
    });

    it("uri({ allowCredentials })", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "url",
              validation: (Rule) => Rule.uri({ allowCredentials: true }),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() =>
        zods.foo.parse("https://user:pass@google.com")
      ).not.toThrow();
    });

    it("uri({ scheme: string })", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "url",
              validation: (Rule) => Rule.uri({ scheme: "mailto" }),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("mailto:foo@bar.com")).not.toThrow();
    });

    it("uri({ scheme: RegExp })", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "url",
              validation: (Rule) => Rule.uri({ scheme: /^tel$/ }),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("tel:15555555555")).not.toThrow();
    });

    it("custom(fn)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "url",
              validation: (Rule) =>
                Rule.custom(() => "fail for no reason").custom(
                  enableZod(
                    (value) =>
                      value !== "https://yahoo.com" ||
                      "value can't be `https://yahoo.com`"
                  )
                ),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(() => zods.foo.parse("https://google.com")).not.toThrow();
      expect(() => zods.foo.parse("https://yahoo.com")).toThrow(
        "value can't be `https://yahoo.com`"
      );
    });
  });
});
