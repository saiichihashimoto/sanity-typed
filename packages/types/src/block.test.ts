import { describe, it } from "@jest/globals";
import type { GeopointValue, SlugValue } from "sanity";
import type { Simplify } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type {
  InferSchemaValues,
  PortableTextBlock,
  PortableTextMarkDefinition,
  PortableTextSpan,
} from ".";

describe("block", () => {
  describe("defineArrayMember", () => {
    it("infers PortableTextBlock", () => {
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
                  type: "block",
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]
      >().toStrictEqual<
        Simplify<
          PortableTextBlock & {
            _key: string;
          }
        >
      >();
    });

    it("infers array of members", () => {
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
                  type: "block",
                  of: [defineArrayMember({ type: "slug" })],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]
      >().toStrictEqual<
        Simplify<
          PortableTextBlock<
            PortableTextMarkDefinition,
            PortableTextSpan | Simplify<SlugValue & { _key: string }>
          > & {
            _key: string;
          }
        >
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
                defineArrayMember({
                  type: "block",
                  of: [
                    defineArrayMember({ type: "slug" }),
                    defineArrayMember({ type: "geopoint" }),
                  ],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]
      >().toStrictEqual<
        Simplify<
          PortableTextBlock<
            PortableTextMarkDefinition,
            | PortableTextSpan
            | Simplify<GeopointValue & { _key: string }>
            | Simplify<SlugValue & { _key: string }>
          > & {
            _key: string;
          }
        >
      >();
    });
  });

  describe("defineField", () => {
    it("is a typescript error", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "object",
              fields: [
                // @ts-expect-error -- blocks can't be fields https://www.sanity.io/docs/block-type
                defineField({
                  name: "bar",
                  type: "block",
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        Exclude<
          keyof Required<InferSchemaValues<typeof config>["foo"]>,
          "_type"
        >
      >().toBeNever();
    });
  });

  describe("defineType", () => {
    it("infers PortableTextBlock", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]
      >().toStrictEqual<PortableTextBlock>();
    });

    it("infers array of members", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              of: [defineArrayMember({ type: "slug" })],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
        PortableTextBlock<
          PortableTextMarkDefinition,
          PortableTextSpan | Simplify<SlugValue & { _key: string }>
        >
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
              type: "block",
              of: [
                defineArrayMember({ type: "slug" }),
                defineArrayMember({ type: "geopoint" }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
        PortableTextBlock<
          PortableTextMarkDefinition,
          | PortableTextSpan
          | Simplify<GeopointValue & { _key: string }>
          | Simplify<SlugValue & { _key: string }>
        >
      >();
    });
  });
});
