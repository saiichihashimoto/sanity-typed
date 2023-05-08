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

      // @ts-expect-error -- FIXME
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

      // @ts-expect-error -- FIXME
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
