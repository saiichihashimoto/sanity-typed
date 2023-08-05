import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { _InferValue } from ".";

describe("object", () => {
  describe("defineArrayMember", () => {
    it("infers object with fields", () => {
      const arrayMember = defineArrayMember({
        type: "object",
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
          bar?: boolean;
          tar?: number;
        }
      >();
    });

    it("infers nested objects", () => {
      const arrayMember = defineArrayMember({
        type: "object",
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
          bar?: {
            tar?: number;
          };
        }
      >();
    });

    it("infers required fields", () => {
      const arrayMember = defineArrayMember({
        type: "object",
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
          bar: boolean;
        }
      >();
    });
  });

  describe("defineField", () => {
    it("infers object with fields", () => {
      const field = defineField({
        name: "foo",
        type: "object",
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
        bar?: boolean;
        tar?: number;
      }>();
    });

    it("infers nested objects", () => {
      const field = defineField({
        name: "foo",
        type: "object",
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
        bar?: {
          tar?: number;
        };
      }>();
    });

    it("infers required fields", () => {
      const field = defineField({
        name: "foo",
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (Rule) => Rule.required(),
          }),
        ],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<{
        bar: boolean;
      }>();
    });
  });

  describe("defineType", () => {
    it("infers object with fields", () => {
      const type = defineType({
        name: "foo",
        type: "object",
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
        bar?: boolean;
        tar?: number;
      }>();
    });

    it("infers nested objects", () => {
      const type = defineType({
        name: "foo",
        type: "object",
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
        bar?: {
          tar?: number;
        };
      }>();
    });

    it("infers required fields", () => {
      const type = defineType({
        name: "foo",
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (Rule) => Rule.required(),
          }),
        ],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<{
        bar: boolean;
      }>();
    });
  });
});
