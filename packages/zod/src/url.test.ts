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

describe("url", () => {
  describe("defineArrayMember", () => {
    it("builds parser for string", () => {
      const arrayMember = defineArrayMember({
        type: "url",
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof arrayMember>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for string", () => {
      const field = defineField({
        name: "foo",
        type: "url",
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for string", () => {
      const type = defineType({
        name: "foo",
        type: "url",
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
