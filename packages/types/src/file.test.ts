import { describe, it } from "@jest/globals";
import type { Simplify } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { FileValue, InferSchemaValues } from ".";

describe("file", () => {
  describe("defineArrayMember", () => {
    it("infers FileValue", () => {
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
                  type: "file",
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
          FileValue & {
            _key: string;
          }
        >
      >();
    });
  });

  it("infers FileValue with fields", () => {
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
                type: "file",
                fields: [
                  defineField({
                    name: "bar",
                    type: "boolean",
                  }),
                  defineField({
                    name: "tar",
                    type: "number",
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<InferSchemaValues<typeof config>["foo"][number]>().toStrictEqual<
      Simplify<
        FileValue & {
          _key: string;
          bar?: boolean;
          tar?: number;
        }
      >
    >();
  });

  it("infers nested objects", () => {
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
                type: "file",
                fields: [
                  defineField({
                    name: "bar",
                    type: "object",
                    fields: [
                      defineField({
                        name: "tar",
                        type: "number",
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

    expectType<InferSchemaValues<typeof config>["foo"][number]>().toStrictEqual<
      Simplify<
        FileValue & {
          _key: string;
          bar?: {
            tar?: number;
          };
        }
      >
    >();
  });

  it("infers required fields", () => {
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
                type: "file",
                fields: [
                  defineField({
                    name: "bar",
                    type: "boolean",
                    validation: (Rule) => Rule.required(),
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<InferSchemaValues<typeof config>["foo"][number]>().toStrictEqual<
      Simplify<
        FileValue & {
          _key: string;
          bar: boolean;
        }
      >
    >();
  });
});

describe("defineField", () => {
  it("infers FileValue", () => {
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
                type: "file",
              }),
            ],
          }),
        ],
      },
    });

    expectType<
      Required<InferSchemaValues<typeof config>["foo"]>["bar"]
    >().toStrictEqual<FileValue>();
  });

  it("infers FileValue with fields", () => {
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
                type: "file",
                fields: [
                  defineField({
                    name: "bar",
                    type: "boolean",
                  }),
                  defineField({
                    name: "tar",
                    type: "number",
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<
      Required<InferSchemaValues<typeof config>["foo"]>["bar"]
    >().toStrictEqual<
      Simplify<
        FileValue & {
          bar?: boolean;
          tar?: number;
        }
      >
    >();
  });

  it("infers nested objects", () => {
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
                type: "file",
                fields: [
                  defineField({
                    name: "bar",
                    type: "object",
                    fields: [
                      defineField({
                        name: "tar",
                        type: "number",
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
      Required<InferSchemaValues<typeof config>["foo"]>["bar"]
    >().toStrictEqual<
      Simplify<
        FileValue & {
          bar?: {
            tar?: number;
          };
        }
      >
    >();
  });

  it("infers required fields", () => {
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
                type: "file",
                fields: [
                  defineField({
                    name: "bar",
                    type: "boolean",
                    validation: (Rule) => Rule.required(),
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<
      Required<InferSchemaValues<typeof config>["foo"]>["bar"]
    >().toStrictEqual<
      Simplify<
        FileValue & {
          bar: boolean;
        }
      >
    >();
  });
});

describe("defineType", () => {
  it("infers FileValue", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "file",
          }),
        ],
      },
    });

    expectType<
      InferSchemaValues<typeof config>["foo"]
    >().toStrictEqual<FileValue>();
  });

  it("infers FileValue with fields", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "file",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
              }),
              defineField({
                name: "tar",
                type: "number",
              }),
            ],
          }),
        ],
      },
    });

    expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
      Simplify<
        FileValue & {
          bar?: boolean;
          tar?: number;
        }
      >
    >();
  });

  it("infers nested objects", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "file",
            fields: [
              defineField({
                name: "bar",
                type: "object",
                fields: [
                  defineField({
                    name: "tar",
                    type: "number",
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
      Simplify<
        FileValue & {
          bar?: {
            tar?: number;
          };
        }
      >
    >();
  });

  it("infers required fields", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "file",
            fields: [
              defineField({
                name: "bar",
                type: "boolean",
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    });

    expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<
      Simplify<
        FileValue & {
          bar: boolean;
        }
      >
    >();
  });
});
