import { base, en } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";
import { sanityConfigToZods } from "@sanity-typed/zod";

import { customFaker } from ".";
import { sanityConfigToFakerTyped } from "./internal";

describe.each(Array.from({ length: 5 }).map((_, seed) => [{ seed }]))(
  "block %p",
  ({ seed }) => {
    describe("defineArrayMember", () => {
      it("mocks PortableTextBlock", () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<(typeof fake)[number]>().toStrictEqual<
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<(typeof fake)[number]>().toEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("mocks array of members", () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<(typeof fake)[number]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("mocks unions if there are multiple members", () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<(typeof fake)[number]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("mocks style", async () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<(typeof fake)[number]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("mocks listItem", async () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<(typeof fake)[number]>().toStrictEqual<
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<(typeof fake)[number]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });

      it("mocks markDefs", async () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<(typeof fake)[number]>().toEqual<
          InferSchemaValues<typeof config>["foo"][number]
        >();
      });
    });

    describe("defineType", () => {
      it("mocks PortableTextBlock", () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<typeof fake>().toStrictEqual<
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("mocks array of members", () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("mocks unions if there are multiple members", () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("mocks style", async () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("mocks listItem", async () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<typeof fake>().toStrictEqual<
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });

      it("mocks markDefs", async () => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<typeof fake>().toEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
      });
    });

    describe("customMock", () => {
      it("overrides mock", () => {
        const config = defineConfig({
          dataset: "dataset",
          projectId: "projectId",
          schema: {
            types: [
              customFaker(
                defineType({
                  name: "foo",
                  type: "block",
                }),
                (faker, previous) => ({
                  ...previous,
                  children: [
                    {
                      _key: "key",
                      _type: "span" as const,
                      marks: ["mark"],
                      text: "foo",
                    },
                  ],
                })
              ),
            ],
          },
        });
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fake = sanityFaker.foo();

        const zods = sanityConfigToZods(config);

        expect(() => zods.foo.parse(fake)).not.toThrow();
        expectType<typeof fake>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
        >();
        expect(fake).toHaveProperty("children", [
          { _key: "key", _type: "span" as const, marks: ["mark"], text: "foo" },
        ]);
      });
    });
  }
);
