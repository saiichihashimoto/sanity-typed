/* eslint-disable @typescript-eslint/ban-ts-comment -- we use @ts-expect-error as part of the test suite */
import { describe, expect, it } from "@jest/globals";

import { expectType } from ".";

describe("expectType<T>", () => {
  describe("toEqual", () => {
    it(".not inverts the expectation", () => {
      expectType<"foo">().not.toStrictEqual<"bar">();
      expectType<"foo">().toStrictEqual<// @ts-expect-error
      "bar">();

      const typeMatchers = expectType<"foo">();

      // `.not` inverts the type, which we want.
      expectType<typeof typeMatchers>().not.toStrictEqual<
        typeof typeMatchers.not
      >();
      expectType<typeof typeMatchers>().toStrictEqual<
        // @ts-expect-error
        typeof typeMatchers.not
      >();

      // But it's actually the same reference! Since it's all noops during runtime, as long as the types succeed/fail during compile time, we're good.
      expect(typeMatchers).toBe(typeMatchers.not);

      // Since `.not` is the same reference but typed differently, you can chain `.not` as many times as you like.
      expectType<typeof typeMatchers>().toStrictEqual<
        typeof typeMatchers.not.not
      >();
      expectType<typeof typeMatchers>().not.toStrictEqual<
        // @ts-expect-error
        typeof typeMatchers.not.not
      >();
    });

    it("boolean = boolean", () => {
      expectType<boolean>().toStrictEqual<boolean>();
      expectType<boolean>().not.toStrictEqual<// @ts-expect-error
      boolean>();
    });

    it("boolean != true", () => {
      expectType<boolean>().not.toStrictEqual<true>();
      expectType<boolean>().toStrictEqual<// @ts-expect-error
      true>();
    });

    it("true = true", () => {
      expectType<true>().toStrictEqual<true>();
      expectType<true>().not.toStrictEqual<// @ts-expect-error
      true>();
    });

    it("true != boolean", () => {
      expectType<true>().not.toStrictEqual<boolean>();
      expectType<true>().toStrictEqual<// @ts-expect-error
      boolean>();
    });

    it("number = number", () => {
      expectType<number>().toStrictEqual<number>();
      expectType<number>().not.toStrictEqual<// @ts-expect-error
      number>();
    });

    it("number != 1", () => {
      expectType<number>().not.toStrictEqual<1>();
      expectType<number>().toStrictEqual<// @ts-expect-error
      1>();
    });

    it("1 = 1", () => {
      expectType<1>().toStrictEqual<1>();
      expectType<1>().not.toStrictEqual<// @ts-expect-error
      1>();
    });

    it("1 != number", () => {
      expectType<1>().not.toStrictEqual<number>();
      expectType<1>().toStrictEqual<// @ts-expect-error
      number>();
    });

    it("1 != 1 | 2", () => {
      expectType<1>().not.toStrictEqual<1 | 2>();
      expectType<1>().toStrictEqual<
        // @ts-expect-error
        1 | 2
      >();
    });

    it("1 | 2 != 1", () => {
      expectType<1 | 2>().not.toStrictEqual<1>();
      expectType<1 | 2>().toStrictEqual<// @ts-expect-error
      1>();
    });

    it("string = string", () => {
      expectType<string>().toStrictEqual<string>();
      expectType<string>().not.toStrictEqual<// @ts-expect-error
      string>();
    });

    it('string != "foo"', () => {
      expectType<string>().not.toStrictEqual<"foo">();
      expectType<string>().toStrictEqual<// @ts-expect-error
      "foo">();
    });

    it('"foo" = "foo"', () => {
      expectType<"foo">().toStrictEqual<"foo">();
      expectType<"foo">().not.toStrictEqual<// @ts-expect-error
      "foo">();
    });

    it('"foo" != string', () => {
      expectType<"foo">().not.toStrictEqual<string>();
      expectType<"foo">().toStrictEqual<// @ts-expect-error
      string>();
    });

    it('"foo" != "foo" | "bar"', () => {
      expectType<"foo">().not.toStrictEqual<"bar" | "foo">();
      expectType<"foo">().toStrictEqual<
        // @ts-expect-error
        "bar" | "foo"
      >();
    });

    it('"foo" | "bar" = "foo"', () => {
      expectType<"bar" | "foo">().not.toStrictEqual<"foo">();
      expectType<"bar" | "foo">().toStrictEqual<// @ts-expect-error
      "foo">();
    });

    it("symbol = symbol", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toStrictEqual<typeof B>();
      expectType<typeof A>().not.toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("symbol != unique symbol", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B");

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>().toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("unique symbol != unique symbol", () => {
      const A = Symbol("A");
      const B = Symbol("B");

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>().toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("unique symbol = (same) unique symbol", () => {
      const Z = Symbol("A");
      const A: typeof Z = Z;
      const B: typeof Z = Z;

      expectType<typeof A>().toStrictEqual<typeof B>();
      expectType<typeof A>().not.toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("unique symbol != symbol", () => {
      const A = Symbol("A");
      const B = Symbol("B") as symbol;

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>().toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("null = null", () => {
      expectType<null>().toStrictEqual<null>();
      expectType<null>().not.toStrictEqual<// @ts-expect-error
      null>();
    });

    it("null != undefined", () => {
      expectType<null>().not.toStrictEqual<undefined>();
      expectType<null>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it.skip("null != any", () => {
      expectType<null>().not.toStrictEqual<any>();
      expectType<null>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is any
      any>();
    });

    it("null != unknown", () => {
      expectType<null>().not.toStrictEqual<unknown>();
      expectType<null>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it.skip("null != never", () => {
      expectType<null>().not.toStrictEqual<never>();
      expectType<null>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });

    it("undefined = undefined", () => {
      expectType<undefined>().toStrictEqual<undefined>();
      expectType<undefined>().not.toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it("undefined != null", () => {
      expectType<undefined>().not.toStrictEqual<null>();
      expectType<undefined>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it.skip("undefined != any", () => {
      expectType<undefined>().not.toStrictEqual<any>();
      expectType<undefined>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is any
      any>();
    });

    it("undefined != unknown", () => {
      expectType<undefined>().not.toStrictEqual<unknown>();
      expectType<undefined>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it.skip("undefined != never", () => {
      expectType<undefined>().not.toStrictEqual<never>();
      expectType<undefined>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });

    it.skip("any = any", () => {
      expectType<any>().toStrictEqual<any>();
      expectType<any>().not.toStrictEqual<// FIXME can't @ts-expect-error when the second type is any
      any>();
    });

    it("any != null", () => {
      expectType<any>().not.toStrictEqual<null>();
      expectType<any>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it("any != undefined", () => {
      expectType<any>().not.toStrictEqual<undefined>();
      expectType<any>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it("any != unknown", () => {
      expectType<any>().not.toStrictEqual<unknown>();
      expectType<any>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it.skip("any != never", () => {
      expectType<any>().not.toStrictEqual<never>();
      expectType<any>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });

    it("unknown = unknown", () => {
      expectType<unknown>().toStrictEqual<unknown>();
      expectType<unknown>().not.toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it("unknown != null", () => {
      expectType<unknown>().not.toStrictEqual<null>();
      expectType<unknown>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it("unknown != undefined", () => {
      expectType<unknown>().not.toStrictEqual<undefined>();
      expectType<unknown>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it.skip("unknown != any", () => {
      expectType<unknown>().not.toStrictEqual<any>();
      expectType<unknown>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is any
      any>();
    });

    it.skip("unknown != never", () => {
      expectType<unknown>().not.toStrictEqual<never>();
      expectType<unknown>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });

    it.skip("never = never", () => {
      expectType<never>().toStrictEqual<never>();
      expectType<never>().not.toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });

    it("never != unknown", () => {
      expectType<never>().not.toStrictEqual<unknown>();
      expectType<never>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it("never != null", () => {
      expectType<never>().not.toStrictEqual<null>();
      expectType<never>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it("never != undefined", () => {
      expectType<never>().not.toStrictEqual<undefined>();
      expectType<never>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it.skip("never != any", () => {
      expectType<never>().not.toStrictEqual<any>();
      expectType<never>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is any
      any>();
    });

    it.skip("never != never", () => {
      expectType<never>().not.toStrictEqual<never>();
      expectType<never>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });
  });
});
