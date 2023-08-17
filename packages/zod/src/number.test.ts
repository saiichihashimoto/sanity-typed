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

describe("number", () => {
  describe("defineArrayMember", () => {
    it("builds parser for number", () => {
      const arrayMember = defineArrayMember({
        type: "number",
      });
      const zod = sanityZod(z)(arrayMember);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof arrayMember>>
      >();
      expect(zod.parse(5)).toBe(5);
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for number", () => {
      const field = defineField({
        name: "foo",
        type: "number",
      });
      const zod = sanityZod(z)(field);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof field>>
      >();
      expect(zod.parse(5)).toBe(5);
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for number", () => {
      const type = defineType({
        name: "foo",
        type: "number",
      });
      const zod = sanityZod(z)(type);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof type>>
      >();
      expect(zod.parse(5)).toBe(5);
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
