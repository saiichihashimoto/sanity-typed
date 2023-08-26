import { describe, expect, it } from "@jest/globals";
import type { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { _InferValue } from "@sanity-typed/types";

import { sanityZod } from ".";

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
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // FIXME defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
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
            type: "document",
            fields: [
              defineField({
                name: "tar",
                type: "number",
              }),
            ],
          }),
        ],
      });
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // FIXME defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
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
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // FIXME defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
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
      const zod = sanityZod(field);

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
            type: "document",
            fields: [
              defineField({
                name: "tar",
                type: "number",
              }),
            ],
          }),
        ],
      });
      const zod = sanityZod(field);

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
      const zod = sanityZod(field);

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
      const zod = sanityZod(type);

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
            type: "document",
            fields: [
              defineField({
                name: "tar",
                type: "number",
              }),
            ],
          }),
        ],
      });
      const zod = sanityZod(type);

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
      const zod = sanityZod(type);

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
    it.todo("builds parser for SanityDocument with fields");
  });

  describe("definePlugin", () => {
    it.todo("builds parser for SanityDocument with fields");
  });
});
