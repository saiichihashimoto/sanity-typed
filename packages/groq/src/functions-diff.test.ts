import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";

describe("diff", () => {
  it("diff::changedAny(foo,bar,title)", async () => {
    const query = "diff::changedAny(foo,bar,title)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedAny",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/194
      WritableDeep<typeof expectedTree>
    >();

    await expect(async () => evaluate(tree)).rejects.toThrow("not implemented");
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });

  it("diff::changedAny(foo,bar,(title,description))", async () => {
    const query = "diff::changedAny(foo,bar,(title,description))";

    expect(() => parse(query)).toThrow("Invalid selector syntax");
    expectType<Parse<typeof query>>().toStrictEqual<never>();

    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });

  it("diff::changedOnly(foo,bar,title)", async () => {
    const query = "diff::changedOnly(foo,bar,title)";

    const tree = parse(query);

    const expectedTree = {
      args: [
        { name: "foo", type: "AccessAttribute" },
        { name: "bar", type: "AccessAttribute" },
        { type: "Selector" },
      ],
      func: (() => {}) as unknown as GroqFunction,
      name: "changedOnly",
      namespace: "diff",
      type: "FuncCall",
    } as const;

    expect(tree).toStrictEqual({
      ...expectedTree,
      func: expect.any(Function),
    });
    expectType<Parse<typeof query>>().toStrictEqual<
      // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/194
      WritableDeep<typeof expectedTree>
    >();

    await expect(async () => evaluate(tree)).rejects.toThrow("not implemented");
    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });

  it("diff::changedOnly(foo,bar,(title,description))", async () => {
    const query = "diff::changedOnly(foo,bar,(title,description))";

    expect(() => parse(query)).toThrow("Invalid selector syntax");
    expectType<Parse<typeof query>>().toStrictEqual<never>();

    expectType<ExecuteQuery<typeof query>>().toStrictEqual<never>();
  });
});
