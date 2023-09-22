import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { InferSchemaValues } from ".";

describe("array", () => {
  describe("defineArrayMember", () => {
    it("is a typescript error", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [
                // @ts-expect-error -- arrays can't be children of arrays https://www.sanity.io/docs/array-type#fNBIr84P
                defineArrayMember({
                  type: "array",
                  of: [],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]
      >().toStrictEqual<never>();
    });
  });

  describe("defineField", () => {
    it("infers array of members", () => {
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
                  type: "array",
                  of: [defineArrayMember({ type: "boolean" })],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<boolean[]>();
    });

    it("infers unions if there are multiple members", () => {
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
                  type: "array",
                  of: [
                    defineArrayMember({ type: "boolean" }),
                    defineArrayMember({ type: "string" }),
                  ],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<(boolean | string)[]>();
    });

    it("infers unions with objects", () => {
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
                  type: "array",
                  of: [
                    defineArrayMember({
                      type: "object",
                      name: "bar",
                      fields: [
                        defineField({
                          name: "bar",
                          type: "boolean",
                        }),
                      ],
                    }),
                    defineArrayMember({
                      type: "object",
                      name: "qux",
                      fields: [
                        defineField({
                          name: "qux",
                          type: "boolean",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<
        (
          | ({
              _key: string;
            } & {
              _type: "bar";
              bar?: boolean;
            })
          | ({
              _key: string;
            } & {
              _type: "qux";
              qux?: boolean;
            })
        )[]
      >();
    });
  });

  describe("defineType", () => {
    it("infers array of members", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [defineArrayMember({ type: "boolean" })],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
        boolean[]
      >();
    });

    it("infers unions if there are multiple members", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [
                defineArrayMember({ type: "boolean" }),
                defineArrayMember({ type: "string" }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
        (boolean | string)[]
      >();
    });

    it("infers unions with objects", () => {
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
                  type: "object",
                  name: "bar",
                  fields: [
                    defineField({
                      name: "bar",
                      type: "boolean",
                    }),
                  ],
                }),
                defineArrayMember({
                  type: "object",
                  name: "qux",
                  fields: [
                    defineField({
                      name: "qux",
                      type: "boolean",
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
        (
          | ({
              _key: string;
            } & {
              _type: "bar";
              bar?: boolean;
            })
          | ({
              _key: string;
            } & {
              _type: "qux";
              qux?: boolean;
            })
        )[]
      >();
    });
  });
});
