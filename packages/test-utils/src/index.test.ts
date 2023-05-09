/* eslint-disable @typescript-eslint/ban-ts-comment -- we use @ts-expect-error as part of the test suite */
import { describe, expect, it } from "@jest/globals";

import { expectType } from ".";

describe("expectType", () => {
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

  describe("toBeAssignableTo", () => {
    it("expectType<boolean>.toBeAssignableTo<boolean>()", () => {
      expectType<boolean>().toBeAssignableTo<boolean>();
      expectType<boolean>().not.toBeAssignableTo<// @ts-expect-error
      boolean>();
    });

    it("expectType<boolean>.not.toBeAssignableTo<true>()", () => {
      expectType<boolean>().not.toBeAssignableTo<true>();
      expectType<boolean>().toBeAssignableTo<// @ts-expect-error
      true>();
    });

    it("expectType<true>.toBeAssignableTo<true>()", () => {
      expectType<true>().toBeAssignableTo<true>();
      expectType<true>().not.toBeAssignableTo<// @ts-expect-error
      true>();
    });

    it("expectType<true>.toBeAssignableTo<boolean>()", () => {
      expectType<true>().toBeAssignableTo<boolean>();
      expectType<true>().not.toBeAssignableTo<// @ts-expect-error
      boolean>();
    });

    it("expectType<number>.toBeAssignableTo<number>()", () => {
      expectType<number>().toBeAssignableTo<number>();
      expectType<number>().not.toBeAssignableTo<// @ts-expect-error
      number>();
    });

    it("expectType<number>.not.toBeAssignableTo<1>()", () => {
      expectType<number>().not.toBeAssignableTo<1>();
      expectType<number>().toBeAssignableTo<// @ts-expect-error
      1>();
    });

    it("expectType<1>.toBeAssignableTo<1>()", () => {
      expectType<1>().toBeAssignableTo<1>();
      expectType<1>().not.toBeAssignableTo<// @ts-expect-error
      1>();
    });

    it("expectType<1>.toBeAssignableTo<number>()", () => {
      expectType<1>().toBeAssignableTo<number>();
      expectType<1>().not.toBeAssignableTo<// @ts-expect-error
      number>();
    });

    it("expectType<1>.toBeAssignableTo<1 | 2>()", () => {
      expectType<1>().toBeAssignableTo<1 | 2>();
      expectType<1>().not.toBeAssignableTo<
        // @ts-expect-error
        1 | 2
      >();
    });

    it("expectType<1 | 2>.not.toBeAssignableTo<1>()", () => {
      expectType<1 | 2>().not.toBeAssignableTo<1>();
      expectType<1 | 2>().toBeAssignableTo<// @ts-expect-error
      1>();
    });

    it("expectType<string>.toBeAssignableTo<string>()", () => {
      expectType<string>().toBeAssignableTo<string>();
      expectType<string>().not.toBeAssignableTo<// @ts-expect-error
      string>();
    });

    it('expectType<string>.not.toBeAssignableTo<"foo">()', () => {
      expectType<string>().not.toBeAssignableTo<"foo">();
      expectType<string>().toBeAssignableTo<// @ts-expect-error
      "foo">();
    });

    it('expectType<"foo">.toBeAssignableTo<"foo">()', () => {
      expectType<"foo">().toBeAssignableTo<"foo">();
      expectType<"foo">().not.toBeAssignableTo<// @ts-expect-error
      "foo">();
    });

    it('expectType<"foo">.toBeAssignableTo<string>()', () => {
      expectType<"foo">().toBeAssignableTo<string>();
      expectType<"foo">().not.toBeAssignableTo<// @ts-expect-error
      string>();
    });

    it('expectType<"foo">.toBeAssignableTo<"foo" | "bar">()', () => {
      expectType<"foo">().toBeAssignableTo<"bar" | "foo">();
      expectType<"foo">().not.toBeAssignableTo<
        // @ts-expect-error
        "bar" | "foo"
      >();
    });

    it('expectType<"foo" | "bar">.not.toBeAssignableTo<"foo">()', () => {
      expectType<"bar" | "foo">().not.toBeAssignableTo<"foo">();
      expectType<"bar" | "foo">().toBeAssignableTo<// @ts-expect-error
      "foo">();
    });

    it("expectType<symbol>.toBeAssignableTo<symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toBeAssignableTo<typeof B>();
      expectType<typeof A>().not.toBeAssignableTo<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<symbol>.not.toBeAssignableTo<unique symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B");

      expectType<typeof A>().not.toBeAssignableTo<typeof B>();
      expectType<typeof A>().toBeAssignableTo<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<unique symbol>.not.toBeAssignableTo<unique symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B");

      expectType<typeof A>().not.toBeAssignableTo<typeof B>();
      expectType<typeof A>().toBeAssignableTo<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<unique symbol>.toBeAssignableTo<(same) unique symbol>()", () => {
      const Z = Symbol("A");
      const A: typeof Z = Z;
      const B: typeof Z = Z;

      expectType<typeof A>().toBeAssignableTo<typeof B>();
      expectType<typeof A>().not.toBeAssignableTo<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<unique symbol>.toBeAssignableTo<symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toBeAssignableTo<typeof B>();
      expectType<typeof A>().not.toBeAssignableTo<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<null>.toBeAssignableTo<null>()", () => {
      expectType<null>().toBeAssignableTo<null>();
      expectType<null>().not.toBeAssignableTo<// @ts-expect-error
      null>();
    });

    it("expectType<null>.not.toBeAssignableTo<undefined>()", () => {
      expectType<null>().not.toBeAssignableTo<undefined>();
      expectType<null>().toBeAssignableTo<// @ts-expect-error
      undefined>();
    });

    it("expectType<null>[.not].toBeAssignableTo<any>()", () => {
      expectType<null>().not.toBeAssignableTo<any>();
      expectType<null>().toBeAssignableTo<any>();
    });

    it("expectType<null>.toBeAssignableTo<unknown>()", () => {
      expectType<null>().toBeAssignableTo<unknown>();
      expectType<null>().not.toBeAssignableTo<// @ts-expect-error
      unknown>();
    });

    it("expectType<null>[.not].toBeAssignableTo<never>()", () => {
      expectType<null>().toBeAssignableTo<never>();
      expectType<null>().not.toBeAssignableTo<never>();
    });

    it("expectType<undefined>.toBeAssignableTo<undefined>()", () => {
      expectType<undefined>().toBeAssignableTo<undefined>();
      expectType<undefined>().not.toBeAssignableTo<// @ts-expect-error
      undefined>();
    });

    it("expectType<undefined>.not.toBeAssignableTo<null>()", () => {
      expectType<undefined>().not.toBeAssignableTo<null>();
      expectType<undefined>().toBeAssignableTo<// @ts-expect-error
      null>();
    });

    it("expectType<undefined>[.not].toBeAssignableTo<any>()", () => {
      expectType<undefined>().toBeAssignableTo<any>();
      expectType<undefined>().not.toBeAssignableTo<any>();
    });

    it("expectType<undefined>.toBeAssignableTo<unknown>()", () => {
      expectType<undefined>().toBeAssignableTo<unknown>();
      expectType<undefined>().not.toBeAssignableTo<// @ts-expect-error
      unknown>();
    });

    it("expectType<undefined>[.not].toBeAssignableTo<never>()", () => {
      expectType<undefined>().toBeAssignableTo<never>();
      expectType<undefined>().not.toBeAssignableTo<never>();
    });

    it("expectType<any>[.not].toBeAssignableTo<any>()", () => {
      expectType<any>().toBeAssignableTo<any>();
      expectType<any>().not.toBeAssignableTo<any>();
    });

    it("expectType<any>.toBeAssignableTo<null>()", () => {
      expectType<any>().toBeAssignableTo<null>();
      expectType<any>().not.toBeAssignableTo<// @ts-expect-error
      null>();
    });

    it("expectType<any>.toBeAssignableTo<undefined>()", () => {
      expectType<any>().toBeAssignableTo<undefined>();
      expectType<any>().not.toBeAssignableTo<// @ts-expect-error
      undefined>();
    });

    it("expectType<any>.toBeAssignableTo<unknown>()", () => {
      expectType<any>().toBeAssignableTo<unknown>();
      expectType<any>().not.toBeAssignableTo<// @ts-expect-error
      unknown>();
    });

    it("expectType<any>[.not].toBeAssignableTo<never>()", () => {
      expectType<any>().toBeAssignableTo<never>();
      expectType<any>().not.toBeAssignableTo<never>();
    });

    it("expectType<unknown>.toBeAssignableTo<unknown>()", () => {
      expectType<unknown>().toBeAssignableTo<unknown>();
      expectType<unknown>().not.toBeAssignableTo<// @ts-expect-error
      unknown>();
    });

    it("expectType<unknown>.not.toBeAssignableTo<null>()", () => {
      expectType<unknown>().not.toBeAssignableTo<null>();
      expectType<unknown>().toBeAssignableTo<// @ts-expect-error
      null>();
    });

    it("expectType<unknown>.not.toBeAssignableTo<undefined>()", () => {
      expectType<unknown>().not.toBeAssignableTo<undefined>();
      expectType<unknown>().toBeAssignableTo<// @ts-expect-error
      undefined>();
    });

    it("expectType<unknown>[.not].toBeAssignableTo<any>()", () => {
      expectType<unknown>().toBeAssignableTo<any>();
      expectType<unknown>().not.toBeAssignableTo<any>();
    });

    it("expectType<unknown>[.not].toBeAssignableTo<never>()", () => {
      expectType<unknown>().toBeAssignableTo<never>();
      expectType<unknown>().not.toBeAssignableTo<never>();
    });

    it("expectType<never>[.not].toBeAssignableTo<never>()", () => {
      expectType<never>().toBeAssignableTo<never>();
      expectType<never>().not.toBeAssignableTo<never>();
    });

    it("expectType<never>.toBeAssignableTo<null>()", () => {
      expectType<never>().toBeAssignableTo<null>();
      expectType<never>().not.toBeAssignableTo<// @ts-expect-error
      null>();
    });

    it("expectType<never>.toBeAssignableTo<undefined>()", () => {
      expectType<never>().toBeAssignableTo<undefined>();
      expectType<never>().not.toBeAssignableTo<// @ts-expect-error
      undefined>();
    });

    it("expectType<never>[.not].toBeAssignableTo<any>()", () => {
      expectType<never>().toBeAssignableTo<any>();
      expectType<never>().not.toBeAssignableTo<any>();
    });

    it("expectType<never>.toBeAssignableTo<unknown>()", () => {
      expectType<never>().toBeAssignableTo<unknown>();
      expectType<never>().not.toBeAssignableTo<// @ts-expect-error
      unknown>();
    });
  });

  describe("toStrictEqual", () => {
    it("expectType<boolean>.toStrictEqual<boolean>()", () => {
      expectType<boolean>().toStrictEqual<boolean>();
      expectType<boolean>().not.toStrictEqual<// @ts-expect-error
      boolean>();
    });

    it("expectType<boolean>.not.toStrictEqual<true>()", () => {
      expectType<boolean>().not.toStrictEqual<true>();
      expectType<boolean>().toStrictEqual<// @ts-expect-error
      true>();
    });

    it("expectType<true>.toStrictEqual<true>()", () => {
      expectType<true>().toStrictEqual<true>();
      expectType<true>().not.toStrictEqual<// @ts-expect-error
      true>();
    });

    it("expectType<true>.not.toStrictEqual<boolean>()", () => {
      expectType<true>().not.toStrictEqual<boolean>();
      expectType<true>().toStrictEqual<// @ts-expect-error
      boolean>();
    });

    it("expectType<number>.toStrictEqual<number>()", () => {
      expectType<number>().toStrictEqual<number>();
      expectType<number>().not.toStrictEqual<// @ts-expect-error
      number>();
    });

    it("expectType<number>.not.toStrictEqual<1>()", () => {
      expectType<number>().not.toStrictEqual<1>();
      expectType<number>().toStrictEqual<// @ts-expect-error
      1>();
    });

    it("expectType<1>.toStrictEqual<1>()", () => {
      expectType<1>().toStrictEqual<1>();
      expectType<1>().not.toStrictEqual<// @ts-expect-error
      1>();
    });

    it("expectType<1>.not.toStrictEqual<number>()", () => {
      expectType<1>().not.toStrictEqual<number>();
      expectType<1>().toStrictEqual<// @ts-expect-error
      number>();
    });

    it("expectType<1>.not.toStrictEqual<1 | 2>()", () => {
      expectType<1>().not.toStrictEqual<1 | 2>();
      expectType<1>().toStrictEqual<
        // @ts-expect-error
        1 | 2
      >();
    });

    it("expectType<1 | 2>.not.toStrictEqual<1>()", () => {
      expectType<1 | 2>().not.toStrictEqual<1>();
      expectType<1 | 2>().toStrictEqual<// @ts-expect-error
      1>();
    });

    it("expectType<string>.toStrictEqual<string>()", () => {
      expectType<string>().toStrictEqual<string>();
      expectType<string>().not.toStrictEqual<// @ts-expect-error
      string>();
    });

    it('expectType<string>.not.toStrictEqual<"foo">()', () => {
      expectType<string>().not.toStrictEqual<"foo">();
      expectType<string>().toStrictEqual<// @ts-expect-error
      "foo">();
    });

    it('expectType<"foo">.toStrictEqual<"foo">()', () => {
      expectType<"foo">().toStrictEqual<"foo">();
      expectType<"foo">().not.toStrictEqual<// @ts-expect-error
      "foo">();
    });

    it('expectType<"foo">.not.toStrictEqual<string>()', () => {
      expectType<"foo">().not.toStrictEqual<string>();
      expectType<"foo">().toStrictEqual<// @ts-expect-error
      string>();
    });

    it('expectType<"foo">.not.toStrictEqual<"foo" | "bar">()', () => {
      expectType<"foo">().not.toStrictEqual<"bar" | "foo">();
      expectType<"foo">().toStrictEqual<
        // @ts-expect-error
        "bar" | "foo"
      >();
    });

    it('expectType<"foo" | "bar">.not.toStrictEqual<"foo">()', () => {
      expectType<"bar" | "foo">().not.toStrictEqual<"foo">();
      expectType<"bar" | "foo">().toStrictEqual<// @ts-expect-error
      "foo">();
    });

    it("expectType<symbol>.toStrictEqual<symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toStrictEqual<typeof B>();
      expectType<typeof A>().not.toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<symbol>.not.toStrictEqual<unique symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B");

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>().toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<unique symbol>.not.toStrictEqual<unique symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B");

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>().toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<unique symbol>.toStrictEqual<(same) unique symbol>()", () => {
      const Z = Symbol("A");
      const A: typeof Z = Z;
      const B: typeof Z = Z;

      expectType<typeof A>().toStrictEqual<typeof B>();
      expectType<typeof A>().not.toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<unique symbol>.not.toStrictEqual<symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B") as symbol;

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>().toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<null>.toStrictEqual<null>()", () => {
      expectType<null>().toStrictEqual<null>();
      expectType<null>().not.toStrictEqual<// @ts-expect-error
      null>();
    });

    it("expectType<null>.not.toStrictEqual<undefined>()", () => {
      expectType<null>().not.toStrictEqual<undefined>();
      expectType<null>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it.skip("expectType<null>.not.toStrictEqual<any>()", () => {
      expectType<null>().not.toStrictEqual<any>();
      expectType<null>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is any
      any>();
    });

    it("expectType<null>.not.toStrictEqual<unknown>()", () => {
      expectType<null>().not.toStrictEqual<unknown>();
      expectType<null>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it.skip("expectType<null>.not.toStrictEqual<never>()", () => {
      expectType<null>().not.toStrictEqual<never>();
      expectType<null>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });

    it("expectType<undefined>.toStrictEqual<undefined>()", () => {
      expectType<undefined>().toStrictEqual<undefined>();
      expectType<undefined>().not.toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it("expectType<undefined>.not.toStrictEqual<null>()", () => {
      expectType<undefined>().not.toStrictEqual<null>();
      expectType<undefined>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it.skip("expectType<undefined>.not.toStrictEqual<any>()", () => {
      expectType<undefined>().not.toStrictEqual<any>();
      expectType<undefined>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is any
      any>();
    });

    it("expectType<undefined>.not.toStrictEqual<unknown>()", () => {
      expectType<undefined>().not.toStrictEqual<unknown>();
      expectType<undefined>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it.skip("expectType<undefined>.not.toStrictEqual<never>()", () => {
      expectType<undefined>().not.toStrictEqual<never>();
      expectType<undefined>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });

    it.skip("expectType<any>.toStrictEqual<any>()", () => {
      expectType<any>().toStrictEqual<any>();
      expectType<any>().not.toStrictEqual<// FIXME can't @ts-expect-error when the second type is any
      any>();
    });

    it("expectType<any>.not.toStrictEqual<null>()", () => {
      expectType<any>().not.toStrictEqual<null>();
      expectType<any>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it("expectType<any>.not.toStrictEqual<undefined>()", () => {
      expectType<any>().not.toStrictEqual<undefined>();
      expectType<any>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it("expectType<any>.not.toStrictEqual<unknown>()", () => {
      expectType<any>().not.toStrictEqual<unknown>();
      expectType<any>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it.skip("expectType<any>.not.toStrictEqual<never>()", () => {
      expectType<any>().not.toStrictEqual<never>();
      expectType<any>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });

    it("expectType<unknown>.toStrictEqual<unknown>()", () => {
      expectType<unknown>().toStrictEqual<unknown>();
      expectType<unknown>().not.toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it("expectType<unknown>.not.toStrictEqual<null>()", () => {
      expectType<unknown>().not.toStrictEqual<null>();
      expectType<unknown>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it("expectType<unknown>.not.toStrictEqual<undefined>()", () => {
      expectType<unknown>().not.toStrictEqual<undefined>();
      expectType<unknown>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it.skip("expectType<unknown>.not.toStrictEqual<any>()", () => {
      expectType<unknown>().not.toStrictEqual<any>();
      expectType<unknown>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is any
      any>();
    });

    it.skip("expectType<unknown>.not.toStrictEqual<never>()", () => {
      expectType<unknown>().not.toStrictEqual<never>();
      expectType<unknown>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });

    it.skip("expectType<never>.toStrictEqual<never>()", () => {
      expectType<never>().toStrictEqual<never>();
      expectType<never>().not.toStrictEqual<// FIXME can't @ts-expect-error when the second type is never
      never>();
    });

    it("expectType<never>.not.toStrictEqual<null>()", () => {
      expectType<never>().not.toStrictEqual<null>();
      expectType<never>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it("expectType<never>.not.toStrictEqual<undefined>()", () => {
      expectType<never>().not.toStrictEqual<undefined>();
      expectType<never>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it.skip("expectType<never>.not.toStrictEqual<any>()", () => {
      expectType<never>().not.toStrictEqual<any>();
      expectType<never>().toStrictEqual<// FIXME can't @ts-expect-error when the second type is any
      any>();
    });

    it("expectType<never>.not.toStrictEqual<unknown>()", () => {
      expectType<never>().not.toStrictEqual<unknown>();
      expectType<never>().toStrictEqual<// @ts-expect-error
      unknown>();
    });
  });
});
