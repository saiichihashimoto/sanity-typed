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

describe("crossDatasetReference", () => {
  describe("defineArrayMember", () => {
    it("builds parser for CrossDatasetReferenceValue", () => {
      const arrayMember = defineArrayMember({
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
      });
      const zod = _sanityTypeToZod(arrayMember);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        Omit<_InferRawValue<typeof arrayMember>, "_key">
      >();
      expect(
        zod.parse({
          _dataset: "dataset",
          _projectId: "projectId",
          _ref: "foo",
          _type: "crossDatasetReference",
        })
      ).toStrictEqual({
        _dataset: "dataset",
        _projectId: "projectId",
        _ref: "foo",
        _type: "crossDatasetReference",
      });
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for CrossDatasetReferenceValue", () => {
      const field = defineField({
        name: "foo",
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
      });
      const zod = _sanityTypeToZod(field);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof field>
      >();
      expect(
        zod.parse({
          _dataset: "dataset",
          _projectId: "projectId",
          _ref: "foo",
          _type: "crossDatasetReference",
        })
      ).toStrictEqual({
        _dataset: "dataset",
        _projectId: "projectId",
        _ref: "foo",
        _type: "crossDatasetReference",
      });
      expect(() => zod.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for CrossDatasetReferenceValue", () => {
      const type = defineType({
        name: "foo",
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
      });
      const zod = _sanityTypeToZod(type);

      expectType<z.infer<typeof zod>>().toStrictEqual<
        _InferRawValue<typeof type>
      >();
      expect(
        zod.parse({
          _dataset: "dataset",
          _projectId: "projectId",
          _ref: "foo",
          _type: "crossDatasetReference",
        })
      ).toStrictEqual({
        _dataset: "dataset",
        _projectId: "projectId",
        _ref: "foo",
        _type: "crossDatasetReference",
      });
      expect(() => zod.parse(true)).toThrow();
    });
  });
});
