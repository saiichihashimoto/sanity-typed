import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import { DateTime, evaluate, parse } from "groq-js";
import type { GroqFunction } from "groq-js";
import type { WritableDeep } from "type-fest";

import type { ExecuteQuery, Parse } from ".";
import type { ScopeFromPartialContext } from "./internal";

describe("operators", () => {
  describe("&&", () => {
    it("true&&true", async () => {
      const query = "true&&true";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: true },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("false&&true", async () => {
      const query = "false&&true";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: true },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("true&&false", async () => {
      const query = "true&&false";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: false },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("false&&false", async () => {
      const query = "false&&false";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: false },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('""&&false', async () => {
      const query = '""&&false';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: false },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('false&&""', async () => {
      const query = 'false&&""';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: "" },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('""&&true', async () => {
      const query = '""&&true';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: true },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('true&&""', async () => {
      const query = 'true&&""';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: "" },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('""&&""', async () => {
      const query = '""&&""';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: "" },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("||", () => {
    it("false||false", async () => {
      const query = "false||false";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: false },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("false||true", async () => {
      const query = "false||true";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: true },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("true||false", async () => {
      const query = "true||false";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: false },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("true||true", async () => {
      const query = "true||true";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: true },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('""||true', async () => {
      const query = '""||true';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: true },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('true||""', async () => {
      const query = 'true||""';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: "" },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('""||false', async () => {
      const query = '""||false';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: false },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('false||""', async () => {
      const query = 'false||""';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: "" },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('""||""', async () => {
      const query = '""||""';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: "" },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("!", () => {
    it("!true", async () => {
      const query = "!true";

      const tree = parse(query);

      const expectedTree = {
        base: { type: "Value", value: true },
        type: "Not",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("!false", async () => {
      const query = "!false";

      const tree = parse(query);

      const expectedTree = {
        base: { type: "Value", value: false },
        type: "Not",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('!"string"', async () => {
      const query = '!"string"';

      const tree = parse(query);

      const expectedTree = {
        base: { type: "Value", value: "string" },
        type: "Not",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("==", () => {
    it("4==5", async () => {
      const query = "4==5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: "==",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("5==5", async () => {
      const query = "5==5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 5 },
        op: "==",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("!=", () => {
    it("4!=5", async () => {
      const query = "4!=5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: "!=",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("5!=5", async () => {
      const query = "5!=5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 5 },
        op: "!=",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("<", () => {
    it("4<5", async () => {
      const query = "4<5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: "<",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("<=", () => {
    it("4<=5", async () => {
      const query = "4<=5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: "<=",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe(">", () => {
    it("4>5", async () => {
      const query = "4>5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: ">",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe(">=", () => {
    it("4>=5", async () => {
      const query = "4>=5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: ">=",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("in", () => {
    it('"string" in ["string","another string"]', async () => {
      const query = '"string" in ["string","another string"]';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "string" },
        op: "in",
        right: {
          elements: [
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: "string" },
            },
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: "another string" },
            },
          ],
          type: "Array",
        },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedResult>
      >();
    });

    it('"not string" in ["string","another string"]', async () => {
      const query = '"not string" in ["string","another string"]';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "not string" },
        op: "in",
        right: {
          elements: [
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: "string" },
            },
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: "another string" },
            },
          ],
          type: "Array",
        },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedResult>
      >();
    });

    it("0 in 0...1", async () => {
      const query = "0 in 0...1";

      const tree = parse(query);

      const expectedTree = {
        base: { type: "Value", value: 0 },
        isInclusive: false,
        left: { type: "Value", value: 0 },
        right: { type: "Value", value: 1 },
        type: "InRange",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedResult>
      >();
    });

    it("5 in 0...1", async () => {
      const query = "5 in 0...1";

      const tree = parse(query);

      const expectedTree = {
        base: { type: "Value", value: 5 },
        isInclusive: false,
        left: { type: "Value", value: 0 },
        right: { type: "Value", value: 1 },
        type: "InRange",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedResult>
      >();
    });

    it('"string" in 0...1', async () => {
      const query = '"string" in 0...1';

      const tree = parse(query);

      const expectedTree = {
        base: { type: "Value", value: "string" },
        isInclusive: false,
        left: { type: "Value", value: 0 },
        right: { type: "Value", value: 1 },
        type: "InRange",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedResult>
      >();
    });

    it('"a.b" in path("a.*")', async () => {
      const query = '"a.b" in path("a.*")';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "a.b" },
        op: "in",
        right: {
          args: [
            {
              type: "Value",
              value: "a.*",
            },
          ],
          func: (() => {}) as unknown as GroqFunction,
          name: "path",
          namespace: "global",
          type: "FuncCall",
        },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        right: {
          ...expectedTree.right,
          func: expect.any(Function),
        },
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = true as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedResult>
      >();
    });

    it('"a.b" in path("b.*")', async () => {
      const query = '"a.b" in path("b.*")';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "a.b" },
        op: "in",
        right: {
          args: [
            {
              type: "Value",
              value: "b.*",
            },
          ],
          func: (() => {}) as unknown as GroqFunction,
          name: "path",
          namespace: "global",
          type: "FuncCall",
        },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        right: {
          ...expectedTree.right,
          func: expect.any(Function),
        },
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = false as boolean;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedResult>
      >();
    });

    it('5 in path("a.*")', async () => {
      const query = '5 in path("a.*")';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 5 },
        op: "in",
        right: {
          args: [{ type: "Value", value: "a.*" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "path",
          namespace: "global",
          type: "FuncCall",
        },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        right: {
          ...expectedTree.right,
          func: expect.any(Function),
        },
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        // @ts-expect-error -- TODO https://github.com/saiichihashimoto/sanity-typed/issues/214
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("+ (prefix)", () => {
    it("+5", async () => {
      const query = "+5";

      const tree = parse(query);

      const expectedTree = {
        base: { type: "Value", value: 5 },
        type: "Pos",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 5 as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("+$param (5)", async () => {
      const query = "+$param";

      const tree = parse(query);

      const expectedTree = {
        base: { name: "param", type: "Parameter" },
        type: "Pos",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: 5 } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = 5;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<typeof expectedResult>();
    });

    it("+$param (-5)", async () => {
      const query = "+$param";

      const tree = parse(query);

      const expectedTree = {
        base: { name: "param", type: "Parameter" },
        type: "Pos",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: -5 } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = -5;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<typeof expectedResult>();
    });

    it("+$param (string)", async () => {
      const query = "+$param";

      const tree = parse(query);

      const expectedTree = {
        base: { name: "param", type: "Parameter" },
        type: "Pos",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: "foo" } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<typeof expectedResult>();
    });
  });

  describe("- (prefix)", () => {
    it("-5", async () => {
      const query = "-5";

      const tree = parse(query);

      const expectedTree = {
        base: { type: "Value", value: 5 },
        type: "Neg",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = -5 as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("-$param (5)", async () => {
      const query = "-$param";

      const tree = parse(query);

      const expectedTree = {
        base: { name: "param", type: "Parameter" },
        type: "Neg",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: 5 } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = -5;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<typeof expectedResult>();
    });

    it("-$param (-5)", async () => {
      const query = "-$param";

      const tree = parse(query);

      const expectedTree = {
        base: { name: "param", type: "Parameter" },
        type: "Neg",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: -5 } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = 5;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<typeof expectedResult>();
    });

    it("-$param (string)", async () => {
      const query = "-$param";

      const tree = parse(query);

      const expectedTree = {
        base: { name: "param", type: "Parameter" },
        type: "Neg",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const params = { param: "foo" } as const;

      const result = await (await evaluate(tree, { params })).get();

      const expectedResult = null;

      expect(result).toStrictEqual(expectedResult);
      expectType<
        ExecuteQuery<
          typeof query,
          ScopeFromPartialContext<{
            parameters: WritableDeep<typeof params>;
          }>
        >
      >().toStrictEqual<typeof expectedResult>();
    });
  });

  describe("+", () => {
    it('"foo"+"bar"', async () => {
      const query = '"foo"+"bar"';

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: "foo" },
        op: "+",
        right: { type: "Value", value: "bar" },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = "foobar" as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("4+5", async () => {
      const query = "4+5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: "+",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 9 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it("[1,2]+[3,4]", async () => {
      const query = "[1,2]+[3,4]";

      const tree = parse(query);

      const expectedTree = {
        left: {
          elements: [
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: 1 },
            },
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: 2 },
            },
          ],
          type: "Array",
        },
        op: "+",
        right: {
          elements: [
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: 3 },
            },
            {
              isSplat: false,
              type: "ArrayElement",
              value: { type: "Value", value: 4 },
            },
          ],
          type: "Array",
        },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = [1, 2, 3, 4] as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('{"foo":"bar"}+{"baz":"qux"}', async () => {
      const query = '{"foo":"bar"}+{"baz":"qux"}';

      const tree = parse(query);

      const expectedTree = {
        left: {
          attributes: [
            {
              name: "foo",
              type: "ObjectAttributeValue",
              value: { type: "Value", value: "bar" },
            },
          ],
          type: "Object",
        },
        op: "+",
        right: {
          attributes: [
            {
              name: "baz",
              type: "ObjectAttributeValue",
              value: { type: "Value", value: "qux" },
            },
          ],
          type: "Object",
        },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = { baz: "qux", foo: "bar" } as const;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('dateTime("2023-09-06T09:39:45.496Z")+5', async () => {
      const query = 'dateTime("2023-09-06T09:39:45.496Z")+5';

      const tree = parse(query);

      const expectedTree = {
        left: {
          args: [{ type: "Value", value: "2023-09-06T09:39:45.496Z" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "dateTime",
          namespace: "global",
          type: "FuncCall",
        },
        op: "+",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        left: {
          ...expectedTree.left,
          func: expect.any(Function),
        },
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = new DateTime(new Date("2023-09-06T09:39:50.496Z"));

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("-", () => {
    it("4-5", async () => {
      const query = "4-5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: "-",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = -1 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('dateTime("2023-09-06T09:39:45.496Z")-dateTime("2023-09-06T09:39:45.496Z")', async () => {
      const query =
        'dateTime("2023-09-06T09:39:45.496Z")-dateTime("2023-09-06T09:39:45.496Z")';

      const tree = parse(query);

      const expectedTree = {
        left: {
          args: [{ type: "Value", value: "2023-09-06T09:39:45.496Z" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "dateTime",
          namespace: "global",
          type: "FuncCall",
        },
        op: "-",
        right: {
          args: [{ type: "Value", value: "2023-09-06T09:39:45.496Z" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "dateTime",
          namespace: "global",
          type: "FuncCall",
        },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        left: {
          ...expectedTree.left,
          func: expect.any(Function),
        },
        right: {
          ...expectedTree.right,
          func: expect.any(Function),
        },
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 0 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });

    it('dateTime("2023-09-06T09:39:45.496Z")-5', async () => {
      const query = 'dateTime("2023-09-06T09:39:45.496Z")-5';

      const tree = parse(query);

      const expectedTree = {
        left: {
          args: [{ type: "Value", value: "2023-09-06T09:39:45.496Z" }],
          func: (() => {}) as unknown as GroqFunction,
          name: "dateTime",
          namespace: "global",
          type: "FuncCall",
        },
        op: "-",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual({
        ...expectedTree,
        left: {
          ...expectedTree.left,
          func: expect.any(Function),
        },
      });
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = new DateTime(new Date("2023-09-06T09:39:40.496Z"));

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("*", () => {
    it("4*5", async () => {
      const query = "4*5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: "*",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 20 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("/", () => {
    it("4/5", async () => {
      const query = "4/5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: "/",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 0.8 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("%", () => {
    it("4%5", async () => {
      const query = "4%5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: "%",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 4 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });

  describe("**", () => {
    it("4**5", async () => {
      const query = "4**5";

      const tree = parse(query);

      const expectedTree = {
        left: { type: "Value", value: 4 },
        op: "**",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(expectedTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedTree>
      >();

      const result = await (await evaluate(tree)).get();

      const expectedResult = 1024 as number;

      expect(result).toStrictEqual(expectedResult);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<
        WritableDeep<typeof expectedResult>
      >();
    });
  });
});
