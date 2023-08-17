import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { SlugValue, _InferValue } from ".";

describe("slug", () => {
  describe("defineArrayMember", () => {
    it("infers SlugValue", () => {
      const arrayMember = defineArrayMember({
        type: "slug",
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        SlugValue & {
          _key: string;
        }
      >();
    });
  });

  describe("defineField", () => {
    it("infers SlugValue", () => {
      const field = defineField({
        name: "foo",
        type: "slug",
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<SlugValue>();
    });
  });

  describe("defineType", () => {
    it("infers SlugValue", () => {
      const type = defineType({
        name: "foo",
        type: "slug",
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<SlugValue>();
    });
  });
});
