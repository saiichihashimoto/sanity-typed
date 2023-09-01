import { describe, expect, it } from "@jest/globals";
import { evaluate, parse } from "groq-js";
import type { DateTime } from "groq-js";
import type { WritableDeep } from "type-fest";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse, _ScopeFromPartialContext } from ".";

describe("operators", () => {
  describe("&&", () => {
    it("true&&true", async () => {
      const query = "true&&true";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: true },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("false&&true", async () => {
      const query = "false&&true";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: true },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("true&&false", async () => {
      const query = "true&&false";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: false },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("false&&false", async () => {
      const query = "false&&false";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: false },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it('""&&false', async () => {
      const query = '""&&false';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: false },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it('false&&""', async () => {
      const query = 'false&&""';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: "" },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it('""&&true', async () => {
      const query = '""&&true';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: true },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('true&&""', async () => {
      const query = 'true&&""';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: "" },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('""&&""', async () => {
      const query = '""&&""';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: "" },
        type: "And",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });
  });

  describe("||", () => {
    it("false||false", async () => {
      const query = "false||false";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: false },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("false||true", async () => {
      const query = "false||true";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: true },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("true||false", async () => {
      const query = "true||false";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: false },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("true||true", async () => {
      const query = "true||true";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: true },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it('""||true', async () => {
      const query = '""||true';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: true },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it('true||""', async () => {
      const query = 'true||""';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: true },
        right: { type: "Value", value: "" },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it('""||false', async () => {
      const query = '""||false';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: false },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('false||""', async () => {
      const query = 'false||""';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: false },
        right: { type: "Value", value: "" },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('""||""', async () => {
      const query = '""||""';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: "" },
        right: { type: "Value", value: "" },
        type: "Or",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });
  });

  describe("!", () => {
    it("!true", async () => {
      const query = "!true";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        base: { type: "Value", value: true },
        type: "Not",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("!false", async () => {
      const query = "!false";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        base: { type: "Value", value: false },
        type: "Not",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it('!"string"', async () => {
      const query = '!"string"';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        base: { type: "Value", value: "string" },
        type: "Not",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBeNull();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });
  });

  describe("==", () => {
    it("4==5", async () => {
      const query = "4==5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "==",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("5==5", async () => {
      const query = "5==5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 5 },
        op: "==",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });
  });

  describe("!=", () => {
    it("4!=5", async () => {
      const query = "4!=5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "!=",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("5!=5", async () => {
      const query = "5!=5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 5 },
        op: "!=",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });
  });

  describe("<", () => {
    it("4<5", async () => {
      const query = "4<5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "<",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });
  });

  describe("<=", () => {
    it("4<=5", async () => {
      const query = "4<=5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "<=",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(true);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });
  });

  describe(">", () => {
    it("4>5", async () => {
      const query = "4>5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: ">",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });
  });

  describe(">=", () => {
    it("4>=5", async () => {
      const query = "4>=5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: ">=",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(false);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });
  });

  describe("+ (prefix)", () => {
    it("+5", async () => {
      const query = "+5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        base: {
          type: "Value",
          value: 5,
        },
        type: "Pos",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(5);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<5>();
    });

    it("+$param (5)", async () => {
      const query = "+$param";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: 5 } })
      ).get();

      const desiredTree = {
        base: { name: "param", type: "Parameter" },
        type: "Pos",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(5);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: 5 } }>
        >
      >().toStrictEqual<5>();
    });

    it("+$param (-5)", async () => {
      const query = "+$param";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: -5 } })
      ).get();

      expect(result).toBe(-5);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: -5 } }>
        >
      >().toStrictEqual<-5>();
    });

    it("+$param (number)", async () => {
      const query = "+$param";

      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: number } }>
        >
      >().toStrictEqual<number>();
    });

    it("+$param (string)", async () => {
      const query = "+$param";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: "foo" } })
      ).get();

      expect(result).toBeNull();
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: "foo" } }>
        >
      >().toStrictEqual<null>();
    });
  });

  describe("- (prefix)", () => {
    it("-5", async () => {
      const query = "-5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        base: {
          type: "Value",
          value: 5,
        },
        type: "Neg",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(-5);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<-5>();
    });

    it("-$param (5)", async () => {
      const query = "-$param";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: 5 } })
      ).get();

      const desiredTree = {
        base: { name: "param", type: "Parameter" },
        type: "Neg",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(-5);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: 5 } }>
        >
      >().toStrictEqual<-5>();
    });

    it("-$param (-5)", async () => {
      const query = "-$param";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: -5 } })
      ).get();

      expect(result).toBe(5);
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: -5 } }>
        >
      >().toStrictEqual<5>();
    });

    it("-$param (number)", async () => {
      const query = "-$param";

      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: number } }>
        >
      >().toStrictEqual<number>();
    });

    it("-$param (string)", async () => {
      const query = "-$param";
      const tree = parse(query);
      const result = await (
        await evaluate(tree, { params: { param: "foo" } })
      ).get();

      expect(result).toBeNull();
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: "foo" } }>
        >
      >().toStrictEqual<null>();
    });
  });

  describe("+", () => {
    it('"foo"+"bar"', async () => {
      const query = '"foo"+"bar"';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: "foo" },
        op: "+",
        right: { type: "Value", value: "bar" },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe("foobar");
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"foobar">();
    });

    it("4+5", async () => {
      const query = "4+5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "+",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(9);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("[1,2]+[3,4]", async () => {
      const query = "[1,2]+[3,4]";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
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

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual([1, 2, 3, 4]);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<[1, 2, 3, 4]>();
    });

    it('{"foo":"bar"}+{"baz":"qux"}', async () => {
      const query = '{"foo":"bar"}+{"baz":"qux"}';
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
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

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toStrictEqual({
        baz: "qux",
        foo: "bar",
      });
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<{
        baz: "qux";
        foo: "bar";
      }>();
    });

    it("$param+5 (with DateTime)", async () => {
      const query = "$param+5";
      // TODO https://github.com/sanity-io/groq-js/issues/144

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { name: "param"; type: "Parameter" };
        op: "+";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: DateTime } }>
        >
      >().toStrictEqual<DateTime>();
    });
  });

  describe("-", () => {
    it("4-5", async () => {
      const query = "4-5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "-",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(-1);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("$param1-$param2 (with DateTime)", async () => {
      const query = "$param1-$param2";
      // TODO https://github.com/sanity-io/groq-js/issues/144

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { name: "param1"; type: "Parameter" };
        op: "-";
        right: { name: "param2"; type: "Parameter" };
        type: "OpCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{
            parameters: {
              param1: DateTime;
              param2: DateTime;
            };
          }>
        >
      >().toStrictEqual<number>();
    });

    it("$param-5 (with DateTime)", async () => {
      const query = "$param-5";
      // TODO https://github.com/sanity-io/groq-js/issues/144

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { name: "param"; type: "Parameter" };
        op: "-";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          _ScopeFromPartialContext<{ parameters: { param: DateTime } }>
        >
      >().toStrictEqual<DateTime>();
    });
  });

  describe("*", () => {
    it("4*5", async () => {
      const query = "4*5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "*",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(20);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });
  });

  describe("/", () => {
    it("4/5", async () => {
      const query = "4/5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "/",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(0.8);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });
  });

  describe("%", () => {
    it("4%5", async () => {
      const query = "4%5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "%",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(4);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });
  });

  describe("**", () => {
    it("4**5", async () => {
      const query = "4**5";
      const tree = parse(query);
      const result = await (await evaluate(tree)).get();

      const desiredTree = {
        left: { type: "Value", value: 4 },
        op: "**",
        right: { type: "Value", value: 5 },
        type: "OpCall",
      } as const;

      expect(tree).toStrictEqual(desiredTree);
      expectType<Parse<typeof query>>().toStrictEqual<
        WritableDeep<typeof desiredTree>
      >();

      expect(result).toBe(1024);
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });
  });
});
