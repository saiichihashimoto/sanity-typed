import { describe, it } from "@jest/globals";
import type { ImageCrop, ImageHotspot, ReferenceValue } from "sanity";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField } from "..";
import type { _InferValue } from "..";

describe("depth test", () => {
  it("object in array", () => {
    const objectArrayObject = defineField({
      name: "foo",
      type: "object",
      fields: [
        defineField({
          name: "foo",
          type: "array",
          of: [
            defineArrayMember({
              type: "slug",
            }),
          ],
        }),
      ],
    });

    expectType<_InferValue<typeof objectArrayObject>>().toStrictEqual<{
      foo?: { _key: string; _type: "slug"; current?: string }[];
    }>();

    // FIXME breaks so shallowly
    const nestedInObject = defineField({
      name: "foo",
      type: "object",
      fields: [objectArrayObject],
    });

    // FIXME breaks so shallowly
    expectType<_InferValue<typeof nestedInObject>>().toStrictEqual<{
      foo?: { foo?: { _key: string; _type: "slug"; current?: string }[] };
    }>();
  });

  describe("#108 https://github.com/saiichihashimoto/sanity-typed/issues/108", () => {
    it("object -> array -> object -> object -> array -> object -> image", () => {
      const type = defineField({
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
                  // FIXME breaks so shallowly
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
      });

      // FIXME breaks so shallowly
      expectType<_InferValue<typeof type>>().toStrictEqual<{
        foo?: {
          foo?: {
            foo?: {
              foo?: {
                asset?: ReferenceValue;
                crop?: ImageCrop;
                hotspot?: ImageHotspot;
              };
            }[];
          };
        }[];
      }>();
    });
  });
});
