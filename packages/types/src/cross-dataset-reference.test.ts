import { describe, it } from "@jest/globals";
import type { Merge, Simplify } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { CrossDatasetReferenceValue, InferSchemaValues } from ".";

describe("crossDatasetReference", () => {
  describe("defineArrayMember", () => {
    it("infers CrossDatasetReferenceValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [
                defineArrayMember({
                  type: "crossDatasetReference",
                  dataset: "dataset",
                  to: [],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >().toStrictEqual<
        Simplify<
          CrossDatasetReferenceValue & {
            _key: string;
          }
        >
      >();
    });

    it("overwrites `_type` with `name`", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [
                defineArrayMember({
                  name: "bar",
                  type: "crossDatasetReference",
                  dataset: "dataset",
                  to: [],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >().toStrictEqual<"bar">();
    });
  });

  describe("defineField", () => {
    it("infers CrossDatasetReferenceValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "object",
              fields: [
                defineField({
                  name: "bar",
                  type: "crossDatasetReference",
                  dataset: "dataset",
                  to: [],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >().toStrictEqual<CrossDatasetReferenceValue>();
    });
  });

  describe("defineType", () => {
    it("infers CrossDatasetReferenceValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "crossDatasetReference",
              dataset: "dataset",
              to: [],
            }),
          ],
        },
      });

      expectType<
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >().toStrictEqual<
        Merge<
          CrossDatasetReferenceValue,
          {
            _type: "foo";
          }
        >
      >();
    });

    it("overwrites `_type` with defineArrayMember `name`", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "crossDatasetReference",
              dataset: "dataset",
              to: [],
            }),
            defineType({
              name: "bar",
              type: "array",
              of: [
                defineArrayMember({
                  name: "bar",
                  type: "foo",
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
      >().toStrictEqual<"bar">();
    });
  });
});
