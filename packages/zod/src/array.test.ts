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

describe("array", () => {
  describe("defineField", () => {
    it("builds parser for array of the member", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [defineArrayMember({ type: "boolean" })],
      });
      const zod = sanityZod(field);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof field>>
      >();
      expect(zod.parse([true, false])).toStrictEqual([true, false]);
      expect(() => zod.parse(true)).toThrow();
    });

    it.todo("infers unions if there are multiple members");

    it.todo('adds "_key" to objects');

    it.todo('adds "_type" to named objects');

    it.todo("infers unions with objects");

    it.todo('adds "_type" to named alias values');
  });

  describe("defineType", () => {
    it("builds parser for array of the member", () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [defineArrayMember({ type: "boolean" })],
      });
      const zod = sanityZod(type);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof type>>
      >();
      expect(zod.parse([true, false])).toStrictEqual([true, false]);
      expect(() => zod.parse(true)).toThrow();
    });

    it.todo("infers unions if there are multiple members");

    it.todo('adds "_key" to objects');

    it.todo('adds "_type" to named objects');

    it.todo("infers unions with objects");

    it.todo('adds "_type" to named alias values');
  });

  describe("defineConfig", () => {
    it.todo('adds "_type" to inferred types');

    it.todo('overrides "_type" with arrayMember name');
  });

  describe("definePlugin", () => {
    it.todo('adds "_type" to inferred types');

    it.todo('overrides "_type" with arrayMember name');
  });
});
