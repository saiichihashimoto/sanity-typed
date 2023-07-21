import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";
import type { DocumentValue } from "@sanity-typed/types";

import type { ExecuteQuery } from ".";

describe("groq", () => {
  it("null", () =>
    expectType<
      ExecuteQuery<"null", { [key: string]: never }>
    >().toStrictEqual<null>());

  it("true", () =>
    expectType<
      ExecuteQuery<"true", { [key: string]: never }>
    >().toStrictEqual<true>());

  it("false", () =>
    expectType<
      ExecuteQuery<"false", { [key: string]: never }>
    >().toStrictEqual<false>());

  it("-5.6", () =>
    expectType<
      ExecuteQuery<"-5.6", { [key: string]: never }>
    >().toStrictEqual<-5.6>());

  it('"double quoted string"', () =>
    expectType<
      ExecuteQuery<'"double quoted string"', { [key: string]: never }>
    >().toStrictEqual<"double quoted string">());

  it("'single quoted string'", () =>
    expectType<
      ExecuteQuery<"'single quoted string'", { [key: string]: never }>
    >().toStrictEqual<"single quoted string">());

  it("[]", () =>
    expectType<ExecuteQuery<"[]", { [key: string]: never }>>().toStrictEqual<
      []
    >());

  it("[null,true,false,-5.6,\"double quoted string\",'single quoted string']", () =>
    expectType<
      ExecuteQuery<
        "[null,true,false,-5.6,\"double quoted string\",'single quoted string']",
        { [key: string]: never }
      >
    >().toStrictEqual<
      [null, true, false, -5.6, "double quoted string", "single quoted string"]
    >());

  it("[...[null]]", () =>
    expectType<
      ExecuteQuery<"[...[null]]", { [key: string]: never }>
    >().toStrictEqual<[null]>());

  it("[[null,null],[null,null,null]]", () =>
    expectType<
      ExecuteQuery<"[[null,null],[null,null,null]]", { [key: string]: never }>
    >().toStrictEqual<[[null, null], [null, null, null]]>());

  it("*", () =>
    expectType<
      ExecuteQuery<
        "*",
        {
          bar: DocumentValue<"bar", never>;
          foo: DocumentValue<"foo", never>;
          qux: { _type: "qux" };
        }
      >
    >().toStrictEqual<
      (DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]
    >());

  it("(*)", () =>
    expectType<
      ExecuteQuery<
        "(*)",
        {
          bar: DocumentValue<"bar", never>;
          foo: DocumentValue<"foo", never>;
          qux: { _type: "qux" };
        }
      >
    >().toStrictEqual<
      (DocumentValue<"bar", never> | DocumentValue<"foo", never>)[]
    >());
});
