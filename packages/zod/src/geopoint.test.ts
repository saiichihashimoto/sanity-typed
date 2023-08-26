import { describe, expect, it } from "@jest/globals";
import type { ZodType } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { _InferValue } from "@sanity-typed/types";

import { sanityZod } from ".";

describe("geopoint", () => {
  describe("defineArrayMember", () => {
    it("builds parser for GeopointValue", () => {
      const arrayMember = defineArrayMember({
        type: "geopoint",
      });
      const zod = sanityZod(arrayMember);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<
          Omit<
            _InferValue<typeof arrayMember>,
            // FIXME defineArrayMember would have to return a runtime value to determine _key
            "_key"
          >
        >
      >();
      expect(
        zod.parse({ _type: "geopoint", lat: 5, lng: 5, alt: 5 })
      ).toStrictEqual({ _type: "geopoint", lat: 5, lng: 5, alt: 5 });
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for GeopointValue", () => {
      const field = defineField({
        name: "foo",
        type: "geopoint",
      });
      const zod = sanityZod(field);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof field>>
      >();
      expect(
        zod.parse({
          _type: "geopoint",
          lat: 5,
          lng: 5,
          alt: 5,
        })
      ).toStrictEqual({ _type: "geopoint", lat: 5, lng: 5, alt: 5 });
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for GeopointValue", () => {
      const type = defineType({
        name: "foo",
        type: "geopoint",
      });
      const zod = sanityZod(type);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof type>>
      >();
      expect(
        zod.parse({
          _type: "geopoint",
          lat: 5,
          lng: 5,
          alt: 5,
        })
      ).toStrictEqual({ _type: "geopoint", lat: 5, lng: 5, alt: 5 });
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
