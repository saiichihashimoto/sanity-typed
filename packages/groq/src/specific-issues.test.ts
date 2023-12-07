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
});
