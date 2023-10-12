import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import type { ImageCrop, ImageHotspot, Reference } from "sanity";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { InferSchemaValues } from ".";

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

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "image";
        asset: Reference;
      }>();
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
                  type: "image",
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >().toStrictEqual<"bar">();
    });

    it("adds hotspot fields", () => {
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
                  options: {
                    hotspot: true,
                  },
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "image";
        asset: Reference;
        crop: ImageCrop;
        hotspot: ImageHotspot;
      }>();
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

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "image";
        asset: Reference;
        bar?: boolean;
        tar?: number;
      }>();
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

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "image";
        asset: Reference;
        bar: boolean;
      }>();
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
                      validation: (Rule) => Rule.required(),
                      fields: [
                        defineField({
                          name: "tar",
                          type: "number",
                          validation: (Rule) => Rule.required(),
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

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "image";
        asset: Reference;
        bar: {
          tar: number;
        };
      }>();
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
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<{
        _type: "image";
        asset: Reference;
      }>();
    });

    it("adds hotspot fields", () => {
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
                  validation: (Rule) => Rule.required(),
                  options: {
                    hotspot: true,
                  },
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<{
        _type: "image";
        asset: Reference;
        crop: ImageCrop;
        hotspot: ImageHotspot;
      }>();
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
                  validation: (Rule) => Rule.required(),
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
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<{
        _type: "image";
        asset: Reference;
        bar?: boolean;
        tar?: number;
      }>();
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
                  validation: (Rule) => Rule.required(),
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
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<{
        _type: "image";
        asset: Reference;
        bar: boolean;
      }>();
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
                  validation: (Rule) => Rule.required(),
                  fields: [
                    defineField({
                      name: "bar",
                      type: "object",
                      validation: (Rule) => Rule.required(),
                      fields: [
                        defineField({
                          name: "tar",
                          type: "number",
                          validation: (Rule) => Rule.required(),
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
        InferSchemaValues<typeof config>["foo"]["bar"]
      >().toStrictEqual<{
        _type: "image";
        asset: Reference;
        bar: {
          tar: number;
        };
      }>();
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

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        asset: Reference;
      }>();
    });

    it("overwrites `_type` with defineArrayMember `name`", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "image",
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

      expectType<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
      >().toStrictEqual<"bar">();
    });

    it("adds hotspot fields", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "image",
              options: {
                hotspot: true,
              },
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        asset: Reference;
        crop: ImageCrop;
        hotspot: ImageHotspot;
      }>();
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

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        asset: Reference;
        bar?: boolean;
        tar?: number;
      }>();
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

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        asset: Reference;
        bar: boolean;
      }>();
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
                  validation: (Rule) => Rule.required(),
                  fields: [
                    defineField({
                      name: "tar",
                      type: "number",
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        asset: Reference;
        bar: {
          tar: number;
        };
      }>();
    });
  });
});
