import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { ReferenceValue, _InferValue } from ".";

describe("reference", () => {
  describe("defineArrayMember", () => {
    it("infers Reference", () => {
      const arrayMember = defineArrayMember({
        type: "reference",
        to: [{ type: "other" as const }],
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        ReferenceValue<"other">
      >();
    });
  });

  describe("defineField", () => {
    it("infers Reference", () => {
      const field = defineField({
        name: "foo",
        type: "reference",
        to: [{ type: "other" as const }],
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<
        ReferenceValue<"other">
      >();
    });
  });

  describe("defineType", () => {
    it("infers Reference", () => {
      const type = defineType({
        name: "foo",
        type: "reference",
        to: [{ type: "other" as const }],
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<
        ReferenceValue<"other">
      >();
    });
  });
});
