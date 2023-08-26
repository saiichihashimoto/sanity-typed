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

describe("crossDatasetReference", () => {
  describe("defineArrayMember", () => {
    it("builds parser for CrossDatasetReferenceValue", () => {
      const arrayMember = defineArrayMember({
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
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
      const zod = sanityZod(field);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof field>>
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
      const zod = sanityZod(type);

      expectType<typeof zod>().toBeAssignableTo<
        ZodType<_InferValue<typeof type>>
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
