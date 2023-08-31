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

describe("number", () => {
  describe("defineArrayMember", () => {
    it("builds parser for number", () => {
      const arrayMember = defineArrayMember({
        type: "number",
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof arrayMember>
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
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
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
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(zod.parse(5)).toBe(5);
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
