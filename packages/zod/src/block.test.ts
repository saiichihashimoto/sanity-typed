import { describe, expect, it } from "@jest/globals";
import type { ZodType } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import { defineArrayMember, defineType } from "@sanity-typed/types";
import type { _InferValue } from "@sanity-typed/types";

import { sanityZod } from ".";

describe("block", () => {
  describe("defineArrayMember", () => {
    it("builds parser for PortableTextBlock", () => {
      const arrayMember = defineArrayMember({
        type: "block",
      });
      const zod = sanityZod(arrayMember);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<
          Omit<
            _InferValue<typeof arrayMember>,
            // FIXME defineArrayMember would have to return a runtime value to determine _key
            "_key"
          >
        >
      >();
      expect(
        zod.parse({
          _type: "block",
          children: [{ _type: "span", text: "foo" }],
        })
      ).toStrictEqual({
        _type: "block",
        children: [{ _type: "span", text: "foo" }],
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it.todo("builds parser for children");
  });

  describe("defineType", () => {
    it("builds parser for PortableTextBlock", () => {
      const type = defineType({
        name: "foo",
        type: "block",
      });
      const zod = sanityZod(type);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof type>>
      >();
      expect(
        zod.parse({
          _type: "block",
          children: [{ _type: "span", text: "foo" }],
        })
      ).toStrictEqual({
        _type: "block",
        children: [{ _type: "span", text: "foo" }],
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it.todo("builds parser for children");
  });
});
