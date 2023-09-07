import { describe, it } from "@jest/globals";
import type {
  ImageCrop,
  ImageHotspot,
  ReferenceValue as ReferenceValueNative,
} from "sanity";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField, defineType } from ".";
import type { ReferenceValue, _InferValue } from ".";

describe("specific issues", () => {
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
              asset?: ReferenceValueNative;
              crop?: ImageCrop;
              hotspot?: ImageHotspot;
            };
          })[];
        };
      })[];
    }>();
  });

  it("#299", () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/299
    const type = defineType({
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
          validation: (rule) => rule.min(3),
          of: [
            defineArrayMember({
              type: "reference",
              to: [{ type: "project" as const }],
            }),
          ],
        }),
      ],
    });

    expectType<_InferValue<typeof type>>().toStrictEqual<{
      _type: "section.projectSlider";
      projects?: (ReferenceValue<"project"> & { _key: string })[];
      title?: string;
    }>();
  });
});
