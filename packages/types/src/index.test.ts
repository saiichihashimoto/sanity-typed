import { describe, it } from "@jest/globals";
import type { PortableTextBlock } from "@portabletext/types";
import {
  defineArrayMember as defineArrayMemberNative,
  defineField as defineFieldNative,
} from "@sanity/types";
import type {
  FileValue,
  GeopointValue,
  ImageValue,
  Reference,
  SlugValue,
} from "@sanity/types";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField } from ".";
import type { InferValue } from ".";

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

    it("infers a block", () => {
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

    it("infers a boolean", () => {
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

    it("infers something strange", () => {
      const field = defineArrayMember({
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<
        NonNullable<unknown>
      >();
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

    it("infers a string", () => {
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

    it("infers a string", () => {
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
          fields: [],
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "document",
          fields: [],
        })
      ));

    it("infers an unknown object", () => {
      const field = defineArrayMember({
        type: "document",
        fields: [],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        [key: string]: unknown;
      }>();
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

    it("infers a FileValue", () => {
      const field = defineArrayMember({
        type: "file",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<FileValue>();
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

    it("infers a GeopointValue", () => {
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

    it("infers an ImageValue", () => {
      const field = defineArrayMember({
        type: "image",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<ImageValue>();
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

    it("infers a number", () => {
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
          fields: [],
        })
      ).toStrictEqual(
        defineArrayMemberNative({
          type: "object",
          fields: [],
        })
      ));

    it("infers an unknown object", () => {
      const field = defineArrayMember({
        type: "object",
        fields: [],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        [key: string]: unknown;
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

    it("infers a Reference", () => {
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

    it("infers a SlugValue", () => {
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

    it("infers a string", () => {
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

    it("infers a string", () => {
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

    it("infers a string", () => {
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

    it("infers a never[]", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<never[]>();
    });

    it("infers an array of the member", () => {
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

    it("infers a block", () => {
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

    it("infers a boolean", () => {
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

      expectType<InferValue<typeof field>>().toStrictEqual<
        NonNullable<unknown>
      >();
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

    it("infers a string", () => {
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

    it("infers a string", () => {
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
          fields: [],
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "document",
          fields: [],
        })
      ));

    it("infers an unknown object", () => {
      const field = defineField({
        name: "foo",
        type: "document",
        fields: [],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        [key: string]: unknown;
      }>();
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

    it("infers a FileValue", () => {
      const field = defineField({
        name: "foo",
        type: "file",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<FileValue>();
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

    it("infers a GeopointValue", () => {
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

    it("infers an ImageValue", () => {
      const field = defineField({
        name: "foo",
        type: "image",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<ImageValue>();
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

    it("infers a number", () => {
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
          fields: [],
        })
      ).toStrictEqual(
        defineFieldNative({
          name: "foo",
          type: "object",
          fields: [],
        })
      ));

    it("infers an unknown object", () => {
      const field = defineField({
        name: "foo",
        type: "object",
        fields: [],
      });

      expectType<InferValue<typeof field>>().toStrictEqual<{
        [key: string]: unknown;
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

    it("infers a Reference", () => {
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

    it("infers a SlugValue", () => {
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

    it("infers a string", () => {
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

    it("infers a string", () => {
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

    it("infers a string", () => {
      const field = defineField({
        name: "foo",
        type: "url",
      });

      expectType<InferValue<typeof field>>().toStrictEqual<string>();
    });
  });
});
