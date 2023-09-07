import { describe, it } from "@jest/globals";
import type { Simplify } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, SanityDocument } from "@sanity-typed/types";

import { _sanityConfigToZods } from ".";

const fields: Omit<SanityDocument, "_type"> = {
  _id: "id",
  _createdAt: "createdAt",
  _updatedAt: "updatedAt",
  _rev: "rev",
};

describe("document", () => {
  describe("defineArrayMember", () => {
    it("builds parser for SanityDocument with fields", () => {
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
                  type: "document",
                  fields: [
                    defineField({
                      name: "bar",
                      type: "boolean",
                    }),
                    defineField({
                      name: "tar",
                      type: "number",
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
        {
          ...fields,
          _type: "document",
          _key: "key",
          bar: true,
          tar: 1,
        },
      ]);

      // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
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
                  type: "document",
                  fields: [
                    defineField({
                      name: "bar",
                      type: "boolean",
                    }),
                    defineField({
                      name: "tar",
                      type: "number",
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
      const parsed = zods.foo.parse([
        {
          ...fields,
          _key: "key",
          _type: "bar",
          bar: true,
          tar: 1,
        },
      ]);

      expectType<(typeof parsed)[number]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
    });

    it("infers nested objects", () => {
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
                  type: "document",
                  fields: [
                    defineField({
                      name: "bar",
                      type: "object",
                      fields: [
                        defineField({
                          name: "tar",
                          type: "number",
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

      // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
      const parsed = zods.foo.parse([
        {
          ...fields,
          _type: "document",
          _key: "key",
          bar: { tar: 1 },
        },
      ]);

      expectType<(typeof parsed)[number]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
    });

    it("infers required fields", () => {
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
                  type: "document",
                  fields: [
                    defineField({
                      name: "bar",
                      type: "boolean",
                      validation: (Rule) => Rule.required(),
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
        {
          ...fields,
          _type: "document",
          _key: "key",
          bar: true,
        },
      ]);

      // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
    });
  });

  describe("defineField", () => {
    it("builds parser for SanityDocument with fields", () => {
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
                  type: "document",
                  fields: [
                    defineField({
                      name: "bar",
                      type: "boolean",
                    }),
                    defineField({
                      name: "tar",
                      type: "number",
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
      const parsed = zods.foo.parse({
        _type: "foo",
        bar: {
          ...fields,
          _type: "document",
          bar: true,
          tar: 1,
        },
      });

      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
    });

    it("infers nested objects", () => {
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
                  type: "document",
                  fields: [
                    defineField({
                      name: "bar",
                      type: "object",
                      fields: [
                        defineField({
                          name: "tar",
                          type: "number",
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

      // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
      const parsed = zods.foo.parse({
        _type: "foo",
        bar: {
          ...fields,
          _type: "document",
          bar: { tar: 1 },
        },
      });

      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
    });

    it("infers required fields", () => {
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
                  type: "document",
                  fields: [
                    defineField({
                      name: "bar",
                      type: "boolean",
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
      const parsed = zods.foo.parse({
        _type: "foo",
        bar: {
          ...fields,
          _type: "document",
          bar: true,
        },
      });

      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
    });
  });

  describe("defineType", () => {
    it("builds parser for SanityDocument with fields", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "bar",
                  type: "boolean",
                }),
                defineField({
                  name: "tar",
                  type: "number",
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse({
        ...fields,
        _type: "foo",
        bar: true,
        tar: 1,
      });

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
              type: "document",
              fields: [
                defineField({
                  name: "bar",
                  type: "boolean",
                }),
                defineField({
                  name: "tar",
                  type: "number",
                }),
              ],
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

      const parsed = zods.bar.parse([
        {
          ...fields,
          _key: "key",
          _type: "bar",
          bar: true,
          tar: 1,
        },
      ]);

      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
      >();
    });

    it("infers nested objects", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "bar",
                  type: "object",
                  fields: [
                    defineField({
                      name: "tar",
                      type: "number",
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
        ...fields,
        _type: "foo",
        bar: { tar: 1 },
      });

      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("infers required fields", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "bar",
                  type: "boolean",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const parsed = zods.foo.parse({
        ...fields,
        _type: "foo",
        bar: true,
      });

      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });
  });
});
