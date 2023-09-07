import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { WritableDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";

describe("compound expressions", () => {
  it("(10)", async () => {
    const query = "(10)";

    const tree = parse(query);

    const expectedTree = {
      base: { type: "Value", value: 10 },
      type: "Group",
    } as const;

    expect(tree).toStrictEqual(expectedTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof expectedTree>
    >();

    const result = await (await evaluate(tree)).get();

    const expectedResult = 10;

    expect(result).toStrictEqual(expectedResult);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<
      typeof expectedResult
    >();
  });
});
