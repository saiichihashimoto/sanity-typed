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

describe("slug", () => {
  describe("defineArrayMember", () => {
    it("builds parser for SlugValue", () => {
      const arrayMember = defineArrayMember({
        type: "slug",
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
      const zod = sanityZod(field);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof field>>
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
      const zod = sanityZod(type);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof type>>
      >();
      expect(zod.parse({ _type: "slug", current: "foo" })).toStrictEqual({
        _type: "slug",
        current: "foo",
      });
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
