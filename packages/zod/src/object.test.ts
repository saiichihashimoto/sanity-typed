import { describe, it } from "@jest/globals";
import type { Simplify } from "type-fest";
import type { z } from "zod";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { sanityConfigToZods } from ".";

describe("object", () => {
  describe("defineArrayMember", () => {
    it("builds parser for object with fields", () => {
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>[number]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            _key: "key",
            bar: true,
            tar: 1,
          },
        ])
      ).toStrictEqual([
        {
          _key: "key",
          bar: true,
          tar: 1,
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
    });

    it("overwrites `_type` with `name`", () => {
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
                  name: "bar",
                  type: "object",
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>[number]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            _key: "key",
            _type: "bar",
            bar: true,
            tar: 1,
          },
        ])
      ).toStrictEqual([
        {
          _key: "key",
          _type: "bar",
          bar: true,
          tar: 1,
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
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
                  type: "object",
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>[number]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            _key: "key",
            bar: { tar: 1 },
          },
        ])
      ).toStrictEqual([
        {
          _key: "key",
          bar: { tar: 1 },
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
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
                  type: "object",
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>[number]>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"][number]>
      >();
      expect(
        zods.foo.parse([
          {
            _key: "key",
            bar: true,
          },
        ])
      ).toStrictEqual([
        {
          _key: "key",
          bar: true,
        },
      ]);
      expect(() => zods.foo.parse([true])).toThrow();
    });
  });

  describe("defineField", () => {
    it("builds parser for object with fields", () => {
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
                  type: "object",
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
      const zods = sanityConfigToZods(config);

      expectType<
        Required<z.infer<(typeof zods)["foo"]>>["bar"]
      >().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          bar: {
            bar: true,
            tar: 1,
          },
        })
      ).toStrictEqual({
        _type: "foo",
        bar: {
          bar: true,
          tar: 1,
        },
      });
      expect(() => zods.foo.parse(true)).toThrow();
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
                  type: "object",
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
      const zods = sanityConfigToZods(config);

      expectType<
        Required<z.infer<(typeof zods)["foo"]>>["bar"]
      >().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          bar: {
            bar: { tar: 1 },
          },
        })
      ).toStrictEqual({
        _type: "foo",
        bar: {
          bar: { tar: 1 },
        },
      });
      expect(() => zods.foo.parse(true)).toThrow();
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
                  type: "object",
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
      const zods = sanityConfigToZods(config);

      expectType<
        Required<z.infer<(typeof zods)["foo"]>>["bar"]
      >().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          bar: {
            bar: true,
          },
        })
      ).toStrictEqual({
        _type: "foo",
        bar: {
          bar: true,
        },
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });

  describe("defineType", () => {
    it("builds parser for object with fields", () => {
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          bar: true,
          tar: 1,
        })
      ).toStrictEqual({
        _type: "foo",
        bar: true,
        tar: 1,
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });

    it.failing("overwrites `_type` with defineArrayMember `name`", () => {
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
                  type: "boolean",
                }),
                defineField({
                  name: "tar",
                  type: "number",
                }),
              ],
            }),
            defineType({
              name: "bar",
              type: "array",
              of: [
                defineArrayMember({
                  name: "bar",
                  type: "foo",
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["bar"]>[number]["_type"]>()
        // @ts-expect-error -- FIXME
        .toStrictEqual<
          InferSchemaValues<typeof config>["bar"][number]["_type"]
        >();
      expect(
        zods.foo.parse({
          _type: "bar",
          bar: true,
          tar: 1,
        })
      ).toStrictEqual({
        _type: "bar",
        bar: true,
        tar: 1,
      });
      expect(() => zods.foo.parse(true)).toThrow();
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
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          bar: { tar: 1 },
        })
      ).toStrictEqual({
        _type: "foo",
        bar: { tar: 1 },
      });
      expect(() => zods.foo.parse(true)).toThrow();
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
                  type: "boolean",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      });
      const zods = sanityConfigToZods(config);

      expectType<z.infer<(typeof zods)["foo"]>>().toStrictEqual<
        Simplify<InferSchemaValues<typeof config>["foo"]>
      >();
      expect(
        zods.foo.parse({
          _type: "foo",
          bar: true,
        })
      ).toStrictEqual({
        _type: "foo",
        bar: true,
      });
      expect(() => zods.foo.parse(true)).toThrow();
    });
  });
});
