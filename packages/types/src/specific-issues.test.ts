import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import type { decorator } from "@portabletext-typed/types";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type {
  ImageValue,
  InferSchemaValues,
  ReferenceValue,
  referenced,
} from ".";

describe("specific issues", () => {
  it("#108 object -> array -> object -> object -> array -> object -> image", () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/108
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
                type: "array",
                of: [
                  defineArrayMember({
                    type: "object",
                    fields: [
                      defineField({
                        name: "foo",
                        type: "object",
                        fields: [
                          defineField({
                            name: "foo",
                            type: "array",
                            of: [
                              defineArrayMember({
                                type: "object",
                                fields: [
                                  defineField({
                                    name: "foo",
                                    type: "image",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
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

    expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
      _type: "foo";
      foo?: {
        _key: string;
        foo?: {
          foo?: {
            _key: string;
            foo?: ImageValue<false>;
          }[];
        };
      }[];
    }>();
  });

  it("#299 object -> array -> reference", () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/299
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            title: "Project slider",
            name: "section.projectSlider",
            type: "object",
            fields: [
              defineField({
                type: "string",
                name: "title",
              }),
              defineField({
                title: "Projects",
                name: "projects",
                type: "array",
                validation: (Rule) => Rule.min(3),
                of: [
                  defineArrayMember({
                    type: "reference",
                    to: [{ type: "project" as const }],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<
      InferSchemaValues<typeof config>["section.projectSlider"]
    >().toEqual<{
      _type: "section.projectSlider";
      projects?: (ReferenceValue<"project"> & { _key: string })[];
      title?: string;
    }>();
  });

  it("#415 object -> array -> block", () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/415
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            type: "object",
            name: "foo",
            fields: [
              defineField({
                name: "bar",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "block",
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
      bar?: {
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
      }[];
    }>();
  });

  it("#589 object -> array -> block -> object -> field", () => {
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
                type: "array",
                of: [
                  defineArrayMember({
                    name: "baz",
                    type: "block",
                    marks: {
                      annotations: [
                        defineArrayMember({
                          name: "qux",
                          type: "object",
                          fields: [
                            defineField({
                              name: "quux",
                              type: "string",
                            }),
                          ],
                        }),
                      ],
                    },
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
      bar?: {
        _key: string;
        _type: "baz";
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
          _type: "qux";
          quux?: string;
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
      }[];
    }>();
  });

  it("#622 ???", () => {
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
                name: "content",
                type: "array",
                of: [
                  defineArrayMember({ type: "image" }),
                  defineArrayMember({
                    type: "block",
                    of: [defineArrayMember({ type: "file" })],
                    styles: [
                      { title: "Normal", value: "normal" as const },
                      { title: "Foo", value: "foo" as const },
                    ],
                    lists: [
                      { title: "Bullet", value: "bullet" as const },
                      { title: "Bar", value: "bar" as const },
                    ],
                    marks: {
                      decorators: [
                        { title: "Strong", value: "strong" as const },
                        { title: "Baz", value: "baz" as const },
                      ],
                      annotations: [
                        defineArrayMember({
                          name: "link",
                          type: "object",
                          fields: [
                            defineField({
                              name: "href",
                              type: "string",
                              validation: (Rule) => Rule.required(),
                            }),
                          ],
                        }),
                        defineArrayMember({
                          name: "qux",
                          type: "object",
                          fields: [
                            defineField({
                              name: "value",
                              type: "string",
                              validation: (Rule) => Rule.required(),
                            }),
                          ],
                        }),
                      ],
                    },
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
      _createdAt: string;
      _id: string;
      _rev: string;
      _type: "foo";
      _updatedAt: string;
      content?: (
        | {
            _key: string;
            _type: "block";
            children: (
              | {
                  _key: string;
                  _type: "file";
                  asset: {
                    _ref: string;
                    _type: "reference";
                    [referenced]: "sanity.fileAsset";
                  };
                }
              | {
                  _key: string;
                  _type: "span";
                  [decorator]: "baz" | "strong";
                  marks: string[];
                  text: string;
                }
            )[];
            level?: number;
            listItem?: "bar" | "bullet";
            markDefs: (
              | { _key: string; _type: "link"; href: string }
              | { _key: string; _type: "qux"; value: string }
            )[];
            style: "foo" | "normal";
          }
        | {
            _key: string;
            _type: "image";
            asset: {
              _ref: string;
              _type: "reference";
              [referenced]: "sanity.imageAsset";
            };
          }
      )[];
    }>();
  });
});
