import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { InferSchemaValues } from ".";

describe("date", () => {
  describe("defineArrayMember", () => {
    it("infers string", () => {
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
                  type: "date",
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]
      >().toStrictEqual<string>();
    });
  });

  describe("defineField", () => {
    it("infers string", () => {
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
                  type: "date",
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<string>();
    });
  });

  describe("defineType", () => {
    it("infers string", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "date",
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]
      >().toStrictEqual<string>();
    });
  });
});
