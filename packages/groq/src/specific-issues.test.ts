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

  it("#638 seven projections", async () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/638
    const query = `*[_id=="id"]{
      "1": obj7.a,
      "2": obj7.b,
      "3": obj7.c,
      "4": obj7.d,
      "5": obj7.e,
      "6": obj7.f,
      "7": obj7.g,
    }`;

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: { type: "Everything" },
        expr: {
          left: { name: "_id", type: "AccessAttribute" },
          op: "==",
          right: { type: "Value", value: "id" },
          type: "OpCall",
        },
        type: "Filter",
      },
      expr: {
        base: { type: "This" },
        expr: {
          attributes: [
            {
              name: "1",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj7", type: "AccessAttribute" },
                name: "a",
                type: "AccessAttribute",
              },
            },
            {
              name: "2",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj7", type: "AccessAttribute" },
                name: "b",
                type: "AccessAttribute",
              },
            },
            {
              name: "3",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj7", type: "AccessAttribute" },
                name: "c",
                type: "AccessAttribute",
              },
            },
            {
              name: "4",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj7", type: "AccessAttribute" },
                name: "d",
                type: "AccessAttribute",
              },
            },
            {
              name: "5",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj7", type: "AccessAttribute" },
                name: "e",
                type: "AccessAttribute",
              },
            },
            {
              name: "6",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj7", type: "AccessAttribute" },
                name: "f",
                type: "AccessAttribute",
              },
            },
            {
              name: "7",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj7", type: "AccessAttribute" },
                name: "g",
                type: "AccessAttribute",
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
        _id: "id",
        obj7: {
          a: "a",
          b: "b",
          c: "c",
          d: "d",
          e: "e",
          f: "f",
          g: "g",
        },
      },
    ] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [
      {
        1: "a",
        2: "b",
        3: "c",
        4: "d",
        5: "e",
        6: "f",
        7: "g",
      },
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

  it("#638 eight projections", async () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/638
    const query = `*[_id=="id"]{
      "1": obj8.a,
      "2": obj8.b,
      "3": obj8.c,
      "4": obj8.d,
      "5": obj8.e,
      "6": obj8.f,
      "7": obj8.g,
      "8": obj8.h,
    }`;

    const tree = parse(query);

    const expectedTree = {
      base: {
        base: { type: "Everything" },
        expr: {
          left: { name: "_id", type: "AccessAttribute" },
          op: "==",
          right: { type: "Value", value: "id" },
          type: "OpCall",
        },
        type: "Filter",
      },
      expr: {
        base: { type: "This" },
        expr: {
          attributes: [
            {
              name: "1",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj8", type: "AccessAttribute" },
                name: "a",
                type: "AccessAttribute",
              },
            },
            {
              name: "2",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj8", type: "AccessAttribute" },
                name: "b",
                type: "AccessAttribute",
              },
            },
            {
              name: "3",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj8", type: "AccessAttribute" },
                name: "c",
                type: "AccessAttribute",
              },
            },
            {
              name: "4",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj8", type: "AccessAttribute" },
                name: "d",
                type: "AccessAttribute",
              },
            },
            {
              name: "5",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj8", type: "AccessAttribute" },
                name: "e",
                type: "AccessAttribute",
              },
            },
            {
              name: "6",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj8", type: "AccessAttribute" },
                name: "f",
                type: "AccessAttribute",
              },
            },
            {
              name: "7",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj8", type: "AccessAttribute" },
                name: "g",
                type: "AccessAttribute",
              },
            },
            {
              name: "8",
              type: "ObjectAttributeValue",
              value: {
                base: { name: "obj8", type: "AccessAttribute" },
                name: "h",
                type: "AccessAttribute",
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
        _id: "id",
        obj8: {
          a: "a",
          b: "b",
          c: "c",
          d: "d",
          e: "e",
          f: "f",
          g: "g",
          h: "h",
        },
      },
    ] as const;

    const result = await (await evaluate(tree, { dataset })).get();

    const expectedResult = [
      {
        1: "a",
        2: "b",
        3: "c",
        4: "d",
        5: "e",
        6: "f",
        7: "g",
        8: "h",
      },
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
