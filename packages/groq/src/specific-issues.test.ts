import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { WritableDeep } from "type-fest";

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

  it("#639", async () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/639
    const query = `*[]{
      "0": f->{other->},
    }`;

    const tree = parse(query);

    const expectedTree = {
      base: { base: { type: "Everything" }, type: "ArrayCoerce" },
      expr: {
        base: { type: "This" },
        expr: {
          attributes: [
            {
              name: "0",
              type: "ObjectAttributeValue",
              value: {
                base: {
                  base: { name: "f", type: "AccessAttribute" },
                  type: "Deref",
                },
                expr: {
                  attributes: [
                    {
                      name: "other",
                      type: "ObjectAttributeValue",
                      value: {
                        base: { name: "other", type: "AccessAttribute" },
                        type: "Deref",
                      },
                    },
                  ],
                  type: "Object",
                },
                type: "Projection",
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

    const dataset = [
      {
        _type: "foo",
        f: {
          _type: "reference",
          _ref: "f",
          // If your types came from InferSchemaValues, it would have this symbol. For now, the -> is resolving to a union of ALL the dataset types, which is not great. Luckily, the query ends up narrowing us down to what happens to be correct.
          // [referenced]: "f",
        },
      },
      {
        _id: "f",
        _type: "f",
        other: {
          _type: "reference",
          _ref: "other",
          // If your types came from InferSchemaValues, it would have this symbol. For now, the -> is resolving to a union of ALL the dataset types, which is not great. Luckily, the query ends up narrowing us down to what happens to be correct.
          // [referenced]: "other",
        },
      },
      { _id: "other", _type: "other" },
    ] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [
      { 0: { other: { _id: "other", _type: "other" } } },
      // Without any filter in the query, it'll try the same projection on the docs of type "f" and "other", which won't work
      // For demonstration purposes, it's fine. In practice, running a query with no filter is probably bad
      { 0: { other: null } },
      { 0: { other: null } },
    ] as const;

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
