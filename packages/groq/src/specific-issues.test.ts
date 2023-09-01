import { describe, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { WritableDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse, _ScopeFromPartialContext } from ".";

describe("specific issues", () => {
  it("#242", async () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/242
    const query = '*[_type == "foo" && slug.current == $slug]{ title, slug }';
    const tree = parse(query);
    const result = await (
      await evaluate(tree, {
        dataset: [
          {
            _type: "bar",
            slug: { _type: "slug", current: "bar" },
            title: "nottitle",
          },
          {
            _type: "foo",
            slug: { _type: "slug", current: "foo" },
            title: "title",
          },
        ],
        params: { slug: "foo" },
      })
    ).get();

    const desiredTree = {
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

    expect(tree).toStrictEqual(desiredTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof desiredTree>
    >();

    expect(result).toStrictEqual([
      { slug: { _type: "slug", current: "foo" }, title: "title" },
    ]);
    expectType<
      ExecuteQuery<
        typeof query,
        _ScopeFromPartialContext<{
          dataset: (
            | {
                _type: "bar";
                slug: { _type: "slug"; current: "bar" };
                title: "nottitle";
              }
            | {
                _type: "foo";
                slug: { _type: "slug"; current: "foo" };
                title: "title";
              }
          )[];
          params: { slug: "foo" };
        }>
      >
    >().toStrictEqual<
      { slug: { _type: "slug"; current: "foo" }; title: "title" }[]
    >();
  });
});
