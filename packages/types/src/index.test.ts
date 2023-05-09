import { describe, it } from "@jest/globals";
import type { PortableTextBlock } from "@portabletext/types";
import {
  defineArrayMember as defineArrayMemberNative,
  defineField as defineFieldNative,
  defineType as defineTypeNative,
} from "@sanity/types";
import type {
  ArrayOfEntry,
  BooleanDefinition,
  DateDefinition,
  DatetimeDefinition,
  EmailDefinition,
  FieldDefinition,
  FieldDefinitionBase,
  FileValue,
  GeopointDefinition,
  GeopointValue,
  ImageCrop,
  ImageHotspot,
  ImageValue,
  NumberDefinition,
  Reference,
  ReferenceDefinition,
  SlugDefinition,
  SlugValue,
  StringDefinition,
  TextDefinition,
  UrlDefinition,
} from "@sanity/types";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { ArrayDefinition, BlockDefinition, InferValue } from ".";

describe("defineArrayMember", () => {
  describe("block", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "block",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "block",
        })
      ));

    it("infers PortableTextBlock", () => {
      const field = defineArrayMember({
        type: "block",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<PortableTextBlock>();
    });
  });

  describe("boolean", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "boolean",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "boolean",
        })
      ));

    it("infers boolean", () => {
      const field = defineArrayMember({
        type: "boolean",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<boolean>();
    });
  });

  describe("crossDatasetReference", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "crossDatasetReference",
          to: [],
          dataset: "foo",
          projectId: "bar",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "crossDatasetReference",
          to: [],
          dataset: "foo",
          projectId: "bar",
        })
      ));

    it("infers unknown", () => {
      const field = defineArrayMember({
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<unknown>();
    });
  });

  describe("date", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "date",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "date",
        })
      ));

    it("infers string", () => {
      const field = defineArrayMember({
        type: "date",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("datetime", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "datetime",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "datetime",
        })
      ));

    it("infers string", () => {
      const field = defineArrayMember({
        type: "datetime",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("document", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "document",
          fields: [
            defineField({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "document",
          fields: [
            defineFieldNative({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ));

    it("infers SanityDocument with fields", () => {
      const field = defineArrayMember({
        type: "document",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: string;
        _updatedAt: string;
        bar: boolean;
        tar: number;
      }>();
    });
  });

  describe("email", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "email",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "email",
        })
      ));

    it("infers string", () => {
      const field = defineArrayMember({
        type: "email",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("file", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "file",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "file",
        })
      ));

    it("infers FileValue", () => {
      const field = defineArrayMember({
        type: "file",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<FileValue>();
    });

    it("infers FileValue with fields", () => {
      const field = defineArrayMember({
        type: "file",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        asset?: Reference;
        bar: boolean;
        tar: number;
      }>();
    });
  });

  describe("geopoint", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "geopoint",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "geopoint",
        })
      ));

    it("infers GeopointValue", () => {
      const field = defineArrayMember({
        type: "geopoint",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        Omit<GeopointValue, "_type">
      >();
    });
  });

  describe("image", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "image",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "image",
        })
      ));

    it("infers ImageValue", () => {
      const field = defineArrayMember({
        type: "image",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<ImageValue>();
    });

    it("infers ImageValue with fields", () => {
      const field = defineArrayMember({
        type: "image",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        asset?: Reference;
        bar: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
        tar: number;
      }>();
    });
  });

  describe("number", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "number",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "number",
        })
      ));

    it("infers number", () => {
      const field = defineArrayMember({
        type: "number",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<number>();
    });
  });

  describe("object", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "object",
          fields: [
            defineFieldNative({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ));

    it("infers object with fields", () => {
      const field = defineArrayMember({
        type: "object",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        bar: boolean;
        tar: number;
      }>();
    });
  });

  describe("reference", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "reference",
          to: [],
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "reference",
          to: [],
        })
      ));

    it("infers Reference", () => {
      const field = defineArrayMember({
        type: "reference",
        to: [],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        Omit<Reference, "_type">
      >();
    });
  });

  describe("slug", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "slug",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "slug",
        })
      ));

    it("infers SlugValue", () => {
      const field = defineArrayMember({
        type: "slug",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        Omit<SlugValue, "_type">
      >();
    });
  });

  describe("string", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "string",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "string",
        })
      ));

    it("infers string", () => {
      const field = defineArrayMember({
        type: "string",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("text", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "text",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "text",
        })
      ));

    it("infers string", () => {
      const field = defineArrayMember({
        type: "text",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("url", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineArrayMember({
          type: "url",
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "url",
        })
      ));

    it("infers string", () => {
      const field = defineArrayMember({
        type: "url",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });
});

describe("defineField", () => {
  describe("array", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "array",
          of: [defineArrayMember({ type: "boolean" })],
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "array",
          of: [defineArrayMemberNative({ type: "boolean" })],
        })
      ));

    it("infers array of the member", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [defineArrayMember({ type: "boolean" })],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<boolean[]>();
    });

    it("infers unions if there are multiple members", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({ type: "boolean" }),
          defineArrayMember({ type: "string" }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        (boolean | string)[]
      >();
    });

    it('adds "_key" to objects', () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({
                name: "bar" as const,
                type: "boolean",
              }),
            ],
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        {
          _key: string;
          bar: boolean;
        }[]
      >();
    });
  });

  describe("block", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "block",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "block",
        })
      ));

    it("infers PortableTextBlock", () => {
      const field = defineField({
        name: "foo",
        type: "block",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<PortableTextBlock>();
    });
  });

  describe("boolean", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "boolean",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "boolean",
        })
      ));

    it("infers boolean", () => {
      const field = defineField({
        name: "foo",
        type: "boolean",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<boolean>();
    });
  });

  describe("crossDatasetReference", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "crossDatasetReference",
          to: [],
          dataset: "foo",
          projectId: "bar",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "crossDatasetReference",
          to: [],
          dataset: "foo",
          projectId: "bar",
        })
      ));

    it("infers something string", () => {
      const field = defineField({
        name: "foo",
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<unknown>();
    });
  });

  describe("date", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "date",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "date",
        })
      ));

    it("infers string", () => {
      const field = defineField({
        name: "foo",
        type: "date",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("datetime", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "datetime",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "datetime",
        })
      ));

    it("infers string", () => {
      const field = defineField({
        name: "foo",
        type: "datetime",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("document", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "document",
          fields: [
            defineField({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "document",
          fields: [
            defineFieldNative({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ));

    it("infers SanityDocument with fields", () => {
      const field = defineField({
        name: "foo",
        type: "document",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: string;
        _updatedAt: string;
        bar: boolean;
        tar: number;
      }>();
    });
  });

  describe("email", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "email",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "email",
        })
      ));

    it("infers string", () => {
      const field = defineField({
        name: "foo",
        type: "email",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("file", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "file",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "file",
        })
      ));

    it("infers FileValue", () => {
      const field = defineField({
        name: "foo",
        type: "file",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<FileValue>();
    });

    it("infers FileValue with fields", () => {
      const field = defineField({
        name: "foo",
        type: "file",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        asset?: Reference;
        bar: boolean;
        tar: number;
      }>();
    });
  });

  describe("geopoint", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "geopoint",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "geopoint",
        })
      ));

    it("infers GeopointValue", () => {
      const field = defineField({
        name: "foo",
        type: "geopoint",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        Omit<GeopointValue, "_type">
      >();
    });
  });

  describe("image", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "image",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "image",
        })
      ));

    it("infers ImageValue", () => {
      const field = defineField({
        name: "foo",
        type: "image",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<ImageValue>();
    });

    it("infers ImageValue with fields", () => {
      const field = defineField({
        name: "foo",
        type: "image",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        asset?: Reference;
        bar: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
        tar: number;
      }>();
    });
  });

  describe("number", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "number",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "number",
        })
      ));

    it("infers number", () => {
      const field = defineField({
        name: "foo",
        type: "number",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<number>();
    });
  });

  describe("object", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "object",
          fields: [
            defineField({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "object",
          fields: [
            defineFieldNative({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ));

    it("infers object with fields", () => {
      const field = defineField({
        name: "foo",
        type: "object",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        bar: boolean;
        tar: number;
      }>();
    });
  });

  describe("reference", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "reference",
          to: [],
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "reference",
          to: [],
        })
      ));

    it("infers Reference", () => {
      const field = defineField({
        name: "foo",
        type: "reference",
        to: [],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        Omit<Reference, "_type">
      >();
    });
  });

  describe("slug", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "slug",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "slug",
        })
      ));

    it("infers SlugValue", () => {
      const field = defineField({
        name: "foo",
        type: "slug",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        Omit<SlugValue, "_type">
      >();
    });
  });

  describe("string", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "string",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "string",
        })
      ));

    it("infers string", () => {
      const field = defineField({
        name: "foo",
        type: "string",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("text", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "text",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "text",
        })
      ));

    it("infers string", () => {
      const field = defineField({
        name: "foo",
        type: "text",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("url", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineField({
          name: "foo",
          type: "url",
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "url",
        })
      ));

    it("infers string", () => {
      const field = defineField({
        name: "foo",
        type: "url",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });
});

describe("defineType", () => {
  describe("array", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "array",
          of: [defineArrayMember({ type: "boolean" })],
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "array",
          of: [defineArrayMemberNative({ type: "boolean" })],
        })
      ));

    it("infers array of the member", () => {
      const field = defineType({
        name: "foo",
        type: "array",
        of: [defineArrayMember({ type: "boolean" })],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<boolean[]>();
    });

    it("infers unions if there are multiple members", () => {
      const field = defineType({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({ type: "boolean" }),
          defineArrayMember({ type: "string" }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        (boolean | string)[]
      >();
    });
  });

  describe("block", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "block",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "block",
        })
      ));

    it("infers PortableTextBlock", () => {
      const field = defineType({
        name: "foo",
        type: "block",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<PortableTextBlock>();
    });
  });

  describe("boolean", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "boolean",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "boolean",
        })
      ));

    it("infers boolean", () => {
      const field = defineType({
        name: "foo",
        type: "boolean",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<boolean>();
    });
  });

  describe("crossDatasetReference", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "crossDatasetReference",
          to: [],
          dataset: "foo",
          projectId: "bar",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "crossDatasetReference",
          to: [],
          dataset: "foo",
          projectId: "bar",
        })
      ));

    it("infers something string", () => {
      const field = defineType({
        name: "foo",
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<unknown>();
    });
  });

  describe("date", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "date",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "date",
        })
      ));

    it("infers string", () => {
      const field = defineType({
        name: "foo",
        type: "date",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("datetime", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "datetime",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "datetime",
        })
      ));

    it("infers string", () => {
      const field = defineType({
        name: "foo",
        type: "datetime",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("document", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "document",
          fields: [
            defineField({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "document",
          fields: [
            defineFieldNative({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ));

    it("infers SanityDocument with fields", () => {
      const field = defineType({
        name: "foo",
        type: "document",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: string;
        _updatedAt: string;
        bar: boolean;
        tar: number;
      }>();
    });
  });

  describe("email", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "email",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "email",
        })
      ));

    it("infers string", () => {
      const field = defineType({
        name: "foo",
        type: "email",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("file", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "file",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "file",
        })
      ));

    it("infers FileValue", () => {
      const field = defineType({
        name: "foo",
        type: "file",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<FileValue>();
    });

    it("infers FileValue with fields", () => {
      const field = defineType({
        name: "foo",
        type: "file",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        asset?: Reference;
        bar: boolean;
        tar: number;
      }>();
    });
  });

  describe("geopoint", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "geopoint",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "geopoint",
        })
      ));

    it("infers GeopointValue", () => {
      const field = defineType({
        name: "foo",
        type: "geopoint",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        Omit<GeopointValue, "_type">
      >();
    });
  });

  describe("image", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "image",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "image",
        })
      ));

    it("infers ImageValue", () => {
      const field = defineType({
        name: "foo",
        type: "image",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<ImageValue>();
    });

    it("infers ImageValue with fields", () => {
      const field = defineType({
        name: "foo",
        type: "image",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        asset?: Reference;
        bar: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
        tar: number;
      }>();
    });
  });

  describe("number", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "number",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "number",
        })
      ));

    it("infers number", () => {
      const field = defineType({
        name: "foo",
        type: "number",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<number>();
    });
  });

  describe("object", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "object",
          fields: [
            defineField({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "object",
          fields: [
            defineFieldNative({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      ));

    it("infers object with fields", () => {
      const field = defineType({
        name: "foo",
        type: "object",
        fields: [
          defineField({
            // FIXME Why do we need "as const?"
            name: "bar" as const,
            type: "boolean",
          }),
          defineField({
            // FIXME Why do we need "as const?"
            name: "tar" as const,
            type: "number",
          }),
        ],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        bar: boolean;
        tar: number;
      }>();
    });
  });

  describe("reference", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "reference",
          to: [],
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "reference",
          to: [],
        })
      ));

    it("infers Reference", () => {
      const field = defineType({
        name: "foo",
        type: "reference",
        to: [],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        Omit<Reference, "_type">
      >();
    });
  });

  describe("slug", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "slug",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "slug",
        })
      ));

    it("infers SlugValue", () => {
      const field = defineType({
        name: "foo",
        type: "slug",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        Omit<SlugValue, "_type">
      >();
    });
  });

  describe("string", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "string",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "string",
        })
      ));

    it("infers string", () => {
      const field = defineType({
        name: "foo",
        type: "string",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("text", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "text",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "text",
        })
      ));

    it("infers string", () => {
      const field = defineType({
        name: "foo",
        type: "text",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("url", () => {
    it("returns the same object as sanity", () =>
      expect(
        defineType({
          name: "foo",
          type: "url",
        })
      ).toStrictEqual(
        defineTypeNative({
          name: "foo",
          type: "url",
        })
      ));

    it("infers string", () => {
      const field = defineType({
        name: "foo",
        type: "url",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });
});

describe("https://github.com/sanity-io/sanity/blob/v3.10.0/packages/%40sanity/types/src/schema/test", () => {
  describe("alias", () => {
    it.todo(
      "https://github.com/sanity-io/sanity/blob/v3.10.0/packages/%40sanity/types/src/schema/test/alias.test.ts"
    );
  });

  describe("array", () => {
    it.todo(
      "https://github.com/sanity-io/sanity/blob/v3.10.0/packages/%40sanity/types/src/schema/test/array.test.ts"
    );
  });

  describe("boolean", () => {
    it("should define boolean schema", () => {
      const booleanDef = defineType({
        type: "boolean",
        name: "custom-boolean",
        title: "Custom",
        icon: () => null,
        description: "Description",
        initialValue: async () => true,
        validation: (Rule) => [
          Rule.required()
            .required()
            .custom(() => true)
            .warning(),
          // @ts-expect-error -- greaterThan does not exist on BooleanRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
        options: {
          layout: "checkbox",
        },
      });

      expectType<typeof booleanDef>().toBeAssignableTo<BooleanDefinition>();
      expectType<typeof booleanDef>().not.toBeAssignableTo<StringDefinition>();
    });
  });

  describe("block", () => {
    it("should define block schema", () => {
      const blockDef = defineType({
        type: "block",
        name: "custom-block",
        title: "Custom PTE",
        icon: () => null,
        description: "Description",
        // FIXME https://github.com/sanity-io/sanity/issues/4464
        // initialValue: async () => [],
        // validation: (Rule) => [
        //   Rule.required()
        //     .required()
        //     .custom((value) =>
        //       value?.filter((t) => !t).length === 1 ? "Error" : true
        //     )
        //     .warning(),
        //   // @ts-expect-error -- greaterThan does not exist on BlockRule
        //   Rule.greaterThan(5).error(),
        // ],
        hidden: () => false,
        readOnly: () => false,
        styles: [{ title: "Quote", value: "blockquote" }],
        lists: [{ title: "Bullet", value: "bullet" }],
        marks: {
          decorators: [
            { title: "Strong", value: "strong" },
            { title: "Emphasis", value: "em" },
            {
              title: "Sup",
              value: "sup",
              icon: () => null,
            },
          ],
          annotations: [
            {
              name: "authorInline",
              title: "Author",
              type: "reference",
              to: { type: "author" },
            },
            { type: "author", initialValue: {} },
            { type: "object", fields: [{ name: "title", type: "string" }] },
          ],
        },
        of: [{ type: "string" }],
        options: {
          spellCheck: true,
        },
      });

      expectType<typeof blockDef>().toBeAssignableTo<BlockDefinition>();
      expectType<typeof blockDef>().not.toBeAssignableTo<BooleanDefinition>();
    });
  });

  it("should define block field and arrayOf", () => {
    const field = defineField({
      type: "block",
      name: "pteField",
      title: "Custom PTE",
      icon: () => null,
      styles: [{ title: "Quote", value: "blockquote" }],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          {
            title: "Sup",
            value: "sup",
            icon: () => null,
          },
        ],
        annotations: [
          {
            name: "author",
            title: "Author",
            type: "reference",
            to: { type: "author" },
          },
        ],
      },
      of: [{ type: "string" }],
      options: {
        spellCheck: true,
      },
    });

    expectType<typeof field>().toBeAssignableTo<BlockDefinition>();

    const arrayOf = defineArrayMember({
      type: "block",
      name: "pteField",
      title: "Custom PTE",
      icon: () => null,
      styles: [{ title: "Quote", value: "blockquote" }],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          {
            title: "Sup",
            value: "sup",
            icon: () => null,
          },
        ],
        annotations: [
          {
            name: "author",
            title: "Author",
            type: "reference",
            to: { type: "author" },
          },
        ],
      },
      of: [{ type: "string" }],
      options: {
        spellCheck: true,
      },
    });

    expectType<typeof arrayOf>().toBeAssignableTo<
      ArrayOfEntry<BlockDefinition>
    >();
  });

  it("should allow block fields in array defineType as inline definition", () => {
    const type = defineType({
      type: "array",
      name: "pte",
      of: [
        defineArrayMember({
          type: "block",
          name: "pte",
          styles: [{ title: "Quote", value: "blockquote" }],
          lists: [{ title: "Bullet", value: "bullet" }],
          marks: {
            decorators: [{ title: "Strong", value: "strong" }],
            annotations: [
              {
                name: "author",
                title: "Author",
                type: "reference",
                to: { type: "author" },
              },
            ],
          },
        }),
      ],
    });

    expectType<typeof type>().toBeAssignableTo<
      ArrayDefinition<[ArrayOfEntry<BlockDefinition>]>
    >();
  });

  describe("date", () => {
    it("should define date schema", () => {
      const dateDef = defineType({
        type: "date",
        name: "custom-date",
        title: "Custom",
        placeholder: "blabal",
        icon: () => null,
        description: "Description",
        initialValue: async () => "2021-01-01",
        validation: (Rule) => [
          Rule.required()
            .required()
            .custom((value) =>
              (value?.indexOf("2021-01-01") ?? -1) >= 0 ? "Error" : true
            )
            .warning(),
          // @ts-expect-error -- greaterThan does not exist on dateRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
        options: {
          dateFormat: "YYYY-MM-DD",
        },
      });

      expectType<typeof dateDef>().toBeAssignableTo<DateDefinition>();
      expectType<typeof dateDef>().not.toBeAssignableTo<StringDefinition>();
    });

    it("should support Rule.valueOfField calls inside defineField", () => {
      const dateDef = defineField({
        type: "date",
        name: "defineField-defined",
        description:
          "field defined with defineField, containing validation using Rule.valueOfField",
        validation: (Rule) => {
          const fieldRef = Rule.valueOfField("some-other-field");
          return Rule.min(fieldRef).max(fieldRef);
        },
      });

      expectType<typeof dateDef>().toBeAssignableTo<DateDefinition>();
    });
  });

  describe("datetime", () => {
    it("should define datetime schema", () => {
      const datetimeDef = defineType({
        type: "datetime",
        name: "custom-datetime",
        title: "Custom",
        placeholder: "balba",
        icon: () => null,
        description: "Description",
        initialValue: async () => "2021-01-01",
        validation: (Rule) => [
          Rule.required()
            .min("2021-01-01")
            .max("2021-01-01")
            .required()
            .custom((value) =>
              (value?.indexOf("2021-01-01") ?? -1) >= 0 ? "Error" : true
            )
            .warning(),
          // @ts-expect-error -- greaterThan does not exist on DatetimeRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
        options: {
          dateFormat: "YYYY-MM-DD",
          timeFormat: "10:10",
          timeStep: 2,
        },
      });

      expectType<typeof datetimeDef>().toBeAssignableTo<DatetimeDefinition>();
      expectType<typeof datetimeDef>().not.toBeAssignableTo<StringDefinition>();
    });

    it("should support Rule.valueOfField calls inside defineField", () => {
      const datetimeDef = defineField({
        type: "datetime",
        name: "defineField-defined",
        description:
          "field defined with defineField, containing validation using Rule.valueOfField",
        validation: (Rule) => {
          const fieldRef = Rule.valueOfField("some-other-field");
          return Rule.min(fieldRef).max(fieldRef);
        },
      });

      expectType<typeof datetimeDef>().toBeAssignableTo<DatetimeDefinition>();
    });
  });

  describe("document", () => {
    it.todo(
      "https://github.com/sanity-io/sanity/blob/v3.10.0/packages/%40sanity/types/src/schema/test/document.test.ts"
    );
  });

  describe("email", () => {
    it("should define email schema", () => {
      const emailDef = defineType({
        type: "email",
        name: "custom-email",
        title: "Custom email",
        description: "Description",
        placeholder: "daff",
        initialValue: async () => "email",
        validation: (Rule) => [
          Rule.required()
            .custom((value) =>
              value?.toUpperCase() === "SHOUT" ? "Error" : true
            )
            .warning(),
          // @ts-expect-error -- greaterThan is not on emailRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
        readOnly: () => false,
      });

      expectType<typeof emailDef>().toBeAssignableTo<EmailDefinition>();
      expectType<typeof emailDef>().not.toBeAssignableTo<BooleanDefinition>();
    });
  });

  describe("file", () => {
    it.todo(
      "https://github.com/sanity-io/sanity/blob/v3.10.0/packages/%40sanity/types/src/schema/test/file.test.ts"
    );
  });

  describe("generic", () => {
    it("should capture literal string type", () => {
      const stringDef = defineType({
        type: "string",
        name: "custom-string",
      });

      expectType<typeof stringDef.type>().toStrictEqual<"string">();
      expectType<typeof stringDef.name>().toStrictEqual<"custom-string">();

      const stringField = defineField({
        type: "string",
        name: "custom-string",
      });

      expectType<typeof stringField.type>().toStrictEqual<"string">();
      expectType<typeof stringField.name>().toStrictEqual<"custom-string">();

      const stringArrayOf = defineArrayMember({
        type: "string",
        name: "custom-string",
      });

      expectType<typeof stringArrayOf.type>().toStrictEqual<"string">();
      expectType<typeof stringArrayOf.name>().toStrictEqual<
        "custom-string" | undefined
      >();
    });

    it("should support using all the define functions within each-other", () => {
      const type = defineType({
        type: "object",
        name: "custom-object",
        fields: [
          defineField({
            type: "array",
            name: "arrayField",
            title: "Things",
            of: [
              defineArrayMember({
                type: "object",
                name: "type-name-in-array",
                fields: [
                  defineField({
                    type: "string",
                    name: "title",
                    title: "Title",
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      expectType<typeof type>().toBeAssignableTo<any>();
    });

    it("should support optional strictness", () => {
      const type1 = defineType({
        type: "string",
        name: "custom-string",
        // @ts-expect-error -- we are in strict mode, so this is not allowed
        doc18n: true,
      });

      expectType<typeof type1>().toBeAssignableTo<any>();

      const type2 = defineType(
        {
          type: "string",
          name: "custom-string",
          // @ts-expect-error -- we are in strict mode, so this is not allowed
          doc18n: true,
        },
        { strict: true }
      );

      expectType<typeof type2>().toBeAssignableTo<any>();

      const type3 = defineType(
        {
          type: "string",
          name: "custom-string",
          // strict mode disabled so unknown props are types as any
          doc18n: true,
        },
        { strict: false }
      );

      expectType<typeof type3>().toBeAssignableTo<any>();

      const type4 = defineType(
        {
          type: "string",
          name: "custom-string",
          options: {
            custom: true,
          },
        },
        { strict: false }
      );

      expectType<typeof type4>().toBeAssignableTo<any>();
    });

    it("should fail for missing fields", () => {
      const type1 = defineType({
        // @ts-expect-error -- did you mean to write type?
        type1: "string",
      });

      expectType<typeof type1>().toBeAssignableTo<any>();

      // @ts-expect-error -- name is missing
      const type2 = defineType({
        type: "string",
      });

      expectType<typeof type2>().toBeAssignableTo<any>();

      const type3 = defineType({
        type: "string",
        name: "custom-string",
        // @ts-expect-error -- disallow unknown props
        unknownProp: false,
      });

      expectType<typeof type3>().toBeAssignableTo<any>();
    });

    it("should allow ReactElement for description", () => {
      const type1 = defineType({
        type: "text",
        name: "text",
        description: "Some text",
      });

      expectType<typeof type1>().toBeAssignableTo<any>();

      // TODO
      // const type2 = defineType({
      //   type: "text",
      //   name: "text",
      //   description: <strong>Some like it bold</strong>,
      // });

      // expectType<typeof type2>().toBeAssignableTo<any>();

      // const type3 = defineType({
      //   type: "text",
      //   name: "text",
      //   // @ts-expect-error -- ReactElement but not ReactNode
      //   description: () => <strong>Render function not supported</strong>,
      // });

      // expectType<typeof type3>().toBeAssignableTo<any>();
    });
  });

  describe("geopoint", () => {
    it("should define geopoint schema", () => {
      const geopointDef = defineType({
        type: "geopoint",
        name: "custom-geopoint",
        title: "Custom",
        icon: () => null,
        description: "Description",
        initialValue: async () => ({
          lat: 1,
          lng: 2,
          alt: 2,
        }),
        validation: (Rule) => [
          Rule.required()
            .required()
            .custom((value) => (value?.alt === 2 ? "Error" : true))
            .warning(),
          // @ts-expect-error -- greaterThan does not exist on geopointRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
      });

      expectType<typeof geopointDef>().toBeAssignableTo<GeopointDefinition>();
      expectType<typeof geopointDef>().not.toBeAssignableTo<StringDefinition>();
    });
  });

  describe("image", () => {
    it.todo(
      "https://github.com/sanity-io/sanity/blob/v3.10.0/packages/%40sanity/types/src/schema/test/image.test.ts"
    );
  });

  describe("number", () => {
    it("should define number schema", () => {
      const numberDef = defineType({
        type: "number",
        name: "custom-number",
        title: "Custom",
        placeholder: "badbf",
        icon: () => null,
        description: "Description",
        initialValue: 10,
        validation: (Rule) => [
          Rule.required()
            .required()
            .min(1)
            .max(2)
            .lessThan(5)
            .greaterThan(10)
            .integer()
            .precision(3)
            .positive()
            .negative()
            .custom((value) => (value?.toFixed(1) === "2.0" ? "Error" : true))
            .warning(),
          // @ts-expect-error -- something does not exist on numberRule
          Rule.something(5).error(),
        ],
        hidden: () => false,
        options: {
          layout: "radio",
          list: [2, 4],
          direction: "vertical",
        },
      });

      expectType<typeof numberDef>().toBeAssignableTo<NumberDefinition>();
      expectType<typeof numberDef>().not.toBeAssignableTo<StringDefinition>();
    });
  });

  it("should support Rule.valueOfField calls inside defineField", () => {
    const numberField = defineField({
      type: "number",
      name: "defineField-defined",
      description:
        "field defined with defineField, containing validation using Rule.valueOfField",
      validation: (Rule) => {
        const fieldRef = Rule.valueOfField("some-other-field");
        return Rule.min(fieldRef)
          .max(fieldRef)
          .lessThan(fieldRef)
          .greaterThan(fieldRef)
          .precision(fieldRef);
      },
    });

    expectType<typeof numberField>().toBeAssignableTo<NumberDefinition>();
  });

  describe("object", () => {
    it.todo(
      "https://github.com/sanity-io/sanity/blob/v3.10.0/packages/%40sanity/types/src/schema/test/object.test.ts"
    );
  });

  describe("reference", () => {
    it("should define reference schema", () => {
      const referenceDef = defineType({
        type: "reference",
        name: "custom-reference",
        title: "Custom PTE",
        icon: () => null,
        description: "Description",
        initialValue: async () => ({ _ref: "yolo" }),
        validation: (Rule) => [
          Rule.required()
            .required()
            .custom(
              (
                value // eslint-disable-next-line no-underscore-dangle -- _ref is a valid property
              ) => (value?._ref.toLowerCase() ? "Error" : true)
            )
            .warning(),
          // @ts-expect-error -- greaterThan does not exist on referenceRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
        readOnly: () => false,
        weak: true,
        to: [{ type: "crewMember" }],
        options: {
          disableNew: false,
          filter: async ({ document: { _type: param } }) => ({
            filter: "*[field==$param]",
            params: {
              param,
            },
          }),
        },
      });

      expectType<typeof referenceDef>().toBeAssignableTo<ReferenceDefinition>();
      expectType<
        typeof referenceDef
      >().not.toBeAssignableTo<BooleanDefinition>();
    });

    it("should allow reference without filter in options", () => {
      const referenceDef = defineType({
        type: "reference",
        name: "custom-reference",
        title: "Custom PTE",
        to: [{ type: "crewMember" }],
        options: {
          disableNew: false,
        },
      });

      expectType<typeof referenceDef>().toBeAssignableTo<ReferenceDefinition>();
    });

    it("should not allow filterParams when filter is function", () => {
      const referenceDef = defineType({
        type: "reference",
        name: "custom-reference",
        title: "Custom PTE",
        to: [{ type: "crewMember" }],
        options: {
          // @ts-expect-error -- function is not assignable to string (when filterParams is provided, filter must be string)
          filter: () => ({}),
          filterParams: { not: "allowed" },
        },
      });

      expectType<typeof referenceDef>().toBeAssignableTo<ReferenceDefinition>();
    });

    it("should allow filterParams when filter is string", () => {
      const referenceDef = defineType({
        type: "reference",
        name: "custom-reference",
        title: "Custom PTE",
        to: [{ type: "crewMember" }],
        options: {
          filter: "*",
          filterParams: { is: "allowed" },
        },
      });

      expectType<typeof referenceDef>().toBeAssignableTo<ReferenceDefinition>();
    });
  });

  describe("slug", () => {
    it("should define slug schema", () => {
      const slugDef = defineType({
        type: "slug",
        name: "custom-slug",
        title: "Custom",
        icon: () => null,
        description: "Description",
        initialValue: () => ({ current: "some-value" }),
        validation: (Rule) => [
          Rule.required()
            .required()
            .custom((value) => (value?.current ? true : "Error"))
            .warning(),
          // @ts-expect-error -- greaterThan does not exist on slugRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
        options: {
          // TODO test all permutations of options and ensure param contents
          isUnique: (slugValue) => slugValue.toLowerCase() === "whatever",
          maxLength: 50,
          source: () => "title",
          slugify: (input) => input.toUpperCase(),
        },
      });

      expectType<typeof slugDef>().toBeAssignableTo<SlugDefinition>();
      expectType<typeof slugDef>().not.toBeAssignableTo<StringDefinition>();
    });
  });

  describe("string", () => {
    it("should define string schema", () => {
      const stringDef = defineType({
        type: "string",
        name: "custom-string",
        title: "Custom string",
        description: "Description",
        placeholder: "fdsasfd",
        initialValue: async () => "string",
        validation: (Rule) => [
          Rule.required()
            .min(1)
            .max(10)
            .length(10)
            .uppercase()
            .lowercase()
            .regex(/a+/, "test", { name: "yeah", invert: true })
            .regex(/a+/, { name: "yeah", invert: true })
            .regex(/a+/, "test")
            .regex(/a+/)
            .email()
            .custom((value) =>
              value?.toUpperCase() === "SHOUT" ? "Error" : true
            )
            .warning(),
          // @ts-expect-error -- greaterThan is not on StringRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
        readOnly: () => false,
        options: {
          layout: "radio",
          direction: "horizontal",
          list: [{ value: "A", title: "An entry" }],
        },
      });

      expectType<typeof stringDef>().toBeAssignableTo<StringDefinition>();
      expectType<typeof stringDef>().not.toBeAssignableTo<BooleanDefinition>();
    });

    it("should fail compilation for string with incorrect options", () => {
      const stringDef = defineType({
        type: "string",
        name: "custom-string",
        title: "Custom string",
        options: {
          // @ts-expect-error -- unsassignable is not assiagnable to layout
          layout: "unsassignable",
          // @ts-expect-error -- unsassignable is not assiagnable to direction
          direction: "unsassignable",
          list: [
            {
              // @ts-expect-error -- object-literals may only assign known fields
              unknownField: "A",
              title: "An entry",
            },
          ],
        },
      });

      expectType<typeof stringDef>().toBeAssignableTo<StringDefinition>();
    });

    it("should not have type-helping fields not on string", () => {
      const stringDef = defineType({
        type: "string",
        name: "custom-string",
        // @ts-expect-error -- preview does not exist in type StringDefinition
        preview: {},
        of: [],
      });

      expectType<typeof stringDef>().toBeAssignableTo<StringDefinition>();
    });

    it.skip("should define string field", () => {
      const stringField = defineField({
        type: "string",
        name: "stringField",
        title: "String",
        fieldset: "test",
        group: "test",
        description: "Description",
        initialValue: async () => "string",
        validation: (Rule) => [
          Rule.required()
            .min(1)
            .max(10)
            .length(10)
            .uppercase()
            .lowercase()
            .regex(/a+/, "test", { name: "yeah", invert: true })
            .regex(/a+/, { name: "yeah", invert: true })
            .regex(/a+/, "test")
            .regex(/a+/)
            .custom((value) =>
              value?.toUpperCase() === "SHOUT" ? "Error" : true
            )
            .warning(),
          // @ts-expect-error -- greaterThan is not on StringRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
        readOnly: () => false,
        options: {
          layout: "radio",
          direction: "horizontal",
          list: [{ value: "A", title: "An entry" }],
        },
      });

      expectType<typeof stringField>().toBeAssignableTo<
        FieldDefinitionBase & StringDefinition
      >();

      expectType<typeof stringField.name>().toBeAssignableTo<"stringField">();

      const fieldDef = defineField({
        type: "string",
        name: "nestedField",
        options: {
          layout: "dropdown",
        },
      });

      expectType<
        typeof fieldDef
      >().toBeAssignableTo<// @ts-expect-error -- FIXME
      FieldDefinition>();
    });

    it("should support Rule.valueOfField calls", () => {
      const stringField: StringDefinition = defineField({
        type: "string",
        name: "defineField-defined",
        description:
          "field defined with defineField, containing validation using Rule.valueOfField",
        validation: (Rule) => {
          const fieldRef = Rule.valueOfField("some-other-field");
          return Rule.min(fieldRef).max(fieldRef).max(10);
        },
      });

      expectType<typeof stringField>().toBeAssignableTo<StringDefinition>();
    });
  });

  describe("text", () => {
    it("should define text schema", () => {
      const textDef = defineType({
        type: "text",
        name: "custom-text",
        title: "Custom text",
        description: "Description",
        placeholder: "fdsasfd",
        initialValue: async () => "text",
        validation: (Rule) => [
          Rule.required()
            .min(1)
            .max(10)
            .length(10)
            .uppercase()
            .lowercase()
            .regex(/a+/, "test", { name: "yeah", invert: true })
            .regex(/a+/, { name: "yeah", invert: true })
            .regex(/a+/, "test")
            .regex(/a+/)
            .custom((value) =>
              value?.toUpperCase() === "SHOUT" ? "Error" : true
            )
            .warning(),
          // @ts-expect-error -- greaterThan is not on textRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
        readOnly: () => false,
        options: {
          layout: "radio",
          direction: "horizontal",
          list: [{ value: "A", title: "An entry" }],
        },
      });

      expectType<typeof textDef>().toBeAssignableTo<TextDefinition>();
      expectType<typeof textDef>().not.toBeAssignableTo<BooleanDefinition>();
    });
  });

  describe("typeMerge", () => {
    it.todo(
      "https://github.com/sanity-io/sanity/blob/v3.10.0/packages/%40sanity/types/src/schema/test/typeMerge.test.ts"
    );
  });

  describe("url", () => {
    it("should define url schema", () => {
      const urlDef = defineType({
        type: "url",
        name: "custom-url",
        title: "Custom url",
        description: "Description",
        placeholder: "daff",
        initialValue: async () => "url",
        validation: (Rule) => [
          Rule.required()
            .uri({
              scheme: "https",
              allowCredentials: true,
              allowRelative: true,
              relativeOnly: false,
            })
            .custom((value) =>
              value?.toUpperCase() === "SHOUT" ? "Error" : true
            )
            .warning(),
          // @ts-expect-error -- greaterThan is not on urlRule
          Rule.greaterThan(5).error(),
        ],
        hidden: () => false,
        readOnly: () => false,
        options: {
          layout: "radio",
          direction: "horizontal",
          list: [{ value: "A", title: "An entry" }],
        },
      });

      expectType<typeof urlDef>().toBeAssignableTo<UrlDefinition>();
      expectType<typeof urlDef>().not.toBeAssignableTo<BooleanDefinition>();
    });
  });
});
