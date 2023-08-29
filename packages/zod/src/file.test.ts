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

describe("file", () => {
  describe("defineArrayMember", () => {
    it("builds parser for FileValue", () => {
      const arrayMember = defineArrayMember({
        type: "file",
      });
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // TODO defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
      >();
      expect(zod.parse({ _type: "file" })).toStrictEqual({ _type: "file" });
      expect(
        zod.parse({
          _type: "file",
          asset: { _ref: "ref", _type: "type" },
        })
      ).toStrictEqual({
        _type: "file",
        asset: { _ref: "ref", _type: "type" },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("builds parser for FileValue with fields", () => {
      const arrayMember = defineArrayMember({
        type: "file",
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
          // TODO defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
      >();
      expect(zod.parse({ _type: "file" })).toStrictEqual({ _type: "file" });
      expect(
        zod.parse({
          _type: "file",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
          tar: 5,
        })
      ).toStrictEqual({
        _type: "file",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const arrayMember = defineArrayMember({
        type: "file",
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
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // TODO defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
      >();
      expect(zod.parse({ _type: "file" })).toStrictEqual({ _type: "file" });
      expect(
        zod.parse({
          _type: "file",
          asset: { _ref: "ref", _type: "type" },
          bar: { tar: 5 },
        })
      ).toStrictEqual({
        _type: "file",
        asset: { _ref: "ref", _type: "type" },
        bar: { tar: 5 },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const arrayMember = defineArrayMember({
        type: "file",
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
          // TODO defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
      >();
      expect(
        zod.parse({
          _type: "file",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
        })
      ).toStrictEqual({
        _type: "file",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
      });
      expect(() => zod.parse({ _type: "file" })).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for FileValue with fields", () => {
      const field = defineField({
        name: "foo",
        type: "file",
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
      expect(zod.parse({ _type: "file" })).toStrictEqual({ _type: "file" });
      expect(
        zod.parse({
          _type: "file",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
          tar: 5,
        })
      ).toStrictEqual({
        _type: "file",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const field = defineField({
        name: "foo",
        type: "file",
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
      const zod = sanityZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
      >();
      expect(zod.parse({ _type: "file" })).toStrictEqual({ _type: "file" });
      expect(
        zod.parse({
          _type: "file",
          asset: { _ref: "ref", _type: "type" },
          bar: { tar: 5 },
        })
      ).toStrictEqual({
        _type: "file",
        asset: { _ref: "ref", _type: "type" },
        bar: { tar: 5 },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const field = defineField({
        name: "foo",
        type: "file",
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
          _type: "file",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
        })
      ).toStrictEqual({
        _type: "file",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
      });
      expect(() => zod.parse({ _type: "file" })).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for FileValue with fields", () => {
      const type = defineType({
        name: "foo",
        type: "file",
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
      expect(zod.parse({ _type: "file" })).toStrictEqual({ _type: "file" });
      expect(
        zod.parse({
          _type: "file",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
          tar: 5,
        })
      ).toStrictEqual({
        _type: "file",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const type = defineType({
        name: "foo",
        type: "file",
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
      const zod = sanityZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(zod.parse({ _type: "file" })).toStrictEqual({ _type: "file" });
      expect(
        zod.parse({
          _type: "file",
          asset: { _ref: "ref", _type: "type" },
          bar: { tar: 5 },
        })
      ).toStrictEqual({
        _type: "file",
        asset: { _ref: "ref", _type: "type" },
        bar: { tar: 5 },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const type = defineType({
        name: "foo",
        type: "file",
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
          _type: "file",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
        })
      ).toStrictEqual({
        _type: "file",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
      });
      expect(() => zod.parse({ _type: "file" })).toThrow();
    });
  });
});
