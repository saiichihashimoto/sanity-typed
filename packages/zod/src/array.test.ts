import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { _sanityConfigToZods } from ".";

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
                  of: [defineArrayMember({ type: "boolean" })],
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse({
        _type: "foo",
        bar: [true],
      });

      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
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
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse({
        _type: "foo",
        bar: [true, "foo"],
      });

      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
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
                  of: [
                    defineArrayMember({
                      type: "object",
                      name: "bar",
                      fields: [
                        defineField({
                          name: "bar",
                          type: "boolean",
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
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse({
        _type: "foo",
        bar: [
          { _key: "key", _type: "bar", bar: true },
          { _key: "key", _type: "qux", qux: true },
        ],
      });

      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
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
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse([true]);

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
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse([true, "foo"]);

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
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse([
        { _key: "key", _type: "bar", bar: true },
        { _key: "key", _type: "qux", qux: true },
      ]);

      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });
  });
});
