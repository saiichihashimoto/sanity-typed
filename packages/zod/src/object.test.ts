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

describe("object", () => {
  describe("defineArrayMember", () => {
    it("builds parser for object with fields", () => {
      const arrayMember = defineArrayMember({
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
          }),
          defineField({
            name: "tar",
            type: "number",
          }),
        ],
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferRawValue<typeof arrayMember>, "_key">
      >();
      expect(zod.parse({})).toStrictEqual({});
      expect(zod.parse({ bar: true, tar: 5 })).toStrictEqual({
        bar: true,
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const arrayMember = defineArrayMember({
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "object",
            fields: [
              defineField({
                name: "tar",
                type: "number",
              }),
            ],
          }),
        ],
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferRawValue<typeof arrayMember>, "_key">
      >();
      expect(zod.parse({})).toStrictEqual({});
      expect(zod.parse({ bar: { tar: 5 } })).toStrictEqual({ bar: { tar: 5 } });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const arrayMember = defineArrayMember({
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (Rule) => Rule.required(),
          }),
        ],
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferRawValue<typeof arrayMember>, "_key">
      >();
      expect(zod.parse({ bar: true })).toStrictEqual({ bar: true });
      expect(() => zod.parse({})).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for object with fields", () => {
      const field = defineField({
        name: "foo",
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
          }),
          defineField({
            name: "tar",
            type: "number",
          }),
        ],
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
      >();
      expect(zod.parse({})).toStrictEqual({});
      expect(zod.parse({ bar: true, tar: 5 })).toStrictEqual({
        bar: true,
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const field = defineField({
        name: "foo",
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "object",
            fields: [
              defineField({
                name: "tar",
                type: "number",
              }),
            ],
          }),
        ],
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
      >();
      expect(zod.parse({})).toStrictEqual({});
      expect(zod.parse({ bar: { tar: 5 } })).toStrictEqual({ bar: { tar: 5 } });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const field = defineField({
        name: "foo",
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (Rule) => Rule.required(),
          }),
        ],
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
      >();
      expect(zod.parse({ bar: true })).toStrictEqual({ bar: true });
      expect(() => zod.parse({})).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for object with fields", () => {
      const type = defineType({
        name: "foo",
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
          }),
          defineField({
            name: "tar",
            type: "number",
          }),
        ],
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(zod.parse({})).toStrictEqual({});
      expect(zod.parse({ bar: true, tar: 5 })).toStrictEqual({
        bar: true,
        tar: 5,
      });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers nested objects", () => {
      const type = defineType({
        name: "foo",
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "object",
            fields: [
              defineField({
                name: "tar",
                type: "number",
              }),
            ],
          }),
        ],
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(zod.parse({})).toStrictEqual({});
      expect(zod.parse({ bar: { tar: 5 } })).toStrictEqual({ bar: { tar: 5 } });
      expect(() => zod.parse(true)).toThrow();
    });

    it("infers required fields", () => {
      const type = defineType({
        name: "foo",
        type: "object",
        fields: [
          defineField({
            name: "bar",
            type: "boolean",
            validation: (Rule) => Rule.required(),
          }),
        ],
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(zod.parse({ bar: true })).toStrictEqual({ bar: true });
      expect(() => zod.parse({})).toThrow();
    });
  });
});
