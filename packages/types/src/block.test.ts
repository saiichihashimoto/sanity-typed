import { describe, it } from "@jest/globals";
import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
  PortableTextSpan,
} from "@portabletext/types";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { ReferenceValue, _InferValue } from ".";

describe("block", () => {
  describe("defineArrayMember", () => {
    it("infers PortableTextBlock", () => {
      const arrayMember = defineArrayMember({ type: "block" });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        PortableTextBlock<PortableTextMarkDefinition, PortableTextSpan> & {
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
            to: [{ type: "qux" }],
          }),
        ],
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        PortableTextBlock<
          PortableTextMarkDefinition,
          | PortableTextSpan
          | ({
              _key: string;
            } & {
              _type: "foo";
            } & {
              baz?: boolean;
            })
          | (ReferenceValue<string> & {
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

      expectType<_InferValue<typeof type>>().toStrictEqual<
        PortableTextBlock<PortableTextMarkDefinition, PortableTextSpan>
      >();
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
            to: [{ type: "qux" }],
          }),
        ],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<
        PortableTextBlock<
          PortableTextMarkDefinition,
          | PortableTextSpan
          | ({
              _key: string;
            } & {
              _type: "foo";
            } & {
              baz?: boolean;
            })
          | (ReferenceValue<string> & {
              _key: string;
            } & {
              _type: "bar";
            })
        >
      >();
    });
  });
});
