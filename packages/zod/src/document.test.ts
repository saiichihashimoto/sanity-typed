import { describe, it } from "@jest/globals";
import type { Simplify } from "type-fest";
import type { z } from "zod";

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

      expectType<
        // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
        z.infer<(typeof zods)["foo"]>[number]
      >().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            ...fields,
            _type: "document",
            _key: "key",
            bar: true,
            tar: 1,
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _type: "document",
          _key: "key",
          bar: true,
          tar: 1,
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

      expectType<
        // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
        z.infer<(typeof zods)["foo"]>[number]
      >().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            ...fields,
            _key: "key",
            _type: "bar",
            bar: true,
            tar: 1,
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _key: "key",
          _type: "bar",
          bar: true,
          tar: 1,
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
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

      expectType<
        z.infer<
          // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
          (typeof zods)["foo"]
        >[number]
      >().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            ...fields,
            _type: "document",
            _key: "key",
            bar: { tar: 1 },
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _type: "document",
          _key: "key",
          bar: { tar: 1 },
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
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

      expectType<
        // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
        z.infer<(typeof zods)["foo"]>[number]
      >().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            ...fields,
            _type: "document",
            _key: "key",
            bar: true,
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _type: "document",
          _key: "key",
          bar: true,
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
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

      expectType<
        // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
        Required<z.infer<(typeof zods)["foo"]>>["bar"]
      >().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          bar: {
            ...fields,
            _type: "document",
            bar: true,
            tar: 1,
          },
        })
      ).toStrictEqual({
        _type: "foo",
        bar: {
          ...fields,
          _type: "document",
          bar: true,
          tar: 1,
        },
      });
      expect(() => zods.foo.parse(true)).toThrow();
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

      expectType<
        Required<
          z.infer<
            // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
            (typeof zods)["foo"]
          >
        >["bar"]
      >().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          bar: {
            ...fields,
            _type: "document",
            bar: { tar: 1 },
          },
        })
      ).toStrictEqual({
        _type: "foo",
        bar: {
          ...fields,
          _type: "document",
          bar: { tar: 1 },
        },
      });
      expect(() => zods.foo.parse(true)).toThrow();
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

      expectType<
        Required<
          z.infer<
            // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
            (typeof zods)["foo"]
          >
        >["bar"]
      >().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          bar: {
            ...fields,
            _type: "document",
            bar: true,
          },
        })
      ).toStrictEqual({
        _type: "foo",
        bar: {
          ...fields,
          _type: "document",
          bar: true,
        },
      });
      expect(() => zods.foo.parse(true)).toThrow();
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

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >();
      expect(
        zods.foo.parse({
          ...fields,
          _type: "foo",
          bar: true,
          tar: 1,
        })
      ).toStrictEqual({
        ...fields,
        _type: "foo",
        bar: true,
        tar: 1,
      });
      expect(() => zods.foo.parse(true)).toThrow();
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

      expectType<
        // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
        z.infer<(typeof zods)["bar"]>[number]["_type"]
      >().toStrictEqual<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
      >();
      expect(
        zods.bar.parse([
          {
            ...fields,
            _key: "key",
            _type: "bar",
            bar: true,
            tar: 1,
          },
        ])
      ).toStrictEqual([
        {
          ...fields,
          _key: "key",
          _type: "bar",
          bar: true,
          tar: 1,
        },
      ]);
      expect(() => zods.bar.parse([true])).toThrow();
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

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >();
      expect(
        zods.foo.parse({
          ...fields,
          _type: "foo",
          bar: { tar: 1 },
        })
      ).toStrictEqual({
        ...fields,
        _type: "foo",
        bar: { tar: 1 },
      });
      expect(() => zods.foo.parse(true)).toThrow();
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

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >();
      expect(
        zods.foo.parse({
          ...fields,
          _type: "foo",
          bar: true,
        })
      ).toStrictEqual({
        ...fields,
        _type: "foo",
        bar: true,
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });
});
