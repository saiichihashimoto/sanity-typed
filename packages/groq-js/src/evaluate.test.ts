import { describe, expect, it } from "@jest/globals";
import { evaluate as evaluateNative, parse as parseNative } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery } from "@sanity-typed/groq";
import { expectType } from "@sanity-typed/test-utils";

import { evaluate, parse } from ".";

const FOO: unique symbol = Symbol("foo");

describe("evaluate", () => {
  it("returns same value as groq-js", () => {
    const query = "5";
    const tree = parse(query);
    const result = evaluate(tree);

    expect(result).toStrictEqual(evaluateNative(parseNative(query)));
  });

  it("returns same type as @sanity-typed/groq", async () => {
    const query = "5";
    const tree = parse(query);
    const result = await (await evaluate(tree)).get();

    expectType<typeof result>().toStrictEqual<ExecuteQuery<typeof query>>();
  });

  it("uses `root` as `@`", async () => {
    const query = "@";
    const tree = parse(query);
    const result = await (await evaluate(tree, { root: FOO })).get();

    const expectedResult = FOO;

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("uses `dataset` as `*`", async () => {
    const query = "*";
    const tree = parse(query);
    const result = await (await evaluate(tree, { dataset: [FOO] })).get();

    const expectedResult = [FOO] as const;

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("uses `params` as parameters", async () => {
    const query = "$param";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { params: { param: FOO } })
    ).get();

    const expectedResult = FOO;

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("uses `identity` as `identity()`", async () => {
    const query = "identity()";
    const tree = parse(query);
    const result = await (await evaluate(tree, { identity: "foo" })).get();

    const expectedResult = "foo";

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("uses `before` as `before()`", async () => {
    const query = "before()";
    const tree = parse(query, { mode: "delta" });
    const result = await (await evaluate(tree, { before: FOO })).get();

    const expectedResult = FOO;

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("uses `after` as `after()`", async () => {
    const query = "after()";
    const tree = parse(query, { mode: "delta" });
    const result = await (await evaluate(tree, { after: FOO })).get();

    const expectedResult = FOO;

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("`delta::operation()` should be null", async () => {
    const query = "delta::operation()";
    const tree = parse(query, { mode: "delta" });
    const result = await (await evaluate(tree)).get();

    const expectedResult = null;

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("`delta::operation()` should be `delete` when `before`", async () => {
    const query = "delta::operation()";
    const tree = parse(query, { mode: "delta" });
    const result = await (await evaluate(tree, { before: FOO })).get();

    const expectedResult = "delete";

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("`delta::operation()` should be `create` when `after`", async () => {
    const query = "delta::operation()";
    const tree = parse(query, { mode: "delta" });
    const result = await (await evaluate(tree, { after: FOO })).get();

    const expectedResult = "create";

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("`delta::operation()` should be `update` when both `before` and `after`", async () => {
    const query = "delta::operation()";
    const tree = parse(query, { mode: "delta" });
    const result = await (
      await evaluate(tree, { before: FOO, after: FOO })
    ).get();

    const expectedResult = "update";

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("uses `sanity.projectId` as `sanity::projectId()`", async () => {
    const query = "sanity::projectId()";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, {
        sanity: { dataset: "dataset", projectId: "projectId" },
      })
    ).get();

    const expectedResult = "projectId";

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });

  it("uses `sanity.dataset` as `sanity::dataset()`", async () => {
    const query = "sanity::dataset()";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, {
        sanity: { dataset: "dataset", projectId: "projectId" },
      })
    ).get();

    const expectedResult = "dataset";

    expect(result).toStrictEqual(expectedResult);
    expectType<typeof result>().toStrictEqual<
      WritableDeep<typeof expectedResult>
    >();
  });
});
