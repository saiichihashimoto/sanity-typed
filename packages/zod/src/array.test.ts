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

describe("array", () => {
  describe("defineField", () => {
    it("builds parser for array of the member", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [defineArrayMember({ type: "boolean" })],
      });
      const zod = sanityZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
      >();
      expect(zod.parse([true, false])).toStrictEqual([true, false]);
      expect(() => zod.parse(true)).toThrow();
    });

    it("builds unions if there are multiple members", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({ type: "boolean" }),
          defineArrayMember({ type: "string" }),
        ],
      });
      const zod = sanityZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
      >();
      expect(zod.parse([true, "false"])).toStrictEqual([true, "false"]);
      expect(() => zod.parse(true)).toThrow();
    });

    it.todo('adds "_key" to objects');

    it.todo('adds "_type" to named objects');

    it.todo("builds unions with objects");

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

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(zod.parse([true, false])).toStrictEqual([true, false]);
      expect(() => zod.parse(true)).toThrow();
    });

    it("builds unions if there are multiple members", () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({ type: "boolean" }),
          defineArrayMember({ type: "string" }),
        ],
      });
      const zod = sanityZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(zod.parse([true, "false"])).toStrictEqual([true, "false"]);
      expect(() => zod.parse(true)).toThrow();
    });

    it.todo('adds "_key" to objects');

    it.todo('adds "_type" to named objects');

    it.todo("builds unions with objects");

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
