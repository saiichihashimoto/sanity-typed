import { describe, it } from "@jest/globals";
import type { ImageCrop, ImageHotspot, ReferenceValue } from "sanity";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField } from "..";
import type { _InferValue } from "..";

describe("depth test", () => {
  it("#108 object -> array -> object -> object -> array -> object -> image", () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/108
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

    expectType<_InferValue<typeof type>>().toStrictEqual<{
      foo?: ({
        _key: string;
      } & {
        foo?: {
          foo?: ({
            _key: string;
          } & {
            foo?: {
              _type: "image";
              asset?: ReferenceValue;
              crop?: ImageCrop;
              hotspot?: ImageHotspot;
            };
          })[];
        };
      })[];
    }>();
  });
});
