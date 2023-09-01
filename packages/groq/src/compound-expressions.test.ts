import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { WritableDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";

describe("compound expressions", () => {
  it("(10)", async () => {
    const query = "(10)";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    const desiredTree = {
      base: { type: "Value", value: 10 },
      type: "Group",
    } as const;

    expect(tree).toStrictEqual(desiredTree);
    expectType<Parse<typeof query>>().toStrictEqual<
      WritableDeep<typeof desiredTree>
    >();

    expect(result).toBe(10);
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<10>();
  });
});
