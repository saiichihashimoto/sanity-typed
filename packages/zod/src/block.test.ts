import { describe, expect, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, PortableTextBlock } from "@sanity-typed/types";

import { _sanityConfigToZods } from ".";

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
      const zods = _sanityConfigToZods(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "block",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          ],
        },
      ];

      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
        InferSchemaValues<typeof config>["foo"][number]
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
      const zods = _sanityConfigToZods(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "bar",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          ],
        },
      ];

      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
        InferSchemaValues<typeof config>["foo"][number]["_type"]
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
      const zods = _sanityConfigToZods(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "block",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
            { _key: "key", _type: "slug", current: "foo" },
          ],
        },
      ];

      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["children"]>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
        InferSchemaValues<typeof config>["foo"][number]["children"]
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
      const zods = _sanityConfigToZods(config);

      const unparsed = [
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
      ];

      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["children"]>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
        InferSchemaValues<typeof config>["foo"][number]["children"]
      >();
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
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        ...fields,
        _type: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
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
      const zods = _sanityConfigToZods(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "bar",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          ],
        },
      ];

      const parsed = zods.bar.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
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
              type: "block",
              of: [defineArrayMember({ type: "slug" })],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        ...fields,
        _type: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          { _key: "key", _type: "slug", current: "foo" },
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["children"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["children"]
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
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        ...fields,
        _type: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          { _key: "key", _type: "slug", current: "foo" },
          { _key: "key", _type: "geopoint", lat: 0, lng: 0 },
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)["children"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["children"]
      >();
    });
  });

  describe("validation", () => {
    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/285
    it.todo("custom(fn)");
  });
});
