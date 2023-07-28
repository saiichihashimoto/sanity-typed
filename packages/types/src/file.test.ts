import { describe, it } from "@jest/globals";
import type { ReferenceValue as ReferenceValueNative } from "sanity";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { FileValue, _InferValue } from ".";

describe("file", () => {
  describe("defineArrayMember", () => {
    it("infers FileValue", () => {
      const arrayMember = defineArrayMember({
        type: "file",
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<FileValue>();
    });

    it("infers FileValue with fields", () => {
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

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar?: boolean;
        tar?: number;
      }>();
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

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar?: {
          tar?: number;
        };
      }>();
    });

    it("infers required fields", () => {
      const arrayMember = defineArrayMember({
        type: "file",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (rule) => rule.required(),
          }),
        ],
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar: boolean;
      }>();
    });
  });

  describe("defineField", () => {
    it("infers FileValue", () => {
      const field = defineField({
        name: "foo",
        type: "file",
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<FileValue>();
    });

    it("infers FileValue with fields", () => {
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

      expectType<_InferValue<typeof field>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar?: boolean;
        tar?: number;
      }>();
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

      expectType<_InferValue<typeof field>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar?: {
          tar?: number;
        };
      }>();
    });

    it("infers required fields", () => {
      const field = defineField({
        name: "foo",
        type: "file",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (rule) => rule.required(),
          }),
        ],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar: boolean;
      }>();
    });
  });

  describe("defineType", () => {
    it("infers FileValue", () => {
      const type = defineType({
        name: "foo",
        type: "file",
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<FileValue>();
    });

    it("infers FileValue with fields", () => {
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

      expectType<_InferValue<typeof type>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar?: boolean;
        tar?: number;
      }>();
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

      expectType<_InferValue<typeof type>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar?: {
          tar?: number;
        };
      }>();
    });

    it("infers required fields", () => {
      const type = defineType({
        name: "foo",
        type: "file",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (rule) => rule.required(),
          }),
        ],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<{
        asset?: ReferenceValueNative;
        bar: boolean;
      }>();
    });
  });
});
