import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { InferSchemaValues } from ".";

describe("string", () => {
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
                  type: "string",
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

    it("infers literal string from list", () => {
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
                  type: "string",
                  options: {
                    list: ["foo", { title: "Bar", value: "bar" }],
                  },
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]
      >().toStrictEqual<"bar" | "foo">();
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
                  type: "string",
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

    it("infers literal string from list", () => {
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
                  type: "string",
                  options: {
                    list: ["foo", { title: "Bar", value: "bar" }],
                  },
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<"bar" | "foo">();
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
              type: "string",
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]
      >().toStrictEqual<string>();
    });

    it("infers literal string from list", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "string",
              options: {
                list: ["foo", { title: "Bar", value: "bar" }],
              },
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
        "bar" | "foo"
      >();
    });
  });
});
