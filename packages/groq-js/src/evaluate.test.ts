import { describe, expect, it } from "@jest/globals";
import { evaluate as evaluateNative, parse as parseNative } from "groq-js";

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

    expect(result).toStrictEqual(FOO);
    expectType<typeof result>().toStrictEqual<symbol>();
  });

  it("uses `dataset` as `*`", async () => {
    const query = "*";
    const tree = parse(query);
    const dataset = [FOO];
    const result = await (await evaluate(tree, { dataset })).get();

    expect(result).toStrictEqual([FOO]);
    expectType<typeof result>().toStrictEqual<symbol[]>();
  });

  it("uses `params` as parameters", async () => {
    const query = "$param";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, { params: { param: FOO } })
    ).get();

    expect(result).toStrictEqual(FOO);
    expectType<typeof result>().toStrictEqual<symbol>();
  });

  it.todo("uses `identity` as `identity()`");

  it("uses `before` as `before()`", async () => {
    const query = "before()";
    const tree = parse(query, { mode: "delta" });
    const result = await (await evaluate(tree, { before: FOO })).get();

    expect(result).toStrictEqual(FOO);
    expectType<typeof result>().toStrictEqual<symbol>();
  });

  it("uses `after` as `after()`", async () => {
    const query = "after()";
    const tree = parse(query, { mode: "delta" });
    const result = await (await evaluate(tree, { after: FOO })).get();

    expect(result).toStrictEqual(FOO);
    expectType<typeof result>().toStrictEqual<symbol>();
  });

  it.failing("`operation()` should be never", async () => {
    const query = "operation()";
    // TODO https://github.com/sanity-io/groq-js/issues/140
    const tree = parse(query, { mode: "delta" });
    const result = await (await evaluate(tree)).get();

    expect(result).toBeNull();
    expectType<typeof result>().toBeNever();
  });

  it.failing("`operation()` should be `delete` when `before`", async () => {
    const query = "operation()";
    // TODO https://github.com/sanity-io/groq-js/issues/140
    const tree = parse(query, { mode: "delta" });
    const result = await (await evaluate(tree, { before: FOO })).get();

    expect(result).toBe("delete");
    expectType<typeof result>().toStrictEqual<"delete">();
  });

  it.failing("`operation()` should be `create` when `after`", async () => {
    const query = "operation()";
    // TODO https://github.com/sanity-io/groq-js/issues/140
    const tree = parse(query, { mode: "delta" });
    const result = await (await evaluate(tree, { after: FOO })).get();

    expect(result).toBe("create");
    expectType<typeof result>().toStrictEqual<"create">();
  });

  it.failing(
    "`operation()` should be `update` when both `before` and `after`",
    async () => {
      const query = "operation()";
      // TODO https://github.com/sanity-io/groq-js/issues/140
      const tree = parse(query, { mode: "delta" });
      const result = await (
        await evaluate(tree, { before: FOO, after: FOO })
      ).get();

      expect(result).toBe("update");
      expectType<typeof result>().toStrictEqual<"update">();
    }
  );

  it("uses `sanity.projectId` as `sanity::projectId()`", async () => {
    const query = "sanity::projectId()";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, {
        sanity: { dataset: "dataset", projectId: "projectId" },
      })
    ).get();

    expect(result).toBe("projectId");
    expectType<typeof result>().toStrictEqual<"projectId">();
  });

  it("uses `sanity.dataset` as `sanity::dataset()`", async () => {
    const query = "sanity::dataset()";
    const tree = parse(query);
    const result = await (
      await evaluate(tree, {
        sanity: { dataset: "dataset", projectId: "projectId" },
      })
    ).get();

    expect(result).toBe("dataset");
    expectType<typeof result>().toStrictEqual<"dataset">();
  });

  it.failing("groq-js readme example", async () => {
    const query = '*[_type == "user"]{name}';
    const tree = parse(query);
    const dataset = [
      { _type: "user", name: "Michael" },
      { _type: "company", name: "Bluth Company" },
    ] as const;
    const result = await (await evaluate(tree, { dataset })).get();

    // TODO
    expect(result).toStrictEqual({ name: null });
    expectType<typeof result>().toStrictEqual<{ name: null }>();
  });
});
