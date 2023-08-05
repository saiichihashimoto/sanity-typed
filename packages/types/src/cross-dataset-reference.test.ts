import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { CrossDatasetReferenceValue, _InferValue } from ".";

describe("crossDatasetReference", () => {
  describe("defineArrayMember", () => {
    it("infers CrossDatasetReferenceValue", () => {
      const arrayMember = defineArrayMember({
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
      });

      expectType<_InferValue<typeof arrayMember>>().toStrictEqual<
        CrossDatasetReferenceValue & {
          _key: string;
        }
      >();
    });
  });

  describe("defineField", () => {
    it("infers CrossDatasetReferenceValue", () => {
      const field = defineField({
        name: "foo",
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
      });

      expectType<
        _InferValue<typeof field>
      >().toStrictEqual<CrossDatasetReferenceValue>();
    });
  });

  describe("defineType", () => {
    it("infers CrossDatasetReferenceValue", () => {
      const type = defineType({
        name: "foo",
        type: "crossDatasetReference",
        to: [],
        dataset: "foo",
        projectId: "bar",
      });

      expectType<
        _InferValue<typeof type>
      >().toStrictEqual<CrossDatasetReferenceValue>();
    });
  });
});
