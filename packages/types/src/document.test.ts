import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  definePlugin,
  defineType,
} from ".";
import type { InferSchemaValues, _InferValue } from ".";

describe("document", () => {
  describe("defineArrayMember", () => {
    it("infers SanityDocument with fields", () => {
      const field = defineArrayMember({
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

      expectType<_InferValue<typeof field>>().toStrictEqual<
        {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "foo";
          _updatedAt: string;
          bar?: boolean;
          tar?: number;
        } & {
          _key: string;
        }
      >();
    });

    it("infers nested objects", () => {
      const field = defineArrayMember({
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

      expectType<_InferValue<typeof field>>().toStrictEqual<
        {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "foo";
          _updatedAt: string;
          bar?: {
            tar?: number;
          };
        } & {
          _key: string;
        }
      >();
    });

    it("infers required fields", () => {
      const field = defineArrayMember({
        name: "foo",
        type: "document",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (rule) => rule.required(),
          }),
        ],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<
        {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "foo";
          _updatedAt: string;
          bar: boolean;
        } & {
          _key: string;
        }
      >();
    });
  });

  describe("defineField", () => {
    it("infers SanityDocument with fields", () => {
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

      expectType<_InferValue<typeof field>>().toStrictEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        // FIXME documents as field have _type: "document";
        _updatedAt: string;
        bar?: boolean;
        tar?: number;
      }>();
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

      expectType<_InferValue<typeof field>>().toStrictEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar?: {
          tar?: number;
        };
      }>();
    });

    it("infers required fields", () => {
      const field = defineField({
        name: "foo",
        type: "document",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (rule) => rule.required(),
          }),
        ],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar: boolean;
      }>();
    });
  });

  describe("defineType", () => {
    it("infers SanityDocument with fields", () => {
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

      expectType<_InferValue<typeof type>>().toStrictEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar?: boolean;
        tar?: number;
      }>();
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

      expectType<_InferValue<typeof type>>().toStrictEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar?: {
          tar?: number;
        };
      }>();
    });

    it("infers required fields", () => {
      const type = defineType({
        name: "foo",
        type: "document",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (rule) => rule.required(),
          }),
        ],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar: boolean;
      }>();
    });
  });

  describe("defineConfig", () => {
    it("infers SanityDocument with fields", () => {
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

      type Values = InferSchemaValues<typeof config>;

      expectType<Values>().toStrictEqual<{
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "foo";
          _updatedAt: string;
          bar?: boolean;
        };
      }>();
    });
  });

  describe("definePlugin", () => {
    it("infers SanityDocument with fields", () => {
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

      type Values = InferSchemaValues<typeof plugin>;

      expectType<Values>().toStrictEqual<{
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "foo";
          _updatedAt: string;
          bar?: boolean;
        };
      }>();
    });
  });
});
