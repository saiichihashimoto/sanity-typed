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
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // FIXME defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
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
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // FIXME defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
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
      const zod = sanityZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<
          _InferValue<typeof arrayMember>,
          // FIXME defineArrayMember would have to return a runtime value to determine _key
          "_key"
        >
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
      const zod = sanityZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
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
      const zod = sanityZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
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
      const zod = sanityZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof field>
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
      const zod = sanityZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
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
      const zod = sanityZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
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
      const zod = sanityZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferValue<typeof type>
      >();
      expect(zod.parse({ bar: true })).toStrictEqual({ bar: true });
      expect(() => zod.parse({})).toThrow();
    });
  });
});
