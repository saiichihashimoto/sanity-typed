import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, PortableTextBlock } from "@sanity-typed/types";

import { enableZod } from ".";
import { sanityConfigToZodsTyped } from "./internal";

const fields: Omit<PortableTextBlock, "_type" | "children"> = {
  level: 1,
  listItem: "listItem",
  markDefs: [{ _key: "key", _type: "type" }],
  style: "style",
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
      expectType<(typeof parsed)[number]>().toStrictEqual<
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

      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["children"]>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
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

      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["children"]>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
        InferSchemaValues<typeof config>["foo"][number]["children"]
      >();
    });

    it("accepts styles", async () => {
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
                    { title: "Foo", value: "foo" },
                    { title: "Bar", value: "bar" },
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
          ],
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });

    it("accepts lists", async () => {
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
                    { title: "Foo", value: "foo" },
                    { title: "Bar", value: "bar" },
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
          ],
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });

    it("accepts decorators", async () => {
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
                      { title: "Foo", value: "foo" },
                      { title: "Bar", value: "bar" },
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
      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });

    it("accepts annotations", async () => {
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
                      {
                        name: "internalLink",
                        type: "object",
                        title: "Internal link",
                        fields: [
                          {
                            name: "reference",
                            type: "reference",
                            title: "Reference",
                            to: [{ type: "post" }],
                          },
                        ],
                      },
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
      expectType<(typeof parsed)[number]>().toStrictEqual<
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
      expectType<(typeof parsed)["children"]>().toStrictEqual<
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
      expectType<(typeof parsed)["children"]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]["children"]
      >();
    });

    it("accepts styles", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              styles: [
                { title: "Foo", value: "foo" },
                { title: "Bar", value: "bar" },
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
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("accepts lists", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              lists: [
                { title: "Foo", value: "foo" },
                { title: "Bar", value: "bar" },
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
        ],
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("accepts decorators", async () => {
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
                  { title: "Foo", value: "foo" },
                  { title: "Bar", value: "bar" },
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
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("accepts annotations", async () => {
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
                  {
                    name: "internalLink",
                    type: "object",
                    title: "Internal link",
                    fields: [
                      {
                        name: "reference",
                        type: "reference",
                        title: "Reference",
                        to: [{ type: "post" }],
                      },
                    ],
                  },
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
      expectType<typeof parsed>().toStrictEqual<
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

      expect(() =>
        zods.foo.parse({
          ...fields,
          _type: "foo",
          children: [{ _key: "key", _type: "span", text: "foo" }],
        })
      ).not.toThrow();
      expect(() =>
        zods.foo.parse({
          ...fields,
          _type: "foo",
          children: [{ _key: "key", _type: "span", text: "bar" }],
        })
      ).toThrow("value can't be `bar`");
    });
  });
});
