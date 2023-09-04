import { describe, expect, it } from "@jest/globals";
import type { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { _InferRawValue } from "@sanity-typed/types";

import { _sanityTypeToZod } from ".";

describe("geopoint", () => {
  describe("defineArrayMember", () => {
    it("builds parser for GeopointValue", () => {
      const arrayMember = defineArrayMember({
        type: "geopoint",
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferRawValue<typeof arrayMember>, "_key">
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
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
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
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
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
