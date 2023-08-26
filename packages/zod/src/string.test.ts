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

describe("string", () => {
  describe("defineArrayMember", () => {
    it("builds parser for string", () => {
      const arrayMember = defineArrayMember({
        type: "string",
      });
      const zod = sanityZod(arrayMember);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof arrayMember>>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for string", () => {
      const field = defineField({
        name: "foo",
        type: "string",
      });
      const zod = sanityZod(field);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof field>>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for string", () => {
      const type = defineType({
        name: "foo",
        type: "string",
      });
      const zod = sanityZod(type);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof type>>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
