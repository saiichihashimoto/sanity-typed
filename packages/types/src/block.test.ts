import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
  PortableTextSpan,
  ReferenceValue,
  _InferValue,
} from ".";

describe("block", () => {
  describe("defineArrayMember", () => {
    it("infers PortableTextBlock", () => {
      const arrayMember = defineArrayMember({ type: "block" });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        PortableTextBlock & {
          _key: string;
        }
      >();
    });

    it("infers children", () => {
      const arrayMember = defineArrayMember({
        type: "block",
        of: [
          defineArrayMember({
            name: "foo",
            type: "object",
            fields: [
              defineField({
                name: "baz",
                type: "boolean",
              }),
            ],
          }),
          defineArrayMember({
            name: "bar",
            type: "reference",
            to: [{ type: "qux" as const }],
          }),
        ],
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        PortableTextBlock<
          PortableTextMarkDefinition,
          | ({
              _key: string;
            } & {
              _type: "foo";
            } & {
              baz?: boolean;
            })
          | (PortableTextSpan & { _key: string })
          | (ReferenceValue<"qux"> & {
              _key: string;
            } & {
              _type: "bar";
            })
        > & {
          _key: string;
        }
      >();
    });
  });

  describe("defineField", () => {
    it("is a typescript error", () => {
      // @ts-expect-error -- blocks can't be fields https://www.sanity.io/docs/block-type
      const field = defineField({
        name: "foo",
        type: "block",
      });

      expectType<_InferValue<typeof field>>().toBeNever();
    });
  });

  describe("defineType", () => {
    it("infers PortableTextBlock", () => {
      const type = defineType({ name: "foo", type: "block" });

      expectType<_InferValue<typeof type>>().toStrictEqual<PortableTextBlock>();
    });

    it("infers children", () => {
      const type = defineType({
        name: "foo",
        type: "block",
        of: [
          defineArrayMember({
            name: "foo",
            type: "object",
            fields: [
              defineField({
                name: "baz",
                type: "boolean",
              }),
            ],
          }),
          defineArrayMember({
            name: "bar",
            type: "reference",
            to: [{ type: "qux" as const }],
          }),
        ],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<
        PortableTextBlock<
          PortableTextMarkDefinition,
          | ({
              _key: string;
            } & {
              _type: "foo";
            } & {
              baz?: boolean;
            })
          | (PortableTextSpan & { _key: string })
          | (ReferenceValue<"qux"> & {
              _key: string;
            } & {
              _type: "bar";
            })
        >
      >();
    });
  });
});
