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

describe("boolean", () => {
  describe("defineArrayMember", () => {
    it("builds parser for boolean", () => {
      const arrayMember = defineArrayMember({
        type: "boolean",
      });
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof arrayMember>
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
      const zod = sanityZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
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
      const zod = sanityZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(zod.parse(true)).toBe(true);
      expect(() => zod.parse("foo")).toThrow();
    });
  });
});
