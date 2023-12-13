import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, PortableTextBlock } from "@sanity-typed/types";

import { sanityConfigToZodsTyped } from "./internal";

const fields: Omit<PortableTextBlock, "_type" | "children"> = {
  level: 1,
  listItem: "bullet",
  markDefs: [],
  style: "normal",
};

describe("specific issues", () => {
  it("#559: zod parser strings untyped block markDefs", () => {
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
    const zods = sanityConfigToZodsTyped(config);

    const unparsed = {
      ...fields,
      _type: "foo",
      children: [
        { _key: "key", _type: "span", marks: ["mark-key"], text: "text" },
      ],
      markDefs: [
        {
          _key: "mark-key",
          _type: "internalLink",
          internalLink: {
            _ref: "052a9ccc-ba1f-4e8e-adb4-4be196815746",
            _type: "reference",
          },
          slug: {
            _type: "slug",
            current: "foo-bar-test",
          },
          postType: "post",
        },
      ],
    };

    const parsed = zods.foo.parse(unparsed);
    expect(parsed).toStrictEqual(unparsed);
    expectType<typeof parsed>().toEqual<
      InferSchemaValues<typeof config>["foo"]
    >();
  });
});
