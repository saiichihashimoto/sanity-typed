import { describe, it } from "@jest/globals";
import type { GeopointValue } from "sanity";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { _InferValue } from ".";

describe("geopoint", () => {
  describe("defineArrayMember", () => {
    it("infers GeopointValue", () => {
      const arrayMember = defineArrayMember({
        type: "geopoint",
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        GeopointValue & {
          _key: string;
        }
      >();
    });
  });

  describe("defineField", () => {
    it("infers GeopointValue", () => {
      const field = defineField({
        name: "foo",
        type: "geopoint",
      });

      expectType<_InferValue<typeof field>>().toStrictEqual<GeopointValue>();
    });
  });

  describe("defineType", () => {
    it("infers GeopointValue", () => {
      const type = defineType({
        name: "foo",
        type: "geopoint",
      });

      expectType<_InferValue<typeof type>>().toStrictEqual<GeopointValue>();
    });
  });
});
