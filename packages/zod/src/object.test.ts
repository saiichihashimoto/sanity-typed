import { describe, expect, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { _sanityConfigToZods } from ".";

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
      const zods = _sanityConfigToZods(config);

      const unparsed = [
        {
          _key: "key",
          bar: true,
          tar: 1,
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
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
      const zods = _sanityConfigToZods(config);

      const unparsed = [
        {
          _key: "key",
          _type: "bar",
          bar: true,
          tar: 1,
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toEqual<
        InferSchemaValues<typeof config>["foo"][number]
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
      const zods = _sanityConfigToZods(config);

      const unparsed = [
        {
          _key: "key",
          bar: { tar: 1 },
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
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
      const zods = _sanityConfigToZods(config);

      const unparsed = [
        {
          _key: "key",
          bar: true,
        },
      ];

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"][number]
      >();
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
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        _type: "foo",
        bar: {
          bar: true,
          tar: 1,
        },
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
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
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        _type: "foo",
        bar: {
          bar: { tar: 1 },
        },
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
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
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        _type: "foo",
        bar: {
          bar: true,
        },
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<Required<typeof parsed>["bar"]>().toStrictEqual<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >();
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
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        _type: "foo",
        bar: true,
        tar: 1,
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });

    it("overwrites `_type` with defineArrayMember `name`", () => {
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
      const zods = _sanityConfigToZods(config);

      const unparsed = [
        {
          _key: "key",
          _type: "bar",
          bar: true,
          tar: 1,
        },
      ];

      const parsed = zods.bar.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<(typeof parsed)[number]["_type"]>().toStrictEqual<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
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
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        _type: "foo",
        bar: { tar: 1 },
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
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
                  type: "boolean",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      });
      const zods = _sanityConfigToZods(config);

      const unparsed = {
        _type: "foo",
        bar: true,
      };

      const parsed = zods.foo.parse(unparsed);

      expect(parsed).toStrictEqual(unparsed);
      expectType<typeof parsed>().toStrictEqual<
        InferSchemaValues<typeof config>["foo"]
      >();
    });
  });

  describe("validation", () => {
    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/285
    it.todo("custom(fn)");
  });
});
