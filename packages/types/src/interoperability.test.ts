import { describe, it } from "@jest/globals";
import {
  defineArrayMember as defineArrayMemberNative,
  defineConfig as defineConfigNative,
  defineField as defineFieldNative,
  definePlugin as definePluginNative,
  defineType as defineTypeNative,
} from "sanity";
import type { Simplify } from "type-fest";

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
import type { InferSchemaValues } from ".";

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

      expectType<InferSchemaValues<typeof config>>().toStrictEqual<{
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _updatedAt: string;
          pluginValue?: unknown;
        } & {
          _type: "foo";
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

      expectType<InferSchemaValues<typeof config>>().toStrictEqual<{
        foo: {
          _createdAt: string;
          _id: string;
          _rev: string;
          _updatedAt: string;
          pluginValue?: unknown;
        } & {
          _type: "foo";
        };
      }>();
    });

    it("castToTyped(defineTypeNative(...))", () => {
      const config1 = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            castToTyped(
              defineTypeNative({
                name: "foo",
                type: "boolean",
              })
            ),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config1>["foo"]
      >().toStrictEqual<boolean>();

      const config2 = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            castToTyped(
              defineTypeNative({
                name: "foo",
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

      expectType<
        Simplify<InferSchemaValues<typeof config2>["foo"]>
      >().toStrictEqual<{
        [x: string]: unknown;
        _type: "foo";
      }>();
    });

    it("castToTyped(defineFieldNative(...))", () => {
      const config1 = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "object",
              fields: [
                castToTyped(
                  defineFieldNative({
                    name: "bar",
                    type: "boolean",
                  })
                ),
              ],
            }),
          ],
        },
      });

      expectType<
        Required<InferSchemaValues<typeof config1>["foo"]>["bar"]
      >().toStrictEqual<boolean>();

      const config2 = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "object",
              fields: [
                castToTyped(
                  defineFieldNative({
                    name: "bar",
                    type: "object",
                    fields: [
                      defineFieldNative({
                        name: "bar",
                        type: "boolean",
                      }),
                    ],
                  })
                ),
              ],
            }),
          ],
        },
      });

      expectType<
        Required<InferSchemaValues<typeof config2>["foo"]>["bar"]
      >().toStrictEqual<
        | {
            [x: string]: unknown;
            _type: "bar";
          }
        | {
            [x: string]: unknown;
          }
      >();
    });

    it("castToTyped(defineArrayMemberNative(...))", () => {
      const config1 = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [
                castToTyped(
                  defineArrayMemberNative({
                    name: "bar",
                    type: "boolean",
                  })
                ),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config1>["foo"][number]
      >().toStrictEqual<boolean>();

      const config2 = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [
                castToTyped(
                  defineArrayMemberNative({
                    type: "object",
                    fields: [
                      defineFieldNative({
                        name: "bar",
                        type: "boolean",
                      }),
                    ],
                  })
                ),
              ],
            }),
          ],
        },
      });

      expectType<
        Simplify<InferSchemaValues<typeof config2>["foo"][number]>
      >().toStrictEqual<{
        [x: string]: unknown;
        _key: string;
      }>();
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
