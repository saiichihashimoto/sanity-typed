import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import type { PortableTextBlock } from "@portabletext-typed/types";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { enableZod } from ".";
import { sanityConfigToZodsTyped } from "./internal";

const fields: Omit<PortableTextBlock, "_type" | "children"> = {
  level: 1,
  listItem: "bullet",
  markDefs: [],
  style: "normal",
};

describe("block", () => {
  describe("defineArrayMember", () => {
    it("builds parser for PortableTextBlock", () => {
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
      const zods = sanityConfigToZodsTyped(config);

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

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toEqual<
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
      const zods = sanityConfigToZodsTyped(config);

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

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >();
    });

    it("builds parser for array of members", () => {
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
      const zods = sanityConfigToZodsTyped(config);

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

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["children"]>().toEqual<
        InferSchemaValues<typeof config>["foo"][number]["children"]
      >();
    });

    it("builds parser for unions if there are multiple members", () => {
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
      const zods = sanityConfigToZodsTyped(config);

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

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["children"]>().toEqual<
        InferSchemaValues<typeof config>["foo"][number]["children"]
      >();
    });

    it("builds parser for style", async () => {
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
                  styles: [
                    { title: "Foo", value: "foo" as const },
                    { title: "Bar", value: "bar" as const },
                  ],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "block",
          style: "foo",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          ],
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });

    it("builds parser for listItem", async () => {
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
                  lists: [
                    { title: "Foo", value: "foo" as const },
                    { title: "Bar", value: "bar" as const },
                  ],
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "block",
          listItem: "foo",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          ],
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });

    it("builds parser for decorator", async () => {
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
                  marks: {
                    decorators: [
                      { title: "Foo", value: "foo" as const },
                      { title: "Bar", value: "bar" as const },
                    ],
                  },
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

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

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });

    it("builds parser for markDefs", async () => {
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
                  marks: {
                    annotations: [
                      defineArrayMember({
                        name: "internalLink",
                        type: "object",
                        fields: [
                          defineField({
                            name: "reference",
                            type: "reference",
                            to: [{ type: "post" as const }],
                          }),
                        ],
                      }),
                    ],
                  },
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = [
        {
          ...fields,
          _key: "key",
          _type: "block",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "text" },
          ],
          markDefs: [
            {
              _key: "key",
              _type: "internalLink",
              reference: { _ref: "foo", _type: "reference" },
            },
          ],
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });
  });

  describe("defineType", () => {
    it("builds parser for PortableTextBlock", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        ...fields,
        _type: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toEqual<
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
      const zods = sanityConfigToZodsTyped(config);

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

    it("builds parser for array of members", () => {
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
      const zods = sanityConfigToZodsTyped(config);

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
      expectType<(typeof parsed)["children"]>().toEqual<
        InferSchemaValues<typeof config>["foo"]["children"]
      >();
    });

    it("builds parser for unions if there are multiple members", () => {
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
      const zods = sanityConfigToZodsTyped(config);

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
      expectType<(typeof parsed)["children"]>().toEqual<
        InferSchemaValues<typeof config>["foo"]["children"]
      >();
    });

    it("builds parser for style", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              styles: [
                { title: "Foo", value: "foo" as const },
                { title: "Bar", value: "bar" as const },
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        ...fields,
        _type: "foo",
        style: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("builds parser for listItem", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              lists: [
                { title: "Foo", value: "foo" as const },
                { title: "Bar", value: "bar" as const },
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        ...fields,
        _type: "foo",
        listItem: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("builds parser for decorator", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              marks: {
                decorators: [
                  { title: "Foo", value: "foo" as const },
                  { title: "Bar", value: "bar" as const },
                ],
              },
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        ...fields,
        _type: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("builds parser for markDefs", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              marks: {
                annotations: [
                  defineArrayMember({
                    name: "internalLink",
                    type: "object",
                    fields: [
                      defineField({
                        name: "reference",
                        type: "reference",
                        to: [{ type: "post" as const }],
                      }),
                    ],
                  }),
                ],
              },
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        ...fields,
        _type: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "text" },
        ],
        markDefs: [
          {
            _key: "key",
            _type: "internalLink",
            reference: { _ref: "foo", _type: "reference" },
          },
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });
  });

  describe("validation", () => {
    it("custom(fn)", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              validation: (Rule) =>
                Rule.custom(() => "fail for no reason").custom(
                  enableZod(
                    (value) =>
                      value?.children[0]?.text !== "bar" ||
                      "value can't be `bar`"
                  )
                ),
            }),
          ],
        },
      });
      const zods = sanityConfigToZodsTyped(config);

      expect(
        zods.foo.parse({
          ...fields,
          _type: "foo",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "foo" },
          ],
        })
      ).toStrictEqual({
        ...fields,
        _type: "foo",
        children: [
          { _key: "key", _type: "span", marks: ["mark"], text: "foo" },
        ],
      });
      expect(() =>
        zods.foo.parse({
          ...fields,
          _type: "foo",
          children: [
            { _key: "key", _type: "span", marks: ["mark"], text: "bar" },
          ],
        })
      ).toThrow("value can't be `bar`");
    });
  });
});
