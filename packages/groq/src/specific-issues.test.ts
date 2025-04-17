import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { WritableDeep } from "type-fest";

import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import type { ExecuteQuery, Parse } from ".";
import type { ScopeFromPartialContext } from "./internal";

describe("specific issues", () => {
  it("#242", async () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/242
    const query = '*[_type == "foo" && slug.current == $slug]{ title, slug }';

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: { type: "Everything" },
        expr: {
          left: {
            left: { name: "_type", type: "AccessAttribute" },
            op: "==",
            right: { type: "Value", value: "foo" },
            type: "OpCall",
          },
          right: {
            left: {
              base: { name: "slug", type: "AccessAttribute" },
              name: "current",
              type: "AccessAttribute",
            },
            op: "==",
            right: { name: "slug", type: "Parameter" },
            type: "OpCall",
          },
          type: "And",
        },
        type: "Filter",
      },
      expr: {
        base: { type: "This" },
        expr: {
          attributes: [
            {
              name: "title",
              type: "ObjectAttributeValue",
              value: { name: "title", type: "AccessAttribute" },
            },
            {
              name: "slug",
              type: "ObjectAttributeValue",
              value: { name: "slug", type: "AccessAttribute" },
            },
          ],
          type: "Object",
        },
        type: "Projection",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const dataset = [
      {
        _type: "bar",
        slug: { _type: "slug", current: "bar" },
        title: "notTitle",
      },
      {
        _type: "foo",
        slug: { _type: "slug", current: "foo" },
        title: "title",
      },
    ] as const;
    const params = { slug: "foo" } as const;

    const result = await (await evaluate(tree, { dataset, params })).get();

    const expectedResult = [
      { slug: { _type: "slug", current: "foo" }, title: "title" },
    ] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
          params: WritableDeep<typeof params>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("#641 FIXME", async () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/641
    const query = `
    *[_type == "foo" && type == "links"]{
        _id,
        title,
        links[]{
            _key,
            title,
            url,
            target
        }
    }
`;

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: { type: "Everything" },
        expr: {
          left: {
            left: { name: "_type", type: "AccessAttribute" },
            op: "==",
            right: { type: "Value", value: "foo" },
            type: "OpCall",
          },
          right: {
            left: { name: "type", type: "AccessAttribute" },
            op: "==",
            right: { type: "Value", value: "links" },
            type: "OpCall",
          },
          type: "And",
        },
        type: "Filter",
      },
      expr: {
        base: { type: "This" },
        expr: {
          attributes: [
            {
              name: "_id",
              type: "ObjectAttributeValue",
              value: { name: "_id", type: "AccessAttribute" },
            },
            {
              name: "title",
              type: "ObjectAttributeValue",
              value: { name: "title", type: "AccessAttribute" },
            },
            {
              name: "links",
              type: "ObjectAttributeValue",
              value: {
                base: {
                  base: { name: "links", type: "AccessAttribute" },
                  type: "ArrayCoerce",
                },
                expr: {
                  base: { type: "This" },
                  expr: {
                    attributes: [
                      {
                        name: "_key",
                        type: "ObjectAttributeValue",
                        value: { name: "_key", type: "AccessAttribute" },
                      },
                      {
                        name: "title",
                        type: "ObjectAttributeValue",
                        value: { name: "title", type: "AccessAttribute" },
                      },
                      {
                        name: "url",
                        type: "ObjectAttributeValue",
                        value: { name: "url", type: "AccessAttribute" },
                      },
                      {
                        name: "target",
                        type: "ObjectAttributeValue",
                        value: { name: "target", type: "AccessAttribute" },
                      },
                    ],
                    type: "Object",
                  },
                  type: "Projection",
                },
                type: "Map",
              },
            },
          ],
          type: "Object",
        },
        type: "Projection",
      },
      type: "Map",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

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
                name: "type",
                type: "string",
                options: {
                  list: [
                    { title: "About", value: "about" },
                    { title: "Social", value: "social" },
                    { title: "Links", value: "links" },
                  ],
                },
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "title",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "links",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "object",
                    fields: [
                      defineField({
                        name: "title",
                        type: "string",
                      }),
                      defineField({
                        name: "url",
                        type: "string",
                      }),
                      defineField({
                        name: "target",
                        type: "string",
                        options: {
                          list: [
                            { title: "Self", value: "_self" },
                            { title: "Blank", value: "_blank" },
                          ],
                        },
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

    const dataset: InferSchemaValues<typeof config>["foo"][] = [];

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [] as {
      _id: string;
      links:
        | {
            _key: string;
            target: "_blank" | "_self" | null;
            title: string | null;
            url: string | null;
          }[]
        | null;
      title: string;
    }[];

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          dataset: WritableDeep<typeof dataset>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });
});
