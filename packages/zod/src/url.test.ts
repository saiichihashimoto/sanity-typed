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

describe("url", () => {
  describe("defineArrayMember", () => {
    it("infers string", () => {
      const arrayMember = defineArrayMember({
        type: "url",
      });
      const zod = sanityZod(z)(arrayMember);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof arrayMember>>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineField", () => {
    it("infers string", () => {
      const field = defineField({
        name: "foo",
        type: "url",
      });
      const zod = sanityZod(z)(field);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof field>>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("infers string", () => {
      const type = defineType({
        name: "foo",
        type: "url",
      });
      const zod = sanityZod(z)(type);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof type>>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
