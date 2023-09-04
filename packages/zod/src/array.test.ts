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

describe("array", () => {
  describe("defineField", () => {
    it("builds parser for array of the member", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [defineArrayMember({ type: "boolean" })],
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
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
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
      >();
      expect(zod.parse([true, "false"])).toStrictEqual([true, "false"]);
      expect(() => zod.parse(true)).toThrow();
    });

    it('adds "_key" to objects', () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
        ],
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
      >();
      expect(zod.parse([{ _key: "key", bar: true }])).toStrictEqual([
        { _key: "key", bar: true },
      ]);
      expect(() => zod.parse(true)).toThrow();
    });

    it('adds "_type" to named objects', () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            name: "inlineMemberName",
            type: "object",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
        ],
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
      >();
      expect(
        zod.parse([{ _key: "key", _type: "inlineMemberName", bar: true }])
      ).toStrictEqual([{ _key: "key", _type: "inlineMemberName", bar: true }]);
      expect(() => zod.parse(true)).toThrow();
    });

    it("builds unions with objects", () => {
      const field = defineField({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "bar",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
          defineArrayMember({
            type: "object",
            name: "qux",
            fields: [
              defineField({
                name: "qux",
                type: "boolean",
              }),
            ],
          }),
        ],
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
      >();
      expect(
        zod.parse([
          { _key: "key", _type: "bar", bar: true },
          { _key: "key", _type: "qux", qux: true },
        ])
      ).toStrictEqual([
        { _key: "key", _type: "bar", bar: true },
        { _key: "key", _type: "qux", qux: true },
      ]);
      expect(() => zod.parse(true)).toThrow();
    });

    it.todo('adds "_type" to named alias values');
  });

  describe("defineType", () => {
    it("builds parser for array of the member", () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [defineArrayMember({ type: "boolean" })],
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
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
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(zod.parse([true, "false"])).toStrictEqual([true, "false"]);
      expect(() => zod.parse(true)).toThrow();
    });

    it('adds "_key" to objects', () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
        ],
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(zod.parse([{ _key: "key", bar: true }])).toStrictEqual([
        { _key: "key", bar: true },
      ]);
      expect(() => zod.parse(true)).toThrow();
    });

    it('adds "_type" to named objects', () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            name: "inlineMemberName",
            type: "object",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
        ],
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(
        zod.parse([{ _key: "key", _type: "inlineMemberName", bar: true }])
      ).toStrictEqual([{ _key: "key", _type: "inlineMemberName", bar: true }]);
      expect(() => zod.parse(true)).toThrow();
    });

    it("builds unions with objects", () => {
      const type = defineType({
        name: "foo",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "bar",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
            ],
          }),
          defineArrayMember({
            type: "object",
            name: "qux",
            fields: [
              defineField({
                name: "qux",
                type: "boolean",
              }),
            ],
          }),
        ],
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(
        zod.parse([
          { _key: "key", _type: "bar", bar: true },
          { _key: "key", _type: "qux", qux: true },
        ])
      ).toStrictEqual([
        { _key: "key", _type: "bar", bar: true },
        { _key: "key", _type: "qux", qux: true },
      ]);
      expect(() => zod.parse(true)).toThrow();
    });

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
