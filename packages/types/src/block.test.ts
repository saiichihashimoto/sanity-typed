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
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >().toStrictEqual<
        Simplify<
          PortableTextBlock & {
            _key: string;
          }
        >
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
                  name: "bar",
                  type: "block",
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >().toStrictEqual<"bar">();
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
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >().toStrictEqual<
        Simplify<
          PortableTextBlock<
            PortableTextMarkDefinition,
            PortableTextSpan | (SlugValue & { _key: string })
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
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >().toStrictEqual<
        Simplify<
          PortableTextBlock<
            PortableTextMarkDefinition,
            | PortableTextSpan
            | (GeopointValue & { _key: string })
            | (SlugValue & { _key: string })
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
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >().toStrictEqual<
        Simplify<
          Omit<PortableTextBlock, "_type"> & {
            _type: "foo";
          }
        >
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
              type: "block",
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

      expectType<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
      >().toStrictEqual<"bar">();
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
        Simplify<
          PortableTextBlock<
            PortableTextMarkDefinition,
            PortableTextSpan | Simplify<SlugValue & { _key: string }>
          > & {
            _type: "foo";
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
        Simplify<
          PortableTextBlock<
            PortableTextMarkDefinition,
            | PortableTextSpan
            | Simplify<GeopointValue & { _key: string }>
            | Simplify<SlugValue & { _key: string }>
          > & {
            _type: "foo";
          }
        >
      >();
    });
  });
});
