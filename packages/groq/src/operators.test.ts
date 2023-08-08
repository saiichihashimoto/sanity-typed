import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import type { DateTime, ExecuteQuery, Parse } from ".";

describe("operators", () => {
  describe("&&", () => {
    it("true&&true", () => {
      const query = "true&&true";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: true };
        right: { type: "Value"; value: true };
        type: "And";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("false&&true", () => {
      const query = "false&&true";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: false };
        right: { type: "Value"; value: true };
        type: "And";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("true&&false", () => {
      const query = "true&&false";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: true };
        right: { type: "Value"; value: false };
        type: "And";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("false&&false", () => {
      const query = "false&&false";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: false };
        right: { type: "Value"; value: false };
        type: "And";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it('""&&false', () => {
      const query = '""&&false';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: "" };
        right: { type: "Value"; value: false };
        type: "And";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it('false&&""', () => {
      const query = 'false&&""';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: false };
        right: { type: "Value"; value: "" };
        type: "And";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it('""&&true', () => {
      const query = '""&&true';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: "" };
        right: { type: "Value"; value: true };
        type: "And";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('true&&""', () => {
      const query = 'true&&""';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: true };
        right: { type: "Value"; value: "" };
        type: "And";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('""&&""', () => {
      const query = '""&&""';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: "" };
        right: { type: "Value"; value: "" };
        type: "And";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });
  });

  describe("||", () => {
    it("false||false", () => {
      const query = "false||false";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: false };
        right: { type: "Value"; value: false };
        type: "Or";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("false||true", () => {
      const query = "false||true";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: false };
        right: { type: "Value"; value: true };
        type: "Or";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("true||false", () => {
      const query = "true||false";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: true };
        right: { type: "Value"; value: false };
        type: "Or";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("true||true", () => {
      const query = "true||true";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: true };
        right: { type: "Value"; value: true };
        type: "Or";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it('""||true', () => {
      const query = '""||true';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: "" };
        right: { type: "Value"; value: true };
        type: "Or";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it('true||""', () => {
      const query = 'true||""';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: true };
        right: { type: "Value"; value: "" };
        type: "Or";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it('""||false', () => {
      const query = '""||false';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: "" };
        right: { type: "Value"; value: false };
        type: "Or";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('false||""', () => {
      const query = 'false||""';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: false };
        right: { type: "Value"; value: "" };
        type: "Or";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });

    it('""||""', () => {
      const query = '""||""';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: "" };
        right: { type: "Value"; value: "" };
        type: "Or";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });
  });

  describe("!", () => {
    it("!true", () => {
      const query = "!true";

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { type: "Value"; value: true };
        type: "Not";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("!false", () => {
      const query = "!false";

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { type: "Value"; value: false };
        type: "Not";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it('!"string"', () => {
      const query = '!"string"';

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { type: "Value"; value: "string" };
        type: "Not";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<null>();
    });
  });

  describe("==", () => {
    it("4==5", () => {
      const query = "4==5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: "==";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });

    it("5==5", () => {
      const query = "5==5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 5 };
        op: "==";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });
  });

  describe("!=", () => {
    it("4!=5", () => {
      const query = "4!=5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: "!=";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<true>();
    });

    it("5!=5", () => {
      const query = "5!=5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 5 };
        op: "!=";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<false>();
    });
  });

  describe("<", () => {
    it("4<5", () => {
      const query = "4<5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: "<";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });
  });

  describe("<=", () => {
    it("4<=5", () => {
      const query = "4<=5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: "<=";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });
  });

  describe(">", () => {
    it("4>5", () => {
      const query = "4>5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: ">";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });
  });

  describe(">=", () => {
    it("4>=5", () => {
      const query = "4>=5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: ">=";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<boolean>();
    });
  });

  describe("+ (prefix)", () => {
    it("+5", () => {
      const query = "+5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        type: "Value";
        value: 5;
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: 5 } }>
      >().toStrictEqual<5>();
    });

    it("+$param (5)", () => {
      const query = "+$param";

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { name: "param"; type: "Parameter" };
        type: "Pos";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: 5 } }>
      >().toStrictEqual<5>();
    });

    it("+$param (-5)", () => {
      const query = "+$param";

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { name: "param"; type: "Parameter" };
        type: "Pos";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: -5 } }>
      >().toStrictEqual<-5>();
    });

    it("+$param (number)", () => {
      const query = "+$param";

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { name: "param"; type: "Parameter" };
        type: "Pos";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: number } }>
      >().toStrictEqual<number>();
    });

    it("+$param (string)", () => {
      const query = "+$param";

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { name: "param"; type: "Parameter" };
        type: "Pos";
      }>();
      expectType<
        ExecuteQuery<typeof query, { this: "foo" }>
      >().toStrictEqual<null>();
    });
  });

  describe("- (prefix)", () => {
    it("-5", () => {
      const query = "-5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        type: "Value";
        value: -5;
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: 5 } }>
      >().toStrictEqual<-5>();
    });

    it("-$param (5)", () => {
      const query = "-$param";

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { name: "param"; type: "Parameter" };
        type: "Neg";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: 5 } }>
      >().toStrictEqual<-5>();
    });

    it("-$param (-5)", () => {
      const query = "-$param";

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { name: "param"; type: "Parameter" };
        type: "Neg";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: -5 } }>
      >().toStrictEqual<5>();
    });

    it("-$param (number)", () => {
      const query = "-$param";

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { name: "param"; type: "Parameter" };
        type: "Neg";
      }>();
      expectType<
        ExecuteQuery<typeof query, { parameters: { param: number } }>
      >().toStrictEqual<number>();
    });

    it("-$param (string)", () => {
      const query = "-$param";

      expectType<Parse<typeof query>>().toStrictEqual<{
        base: { name: "param"; type: "Parameter" };
        type: "Neg";
      }>();
      expectType<
        ExecuteQuery<typeof query, { this: "foo" }>
      >().toStrictEqual<null>();
    });
  });

  describe("+", () => {
    it('"foo"+"bar"', () => {
      const query = '"foo"+"bar"';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: "foo" };
        op: "+";
        right: { type: "Value"; value: "bar" };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<"foobar">();
    });

    it("4+5", () => {
      const query = "4+5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: "+";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("[1,2]+[3,4]", () => {
      const query = "[1,2]+[3,4]";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: {
          elements: [
            {
              isSplat: false;
              type: "ArrayElement";
              value: { type: "Value"; value: 1 };
            },
            {
              isSplat: false;
              type: "ArrayElement";
              value: { type: "Value"; value: 2 };
            }
          ];
          type: "Array";
        };
        op: "+";
        right: {
          elements: [
            {
              isSplat: false;
              type: "ArrayElement";
              value: { type: "Value"; value: 3 };
            },
            {
              isSplat: false;
              type: "ArrayElement";
              value: { type: "Value"; value: 4 };
            }
          ];
          type: "Array";
        };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<[1, 2, 3, 4]>();
    });

    it('{"foo":"bar"}+{"baz":"qux"}', () => {
      const query = '{"foo":"bar"}+{"baz":"qux"}';

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: {
          attributes: [
            {
              name: "foo";
              type: "ObjectAttributeValue";
              value: { type: "Value"; value: "bar" };
            }
          ];
          type: "Object";
        };
        op: "+";
        right: {
          attributes: [
            {
              name: "baz";
              type: "ObjectAttributeValue";
              value: { type: "Value"; value: "qux" };
            }
          ];
          type: "Object";
        };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<{
        baz: "qux";
        foo: "bar";
      }>();
    });

    it("$param+5 (with DateTime)", () => {
      const query = "$param+5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { name: "param"; type: "Parameter" };
        op: "+";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { parameters: { param: DateTime<"some date"> } }
        >
      >().toStrictEqual<DateTime<string>>();
    });
  });

  describe("-", () => {
    it("4-5", () => {
      const query = "4-5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: "-";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });

    it("$param1-$param2 (with DateTime)", () => {
      const query = "$param1-$param2";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { name: "param1"; type: "Parameter" };
        op: "-";
        right: { name: "param2"; type: "Parameter" };
        type: "OpCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          {
            parameters: {
              param1: DateTime<"some date">;
              param2: DateTime<"some date">;
            };
          }
        >
      >().toStrictEqual<number>();
    });

    it("$param-5 (with DateTime)", () => {
      const query = "$param-5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { name: "param"; type: "Parameter" };
        op: "-";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<
        ExecuteQuery<
          typeof query,
          { parameters: { param: DateTime<"some date"> } }
        >
      >().toStrictEqual<DateTime<string>>();
    });
  });

  describe("*", () => {
    it("4*5", () => {
      const query = "4*5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: "*";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });
  });

  describe("/", () => {
    it("4/5", () => {
      const query = "4/5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: "/";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });
  });

  describe("%", () => {
    it("4%5", () => {
      const query = "4%5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: "%";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });
  });

  describe("**", () => {
    it("4**5", () => {
      const query = "4**5";

      expectType<Parse<typeof query>>().toStrictEqual<{
        left: { type: "Value"; value: 4 };
        op: "**";
        right: { type: "Value"; value: 5 };
        type: "OpCall";
      }>();
      expectType<ExecuteQuery<typeof query>>().toStrictEqual<number>();
    });
  });
});
