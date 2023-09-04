import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

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

      expectType<InferSchemaValues<typeof config>>().toStrictEqual<{
        bar: string;
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _updatedAt: string;
          bar?: string;
        } & {
          _type: "foo";
        };
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
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>>().toStrictEqual<{
        bar: {
          _type: "bar";
        } & {
          baz?: boolean;
        };
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _updatedAt: string;
          bar?: {
            _type: "bar";
          } & {
            baz?: boolean;
          };
        } & {
          _type: "foo";
        };
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
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      });

      type Values = InferSchemaValues<typeof config>;

      // It really is cyclical!
      expectType<Values["foo"]["foo"]["foo"]>().toStrictEqual<
        Values["foo"]["foo"]
      >();
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

      type Values = InferSchemaValues<typeof config>;

      // It really is cyclical!
      expectType<
        Values["foo"]["bar"]["baz"]["foo"]["bar"]["baz"]["foo"]
      >().toStrictEqual<Values["foo"]["bar"]["baz"]["foo"]>();
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
                    }),
                  ],
                }),
              ],
            },
          })(),
        ],
      });

      expectType<InferSchemaValues<typeof config>>().toStrictEqual<{
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _updatedAt: string;
          pluginValue?: {
            _type: "pluginValue";
          } & {
            baz?: boolean;
          };
        } & {
          _type: "foo";
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

      type Values = InferSchemaValues<typeof plugin>;

      expectType<Values>().toStrictEqual<{
        bar: string;
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _updatedAt: string;
          bar?: string;
        } & {
          _type: "foo";
        };
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
                }),
              ],
            }),
          ],
        },
      })();

      type Values = InferSchemaValues<typeof plugin>;

      expectType<Values>().toStrictEqual<{
        bar: {
          _type: "bar";
        } & {
          baz?: boolean;
        };
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _updatedAt: string;
          bar?: {
            _type: "bar";
          } & {
            baz?: boolean;
          };
        } & {
          _type: "foo";
        };
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
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      })();

      type Values = InferSchemaValues<typeof plugin>;

      // It really is cyclical!
      expectType<Values["foo"]["foo"]["foo"]>().toStrictEqual<
        Values["foo"]["foo"]
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
        Values["foo"]["bar"]["baz"]["foo"]["bar"]["baz"]["foo"]
      >().toStrictEqual<Values["foo"]["bar"]["baz"]["foo"]>();
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
                    }),
                  ],
                }),
              ],
            },
          })(),
        ],
      })();

      type Values = InferSchemaValues<typeof plugin>;

      expectType<Values>().toStrictEqual<{
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _updatedAt: string;
          pluginValue?: {
            _type: "pluginValue";
          } & {
            baz?: boolean;
          };
        } & {
          _type: "foo";
        };
      }>();
    });
  });
});
