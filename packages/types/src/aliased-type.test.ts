import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import { defineConfig, defineField, definePlugin, defineType } from ".";
import type { InferSchemaValues } from ".";

describe("<alias>", () => {
  describe("defineConfig", () => {
    it("infers primitive type value", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "bar",
                  type: "bar",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
            defineType({
              name: "bar",
              type: "string",
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["bar"]
      >().toStrictEqual<string>();
      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar: string;
      }>();
    });

    it("infers non-primitive type value", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "bar",
                  type: "bar",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
            defineType({
              name: "bar",
              type: "object",
              fields: [
                defineField({
                  name: "baz",
                  type: "boolean",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["bar"]>().toEqual<{
        _type: "bar";
        baz: boolean;
      }>();
      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar: {
          _type: "bar";
          baz: boolean;
        };
      }>();
    });

    it("allows group and fieldset", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "bar",
                  group: "test-group",
                  fieldset: "test-fieldset",
                  type: "bar",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
            defineType({
              name: "bar",
              type: "string",
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["bar"]
      >().toStrictEqual<string>();
      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar: string;
      }>();
    });

    it("infers cyclical type value", () => {
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
                  name: "foo",
                  type: "foo",
                }),
              ],
            }),
          ],
        },
      });

      // It really is cyclical!
      expectType<
        NonNullable<InferSchemaValues<typeof config>["foo"]["foo"]>
      >().toStrictEqual<InferSchemaValues<typeof config>["foo"]>();
    });

    it("infers multiple step cyclical type value", () => {
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
                  type: "bar",
                }),
              ],
            }),
            defineType({
              name: "bar",
              type: "object",
              fields: [
                defineField({
                  name: "baz",
                  type: "baz",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
            defineType({
              name: "baz",
              type: "object",
              fields: [
                defineField({
                  name: "foo",
                  type: "foo",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      });

      // It really is cyclical!
      expectType<
        NonNullable<
          NonNullable<
            NonNullable<InferSchemaValues<typeof config>["foo"]["bar"]>["baz"]
          >["foo"]
        >
      >().toStrictEqual<InferSchemaValues<typeof config>["foo"]>();
    });

    it("infers plugin type value", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "pluginValue",
                  type: "pluginValue",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
        plugins: [
          definePlugin({
            name: "plugin",
            schema: {
              types: [
                defineType({
                  name: "pluginValue",
                  type: "object",
                  fields: [
                    defineField({
                      name: "baz",
                      type: "boolean",
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                }),
              ],
            },
          })(),
        ],
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        pluginValue: {
          _type: "pluginValue";
          baz: boolean;
        };
      }>();
    });

    it("infers plugin's plugin type value", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "pluginValue",
                  type: "pluginValue",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
        plugins: [
          definePlugin({
            name: "plugin",
            schema: {
              types: [
                defineType({
                  name: "pluginValue",
                  type: "object",
                  fields: [
                    defineField({
                      name: "baz",
                      type: "plugin2Value",
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                }),
              ],
            },
            plugins: [
              definePlugin({
                name: "plugin",
                schema: {
                  types: [
                    defineType({
                      name: "plugin2Value",
                      type: "boolean",
                    }),
                  ],
                },
              })(),
            ],
          })(),
        ],
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        pluginValue: {
          _type: "pluginValue";
          baz: boolean;
        };
      }>();
    });
  });

  describe("definePlugin", () => {
    it("infers primitive type value", () => {
      const plugin = definePlugin({
        name: "plugin",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "bar",
                  type: "bar",
                }),
              ],
            }),
            defineType({
              name: "bar",
              type: "string",
            }),
          ],
        },
      })();

      expectType<
        InferSchemaValues<typeof plugin>["bar"]
      >().toStrictEqual<string>();
      expectType<InferSchemaValues<typeof plugin>["foo"]>().toEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar?: string;
      }>();
    });

    it("infers non-primitive type value", () => {
      const plugin = definePlugin({
        name: "plugin",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "bar",
                  type: "bar",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
            defineType({
              name: "bar",
              type: "object",
              fields: [
                defineField({
                  name: "baz",
                  type: "boolean",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      })();

      expectType<InferSchemaValues<typeof plugin>["bar"]>().toEqual<{
        _type: "bar";
        baz: boolean;
      }>();
      expectType<InferSchemaValues<typeof plugin>["foo"]>().toEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar: {
          _type: "bar";
          baz: boolean;
        };
      }>();
    });

    it("allows group and fieldset", () => {
      const plugin = definePlugin({
        name: "plugin",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "bar",
                  group: "test-group",
                  fieldset: "test-fieldset",
                  type: "bar",
                }),
              ],
            }),
            defineType({
              name: "bar",
              type: "string",
            }),
          ],
        },
      })();

      expectType<
        InferSchemaValues<typeof plugin>["bar"]
      >().toStrictEqual<string>();
      expectType<InferSchemaValues<typeof plugin>["foo"]>().toEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        bar?: string;
      }>();
    });

    it("infers cyclical type value", () => {
      const plugin = definePlugin({
        name: "plugin",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "object",
              fields: [
                defineField({
                  name: "foo",
                  type: "foo",
                }),
              ],
            }),
          ],
        },
      })();

      type Values = InferSchemaValues<typeof plugin>;

      // It really is cyclical!
      expectType<NonNullable<Values["foo"]["foo"]>>().toStrictEqual<
        Values["foo"]
      >();
    });

    it("infers multiple step cyclical type value", () => {
      const plugin = definePlugin({
        name: "plugin",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "object",
              fields: [
                defineField({
                  name: "bar",
                  type: "bar",
                }),
              ],
            }),
            defineType({
              name: "bar",
              type: "object",
              fields: [
                defineField({
                  name: "baz",
                  type: "baz",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
            defineType({
              name: "baz",
              type: "object",
              fields: [
                defineField({
                  name: "foo",
                  type: "foo",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      })();

      type Values = InferSchemaValues<typeof plugin>;

      // It really is cyclical!
      expectType<
        NonNullable<
          NonNullable<NonNullable<Values["foo"]["bar"]>["baz"]>["foo"]
        >
      >().toStrictEqual<Values["foo"]>();
    });

    it("infers plugin type value", () => {
      const plugin = definePlugin({
        name: "plugin",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "pluginValue",
                  type: "pluginValue",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
        plugins: [
          definePlugin({
            name: "plugin",
            schema: {
              types: [
                defineType({
                  name: "pluginValue",
                  type: "object",
                  fields: [
                    defineField({
                      name: "baz",
                      type: "boolean",
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                }),
              ],
            },
          })(),
        ],
      })();

      expectType<InferSchemaValues<typeof plugin>["foo"]>().toEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        pluginValue: {
          _type: "pluginValue";
          baz: boolean;
        };
      }>();
    });

    it("infers plugin's plugin type value", () => {
      const plugin = definePlugin({
        name: "plugin",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "document",
              fields: [
                defineField({
                  name: "pluginValue",
                  type: "pluginValue",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
        plugins: [
          definePlugin({
            name: "plugin",
            schema: {
              types: [
                defineType({
                  name: "pluginValue",
                  type: "object",
                  fields: [
                    defineField({
                      name: "baz",
                      type: "plugin2Value",
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                }),
              ],
            },
            plugins: [
              definePlugin({
                name: "plugin",
                schema: {
                  types: [
                    defineType({
                      name: "plugin2Value",
                      type: "boolean",
                    }),
                  ],
                },
              })(),
            ],
          })(),
        ],
      })();

      expectType<InferSchemaValues<typeof plugin>["foo"]>().toEqual<{
        _createdAt: string;
        _id: string;
        _rev: string;
        _type: "foo";
        _updatedAt: string;
        pluginValue: {
          _type: "pluginValue";
          baz: boolean;
        };
      }>();
    });
  });
});
