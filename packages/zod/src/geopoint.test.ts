import { describe, expect, it } from "@jest/globals";
import type { z } from "zod";

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

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // TODO defineArrayMember would have to return a runtime value to determine _key
          "_key"
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

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
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

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
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
