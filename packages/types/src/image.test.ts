import { describe, it } from "@jest/globals";
import type { Simplify } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { ImageValue, InferSchemaValues } from ".";

describe("image", () => {
  describe("defineArrayMember", () => {
    it("infers ImageValue", () => {
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
                  type: "image",
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
          ImageValue & {
            _key: string;
          }
        >
      >();
    });
  });

  it("infers ImageValue with fields", () => {
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
                type: "image",
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
        ImageValue & {
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
                type: "image",
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
        ImageValue & {
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
                type: "image",
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
        ImageValue & {
          _key: string;
          bar: boolean;
        }
      >
    >();
  });
});

describe("defineField", () => {
  it("infers ImageValue", () => {
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
                type: "image",
              }),
            ],
          }),
        ],
      },
    });

    expectType<
      Required<InferSchemaValues<typeof config>["foo"]>["bar"]
    >().toStrictEqual<ImageValue>();
  });

  it("infers ImageValue with fields", () => {
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
                type: "image",
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
        ImageValue & {
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
                type: "image",
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
        ImageValue & {
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
                type: "image",
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
        ImageValue & {
          bar: boolean;
        }
      >
    >();
  });
});

describe("defineType", () => {
  it("infers ImageValue", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "image",
          }),
        ],
      },
    });

    expectType<
      InferSchemaValues<typeof config>["foo"]
    >().toStrictEqual<ImageValue>();
  });

  it("infers ImageValue with fields", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "image",
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
        ImageValue & {
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
            type: "image",
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
        ImageValue & {
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
            type: "image",
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
        ImageValue & {
          bar: boolean;
        }
      >
    >();
  });
});
