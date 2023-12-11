import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { DateTime, evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";

describe("dateTime", () => {
  it("dateTime::now()", async () => {
    const query = "dateTime::now()";

    const tree = parse(query);

    const expectedTree = {
      args: [],
      func: (() => {}) as unknown as GroqFunction,
      name: "now",
      namespace: "dateTime",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const timestamp = new Date(0);

    const result = await (await evaluate(tree, { timestamp })).get();

    const expectedResult = new DateTime(timestamp);

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });
});
