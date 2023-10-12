import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineConfig,
  defineField,
  definePlugin,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, SanityDocument } from "@sanity-typed/types";

import { sanityConfigToZodsTyped } from "./internal";

const documentFields: Omit<SanityDocument, "_type"> = {
  _id: "id",
  _createdAt: "createdAt",
  _updatedAt: "updatedAt",
  _rev: "rev",
};

describe("<alias>", () => {
  describe("defineConfig", () => {
    it("builds parser for primitive type value", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        bar: "bar",
        foo: {
          ...documentFields,
          _type: "foo",
          bar: "bar",
        },
      };

      const parsed = {
        bar: zods.bar.parse(unparsed.bar),
        foo: zods.foo.parse(unparsed.foo),
      };

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>
      >();
    });

    it("builds parser for non-primitive type value", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        bar: {
          _type: "bar",
          baz: true,
        },
        foo: {
          ...documentFields,
          _type: "foo",
          bar: {
            _type: "bar",
            baz: true,
          },
        },
      };

      const parsed = {
        bar: zods.bar.parse(unparsed.bar),
        foo: zods.foo.parse(unparsed.foo),
      };

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>
      >();
    });

    it("builds parser for cyclical type value", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        foo: {
          _type: "foo",
          foo: {
            _type: "foo",
            foo: {
              _type: "foo",
            },
          },
        },
      };

      const parsed = {
        // @ts-expect-error -- Cyclical typing with zod doesn't seem to work
        foo: zods.foo.parse(unparsed.foo),
      };

      // It really is cyclical!
      expect(parsed).toStrictEqual(unparsed);
      expect(zods.foo.shape.foo.unwrap().schema).toStrictEqual(zods.foo);
      expectType<typeof parsed>().toStrictEqual<
        // @ts-expect-error -- Cyclical typing with zod doesn't seem to work
        InferSchemaValues<typeof config>
      >();
    });

    it("builds parser for multiple step cyclical type value", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        foo: {
          _type: "foo",
          bar: {
            _type: "bar",
            baz: {
              _type: "baz",
              foo: {
                _type: "foo",
                bar: {
                  _type: "bar",
                  baz: {
                    _type: "baz",
                    foo: {
                      _type: "foo",
                    },
                  },
                },
              },
            },
          },
        },
      };

      const parsed = {
        // @ts-expect-error -- Cyclical typing with zod doesn't seem to work
        foo: zods.foo.parse(unparsed.foo),
      };

      // It really is cyclical!
      expect(parsed).toStrictEqual(unparsed);
      expect(
        zods.foo.shape.bar.unwrap().schema.shape.baz.schema.shape.foo.schema
      ).toStrictEqual(zods.foo);
      expectType<typeof parsed>().toStrictEqual<
        // @ts-expect-error -- Cyclical typing with zod doesn't seem to work
        InferSchemaValues<typeof config>
      >();
    });

    it("builds parser for plugin type value", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        foo: {
          ...documentFields,
          _type: "foo",
          pluginValue: {
            _type: "pluginValue",
            baz: true,
          },
        },
      };

      const parsed = {
        foo: zods.foo.parse(unparsed.foo),
      };

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>
      >();
    });

    it("builds parser for plugin's plugin type value", () => {
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
      const zods = sanityConfigToZodsTyped(config);

      const unparsed = {
        foo: {
          ...documentFields,
          _type: "foo",
          pluginValue: {
            _type: "pluginValue",
            baz: true,
          },
        },
      };

      const parsed = {
        foo: zods.foo.parse(unparsed.foo),
      };

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>
      >();
    });
  });

  describe("definePlugin", () => {
    it("builds parser for primitive type value", () => {
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
              type: "string",
            }),
          ],
        },
      })();
      const zods = sanityConfigToZodsTyped(plugin);

      const unparsed = {
        bar: "bar",
        foo: {
          ...documentFields,
          _type: "foo",
          bar: "bar",
        },
      };

      const parsed = {
        bar: zods.bar.parse(unparsed.bar),
        foo: zods.foo.parse(unparsed.foo),
      };

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof plugin>
      >();
    });

    it("builds parser for non-primitive type value", () => {
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
      const zods = sanityConfigToZodsTyped(plugin);

      const unparsed = {
        bar: {
          _type: "bar",
          baz: true,
        },
        foo: {
          ...documentFields,
          _type: "foo",
          bar: {
            _type: "bar",
            baz: true,
          },
        },
      };

      const parsed = {
        bar: zods.bar.parse(unparsed.bar),
        foo: zods.foo.parse(unparsed.foo),
      };

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof plugin>
      >();
    });

    it("builds parser for cyclical type value", () => {
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
      const zods = sanityConfigToZodsTyped(plugin);

      const unparsed = {
        foo: {
          _type: "foo",
          foo: {
            _type: "foo",
            foo: {
              _type: "foo",
            },
          },
        },
      };

      const parsed = {
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
        foo: zods.foo.parse(unparsed.foo),
      };

      // It really is cyclical!
      expect(parsed).toStrictEqual(unparsed);
      expect(zods.foo.shape.foo.unwrap().schema).toStrictEqual(zods.foo);
      expectType<typeof parsed>().toStrictEqual<
        // @ts-expect-error -- Cyclical typing with zod doesn't seem to work
        InferSchemaValues<typeof plugin>
      >();
    });

    it("builds parser for multiple step cyclical type value", () => {
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
      const zods = sanityConfigToZodsTyped(plugin);

      const unparsed = {
        foo: {
          _type: "foo",
          bar: {
            _type: "bar",
            baz: {
              _type: "baz",
              foo: {
                _type: "foo",
                bar: {
                  _type: "bar",
                  baz: {
                    _type: "baz",
                    foo: {
                      _type: "foo",
                    },
                  },
                },
              },
            },
          },
        },
      };

      const parsed = {
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/335
        foo: zods.foo.parse(unparsed.foo),
      };

      // It really is cyclical!
      expect(parsed).toStrictEqual(unparsed);
      expect(
        zods.foo.shape.bar.unwrap().schema.shape.baz.schema.shape.foo.schema
      ).toStrictEqual(zods.foo);
      expectType<typeof parsed>().toStrictEqual<
        // @ts-expect-error -- Cyclical typing with zod doesn't seem to work
        InferSchemaValues<typeof plugin>
      >();
    });

    it("builds parser for plugin type value", () => {
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
      const zods = sanityConfigToZodsTyped(plugin);

      const unparsed = {
        foo: {
          ...documentFields,
          _type: "foo",
          pluginValue: {
            _type: "pluginValue",
            baz: true,
          },
        },
      };

      const parsed = {
        foo: zods.foo.parse(unparsed.foo),
      };

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof plugin>
      >();
    });

    it("builds parser for plugin's plugin type value", () => {
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
      const zods = sanityConfigToZodsTyped(plugin);

      const unparsed = {
        foo: {
          ...documentFields,
          _type: "foo",
          pluginValue: {
            _type: "pluginValue",
            baz: true,
          },
        },
      };

      const parsed = {
        foo: zods.foo.parse(unparsed.foo),
      };

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof plugin>
      >();
    });
  });
});
