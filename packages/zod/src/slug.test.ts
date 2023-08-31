import { describe, expect, it } from "@jest/globals";
import type { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { _InferValue } from "@sanity-typed/types";

import { _sanityTypeToZod } from ".";

describe("slug", () => {
  describe("defineArrayMember", () => {
    it("builds parser for SlugValue", () => {
      const arrayMember = defineArrayMember({
        type: "slug",
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // TODO defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
      >();
      expect(zod.parse({ _type: "slug", current: "foo" })).toStrictEqual({
        _type: "slug",
        current: "foo",
      });
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for SlugValue", () => {
      const field = defineField({
        name: "foo",
        type: "slug",
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
      >();
      expect(zod.parse({ _type: "slug", current: "foo" })).toStrictEqual({
        _type: "slug",
        current: "foo",
      });
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for SlugValue", () => {
      const type = defineType({
        name: "foo",
        type: "slug",
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(zod.parse({ _type: "slug", current: "foo" })).toStrictEqual({
        _type: "slug",
        current: "foo",
      });
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
