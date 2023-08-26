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

describe("datetime", () => {
  describe("defineArrayMember", () => {
    it("builds parser for string", () => {
      const arrayMember = defineArrayMember({
        type: "datetime",
      });
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof arrayMember>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for string", () => {
      const field = defineField({
        name: "foo",
        type: "datetime",
      });
      const zod = sanityZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for string", () => {
      const type = defineType({
        name: "foo",
        type: "datetime",
      });
      const zod = sanityZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(zod.parse("foo")).toBe("foo");
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
