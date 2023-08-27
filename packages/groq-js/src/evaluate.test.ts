import { describe, expect, it } from "@jest/globals";
import { evaluate as evaluateNative, parse as parseNative } from "groq-js";

import type { ExecuteQuery } from "@sanity-typed/groq";
import { expectType } from "@sanity-typed/test-utils";

import { evaluate, parse } from ".";

const FOO: unique symbol = Symbol("foo");

describe("evaluate", () => {
  it("returns same value as groq-js", () => {
    const query = "5";
    const node = parse(query);
    const value = evaluate(node);

    expect(value).toStrictEqual(evaluateNative(parseNative(query)));
  });

  it("returns same type as @sanity-typed/groq", async () => {
    const query = "5";
    const node = parse(query);
    const value = await (await evaluate(node)).get();

    expectType<typeof value>().toStrictEqual<ExecuteQuery<typeof query>>();
  });

  it("uses `root` as `@`", async () => {
    const query = "@";
    const node = parse(query);
    const value = await (await evaluate(node, { root: FOO })).get();

    expect(value).toStrictEqual(FOO);
    expectType<typeof value>().toStrictEqual<symbol>();
  });

  it("uses `dataset` as `*`", async () => {
    const query = "*";
    const node = parse(query);
    const value = await (await evaluate(node, { dataset: [FOO] })).get();

    expect(value).toStrictEqual([FOO]);
    expectType<typeof value>().toStrictEqual<symbol[]>();
  });

  it("uses `params` as parameters", async () => {
    const query = "$param";
    const node = parse(query);
    const value = await (
      await evaluate(node, { params: { param: FOO } })
    ).get();

    expect(value).toStrictEqual(FOO);
    expectType<typeof value>().toStrictEqual<symbol>();
  });

  it.todo("uses `identity` as `identity()`");

  it("uses `before` as `before()`", async () => {
    const query = "before()";
    const node = parse(query, { mode: "delta" });
    const value = await (await evaluate(node, { before: FOO })).get();

    expect(value).toStrictEqual(FOO);
    expectType<typeof value>().toStrictEqual<symbol>();
  });

  it("uses `after` as `after()`", async () => {
    const query = "after()";
    const node = parse(query, { mode: "delta" });
    const value = await (await evaluate(node, { after: FOO })).get();

    expect(value).toStrictEqual(FOO);
    expectType<typeof value>().toStrictEqual<symbol>();
  });

  it.failing("`operation()` should be never", async () => {
    // FIXME Is operation() under delta or global? https://github.com/sanity-io/groq-js/issues/140
    const query = "operation()";
    const node = parse(query, { mode: "delta" });
    const value = await (await evaluate(node)).get();

    expect(value).toBeNull();
    expectType<typeof value>().toBeNever();
  });

  it.failing("`operation()` should be `delete` when `before`", async () => {
    // FIXME Is operation() under delta or global? https://github.com/sanity-io/groq-js/issues/140
    const query = "operation()";
    const node = parse(query, { mode: "delta" });
    const value = await (await evaluate(node, { before: FOO })).get();

    expect(value).toBe("delete");
    expectType<typeof value>().toStrictEqual<"delete">();
  });

  it.failing("`operation()` should be `create` when `after`", async () => {
    // FIXME Is operation() under delta or global? https://github.com/sanity-io/groq-js/issues/140
    const query = "operation()";
    const node = parse(query, { mode: "delta" });
    const value = await (await evaluate(node, { after: FOO })).get();

    expect(value).toBe("create");
    expectType<typeof value>().toStrictEqual<"create">();
  });

  it.failing(
    "`operation()` should be `update` when both `before` and `after`",
    async () => {
      // FIXME Is operation() under delta or global? https://github.com/sanity-io/groq-js/issues/140
      const query = "operation()";
      const node = parse(query);
      const value = await (
        await evaluate(node, { before: FOO, after: FOO })
      ).get();

      expect(value).toBe("update");
      expectType<typeof value>().toStrictEqual<"update">();
    }
  );

  it("uses `sanity.projectId` as `sanity::projectId()`", async () => {
    const query = "sanity::projectId()";
    const node = parse(query);
    const value = await (
      await evaluate(node, {
        sanity: { dataset: "dataset", projectId: "projectId" },
      })
    ).get();

    expect(value).toBe("projectId");
    expectType<typeof value>().toStrictEqual<"projectId">();
  });

  it("uses `sanity.dataset` as `sanity::dataset()`", async () => {
    const query = "sanity::dataset()";
    const node = parse(query);
    const value = await (
      await evaluate(node, {
        sanity: { dataset: "dataset", projectId: "projectId" },
      })
    ).get();

    expect(value).toBe("dataset");
    expectType<typeof value>().toStrictEqual<"dataset">();
  });
});
