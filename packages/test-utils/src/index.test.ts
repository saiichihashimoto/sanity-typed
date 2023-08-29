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
    /* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/prefer-as-const -- we set variables to see if they work like the assignables do */

    it("expectType<boolean>().toBeAssignableTo<boolean>()", () => {
      expectType<boolean>().toBeAssignableTo<boolean>();
      expectType<boolean>().not.toBeAssignableTo<// @ts-expect-error
      boolean>();

      const test: boolean = true as boolean;
    });

    it("expectType<boolean>().not.toBeAssignableTo<true>()", () => {
      expectType<boolean>().not.toBeAssignableTo<true>();
      expectType<boolean>().toBeAssignableTo<// @ts-expect-error
      true>();

      // @ts-expect-error
      const test: true = true as boolean;
    });

    it("expectType<true>().toBeAssignableTo<true>()", () => {
      expectType<true>().toBeAssignableTo<true>();
      expectType<true>().not.toBeAssignableTo<// @ts-expect-error
      true>();

      const test: true = true as true;
    });

    it("expectType<true>().toBeAssignableTo<boolean>()", () => {
      expectType<true>().toBeAssignableTo<boolean>();
      expectType<true>().not.toBeAssignableTo<// @ts-expect-error
      boolean>();

      const test: boolean = true as true;
    });

    it("expectType<number>().toBeAssignableTo<number>()", () => {
      expectType<number>().toBeAssignableTo<number>();
      expectType<number>().not.toBeAssignableTo<// @ts-expect-error
      number>();

      const test: number = 2 as number;
    });

    it("expectType<number>().not.toBeAssignableTo<1>()", () => {
      expectType<number>().not.toBeAssignableTo<1>();
      expectType<number>().toBeAssignableTo<// @ts-expect-error
      1>();

      // @ts-expect-error
      const test: 1 = 2 as number;
    });

    it("expectType<1>().toBeAssignableTo<1>()", () => {
      expectType<1>().toBeAssignableTo<1>();
      expectType<1>().not.toBeAssignableTo<// @ts-expect-error
      1>();

      const test: 1 = 1 as 1;
    });

    it("expectType<1>().toBeAssignableTo<number>()", () => {
      expectType<1>().toBeAssignableTo<number>();
      expectType<1>().not.toBeAssignableTo<// @ts-expect-error
      number>();

      const test: number = 1 as 1;
    });

    it("expectType<1>().toBeAssignableTo<1 | 2>()", () => {
      expectType<1>().toBeAssignableTo<1 | 2>();
      expectType<1>().not.toBeAssignableTo<
        // @ts-expect-error
        1 | 2
      >();

      const test: 1 | 2 = 1 as 1;
    });

    it("expectType<1 | 2>().not.toBeAssignableTo<1>()", () => {
      expectType<1 | 2>().not.toBeAssignableTo<1>();
      expectType<1 | 2>().toBeAssignableTo<// @ts-expect-error
      1>();

      // @ts-expect-error
      const test: 1 = 1 as 1 | 2;
    });

    it("expectType<string>().toBeAssignableTo<string>()", () => {
      expectType<string>().toBeAssignableTo<string>();
      expectType<string>().not.toBeAssignableTo<// @ts-expect-error
      string>();

      const test: string = "foo" as string;
    });

    it('expectType<string>().not.toBeAssignableTo<"foo">()', () => {
      expectType<string>().not.toBeAssignableTo<"foo">();
      expectType<string>().toBeAssignableTo<// @ts-expect-error
      "foo">();

      // @ts-expect-error
      const test: "foo" = "foo" as string;
    });

    it('expectType<"foo">().toBeAssignableTo<"foo">()', () => {
      expectType<"foo">().toBeAssignableTo<"foo">();
      expectType<"foo">().not.toBeAssignableTo<// @ts-expect-error
      "foo">();

      const test: "foo" = "foo" as "foo";
    });

    it('expectType<"foo">().toBeAssignableTo<string>()', () => {
      expectType<"foo">().toBeAssignableTo<string>();
      expectType<"foo">().not.toBeAssignableTo<// @ts-expect-error
      string>();

      const test: string = "foo" as "foo";
    });

    it('expectType<"foo">().toBeAssignableTo<"foo" | "bar">()', () => {
      expectType<"foo">().toBeAssignableTo<"bar" | "foo">();
      expectType<"foo">().not.toBeAssignableTo<
        // @ts-expect-error
        "bar" | "foo"
      >();

      const test: "bar" | "foo" = "foo" as "foo";
    });

    it('expectType<"foo" | "bar">().not.toBeAssignableTo<"foo">()', () => {
      expectType<"bar" | "foo">().not.toBeAssignableTo<"foo">();
      expectType<"bar" | "foo">().toBeAssignableTo<// @ts-expect-error
      "foo">();

      // @ts-expect-error
      const test: "foo" = "foo" as "bar" | "foo";
    });

    it("expectType<symbol>().toBeAssignableTo<symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toBeAssignableTo<typeof B>();
      expectType<typeof A>().not.toBeAssignableTo<
        // @ts-expect-error
        typeof B
      >();

      const test: typeof B = A as typeof A;
    });

    it("expectType<symbol>().not.toBeAssignableTo<unique symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B");

      expectType<typeof A>().not.toBeAssignableTo<typeof B>();
      expectType<typeof A>().toBeAssignableTo<
        // @ts-expect-error
        typeof B
      >();

      // @ts-expect-error
      const test: typeof B = A as typeof A;
    });

    it("expectType<unique symbol>().not.toBeAssignableTo<unique symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B");

      expectType<typeof A>().not.toBeAssignableTo<typeof B>();
      expectType<typeof A>().toBeAssignableTo<
        // @ts-expect-error
        typeof B
      >();

      // @ts-expect-error
      const test: typeof B = A as typeof A;
    });

    it("expectType<unique symbol>().toBeAssignableTo<(same) unique symbol>()", () => {
      const Z = Symbol("A");
      const A: typeof Z = Z;
      const B: typeof Z = Z;

      expectType<typeof A>().toBeAssignableTo<typeof B>();
      expectType<typeof A>().not.toBeAssignableTo<
        // @ts-expect-error
        typeof B
      >();

      const test: typeof B = A as typeof A;
    });

    it("expectType<unique symbol>().toBeAssignableTo<symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toBeAssignableTo<typeof B>();
      expectType<typeof A>().not.toBeAssignableTo<
        // @ts-expect-error
        typeof B
      >();

      const test: typeof B = A as typeof A;
    });

    it("expectType<null>().toBeAssignableTo<null>()", () => {
      expectType<null>().toBeAssignableTo<null>();
      expectType<null>().not.toBeAssignableTo<// @ts-expect-error
      null>();

      const test: null = null as null;
    });

    it("expectType<null>().not.toBeAssignableTo<undefined>()", () => {
      expectType<null>().not.toBeAssignableTo<undefined>();
      expectType<null>().toBeAssignableTo<// @ts-expect-error
      undefined>();

      // @ts-expect-error
      const test: undefined = null as null;
    });

    it("expectType<null>().toBeAssignableTo<any>()", () => {
      expectType<null>().toBeAssignableTo<any>();
      expectType<null>().not.toBeAssignableTo<// @ts-expect-error
      any>();

      const test: any = null as null;
    });

    it("expectType<null>().toBeAssignableTo<unknown>()", () => {
      expectType<null>().toBeAssignableTo<unknown>();
      expectType<null>().not.toBeAssignableTo<// @ts-expect-error
      unknown>();

      const test: unknown = null as null;
    });

    it.skip("expectType<null>().not.toBeAssignableTo<never>()", () => {
      expectType<null>().not.toBeAssignableTo<never>();
      expectType<null>().toBeAssignableTo<// TODO can't @ts-expect-error when the second type is never
      never>();

      // @ts-expect-error
      const test: never = null as null;
    });

    /* eslint-disable @typescript-eslint/no-invalid-void-type -- tests for void */

    it("expectType<null>().not.toBeAssignableTo<void>()", () => {
      expectType<null>().not.toBeAssignableTo<void>();
      expectType<null>().toBeAssignableTo<// @ts-expect-error
      void>();

      // @ts-expect-error
      const test: void = null as null;
    });

    it("expectType<undefined>().toBeAssignableTo<undefined>()", () => {
      expectType<undefined>().toBeAssignableTo<undefined>();
      expectType<undefined>().not.toBeAssignableTo<// @ts-expect-error
      undefined>();

      const test: undefined = undefined as undefined;
    });

    it("expectType<undefined>().not.toBeAssignableTo<null>()", () => {
      expectType<undefined>().not.toBeAssignableTo<null>();
      expectType<undefined>().toBeAssignableTo<// @ts-expect-error
      null>();

      // @ts-expect-error
      const test: null = undefined as undefined;
    });

    it("expectType<undefined>().toBeAssignableTo<any>()", () => {
      expectType<undefined>().toBeAssignableTo<any>();
      expectType<undefined>().not.toBeAssignableTo<// @ts-expect-error
      any>();

      const test: any = undefined as undefined;
    });

    it("expectType<undefined>().toBeAssignableTo<unknown>()", () => {
      expectType<undefined>().toBeAssignableTo<unknown>();
      expectType<undefined>().not.toBeAssignableTo<// @ts-expect-error
      unknown>();

      const test: unknown = undefined as undefined;
    });

    it.skip("expectType<undefined>().not.toBeAssignableTo<never>()", () => {
      expectType<undefined>().not.toBeAssignableTo<never>();
      expectType<undefined>().toBeAssignableTo<// TODO can't @ts-expect-error when the second type is never
      never>();

      // @ts-expect-error
      const test: never = undefined as undefined;
    });

    it("expectType<undefined>().toBeAssignableTo<void>()", () => {
      expectType<undefined>().toBeAssignableTo<void>();
      expectType<undefined>().not.toBeAssignableTo<// @ts-expect-error
      void>();

      const test: void = undefined as undefined;
    });

    it("expectType<any>().toBeAssignableTo<any>()", () => {
      expectType<any>().toBeAssignableTo<any>();
      expectType<any>().not.toBeAssignableTo<// @ts-expect-error
      any>();

      const test: any = {} as any;
    });

    it("expectType<any>().toBeAssignableTo<null>()", () => {
      expectType<any>().toBeAssignableTo<null>();
      expectType<any>().not.toBeAssignableTo<// @ts-expect-error
      null>();

      const test: null = {} as any;
    });

    it("expectType<any>().toBeAssignableTo<undefined>()", () => {
      expectType<any>().toBeAssignableTo<undefined>();
      expectType<any>().not.toBeAssignableTo<// @ts-expect-error
      undefined>();

      const test: undefined = {} as any;
    });

    it("expectType<any>().toBeAssignableTo<unknown>()", () => {
      expectType<any>().toBeAssignableTo<unknown>();
      expectType<any>().not.toBeAssignableTo<// @ts-expect-error
      unknown>();

      const test: unknown = {} as any;
    });

    it.skip("expectType<any>().not.toBeAssignableTo<never>()", () => {
      expectType<any>().not.toBeAssignableTo<never>();
      expectType<any>().toBeAssignableTo<// TODO can't @ts-expect-error when the second type is never
      never>();

      // @ts-expect-error
      const test: never = {} as any;
    });

    it("expectType<any>().toBeAssignableTo<void>()", () => {
      expectType<any>().toBeAssignableTo<void>();
      expectType<any>().not.toBeAssignableTo<// @ts-expect-error
      void>();

      const test: void = {} as any;
    });

    it("expectType<unknown>().toBeAssignableTo<unknown>()", () => {
      expectType<unknown>().toBeAssignableTo<unknown>();
      expectType<unknown>().not.toBeAssignableTo<// @ts-expect-error
      unknown>();

      const test: unknown = {} as unknown;
    });

    it("expectType<unknown>().not.toBeAssignableTo<null>()", () => {
      expectType<unknown>().not.toBeAssignableTo<null>();
      expectType<unknown>().toBeAssignableTo<// @ts-expect-error
      null>();

      // @ts-expect-error
      const test: null = {} as unknown;
    });

    it("expectType<unknown>().not.toBeAssignableTo<undefined>()", () => {
      expectType<unknown>().not.toBeAssignableTo<undefined>();
      expectType<unknown>().toBeAssignableTo<// @ts-expect-error
      undefined>();

      // @ts-expect-error
      const test: undefined = {} as unknown;
    });

    it("expectType<unknown>().toBeAssignableTo<any>()", () => {
      expectType<unknown>().toBeAssignableTo<any>();
      expectType<unknown>().not.toBeAssignableTo<// @ts-expect-error
      any>();

      const test: any = {} as unknown;
    });

    it.skip("expectType<unknown>().not.toBeAssignableTo<never>()", () => {
      expectType<unknown>().not.toBeAssignableTo<never>();
      expectType<unknown>().toBeAssignableTo<// TODO can't @ts-expect-error when the second type is never
      never>();

      // @ts-expect-error
      const test: never = {} as unknown;
    });

    it("expectType<unknown>().not.toBeAssignableTo<void>()", () => {
      expectType<unknown>().not.toBeAssignableTo<void>();
      expectType<unknown>().toBeAssignableTo<// @ts-expect-error
      void>();

      // @ts-expect-error
      const test: void = {} as unknown;
    });

    it("expectType<void>().toBeAssignableTo<void>()", () => {
      expectType<void>().toBeAssignableTo<void>();
      expectType<void>().not.toBeAssignableTo<// @ts-expect-error
      void>();

      const test: void = undefined as void;
    });

    it("expectType<void>().not.toBeAssignableTo<null>()", () => {
      expectType<void>().not.toBeAssignableTo<null>();
      expectType<void>().toBeAssignableTo<// @ts-expect-error
      null>();

      // @ts-expect-error
      const test: null = undefined as void;
    });

    it("expectType<void>().not.toBeAssignableTo<undefined>()", () => {
      expectType<void>().not.toBeAssignableTo<undefined>();
      expectType<void>().toBeAssignableTo<// @ts-expect-error
      undefined>();

      // @ts-expect-error
      const test: undefined = undefined as void;
    });

    it("expectType<void>().toBeAssignableTo<any>()", () => {
      expectType<void>().toBeAssignableTo<any>();
      expectType<void>().not.toBeAssignableTo<// @ts-expect-error
      any>();

      const test: any = undefined as void;
    });

    it("expectType<void>().toBeAssignableTo<unknown>()", () => {
      expectType<void>().toBeAssignableTo<unknown>();
      expectType<void>().not.toBeAssignableTo<// @ts-expect-error
      unknown>();

      const test: unknown = undefined as void;
    });

    it.skip("expectType<void>().not.toBeAssignableTo<never>()", () => {
      expectType<void>().not.toBeAssignableTo<never>();
      expectType<void>().toBeAssignableTo<// TODO can't @ts-expect-error when the second type is never
      never>();

      // @ts-expect-error
      const test: never = undefined as void;
    });

    /* eslint-enable @typescript-eslint/no-invalid-void-type */
    /* eslint-enable @typescript-eslint/no-unused-vars,@typescript-eslint/prefer-as-const */
  });

  describe("toStrictEqual", () => {
    it("expectType<boolean>().toStrictEqual<boolean>()", () => {
      expectType<boolean>().toStrictEqual<boolean>();
      expectType<boolean>().not.toStrictEqual<// @ts-expect-error
      boolean>();
    });

    it("expectType<boolean>().not.toStrictEqual<true>()", () => {
      expectType<boolean>().not.toStrictEqual<true>();
      expectType<boolean>().toStrictEqual<// @ts-expect-error
      true>();
    });

    it("expectType<true>().toStrictEqual<true>()", () => {
      expectType<true>().toStrictEqual<true>();
      expectType<true>().not.toStrictEqual<// @ts-expect-error
      true>();
    });

    it("expectType<true>().not.toStrictEqual<boolean>()", () => {
      expectType<true>().not.toStrictEqual<boolean>();
      expectType<true>().toStrictEqual<// @ts-expect-error
      boolean>();
    });

    it("expectType<number>().toStrictEqual<number>()", () => {
      expectType<number>().toStrictEqual<number>();
      expectType<number>().not.toStrictEqual<// @ts-expect-error
      number>();
    });

    it("expectType<number>().not.toStrictEqual<1>()", () => {
      expectType<number>().not.toStrictEqual<1>();
      expectType<number>().toStrictEqual<// @ts-expect-error
      1>();
    });

    it("expectType<1>().toStrictEqual<1>()", () => {
      expectType<1>().toStrictEqual<1>();
      expectType<1>().not.toStrictEqual<// @ts-expect-error
      1>();
    });

    it("expectType<1>().not.toStrictEqual<number>()", () => {
      expectType<1>().not.toStrictEqual<number>();
      expectType<1>().toStrictEqual<// @ts-expect-error
      number>();
    });

    it("expectType<1>().not.toStrictEqual<1 | 2>()", () => {
      expectType<1>().not.toStrictEqual<1 | 2>();
      expectType<1>().toStrictEqual<
        // @ts-expect-error
        1 | 2
      >();
    });

    it("expectType<1 | 2>().not.toStrictEqual<1>()", () => {
      expectType<1 | 2>().not.toStrictEqual<1>();
      expectType<1 | 2>().toStrictEqual<// @ts-expect-error
      1>();
    });

    it("expectType<string>().toStrictEqual<string>()", () => {
      expectType<string>().toStrictEqual<string>();
      expectType<string>().not.toStrictEqual<// @ts-expect-error
      string>();
    });

    it('expectType<string>().not.toStrictEqual<"foo">()', () => {
      expectType<string>().not.toStrictEqual<"foo">();
      expectType<string>().toStrictEqual<// @ts-expect-error
      "foo">();
    });

    it('expectType<"foo">().toStrictEqual<"foo">()', () => {
      expectType<"foo">().toStrictEqual<"foo">();
      expectType<"foo">().not.toStrictEqual<// @ts-expect-error
      "foo">();
    });

    it('expectType<"foo">().not.toStrictEqual<string>()', () => {
      expectType<"foo">().not.toStrictEqual<string>();
      expectType<"foo">().toStrictEqual<// @ts-expect-error
      string>();
    });

    it('expectType<"foo">().not.toStrictEqual<"foo" | "bar">()', () => {
      expectType<"foo">().not.toStrictEqual<"bar" | "foo">();
      expectType<"foo">().toStrictEqual<
        // @ts-expect-error
        "bar" | "foo"
      >();
    });

    it('expectType<"foo" | "bar">().not.toStrictEqual<"foo">()', () => {
      expectType<"bar" | "foo">().not.toStrictEqual<"foo">();
      expectType<"bar" | "foo">().toStrictEqual<// @ts-expect-error
      "foo">();
    });

    it("expectType<symbol>().toStrictEqual<symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toStrictEqual<typeof B>();
      expectType<typeof A>().not.toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<symbol>().not.toStrictEqual<unique symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B");

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>().toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<unique symbol>().not.toStrictEqual<unique symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B");

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>().toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<unique symbol>().toStrictEqual<(same) unique symbol>()", () => {
      const Z = Symbol("A");
      const A: typeof Z = Z;
      const B: typeof Z = Z;

      expectType<typeof A>().toStrictEqual<typeof B>();
      expectType<typeof A>().not.toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<unique symbol>().not.toStrictEqual<symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B") as symbol;

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>().toStrictEqual<
        // @ts-expect-error
        typeof B
      >();
    });

    it("expectType<null>().toStrictEqual<null>()", () => {
      expectType<null>().toStrictEqual<null>();
      expectType<null>().not.toStrictEqual<// @ts-expect-error
      null>();
    });

    it("expectType<null>().not.toStrictEqual<undefined>()", () => {
      expectType<null>().not.toStrictEqual<undefined>();
      expectType<null>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it("expectType<null>().not.toStrictEqual<any>()", () => {
      expectType<null>().not.toStrictEqual<any>();
      expectType<null>().toStrictEqual<// @ts-expect-error
      any>();
    });

    it("expectType<null>().not.toStrictEqual<unknown>()", () => {
      expectType<null>().not.toStrictEqual<unknown>();
      expectType<null>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it.skip("expectType<null>().not.toStrictEqual<never>()", () => {
      expectType<null>().not.toStrictEqual<never>();
      expectType<null>().toStrictEqual<// TODO can't @ts-expect-error when the second type is never
      never>();
    });

    /* eslint-disable @typescript-eslint/no-invalid-void-type -- tests for void */

    it("expectType<null>().not.toStrictEqual<void>()", () => {
      expectType<null>().not.toStrictEqual<void>();
      expectType<null>().toStrictEqual<// @ts-expect-error
      void>();
    });

    it("expectType<undefined>().toStrictEqual<undefined>()", () => {
      expectType<undefined>().toStrictEqual<undefined>();
      expectType<undefined>().not.toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it("expectType<undefined>().not.toStrictEqual<null>()", () => {
      expectType<undefined>().not.toStrictEqual<null>();
      expectType<undefined>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it("expectType<undefined>().not.toStrictEqual<any>()", () => {
      expectType<undefined>().not.toStrictEqual<any>();
      expectType<undefined>().toStrictEqual<// @ts-expect-error
      any>();
    });

    it("expectType<undefined>().not.toStrictEqual<unknown>()", () => {
      expectType<undefined>().not.toStrictEqual<unknown>();
      expectType<undefined>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it.skip("expectType<undefined>().not.toStrictEqual<never>()", () => {
      expectType<undefined>().not.toStrictEqual<never>();
      expectType<undefined>().toStrictEqual<// TODO can't @ts-expect-error when the second type is never
      never>();
    });

    it("expectType<undefined>().not.toStrictEqual<void>()", () => {
      expectType<undefined>().not.toStrictEqual<void>();
      expectType<undefined>().toStrictEqual<// @ts-expect-error
      void>();
    });

    it("expectType<any>().toStrictEqual<any>()", () => {
      expectType<any>().toStrictEqual<any>();
      expectType<any>().not.toStrictEqual<// @ts-expect-error
      any>();
    });

    it("expectType<any>().not.toStrictEqual<null>()", () => {
      expectType<any>().not.toStrictEqual<null>();
      expectType<any>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it("expectType<any>().not.toStrictEqual<undefined>()", () => {
      expectType<any>().not.toStrictEqual<undefined>();
      expectType<any>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it("expectType<any>().not.toStrictEqual<unknown>()", () => {
      expectType<any>().not.toStrictEqual<unknown>();
      expectType<any>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it.skip("expectType<any>().not.toStrictEqual<never>()", () => {
      expectType<any>().not.toStrictEqual<never>();
      expectType<any>().toStrictEqual<// TODO can't @ts-expect-error when the second type is never
      never>();
    });

    it("expectType<any>().not.toStrictEqual<void>()", () => {
      expectType<any>().not.toStrictEqual<void>();
      expectType<any>().toStrictEqual<// @ts-expect-error
      void>();
    });

    it("expectType<unknown>().toStrictEqual<unknown>()", () => {
      expectType<unknown>().toStrictEqual<unknown>();
      expectType<unknown>().not.toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it("expectType<unknown>().not.toStrictEqual<null>()", () => {
      expectType<unknown>().not.toStrictEqual<null>();
      expectType<unknown>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it("expectType<unknown>().not.toStrictEqual<undefined>()", () => {
      expectType<unknown>().not.toStrictEqual<undefined>();
      expectType<unknown>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it("expectType<unknown>().not.toStrictEqual<any>()", () => {
      expectType<unknown>().not.toStrictEqual<any>();
      expectType<unknown>().toStrictEqual<// @ts-expect-error
      any>();
    });

    it.skip("expectType<unknown>().not.toStrictEqual<never>()", () => {
      expectType<unknown>().not.toStrictEqual<never>();
      expectType<unknown>().toStrictEqual<// TODO can't @ts-expect-error when the second type is never
      never>();
    });

    it("expectType<unknown>().not.toStrictEqual<void>()", () => {
      expectType<unknown>().not.toStrictEqual<void>();
      expectType<unknown>().toStrictEqual<// @ts-expect-error
      void>();
    });

    it("expectType<void>().toStrictEqual<void>()", () => {
      expectType<void>().toStrictEqual<void>();
      expectType<void>().not.toStrictEqual<// @ts-expect-error
      void>();
    });

    it("expectType<void>().not.toStrictEqual<null>()", () => {
      expectType<void>().not.toStrictEqual<null>();
      expectType<void>().toStrictEqual<// @ts-expect-error
      null>();
    });

    it("expectType<void>().not.toStrictEqual<undefined>()", () => {
      expectType<void>().not.toStrictEqual<undefined>();
      expectType<void>().toStrictEqual<// @ts-expect-error
      undefined>();
    });

    it("expectType<void>().not.toStrictEqual<any>()", () => {
      expectType<void>().not.toStrictEqual<any>();
      expectType<void>().toStrictEqual<// @ts-expect-error
      any>();
    });

    it("expectType<void>().not.toStrictEqual<unknown>()", () => {
      expectType<void>().not.toStrictEqual<unknown>();
      expectType<void>().toStrictEqual<// @ts-expect-error
      unknown>();
    });

    it.skip("expectType<void>().not.toStrictEqual<never>()", () => {
      expectType<void>().not.toStrictEqual<never>();
      expectType<void>().toStrictEqual<// TODO can't @ts-expect-error when the second type is never
      never>();
    });

    /* eslint-enable @typescript-eslint/no-invalid-void-type */
  });
});
