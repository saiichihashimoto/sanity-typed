import { base, en } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineConfig,
  defineField,
  definePlugin,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";
import { sanityConfigToZods } from "@sanity-typed/zod";

import { sanityConfigToFakerTyped } from "./internal";

describe.each(Array.from({ length: 5 }).map((_, seed) => [{ seed }]))(
  "<alias> %p",
  ({ seed }) => {
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          bar: sanityFaker.bar(),
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(config);

        expect(zods.bar.parse(fakes.bar)).toStrictEqual(fakes.bar);
        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["bar"]>().toStrictEqual<
          InferSchemaValues<typeof config>["bar"]
        >();
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          bar: sanityFaker.bar(),
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(config);

        expect(zods.bar.parse(fakes.bar)).toStrictEqual(fakes.bar);
        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["bar"]>().toStrictEqual<
          InferSchemaValues<typeof config>["bar"]
        >();
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(config);

        // It really is cyclical!
        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          bar: sanityFaker.bar(),
          baz: sanityFaker.baz(),
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(config);

        // It really is cyclical!
        expect(zods.bar.parse(fakes.bar)).toStrictEqual(fakes.bar);
        expect(zods.baz.parse(fakes.baz)).toStrictEqual(fakes.baz);
        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["bar"]>().toStrictEqual<
          InferSchemaValues<typeof config>["bar"]
        >();
        expectType<(typeof fakes)["baz"]>().toStrictEqual<
          InferSchemaValues<typeof config>["baz"]
        >();
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(config, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(config);

        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof config>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(plugin, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          bar: sanityFaker.bar(),
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(plugin);

        expect(zods.bar.parse(fakes.bar)).toStrictEqual(fakes.bar);
        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["bar"]>().toStrictEqual<
          InferSchemaValues<typeof plugin>["bar"]
        >();
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof plugin>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(plugin, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          bar: sanityFaker.bar(),
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(plugin);

        expect(zods.bar.parse(fakes.bar)).toStrictEqual(fakes.bar);
        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["bar"]>().toStrictEqual<
          InferSchemaValues<typeof plugin>["bar"]
        >();
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof plugin>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(plugin, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(plugin);

        // It really is cyclical!
        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof plugin>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(plugin, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          bar: sanityFaker.bar(),
          baz: sanityFaker.baz(),
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(plugin);

        // It really is cyclical!
        expect(zods.bar.parse(fakes.bar)).toStrictEqual(fakes.bar);
        expect(zods.baz.parse(fakes.baz)).toStrictEqual(fakes.baz);
        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["bar"]>().toStrictEqual<
          InferSchemaValues<typeof plugin>["bar"]
        >();
        expectType<(typeof fakes)["baz"]>().toStrictEqual<
          InferSchemaValues<typeof plugin>["baz"]
        >();
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof plugin>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(plugin, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(plugin);

        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof plugin>["foo"]
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
        const sanityFaker = sanityConfigToFakerTyped(plugin, {
          seed,
          faker: { locale: [en, base] },
        });

        const fakes = {
          foo: sanityFaker.foo(),
        };

        const zods = sanityConfigToZods(plugin);

        expect(zods.foo.parse(fakes.foo)).toStrictEqual(fakes.foo);
        expectType<(typeof fakes)["foo"]>().toStrictEqual<
          InferSchemaValues<typeof plugin>["foo"]
        >();
      });
    });
  }
);
