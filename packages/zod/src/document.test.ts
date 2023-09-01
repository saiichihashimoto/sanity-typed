import { describe, expect, it } from "@jest/globals";
import type { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  definePlugin,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, _InferValue } from "@sanity-typed/types";

import { _sanityTypeToZod, sanityConfigToZods } from ".";

describe("document", () => {
  describe("defineArrayMember", () => {
    it("builds parser for SanityDocument with fields", () => {
      const arrayMember = defineArrayMember({
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
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferValue<typeof arrayMember>, "_key">
      >();
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
      });
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: true,
          tar: 5,
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: true,
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const arrayMember = defineArrayMember({
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
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferValue<typeof arrayMember>, "_key">
      >();
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
      });
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: { tar: 5 },
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: { tar: 5 },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const arrayMember = defineArrayMember({
        name: "foo",
        type: "document",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (Rule) => Rule.required(),
          }),
        ],
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferValue<typeof arrayMember>, "_key">
      >();
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: true,
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: true,
      });
      expect(() =>
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
        })
      ).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for SanityDocument with fields", () => {
      const field = defineField({
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
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
      >();
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
      });
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: true,
          tar: 5,
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: true,
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const field = defineField({
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
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
      >();
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
      });
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: { tar: 5 },
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: { tar: 5 },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const field = defineField({
        name: "foo",
        type: "document",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (Rule) => Rule.required(),
          }),
        ],
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
      >();
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: true,
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: true,
      });
      expect(() =>
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
        })
      ).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for SanityDocument with fields", () => {
      const type = defineType({
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
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
      });
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: true,
          tar: 5,
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: true,
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const type = defineType({
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
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
      });
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: { tar: 5 },
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: { tar: 5 },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const type = defineType({
        name: "foo",
        type: "document",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (Rule) => Rule.required(),
          }),
        ],
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: true,
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: true,
      });
      expect(() =>
        zod.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
        })
      ).toThrow();
    });
  });

  describe("defineConfig", () => {
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
              ],
            }),
          ],
        },
      });

      const zods = sanityConfigToZods(config);

      expectType<{
        [TName in keyof typeof zods]: z.infer<(typeof zods)[TName]>;
      }>().toStrictEqual<InferSchemaValues<typeof config>>();
      expect(
        zods.foo.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: true,
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: true,
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });

  describe("definePlugin", () => {
    it("builds parser for SanityDocument with fields", () => {
      const plugin = definePlugin({
        name: "plugin",
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
              ],
            }),
          ],
        },
      })();

      const zods = sanityConfigToZods(plugin);

      expectType<{
        [TName in keyof typeof zods]: z.infer<(typeof zods)[TName]>;
      }>().toStrictEqual<InferSchemaValues<typeof plugin>>();
      expect(
        zods.foo.parse({
          _createdAt: "createdAt",
          _id: "id",
          _rev: "rev",
          _type: "foo",
          _updatedAt: "updatedAt",
          bar: true,
        })
      ).toStrictEqual({
        _createdAt: "createdAt",
        _id: "id",
        _rev: "rev",
        _type: "foo",
        _updatedAt: "updatedAt",
        bar: true,
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });
});
