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

describe("block", () => {
  describe("defineArrayMember", () => {
    it("builds parser for PortableTextBlock", () => {
      const arrayMember = defineArrayMember({
        type: "block",
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferRawValue<typeof arrayMember>, "_key">
      >();
      expect(
        zod.parse({
          _type: "block",
          children: [{ _type: "span", _key: "key", text: "foo" }],
        })
      ).toStrictEqual({
        _type: "block",
        children: [{ _type: "span", _key: "key", text: "foo" }],
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("builds parser for children", () => {
      const arrayMember = defineArrayMember({
        type: "block",
        of: [
          defineArrayMember({
            name: "foo",
            type: "object",
            fields: [
              defineField({
                name: "baz",
                type: "boolean",
              }),
            ],
          }),
          defineArrayMember({
            type: "reference",
            to: [{ type: "qux" as const }],
          }),
        ],
      });
      const zod = _sanityTypeToZod(arrayMember);

      // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
      expectType<z.infer<typeof zod>>()
        //
        .toStrictEqual<Omit<_InferRawValue<typeof arrayMember>, "_key">>();
      expect(
        zod.parse({
          _type: "block",
          children: [
            { _type: "span", _key: "key", text: "foo" },
            { _type: "foo", _key: "key", baz: true },
            { _type: "reference", _key: "key", _ref: "ref" },
          ],
        })
      ).toStrictEqual({
        _type: "block",
        children: [
          { _type: "span", _key: "key", text: "foo" },
          { _type: "foo", _key: "key", baz: true },
          { _type: "reference", _key: "key", _ref: "ref" },
        ],
      });
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for PortableTextBlock", () => {
      const type = defineType({
        name: "foo",
        type: "block",
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(
        zod.parse({
          _type: "block",
          children: [{ _type: "span", _key: "key", text: "foo" }],
        })
      ).toStrictEqual({
        _type: "block",
        children: [{ _type: "span", _key: "key", text: "foo" }],
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("builds parser for children", () => {
      const type = defineType({
        name: "foo",
        type: "block",
        of: [
          defineArrayMember({
            name: "foo",
            type: "object",
            fields: [
              defineField({
                name: "baz",
                type: "boolean",
              }),
            ],
          }),
          defineArrayMember({
            type: "reference",
            to: [{ type: "qux" as const }],
          }),
        ],
      });
      const zod = _sanityTypeToZod(type);

      // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
      expectType<z.infer<typeof zod>>()
        //
        .toStrictEqual<_InferRawValue<typeof type>>();
      expect(
        zod.parse({
          _type: "block",
          children: [
            { _type: "span", _key: "key", text: "foo" },
            { _type: "foo", _key: "key", baz: true },
            { _type: "reference", _key: "key", _ref: "ref" },
          ],
        })
      ).toStrictEqual({
        _type: "block",
        children: [
          { _type: "span", _key: "key", text: "foo" },
          { _type: "foo", _key: "key", baz: true },
          { _type: "reference", _key: "key", _ref: "ref" },
        ],
      });
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
