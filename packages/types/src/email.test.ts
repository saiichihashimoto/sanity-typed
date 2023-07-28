import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { _InferValue } from ".";

describe("email", () => {
  describe("defineArrayMember", () => {
    it("infers string", () => {
      const arrayMember = defineArrayMember({
        type: "email",
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<string>();
    });
  });

  describe("defineField", () => {
    it("infers string", () => {
      const field = defineField({
        name: "foo",
        type: "email",
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<string>();
    });
  });

  describe("defineType", () => {
    it("infers string", () => {
      const type = defineType({
        name: "foo",
        type: "email",
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<string>();
    });
  });
});
