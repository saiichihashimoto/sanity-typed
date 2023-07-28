import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { _InferValue } from ".";

describe("number", () => {
  describe("defineArrayMember", () => {
    it("infers number", () => {
      const arrayMember = defineArrayMember({
        type: "number",
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<number>();
    });
  });

  describe("defineField", () => {
    it("infers number", () => {
      const field = defineField({
        name: "foo",
        type: "number",
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<number>();
    });
  });

  describe("defineType", () => {
    it("infers number", () => {
      const type = defineType({
        name: "foo",
        type: "number",
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<number>();
    });
  });
});
