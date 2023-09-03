import { describe, it } from "@jest/globals";
import type { Simplify } from "type-fest";

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
        InferSchemaValues<typeof config>["foo"][number]
      >().toStrictEqual<
        Simplify<
          CrossDatasetReferenceValue & {
            _key: string;
          }
        >
      >();
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
        InferSchemaValues<typeof config>["foo"]
      >().toStrictEqual<CrossDatasetReferenceValue>();
    });
  });
});
