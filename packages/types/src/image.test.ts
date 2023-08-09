import { describe, it } from "@jest/globals";
import type {
  ImageCrop,
  ImageHotspot,
  ReferenceValue as ReferenceValueNative,
} from "sanity";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { ImageValue, _InferValue } from ".";

describe("image", () => {
  describe("defineArrayMember", () => {
    it("infers ImageValue", () => {
      const arrayMember = defineArrayMember({
        type: "image",
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        ImageValue & {
          _key: string;
        }
      >();
    });

    it("infers ImageValue with fields", () => {
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

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        {
          _key: string;
        } & {
          asset?: ReferenceValueNative;
          bar?: boolean;
          crop?: ImageCrop;
          hotspot?: ImageHotspot;
          tar?: number;
        }
      >();
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

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        {
          _key: string;
        } & {
          asset?: ReferenceValueNative;
          bar?: {
            tar?: number;
          };
          crop?: ImageCrop;
          hotspot?: ImageHotspot;
        }
      >();
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

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        {
          _key: string;
        } & {
          asset?: ReferenceValueNative;
          bar: boolean;
          crop?: ImageCrop;
          hotspot?: ImageHotspot;
        }
      >();
    });
  });

  describe("defineField", () => {
    it("infers ImageValue", () => {
      const field = defineField({
        name: "foo",
        type: "image",
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<ImageValue>();
    });

    it("infers ImageValue with fields", () => {
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

      expectType<_InferValue<typeof field>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar?: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
        tar?: number;
      }>();
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

      expectType<_InferValue<typeof field>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar?: {
          tar?: number;
        };
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
      }>();
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

      expectType<_InferValue<typeof field>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
      }>();
    });
  });

  describe("defineType", () => {
    it("infers ImageValue", () => {
      const type = defineType({
        name: "foo",
        type: "image",
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<ImageValue>();
    });

    it("infers ImageValue with fields", () => {
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

      expectType<_InferValue<typeof type>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar?: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
        tar?: number;
      }>();
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

      expectType<_InferValue<typeof type>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar?: {
          tar?: number;
        };
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
      }>();
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

      expectType<_InferValue<typeof type>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
      }>();
    });
  });
});
