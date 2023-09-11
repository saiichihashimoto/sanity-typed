import { describe, it } from "@jest/globals";
import type { ImageCrop, ImageHotspot, Reference } from "sanity";

import { expectType } from "@sanity-typed/test-utils";

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
        asset?: Reference;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
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
        asset?: Reference;
        bar?: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
        tar?: number;
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

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "image";
        asset?: Reference;
        bar?: {
          tar?: number;
        };
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
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
        asset?: Reference;
        bar: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
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
                }),
              ],
            }),
          ],
        },
      });

      expectType<
        Required<InferSchemaValues<typeof config>["foo"]>["bar"]
      >().toStrictEqual<{
        _type: "image";
        asset?: Reference;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
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
      >().toStrictEqual<{
        _type: "image";
        asset?: Reference;
        bar?: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
        tar?: number;
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
      >().toStrictEqual<{
        _type: "image";
        asset?: Reference;
        bar?: {
          tar?: number;
        };
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
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
      >().toStrictEqual<{
        _type: "image";
        asset?: Reference;
        bar: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
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
        asset?: Reference;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
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
        asset?: Reference;
        bar?: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
        tar?: number;
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

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        asset?: Reference;
        bar?: {
          tar?: number;
        };
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
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
        asset?: Reference;
        bar: boolean;
        crop?: ImageCrop;
        hotspot?: ImageHotspot;
      }>();
    });
  });
});
