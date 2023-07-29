import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import type { ExecuteQuery, Parse } from ".";

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
});
