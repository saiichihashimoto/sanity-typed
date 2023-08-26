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

describe("image", () => {
  describe("defineArrayMember", () => {
    it("builds parser for ImageValue", () => {
      const arrayMember = defineArrayMember({
        type: "image",
      });
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // FIXME defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
      >();
      expect(zod.parse({ _type: "image" })).toStrictEqual({ _type: "image" });
      expect(
        zod.parse({
          _type: "image",
          asset: { _ref: "ref", _type: "type" },
          crop: {
            _type: "sanity.imageCrop",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
          hotspot: {
            _type: "sanity.imageHotspot",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          },
        })
      ).toStrictEqual({
        _type: "image",
        asset: { _ref: "ref", _type: "type" },
        crop: {
          _type: "sanity.imageCrop",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("builds parser for ImageValue with fields", () => {
      const arrayMember = defineArrayMember({
        type: "image",
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
      expect(zod.parse({ _type: "image" })).toStrictEqual({ _type: "image" });
      expect(
        zod.parse({
          _type: "image",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
          crop: {
            _type: "sanity.imageCrop",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
          hotspot: {
            _type: "sanity.imageHotspot",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          },
          tar: 5,
        })
      ).toStrictEqual({
        _type: "image",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
        crop: {
          _type: "sanity.imageCrop",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const arrayMember = defineArrayMember({
        type: "image",
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
          // FIXME defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
      >();
      expect(zod.parse({ _type: "image" })).toStrictEqual({ _type: "image" });
      expect(
        zod.parse({
          _type: "image",
          asset: { _ref: "ref", _type: "type" },
          bar: { tar: 5 },
          crop: {
            _type: "sanity.imageCrop",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
          hotspot: {
            _type: "sanity.imageHotspot",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          },
        })
      ).toStrictEqual({
        _type: "image",
        asset: { _ref: "ref", _type: "type" },
        bar: { tar: 5 },
        crop: {
          _type: "sanity.imageCrop",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const arrayMember = defineArrayMember({
        type: "image",
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
          _type: "image",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
          crop: {
            _type: "sanity.imageCrop",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
          hotspot: {
            _type: "sanity.imageHotspot",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          },
        })
      ).toStrictEqual({
        _type: "image",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
        crop: {
          _type: "sanity.imageCrop",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
      });
      expect(() => zod.parse({ _type: "image" })).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for ImageValue with fields", () => {
      const field = defineField({
        name: "foo",
        type: "image",
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
      expect(zod.parse({ _type: "image" })).toStrictEqual({ _type: "image" });
      expect(
        zod.parse({
          _type: "image",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
          crop: {
            _type: "sanity.imageCrop",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
          hotspot: {
            _type: "sanity.imageHotspot",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          },
          tar: 5,
        })
      ).toStrictEqual({
        _type: "image",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
        crop: {
          _type: "sanity.imageCrop",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const field = defineField({
        name: "foo",
        type: "image",
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
      expect(zod.parse({ _type: "image" })).toStrictEqual({ _type: "image" });
      expect(
        zod.parse({
          _type: "image",
          asset: { _ref: "ref", _type: "type" },
          bar: { tar: 5 },
          crop: {
            _type: "sanity.imageCrop",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
          hotspot: {
            _type: "sanity.imageHotspot",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          },
        })
      ).toStrictEqual({
        _type: "image",
        asset: { _ref: "ref", _type: "type" },
        bar: { tar: 5 },
        crop: {
          _type: "sanity.imageCrop",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const field = defineField({
        name: "foo",
        type: "image",
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
          _type: "image",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
          crop: {
            _type: "sanity.imageCrop",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
          hotspot: {
            _type: "sanity.imageHotspot",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          },
        })
      ).toStrictEqual({
        _type: "image",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
        crop: {
          _type: "sanity.imageCrop",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
      });
      expect(() => zod.parse({ _type: "image" })).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for ImageValue with fields", () => {
      const type = defineType({
        name: "foo",
        type: "image",
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
      expect(zod.parse({ _type: "image" })).toStrictEqual({ _type: "image" });
      expect(
        zod.parse({
          _type: "image",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
          crop: {
            _type: "sanity.imageCrop",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
          hotspot: {
            _type: "sanity.imageHotspot",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          },
          tar: 5,
        })
      ).toStrictEqual({
        _type: "image",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
        crop: {
          _type: "sanity.imageCrop",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const type = defineType({
        name: "foo",
        type: "image",
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
      expect(zod.parse({ _type: "image" })).toStrictEqual({ _type: "image" });
      expect(
        zod.parse({
          _type: "image",
          asset: { _ref: "ref", _type: "type" },
          bar: { tar: 5 },
          crop: {
            _type: "sanity.imageCrop",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
          hotspot: {
            _type: "sanity.imageHotspot",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          },
        })
      ).toStrictEqual({
        _type: "image",
        asset: { _ref: "ref", _type: "type" },
        bar: { tar: 5 },
        crop: {
          _type: "sanity.imageCrop",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const type = defineType({
        name: "foo",
        type: "image",
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
          _type: "image",
          asset: { _ref: "ref", _type: "type" },
          bar: true,
          crop: {
            _type: "sanity.imageCrop",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
          hotspot: {
            _type: "sanity.imageHotspot",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          },
        })
      ).toStrictEqual({
        _type: "image",
        asset: { _ref: "ref", _type: "type" },
        bar: true,
        crop: {
          _type: "sanity.imageCrop",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
      });
      expect(() => zod.parse({ _type: "image" })).toThrow();
    });
  });
});
