import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { _InferValue } from ".";

describe("boolean", () => {
  describe("defineArrayMember", () => {
    it("infers boolean", () => {
      const arrayMember = defineArrayMember({
        type: "boolean",
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<boolean>();
    });
  });

  describe("defineField", () => {
    it("infers boolean", () => {
      const field = defineField({
        name: "foo",
        type: "boolean",
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<boolean>();
    });
  });

  describe("defineType", () => {
    it("infers boolean", () => {
      const type = defineType({
        name: "foo",
        type: "boolean",
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<boolean>();
    });
  });
});
