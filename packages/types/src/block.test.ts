import { describe, it } from "@jest/globals";
import type { GeopointValue } from "sanity";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { InferSchemaValues, SlugValue } from ".";

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

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          marks?: string[];
          text: string;
        }[];
        level?: number;
        listItem?: string;
        markDefs?: {
          _key: string;
          _type: string;
        }[];
        style?: string;
      }>();
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

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: (
          | {
              _key: string;
              _type: "span";
              marks?: string[];
              text: string;
            }
          | (SlugValue & { _key: string })
        )[];
        level?: number;
        listItem?: string;
        markDefs?: {
          _key: string;
          _type: string;
        }[];
        style?: string;
      }>();
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

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: (
          | {
              _key: string;
              _type: "span";
              marks?: string[];
              text: string;
            }
          | (GeopointValue & { _key: string })
          | (SlugValue & { _key: string })
        )[];
        level?: number;
        listItem?: string;
        markDefs?: {
          _key: string;
          _type: string;
        }[];
        style?: string;
      }>();
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
        Exclude<keyof InferSchemaValues<typeof config>["foo"], "_type">
      >().toStrictEqual<never>();
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

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: {
          _key: string;
          _type: "span";
          marks?: string[];
          text: string;
        }[];
        level?: number;
        listItem?: string;
        markDefs?: {
          _key: string;
          _type: string;
        }[];
        style?: string;
      }>();
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

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: (
          | {
              _key: string;
              _type: "span";
              marks?: string[];
              text: string;
            }
          | (SlugValue & { _key: string })
        )[];
        level?: number;
        listItem?: string;
        markDefs?: {
          _key: string;
          _type: string;
        }[];
        style?: string;
      }>();
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

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: (
          | {
              _key: string;
              _type: "span";
              marks?: string[];
              text: string;
            }
          | (GeopointValue & { _key: string })
          | (SlugValue & { _key: string })
        )[];
        level?: number;
        listItem?: string;
        markDefs?: {
          _key: string;
          _type: string;
        }[];
        style?: string;
      }>();
    });
  });
});
