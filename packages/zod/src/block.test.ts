import { describe, it } from "@jest/globals";
import type { Simplify } from "type-fest";
import type { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, PortableTextBlock } from "@sanity-typed/types";

import { sanityConfigToZods } from ".";

const fields: Omit<PortableTextBlock, "_type" | "children"> = {
  level: 1,
  listItem: "listItem",
  markDefs: [{ _key: "key", _type: "type" }],
  style: "style",
};

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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>[number]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            ...fields,
            _key: "key",
            _type: "block",
            children: [
              { _key: "key", _type: "span", marks: ["mark"], text: "text" },
            ],
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _key: "key",
          _type: "block",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          ],
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
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
      const zods = sanityConfigToZods(config);

      expectType<
        z.infer<(typeof zods)["foo"]>[number]["_type"]
      >().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >();
      expect(
        zods.foo.parse([
          {
            ...fields,
            _key: "key",
            _type: "bar",
            children: [
              { _key: "key", _type: "span", marks: ["mark"], text: "text" },
            ],
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _key: "key",
          _type: "bar",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          ],
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
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
      const zods = sanityConfigToZods(config);

      expectType<
        z.infer<(typeof zods)["foo"]>[number]["children"]
      >().toStrictEqual<
        Simplify<
          InferSchemaValues<typeof config>["foo"][number]["children"][number]
        >[]
      >();
      expect(
        zods.foo.parse([
          {
            ...fields,
            _key: "key",
            _type: "block",
            children: [
              { _key: "key", _type: "span", marks: ["mark"], text: "text" },
              { _key: "key", _type: "slug", current: "foo" },
            ],
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _key: "key",
          _type: "block",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
            { _key: "key", _type: "slug", current: "foo" },
          ],
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
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
      const zods = sanityConfigToZods(config);

      expectType<
        z.infer<(typeof zods)["foo"]>[number]["children"]
      >().toStrictEqual<
        Simplify<
          InferSchemaValues<typeof config>["foo"][number]["children"][number]
        >[]
      >();
      expect(
        zods.foo.parse([
          {
            ...fields,
            _key: "key",
            _type: "block",
            children: [
              { _key: "key", _type: "span", marks: ["mark"], text: "text" },
              { _key: "key", _type: "slug", current: "foo" },
              { _key: "key", _type: "geopoint", lat: 0, lng: 0 },
            ],
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _key: "key",
          _type: "block",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
            { _key: "key", _type: "slug", current: "foo" },
            { _key: "key", _type: "geopoint", lat: 0, lng: 0 },
          ],
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
    });
  });

  describe("defineType", () => {
    it.failing("infers PortableTextBlock", () => {
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        // @ts-expect-error -- FIXME
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >();
      expect(
        zods.foo.parse({
          ...fields,
          _type: "foo",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          ],
        })
      ).toStrictEqual({
        ...fields,
        _type: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
        ],
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });

    it.failing("overwrites `_type` with defineArrayMember `name`", () => {
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>["_type"]>().toStrictEqual<
        // @ts-expect-error -- FIXME
        InferSchemaValues<typeof config>["foo"]["_type"]
      >();
      expect(
        zods.foo.parse({
          ...fields,
          _type: "bar",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          ],
        })
      ).toStrictEqual({
        ...fields,
        _type: "bar",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
        ],
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });

    it.failing("infers array of members", () => {
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>["children"]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"]["children"][number]>[]
      >();
      expect(
        zods.foo.parse({
          ...fields,
          _type: "foo",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
            { _key: "key", _type: "slug", current: "foo" },
          ],
        })
      ).toStrictEqual({
        ...fields,
        _type: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          { _key: "key", _type: "slug", current: "foo" },
        ],
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });

    it.failing("infers unions if there are multiple members", () => {
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>["children"]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"]["children"][number]>[]
      >();
      expect(
        zods.foo.parse({
          ...fields,
          _type: "foo",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
            { _key: "key", _type: "slug", current: "foo" },
            { _key: "key", _type: "geopoint", lat: 0, lng: 0 },
          ],
        })
      ).toStrictEqual({
        ...fields,
        _type: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          { _key: "key", _type: "slug", current: "foo" },
          { _key: "key", _type: "geopoint", lat: 0, lng: 0 },
        ],
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });
});
