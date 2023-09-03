import { describe, it } from "@jest/globals";
import {
  defineArrayMember as defineArrayMemberNative,
  defineConfig as defineConfigNative,
  defineField as defineFieldNative,
  definePlugin as definePluginNative,
  defineType as defineTypeNative,
} from "sanity";

import { expectType } from "@sanity-typed/test-utils";

import {
  castFromTyped,
  castToTyped,
  defineArrayMember,
  defineConfig,
  defineField,
  definePlugin,
  defineType,
} from ".";
import type { InferSchemaValues, _InferValue } from ".";

describe("interoperability", () => {
  describe("castToTyped", () => {
    it("castToTyped(definePluginNative(...))", () => {
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
          castToTyped(
            definePluginNative({
              name: "plugin",
              schema: {
                types: [
                  defineTypeNative({
                    name: "pluginValue",
                    type: "object" as const,
                    fields: [
                      defineFieldNative({
                        name: "baz",
                        type: "boolean",
                      }),
                    ],
                  }),
                ],
              },
            })()
          ),
        ],
      });

      type Values = InferSchemaValues<typeof config>;

      expectType<Values>().toStrictEqual<{
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "document";
          _updatedAt: string;
          pluginValue?: unknown;
        };
      }>();
    });

    it("definePluginNative(...) can be used directly", () => {
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
          definePluginNative({
            name: "plugin",
            schema: {
              types: [
                defineTypeNative({
                  name: "pluginValue",
                  type: "object" as const,
                  fields: [
                    defineFieldNative({
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

      type Values = InferSchemaValues<typeof config>;

      expectType<Values>().toStrictEqual<{
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "document";
          _updatedAt: string;
          pluginValue?: unknown;
        };
      }>();
    });

    it("castToTyped(defineTypeNative(...))", () => {
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
            castToTyped(
              defineTypeNative({
                name: "bar",
                type: "object",
                fields: [
                  defineFieldNative({
                    name: "baz",
                    type: "boolean",
                  }),
                ],
              })
            ),
          ],
        },
      });

      type Values = InferSchemaValues<typeof config>;

      expectType<Values>().toStrictEqual<{
        bar: { [x: string]: unknown; _type: "bar" };
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "document";
          _updatedAt: string;
          bar?: { _type: "bar" } & { [x: string]: unknown };
        };
      }>();
    });

    it("castToTyped(defineFieldNative(...))", () => {
      const booleanField = castToTyped(
        defineFieldNative({
          name: "bar",
          type: "boolean",
        })
      );

      expectType<_InferValue<typeof booleanField>>().toStrictEqual<boolean>();

      const objectField = castToTyped(
        defineFieldNative({
          name: "foo",
          type: "object",
          fields: [
            defineFieldNative({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      );

      expectType<_InferValue<typeof objectField>>().toStrictEqual<{
        [x: string]: unknown;
      }>();
    });

    it("castToTyped(defineArrayMemberNative(...))", () => {
      const booleanField = castToTyped(
        defineArrayMemberNative({
          name: "bar",
          type: "boolean",
        })
      );

      expectType<_InferValue<typeof booleanField>>().toStrictEqual<boolean>();

      const objectField = castToTyped(
        defineArrayMemberNative({
          name: "foo",
          type: "object",
          fields: [
            defineFieldNative({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      );

      expectType<_InferValue<typeof objectField>>().toStrictEqual<
        {
          _key: string;
        } & {
          _type: "foo";
        } & {
          [x: string]: unknown;
        }
      >();
    });
  });

  describe("castFromTyped", () => {
    it("castFromTyped(definePlugin(...))", () => {
      const config = defineConfigNative({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineTypeNative({
              name: "foo",
              type: "document" as const,
              fields: [
                defineFieldNative({
                  name: "pluginValue",
                  type: "pluginValue",
                }),
              ],
            }),
          ],
        },
        plugins: [
          castFromTyped(
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
            })()
          ),
        ],
      });

      expectType<typeof config>().toBeAssignableTo<
        ReturnType<typeof defineConfigNative>
      >();
    });

    it("castFromTyped(defineType(...))", () => {
      const config = defineConfigNative({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineTypeNative({
              name: "foo",
              type: "document" as const,
              fields: [
                defineFieldNative({
                  name: "bar",
                  type: "bar",
                }),
              ],
            }),
            castFromTyped(
              defineType({
                name: "bar",
                type: "object",
                fields: [
                  defineField({
                    name: "baz",
                    type: "boolean",
                  }),
                ],
              })
            ),
          ],
        },
      });

      expectType<typeof config>().toBeAssignableTo<
        ReturnType<typeof defineConfigNative>
      >();
    });

    it("castFromTyped(defineField(...))", () => {
      const booleanField = castFromTyped(
        defineField({
          name: "bar",
          type: "boolean",
        })
      );

      expectType<typeof booleanField>().toBeAssignableTo<
        ReturnType<
          typeof defineFieldNative<"boolean", "bar", any, any, any, any>
        >
      >();

      const objectField = castFromTyped(
        defineField({
          name: "foo",
          type: "object",
          fields: [
            defineField({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      );

      expectType<typeof objectField>().toBeAssignableTo<
        ReturnType<
          typeof defineFieldNative<"object", "foo", any, any, any, any>
        >
      >();
    });

    it("castFromTyped(defineArrayMember(...))", () => {
      const booleanField = castFromTyped(
        defineArrayMember({
          name: "bar",
          type: "boolean",
        })
      );

      expectType<typeof booleanField>().toBeAssignableTo<
        ReturnType<
          typeof defineArrayMemberNative<"boolean", "bar", any, any, any, any>
        >
      >();

      const objectField = castFromTyped(
        defineArrayMember({
          name: "foo",
          type: "object",
          fields: [
            defineField({
              name: "bar",
              type: "boolean",
            }),
          ],
        })
      );

      expectType<typeof objectField>().toBeAssignableTo<
        ReturnType<
          typeof defineArrayMemberNative<"object", "foo", any, any, any, any>
        >
      >();
    });
  });
});
