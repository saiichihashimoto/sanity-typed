import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import type { GeopointValue } from "sanity";

import type { decorator } from "@portabletext-typed/types";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { InferSchemaValues, ReferenceValue, SlugValue } from ".";

describe("block", () => {
  describe("defineArrayMember", () => {
    it("infers PortableTextBlock", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "array",
              of: [defineArrayMember({ type: "block" })],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
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
              of: [defineArrayMember({ name: "bar", type: "block" })],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["foo"][number]["_type"]
      >().toStrictEqual<"bar">();
    });

    it("infers array of members", () => {
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
                  type: "block",
                  of: [defineArrayMember({ type: "slug" })],
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: (
          | {
              _key: string;
              _type: "span";
              [decorator]:
                | "code"
                | "em"
                | "strike-through"
                | "strike"
                | "strong"
                | "underline";
              marks: string[];
              text: string;
            }
          | (SlugValue & { _key: string })
        )[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers unions if there are multiple members", () => {
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
                  type: "block",
                  of: [
                    defineArrayMember({ type: "slug" }),
                    defineArrayMember({ type: "geopoint" }),
                  ],
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: (
          | {
              _key: string;
              _type: "span";
              [decorator]:
                | "code"
                | "em"
                | "strike-through"
                | "strike"
                | "strong"
                | "underline";
              marks: string[];
              text: string;
            }
          | (GeopointValue & { _key: string })
          | (SlugValue & { _key: string })
        )[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers style", async () => {
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
                  type: "block",
                  styles: [
                    { title: "Foo", value: "foo" as const },
                    { title: "Bar", value: "bar" as const },
                  ],
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style: "bar" | "foo";
      }>();
    });

    it("infers listItem", async () => {
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
                  type: "block",
                  lists: [
                    { title: "Foo", value: "foo" as const },
                    { title: "Bar", value: "bar" as const },
                  ],
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bar" | "foo";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers decorator", async () => {
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
                  type: "block",
                  marks: {
                    decorators: [
                      { title: "Foo", value: "foo" as const },
                      { title: "Bar", value: "bar" as const },
                    ],
                  },
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          [decorator]: "bar" | "foo";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers markDefs", async () => {
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
                  type: "block",
                  marks: {
                    annotations: [
                      defineArrayMember({
                        name: "internalLink",
                        type: "object",
                        fields: [
                          defineField({
                            name: "reference",
                            type: "reference",
                            to: [{ type: "post" as const }],
                          }),
                        ],
                      }),
                    ],
                  },
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: {
          _key: string;
          _type: "internalLink";
          reference?: ReferenceValue<"post", false>;
        }[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers style from readonly list", async () => {
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
                  type: "block",
                  styles: [
                    { title: "Foo", value: "foo" },
                    { title: "Bar", value: "bar" },
                  ] as const,
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style: "bar" | "foo";
      }>();
    });

    it("infers listItem from readonly list", async () => {
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
                  type: "block",
                  lists: [
                    { title: "Foo", value: "foo" },
                    { title: "Bar", value: "bar" },
                  ] as const,
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bar" | "foo";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers decorator from readonly list", async () => {
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
                  type: "block",
                  marks: {
                    decorators: [
                      { title: "Foo", value: "foo" },
                      { title: "Bar", value: "bar" },
                    ] as const,
                  },
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          [decorator]: "bar" | "foo";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers markDefs from readonly list", async () => {
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
                  type: "block",
                  marks: {
                    annotations: [
                      defineArrayMember({
                        name: "internalLink",
                        type: "object",
                        fields: [
                          defineField({
                            name: "reference",
                            type: "reference",
                            to: [{ type: "post" }] as const,
                          }),
                        ],
                      }),
                    ],
                  },
                }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"][number]>().toEqual<{
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: {
          _key: string;
          _type: "internalLink";
          reference?: ReferenceValue<"post", false>;
        }[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });
  });

  describe("defineField", () => {
    it("is a typescript error", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "object",
              fields: [
                // @ts-expect-error EXPECTED blocks can't be fields https://www.sanity.io/docs/block-type
                defineField({ name: "bar", type: "block" }),
              ],
            }),
          ],
        },
      });

      expectType<
        Exclude<keyof InferSchemaValues<typeof config>["foo"], "_type">
      >().toStrictEqual<never>();
    });
  });

  describe("defineType", () => {
    it("infers PortableTextBlock", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: { types: [defineType({ name: "foo", type: "block" })] },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("overwrites `_type` with defineArrayMember `name`", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({ name: "foo", type: "block" }),
            defineType({
              name: "bar",
              type: "array",
              of: [defineArrayMember({ name: "bar", type: "foo" })],
            }),
          ],
        },
      });

      expectType<
        InferSchemaValues<typeof config>["bar"][number]["_type"]
      >().toStrictEqual<"bar">();
    });

    it("infers array of members", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              of: [defineArrayMember({ type: "slug" })],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: (
          | {
              _key: string;
              _type: "span";
              [decorator]:
                | "code"
                | "em"
                | "strike-through"
                | "strike"
                | "strong"
                | "underline";
              marks: string[];
              text: string;
            }
          | (SlugValue & { _key: string })
        )[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers unions if there are multiple members", () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              of: [
                defineArrayMember({ type: "slug" }),
                defineArrayMember({ type: "geopoint" }),
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: (
          | {
              _key: string;
              _type: "span";
              [decorator]:
                | "code"
                | "em"
                | "strike-through"
                | "strike"
                | "strong"
                | "underline";
              marks: string[];
              text: string;
            }
          | (GeopointValue & { _key: string })
          | (SlugValue & { _key: string })
        )[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers style", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              styles: [
                { title: "Foo", value: "foo" as const },
                { title: "Bar", value: "bar" as const },
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style: "bar" | "foo";
      }>();
    });

    it("infers listItem", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              lists: [
                { title: "Foo", value: "foo" as const },
                { title: "Bar", value: "bar" as const },
              ],
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bar" | "foo";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers decorator", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              marks: {
                decorators: [
                  { title: "Foo", value: "foo" as const },
                  { title: "Bar", value: "bar" as const },
                ],
              },
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: {
          _key: string;
          _type: "span";
          [decorator]: "bar" | "foo";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers markDefs", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              marks: {
                annotations: [
                  defineArrayMember({
                    name: "internalLink",
                    type: "object",
                    fields: [
                      defineField({
                        name: "reference",
                        type: "reference",
                        to: [{ type: "post" as const }],
                      }),
                    ],
                  }),
                ],
              },
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: {
          _key: string;
          _type: "internalLink";
          reference?: ReferenceValue<"post", false>;
        }[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers style from readonly list", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              styles: [
                { title: "Foo", value: "foo" },
                { title: "Bar", value: "bar" },
              ] as const,
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style: "bar" | "foo";
      }>();
    });

    it("infers listItem from readonly list", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              lists: [
                { title: "Foo", value: "foo" },
                { title: "Bar", value: "bar" },
              ] as const,
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bar" | "foo";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers decorator from readonly list", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              marks: {
                decorators: [
                  { title: "Foo", value: "foo" },
                  { title: "Bar", value: "bar" },
                ] as const,
              },
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: {
          _key: string;
          _type: "span";
          [decorator]: "bar" | "foo";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });

    it("infers markDefs from readonly list", async () => {
      const config = defineConfig({
        dataset: "dataset",
        projectId: "projectId",
        schema: {
          types: [
            defineType({
              name: "foo",
              type: "block",
              marks: {
                annotations: [
                  defineArrayMember({
                    name: "internalLink",
                    type: "object",
                    fields: [
                      defineField({
                        name: "reference",
                        type: "reference",
                        to: [{ type: "post" }] as const,
                      }),
                    ],
                  }),
                ],
              },
            }),
          ],
        },
      });

      expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
        _type: "foo";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: {
          _key: string;
          _type: "internalLink";
          reference?: ReferenceValue<"post", false>;
        }[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }>();
    });
  });
});
