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

describe("reference", () => {
  describe("defineArrayMember", () => {
    it("builds parser for Reference", () => {
      const arrayMember = defineArrayMember({
        type: "reference",
        to: [{ type: "other" as const }],
      });
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // FIXME defineArrayMember would have to return a runtime value to determine _key
          symbol | "_key"
        >
      >();
      expect(zod.parse({ _ref: "foo" })).toStrictEqual({ _ref: "foo" });
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for Reference", () => {
      const field = defineField({
        name: "foo",
        type: "reference",
        to: [{ type: "other" as const }],
      });
      const zod = sanityZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferValue<typeof field>, symbol>
      >();
      expect(zod.parse({ _ref: "foo" })).toStrictEqual({ _ref: "foo" });
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for Reference", () => {
      const type = defineType({
        name: "foo",
        type: "reference",
        to: [{ type: "other" as const }],
      });
      const zod = sanityZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferValue<typeof type>, symbol>
      >();
      expect(zod.parse({ _ref: "foo" })).toStrictEqual({ _ref: "foo" });
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
