import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { ImageValue, InferSchemaValues } from ".";

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

    expectType<InferSchemaValues<typeof config>["foo"]>().toStrictEqual<{
      _type: "foo";
      foo?: {
        _key: string;
        foo?: {
          foo?: {
            _key: string;
            foo?: ImageValue;
          }[];
        };
      }[];
    }>();
  });
});
