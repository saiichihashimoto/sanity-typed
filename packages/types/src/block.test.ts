import { describe, it } from "@jest/globals";
import type { PortableTextBlock } from "@portabletext/types";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { _InferValue } from ".";

describe("block", () => {
  describe("defineArrayMember", () => {
    it("infers PortableTextBlock", () => {
      const arrayMember = defineArrayMember({
        type: "block",
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        PortableTextBlock & {
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
      const type = defineType({
        name: "foo",
        type: "block",
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<PortableTextBlock>();
    });
  });
});
