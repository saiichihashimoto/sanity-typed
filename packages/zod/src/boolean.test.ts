import { describe, expect, it } from "@jest/globals";
import { z } from "zod";
import type { ZodType } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { _InferValue } from "@sanity-typed/types";

import { sanityZod } from ".";

describe("boolean", () => {
  describe("defineArrayMember", () => {
    it("infers boolean", () => {
      const arrayMember = defineArrayMember({
        type: "boolean",
      });
      const zod = sanityZod(z)(arrayMember);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof arrayMember>>
      >();
      expect(zod.parse(true)).toBe(true);
      expect(() => zod.parse("foo")).toThrow();
    });
  });

  describe("defineField", () => {
    it("infers boolean", () => {
      const field = defineField({
        name: "foo",
        type: "boolean",
      });
      const zod = sanityZod(z)(field);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof field>>
      >();
      expect(zod.parse(true)).toBe(true);
      expect(() => zod.parse("foo")).toThrow();
    });
  });

  describe("defineType", () => {
    it("infers boolean", () => {
      const type = defineType({
        name: "foo",
        type: "boolean",
      });
      const zod = sanityZod(z)(type);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof type>>
      >();
      expect(zod.parse(true)).toBe(true);
      expect(() => zod.parse("foo")).toThrow();
    });
  });
});
