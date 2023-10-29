import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { ImageValue, InferSchemaValues, ReferenceValue } from ".";

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
          marks?: string[];
          text: string;
        }[];
        level?: number;
        listItem?: string;
        markDefs?: {
          _key: string;
          _type: string;
        }[];
        style?: string;
      }[];
    }>();
  });
});
