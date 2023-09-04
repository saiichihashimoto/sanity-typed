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

describe("boolean", () => {
  describe("defineArrayMember", () => {
    it("builds parser for boolean", () => {
      const arrayMember = defineArrayMember({
        type: "boolean",
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof arrayMember>
      >();
      expect(zod.parse(true)).toBe(true);
      expect(() => zod.parse("foo")).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for boolean", () => {
      const field = defineField({
        name: "foo",
        type: "boolean",
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
      >();
      expect(zod.parse(true)).toBe(true);
      expect(() => zod.parse("foo")).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for boolean", () => {
      const type = defineType({
        name: "foo",
        type: "boolean",
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(zod.parse(true)).toBe(true);
      expect(() => zod.parse("foo")).toThrow();
    });
  });
});
