import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";
import type { ScopeFromPartialContext } from "./internal";

describe("sanity", () => {
  it("sanity::projectId()", async () => {
    const query = "sanity::projectId()";

    const tree = parse(query);

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "projectId",
      namespace: "sanity",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const client = { dataset: "dataset", projectId: "projectId" } as const;

    const result = await (await evaluate(tree, { sanity: client })).get();

    const expectedResult = "projectId";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          client: WritableDeep<typeof client>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });

  it("sanity::dataset()", async () => {
    const query = "sanity::dataset()";

    const tree = parse(query);

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "dataset",
      namespace: "sanity",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const client = { dataset: "dataset", projectId: "projectId" } as const;

    const result = await (await evaluate(tree, { sanity: client })).get();

    const expectedResult = "dataset";

    expect(result).toStrictEqual(expectedResult);
    expectType<
      ExecuteQuery<
        typeof query,
        ScopeFromPartialContext<{
          client: WritableDeep<typeof client>;
        }>
      >
    >().toStrictEqual<WritableDeep<typeof expectedResult>>();
  });
});
