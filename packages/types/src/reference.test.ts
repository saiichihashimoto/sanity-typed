import { describe, it } from "@jest/globals";
import type { Simplify } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { InferSchemaValues, ReferenceValue } from ".";

describe("reference", () => {
  describe("defineArrayMember", () => {
    it("infers ReferenceValue", () => {
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
                  type: "reference",
                  to: [{ type: "other" as const }],
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
          ReferenceValue<"other"> & {
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
                  type: "reference",
                  to: [{ type: "other" as const }],
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
    it("infers ReferenceValue", () => {
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
                  type: "reference",
                  to: [{ type: "other" as const }],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >().toStrictEqual<ReferenceValue<"other">>();
    });
  });

  describe("defineType", () => {
    it("infers ReferenceValue", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "reference",
              to: [{ type: "other" as const }],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
        Omit<ReferenceValue<"other">, "_type"> & {
          _type: "foo";
        }
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
              type: "reference",
              to: [{ type: "other" as const }],
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
