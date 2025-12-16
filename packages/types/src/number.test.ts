import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { InferSchemaValues } from ".";

describe("number", () => {
  describe("defineArrayMember", () => {
    it("infers number", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [defineArrayMember({ type: "number" })],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]
      >().toStrictEqual<number>();
    });

    it("infers literal number from list", () => {
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
                  type: "number",
                  options: { list: [1, { title: "Two", value: 2 }] },
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]
      >().toStrictEqual<1 | 2>();
    });
  });

  describe("defineField", () => {
    it("infers number", () => {
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
                  type: "number",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<number>();
    });

    it("infers literal number from list", () => {
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
                  type: "number",
                  validation: (Rule) => Rule.required(),
                  options: { list: [1, { title: "Two", value: 2 }] },
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<1 | 2>();
    });
  });

  describe("defineType", () => {
    it("infers number", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: { types: [defineType({ name: "foo", type: "number" })] },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]
      >().toStrictEqual<number>();
    });

    it("infers literal number from list", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "number",
              options: {
                list: [1 as const, { title: "Two", value: 2 as const }],
              },
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
        1 | 2
      >();
    });
  });
});
