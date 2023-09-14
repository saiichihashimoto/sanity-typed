/* eslint-disable @typescript-eslint/ban-ts-comment -- we use @ts-expect-error as part of the test suite */
import { describe, expect, it } from "@jest/globals";

import { expectType } from ".";

describe("expectType", () => {
  it(".not inverts the expectation", () => {
    expectType<"foo">().not.toStrictEqual<"bar">();
    expectType<"foo">()
      // @ts-expect-error
      .toStrictEqual<"bar">();

    const typeMatchers = expectType<"foo">();

    // `.not` inverts the type, which we want.
    expectType<typeof typeMatchers>().not.toStrictEqual<
      typeof typeMatchers.not
    >();
    expectType<typeof typeMatchers>() // @ts-expect-error
      .toStrictEqual<typeof typeMatchers.not>();

    // But it's actually the same reference! Since it's all noops during runtime, as long as the types succeed/fail during compile time, we're good.
    expect(typeMatchers).toBe(typeMatchers.not);

    // Since `.not` is the same reference but typed differently, you can chain `.not` as many times as you like.
    expectType<typeof typeMatchers>().toStrictEqual<
      typeof typeMatchers.not.not
    >();
    expectType<typeof typeMatchers>()
      .not // @ts-expect-error
      .toStrictEqual<typeof typeMatchers.not.not>();
  });

  describe("toBeAssignableTo", () => {
    /* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/prefer-as-const -- we set variables to see if they work like the assignables do */

    it("expectType<boolean>().toBeAssignableTo<boolean>()", () => {
      expectType<boolean>().toBeAssignableTo<boolean>();
      expectType<boolean>()
        .not // @ts-expect-error
        .toBeAssignableTo<boolean>();

      const test: boolean = true as boolean;
    });

    it("expectType<boolean>().not.toBeAssignableTo<true>()", () => {
      expectType<boolean>().not.toBeAssignableTo<true>();
      expectType<boolean>()
        // @ts-expect-error
        .toBeAssignableTo<true>();

      // @ts-expect-error
      const test: true = true as boolean;
    });

    it("expectType<true>().toBeAssignableTo<true>()", () => {
      expectType<true>().toBeAssignableTo<true>();
      expectType<true>()
        .not // @ts-expect-error
        .toBeAssignableTo<true>();

      const test: true = true as true;
    });

    it("expectType<true>().toBeAssignableTo<boolean>()", () => {
      expectType<true>().toBeAssignableTo<boolean>();
      expectType<true>()
        .not // @ts-expect-error
        .toBeAssignableTo<true>();

      const test: boolean = true as true;
    });

    it("expectType<number>().toBeAssignableTo<number>()", () => {
      expectType<number>().toBeAssignableTo<number>();
      expectType<number>()
        .not // @ts-expect-error
        .toBeAssignableTo<number>();

      const test: number = 2 as number;
    });

    it("expectType<number>().not.toBeAssignableTo<1>()", () => {
      expectType<number>().not.toBeAssignableTo<1>();
      expectType<number>() // @ts-expect-error
        .toBeAssignableTo<1>();

      // @ts-expect-error
      const test: 1 = 2 as number;
    });

    it("expectType<1>().toBeAssignableTo<1>()", () => {
      expectType<1>().toBeAssignableTo<1>();
      expectType<1>()
        .not // @ts-expect-error
        .toBeAssignableTo<1>();

      const test: 1 = 1 as 1;
    });

    it("expectType<1>().toBeAssignableTo<number>()", () => {
      expectType<1>().toBeAssignableTo<number>();
      expectType<1>()
        .not // @ts-expect-error
        .toBeAssignableTo<number>();

      const test: number = 1 as 1;
    });

    it("expectType<1>().toBeAssignableTo<1 | 2>()", () => {
      expectType<1>().toBeAssignableTo<1 | 2>();
      expectType<1>()
        .not // @ts-expect-error
        .toBeAssignableTo<1 | 2>();

      const test: 1 | 2 = 1 as 1;
    });

    it("expectType<1 | 2>().not.toBeAssignableTo<1>()", () => {
      expectType<1 | 2>().not.toBeAssignableTo<1>();
      expectType<1 | 2>() // @ts-expect-error
        .toBeAssignableTo<1>();

      // @ts-expect-error
      const test: 1 = 1 as 1 | 2;
    });

    it("expectType<string>().toBeAssignableTo<string>()", () => {
      expectType<string>().toBeAssignableTo<string>();
      expectType<string>()
        .not // @ts-expect-error
        .toBeAssignableTo<string>();

      const test: string = "foo" as string;
    });

    it('expectType<string>().not.toBeAssignableTo<"foo">()', () => {
      expectType<string>().not.toBeAssignableTo<"foo">();
      expectType<string>() // @ts-expect-error
        .toBeAssignableTo<"foo">();

      // @ts-expect-error
      const test: "foo" = "foo" as string;
    });

    it('expectType<"foo">().toBeAssignableTo<"foo">()', () => {
      expectType<"foo">().toBeAssignableTo<"foo">();
      expectType<"foo">()
        .not // @ts-expect-error
        .toBeAssignableTo<"foo">();

      const test: "foo" = "foo" as "foo";
    });

    it('expectType<"foo">().toBeAssignableTo<string>()', () => {
      expectType<"foo">().toBeAssignableTo<string>();
      expectType<"foo">()
        .not // @ts-expect-error
        .toBeAssignableTo<string>();

      const test: string = "foo" as "foo";
    });

    it('expectType<"foo">().toBeAssignableTo<"foo" | "bar">()', () => {
      expectType<"foo">().toBeAssignableTo<"bar" | "foo">();
      expectType<"foo">()
        .not // @ts-expect-error
        .toBeAssignableTo<"bar" | "foo">();

      const test: "bar" | "foo" = "foo" as "foo";
    });

    it('expectType<"foo" | "bar">().not.toBeAssignableTo<"foo">()', () => {
      expectType<"bar" | "foo">().not.toBeAssignableTo<"foo">();
      expectType<"bar" | "foo">() // @ts-expect-error
        .toBeAssignableTo<"foo">();

      // @ts-expect-error
      const test: "foo" = "foo" as "bar" | "foo";
    });

    it("expectType<symbol>().toBeAssignableTo<symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toBeAssignableTo<typeof B>();
      expectType<typeof A>()
        .not // @ts-expect-error
        .toBeAssignableTo<typeof B>();

      const test: typeof B = A as typeof A;
    });

    it("expectType<symbol>().not.toBeAssignableTo<unique symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B");

      expectType<typeof A>().not.toBeAssignableTo<typeof B>();
      expectType<typeof A>() // @ts-expect-error
        .toBeAssignableTo<typeof B>();

      // @ts-expect-error
      const test: typeof B = A as typeof A;
    });

    it("expectType<unique symbol>().not.toBeAssignableTo<unique symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B");

      expectType<typeof A>().not.toBeAssignableTo<typeof B>();
      expectType<typeof A>() // @ts-expect-error
        .toBeAssignableTo<typeof B>();

      // @ts-expect-error
      const test: typeof B = A as typeof A;
    });

    it("expectType<unique symbol>().toBeAssignableTo<(same) unique symbol>()", () => {
      const Z = Symbol("A");
      const A: typeof Z = Z;
      const B: typeof Z = Z;

      expectType<typeof A>().toBeAssignableTo<typeof B>();
      expectType<typeof A>()
        .not // @ts-expect-error
        .toBeAssignableTo<typeof B>();

      const test: typeof B = A as typeof A;
    });

    it("expectType<unique symbol>().toBeAssignableTo<symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toBeAssignableTo<typeof B>();
      expectType<typeof A>()
        .not // @ts-expect-error
        .toBeAssignableTo<typeof B>();

      const test: typeof B = A as typeof A;
    });

    it("expectType<{ a: true }>().toBeAssignableTo<{ a: true }>()", () => {
      expectType<{ a: true }>().toBeAssignableTo<{ a: true }>();
      expectType<{ a: true }>()
        .not // @ts-expect-error
        .toBeAssignableTo<{ a: true }>();

      const test: { a: true } = { a: true };
    });

    it("expectType<{ a: true }>().not.toBeAssignableTo<{ b: true }>()", () => {
      expectType<{ a: true }>().not.toBeAssignableTo<{ b: true }>();
      expectType<{ a: true }>()
        // @ts-expect-error
        .toBeAssignableTo<{ b: true }>();

      // @ts-expect-error
      const test: { b: true } = { a: true };
    });

    it("expectType<{ a: true; b: false }>().toBeAssignableTo<{ a: true }>()", () => {
      expectType<{ a: true; b: false }>().toBeAssignableTo<{ a: true }>();
      expectType<{ a: true; b: false }>()
        .not // @ts-expect-error
        .toBeAssignableTo<{ a: true }>();

      const other = { a: true as true, b: false };
      const test: { a: true } = other;
    });

    it("expectType<{ a: true; b: false }>().toBeAssignableTo<{ a: true } & { b: false }>()", () => {
      expectType<{ a: true; b: false }>().toBeAssignableTo<
        { a: true } & { b: false }
      >();
      expectType<{ a: true; b: false }>()
        .not // @ts-expect-error
        .toBeAssignableTo<{ a: true } & { b: false }>();

      const test: { a: true } & { b: false } = { a: true, b: false };
    });

    it("expectType<{ a: true } & { b: false }>().toBeAssignableTo<{ a: true; b: false }>()", () => {
      expectType<{ a: true } & { b: false }>().toBeAssignableTo<{
        a: true;
        b: false;
      }>();
      expectType<{ a: true } & { b: false }>()
        .not // @ts-expect-error
        .toBeAssignableTo<{ a: true; b: false }>();

      const test: { a: true; b: false } = { a: true, b: false } as {
        a: true;
      } & { b: false };
    });

    /* eslint-disable @typescript-eslint/no-invalid-void-type -- tests for void */

    it("expectType<null>().toBeAssignableTo<null>()", () => {
      expectType<null>().toBeAssignableTo<null>();
      expectType<null>()
        .not // @ts-expect-error
        .toBeAssignableTo<null>();

      const test: null = null as null;
    });

    it("expectType<null>().not.toBeAssignableTo<undefined>()", () => {
      expectType<null>().not.toBeAssignableTo<undefined>();
      expectType<null>() // @ts-expect-error
        .toBeAssignableTo<undefined>();

      // @ts-expect-error
      const test: undefined = null as null;
    });

    it("expectType<null>().toBeAssignableTo<any>()", () => {
      expectType<null>().toBeAssignableTo<any>();
      expectType<null>()
        .not // @ts-expect-error
        .toBeAssignableTo<any>();

      const test: any = null as null;
    });

    it("expectType<null>().toBeAssignableTo<unknown>()", () => {
      expectType<null>().toBeAssignableTo<unknown>();
      expectType<null>()
        .not // @ts-expect-error
        .toBeAssignableTo<unknown>();

      const test: unknown = null as null;
    });

    it("expectType<null>().not.toBeAssignableTo<void>()", () => {
      expectType<null>().not.toBeAssignableTo<void>();
      expectType<null>() // @ts-expect-error
        .toBeAssignableTo<void>();

      // @ts-expect-error
      const test: void = null as null;
    });

    it("expectType<null>().not.toBeAssignableTo<never>()", () => {
      expectType<null>().not.toBeAssignableTo<never>();
      expectType<null>() // @ts-expect-error
        .toBeAssignableTo<never>();

      // @ts-expect-error
      const test: never = null as null;
    });

    it("expectType<undefined>().toBeAssignableTo<undefined>()", () => {
      expectType<undefined>().toBeAssignableTo<undefined>();
      expectType<undefined>()
        .not // @ts-expect-error
        .toBeAssignableTo<undefined>();

      const test: undefined = undefined as undefined;
    });

    it("expectType<undefined>().not.toBeAssignableTo<null>()", () => {
      expectType<undefined>().not.toBeAssignableTo<null>();
      expectType<undefined>() // @ts-expect-error
        .toBeAssignableTo<null>();

      // @ts-expect-error
      const test: null = undefined as undefined;
    });

    it("expectType<undefined>().toBeAssignableTo<any>()", () => {
      expectType<undefined>().toBeAssignableTo<any>();
      expectType<undefined>()
        .not // @ts-expect-error
        .toBeAssignableTo<any>();

      const test: any = undefined as undefined;
    });

    it("expectType<undefined>().toBeAssignableTo<unknown>()", () => {
      expectType<undefined>().toBeAssignableTo<unknown>();
      expectType<undefined>()
        .not // @ts-expect-error
        .toBeAssignableTo<unknown>();

      const test: unknown = undefined as undefined;
    });

    it("expectType<undefined>().toBeAssignableTo<void>()", () => {
      expectType<undefined>().toBeAssignableTo<void>();
      expectType<undefined>()
        .not // @ts-expect-error
        .toBeAssignableTo<void>();

      const test: void = undefined as undefined;
    });

    it("expectType<undefined>().not.toBeAssignableTo<never>()", () => {
      expectType<undefined>().not.toBeAssignableTo<never>();
      expectType<undefined>() // @ts-expect-error
        .toBeAssignableTo<never>();

      // @ts-expect-error
      const test: never = undefined as undefined;
    });

    it("expectType<any>().toBeAssignableTo<any>()", () => {
      expectType<any>().toBeAssignableTo<any>();
      expectType<any>()
        .not // @ts-expect-error
        .toBeAssignableTo<any>();

      const test: any = {} as any;
    });

    it("expectType<any>().toBeAssignableTo<null>()", () => {
      expectType<any>().toBeAssignableTo<null>();
      expectType<any>()
        .not // @ts-expect-error
        .toBeAssignableTo<null>();

      const test: null = {} as any;
    });

    it("expectType<any>().toBeAssignableTo<undefined>()", () => {
      expectType<any>().toBeAssignableTo<undefined>();
      expectType<any>()
        .not // @ts-expect-error
        .toBeAssignableTo<undefined>();

      const test: undefined = {} as any;
    });

    it("expectType<any>().toBeAssignableTo<unknown>()", () => {
      expectType<any>().toBeAssignableTo<unknown>();
      expectType<any>()
        .not // @ts-expect-error
        .toBeAssignableTo<unknown>();

      const test: unknown = {} as any;
    });

    it("expectType<any>().toBeAssignableTo<void>()", () => {
      expectType<any>().toBeAssignableTo<void>();
      expectType<any>()
        .not // @ts-expect-error
        .toBeAssignableTo<void>();

      const test: void = {} as any;
    });

    it("expectType<any>().not.toBeAssignableTo<never>()", () => {
      expectType<any>().not.toBeAssignableTo<never>();
      expectType<any>() // @ts-expect-error
        .toBeAssignableTo<never>();

      // @ts-expect-error
      const test: never = {} as any;
    });

    it("expectType<unknown>().toBeAssignableTo<unknown>()", () => {
      expectType<unknown>().toBeAssignableTo<unknown>();
      expectType<unknown>()
        .not // @ts-expect-error
        .toBeAssignableTo<unknown>();

      const test: unknown = {} as unknown;
    });

    it("expectType<unknown>().not.toBeAssignableTo<null>()", () => {
      expectType<unknown>().not.toBeAssignableTo<null>();
      expectType<unknown>() // @ts-expect-error
        .toBeAssignableTo<null>();

      // @ts-expect-error
      const test: null = {} as unknown;
    });

    it("expectType<unknown>().not.toBeAssignableTo<undefined>()", () => {
      expectType<unknown>().not.toBeAssignableTo<undefined>();
      expectType<unknown>() // @ts-expect-error
        .toBeAssignableTo<undefined>();

      // @ts-expect-error
      const test: undefined = {} as unknown;
    });

    it("expectType<unknown>().toBeAssignableTo<any>()", () => {
      expectType<unknown>().toBeAssignableTo<any>();
      expectType<unknown>()
        .not // @ts-expect-error
        .toBeAssignableTo<any>();

      const test: any = {} as unknown;
    });

    it("expectType<unknown>().not.toBeAssignableTo<void>()", () => {
      expectType<unknown>().not.toBeAssignableTo<void>();
      expectType<unknown>() // @ts-expect-error
        .toBeAssignableTo<void>();

      // @ts-expect-error
      const test: void = {} as unknown;
    });

    it("expectType<unknown>().not.toBeAssignableTo<never>()", () => {
      expectType<unknown>().not.toBeAssignableTo<never>();
      expectType<unknown>() // @ts-expect-error
        .toBeAssignableTo<never>();

      // @ts-expect-error
      const test: never = {} as unknown;
    });

    it("expectType<void>().toBeAssignableTo<void>()", () => {
      expectType<void>().toBeAssignableTo<void>();
      expectType<void>()
        .not // @ts-expect-error
        .toBeAssignableTo<void>();

      const test: void = undefined as void;
    });

    it("expectType<void>().not.toBeAssignableTo<null>()", () => {
      expectType<void>().not.toBeAssignableTo<null>();
      expectType<void>() // @ts-expect-error
        .toBeAssignableTo<null>();

      // @ts-expect-error
      const test: null = undefined as void;
    });

    it("expectType<void>().not.toBeAssignableTo<undefined>()", () => {
      expectType<void>().not.toBeAssignableTo<undefined>();
      expectType<void>() // @ts-expect-error
        .toBeAssignableTo<undefined>();

      // @ts-expect-error
      const test: undefined = undefined as void;
    });

    it("expectType<void>().toBeAssignableTo<any>()", () => {
      expectType<void>().toBeAssignableTo<any>();
      expectType<void>()
        .not // @ts-expect-error
        .toBeAssignableTo<any>();

      const test: any = undefined as void;
    });

    it("expectType<void>().toBeAssignableTo<unknown>()", () => {
      expectType<void>().toBeAssignableTo<unknown>();
      expectType<void>()
        .not // @ts-expect-error
        .toBeAssignableTo<unknown>();

      const test: unknown = undefined as void;
    });

    it("expectType<void>().not.toBeAssignableTo<never>()", () => {
      expectType<void>().not.toBeAssignableTo<never>();
      expectType<void>() // @ts-expect-error
        .toBeAssignableTo<never>();

      // @ts-expect-error
      const test: never = {} as void;
    });

    it("expectType<never>().toBeAssignableTo<never>()", () => {
      expectType<never>().toBeAssignableTo<never>();
      expectType<never>()
        .not // @ts-expect-error
        .toBeAssignableTo<never>();

      const test: never = undefined as never;
    });

    it("expectType<never>().toBeAssignableTo<null>()", () => {
      expectType<never>().toBeAssignableTo<null>();
      expectType<never>()
        .not // @ts-expect-error
        .toBeAssignableTo<null>();

      const test: null = undefined as never;
    });

    it("expectType<never>().toBeAssignableTo<undefined>()", () => {
      expectType<never>().toBeAssignableTo<undefined>();
      expectType<never>()
        .not // @ts-expect-error
        .toBeAssignableTo<undefined>();

      const test: undefined = undefined as never;
    });

    it("expectType<never>().toBeAssignableTo<any>()", () => {
      expectType<never>().toBeAssignableTo<any>();
      expectType<never>()
        .not // @ts-expect-error
        .toBeAssignableTo<any>();

      const test: any = undefined as never;
    });

    it("expectType<never>().toBeAssignableTo<unknown>()", () => {
      expectType<never>().toBeAssignableTo<unknown>();
      expectType<never>()
        .not // @ts-expect-error
        .toBeAssignableTo<unknown>();

      const test: unknown = undefined as never;
    });

    it("expectType<never>().toBeAssignableTo<void>()", () => {
      expectType<never>().toBeAssignableTo<void>();
      expectType<never>()
        .not // @ts-expect-error
        .toBeAssignableTo<void>();

      const test: void = undefined as never;
    });

    /* eslint-enable @typescript-eslint/no-invalid-void-type */
    /* eslint-enable @typescript-eslint/no-unused-vars,@typescript-eslint/prefer-as-const */
  });

  describe("toEqual", () => {
    it("expectType<boolean>().toEqual<boolean>()", () => {
      expectType<boolean>().toEqual<boolean>();
      expectType<boolean>()
        .not // @ts-expect-error
        .toEqual<boolean>();
    });

    it("expectType<boolean>().not.toEqual<true>()", () => {
      expectType<boolean>().not.toEqual<true>();
      expectType<boolean>() // @ts-expect-error
        .toEqual<true>();
    });

    it("expectType<true>().toEqual<true>()", () => {
      expectType<true>().toEqual<true>();
      expectType<true>()
        .not // @ts-expect-error
        .toEqual<true>();
    });

    it("expectType<true>().not.toEqual<boolean>()", () => {
      expectType<true>().not.toEqual<boolean>();
      expectType<true>() // @ts-expect-error
        .toEqual<boolean>();
    });

    it("expectType<number>().toEqual<number>()", () => {
      expectType<number>().toEqual<number>();
      expectType<number>()
        .not // @ts-expect-error
        .toEqual<number>();
    });

    it("expectType<number>().not.toEqual<1>()", () => {
      expectType<number>().not.toEqual<1>();
      expectType<number>() // @ts-expect-error
        .toEqual<1>();
    });

    it("expectType<1>().toEqual<1>()", () => {
      expectType<1>().toEqual<1>();
      expectType<1>()
        .not // @ts-expect-error
        .toEqual<1>();
    });

    it("expectType<1>().not.toEqual<number>()", () => {
      expectType<1>().not.toEqual<number>();
      expectType<1>() // @ts-expect-error
        .toEqual<number>();
    });

    it("expectType<1>().not.toEqual<1 | 2>()", () => {
      expectType<1>().not.toEqual<1 | 2>();
      expectType<1>() // @ts-expect-error
        .toEqual<1 | 2>();
    });

    it("expectType<1 | 2>().not.toEqual<1>()", () => {
      expectType<1 | 2>().not.toEqual<1>();
      expectType<1 | 2>() // @ts-expect-error
        .toEqual<1>();
    });

    it("expectType<string>().toEqual<string>()", () => {
      expectType<string>().toEqual<string>();
      expectType<string>()
        .not // @ts-expect-error
        .toEqual<string>();
    });

    it('expectType<string>().not.toEqual<"foo">()', () => {
      expectType<string>().not.toEqual<"foo">();
      expectType<string>() // @ts-expect-error
        .toEqual<"foo">();
    });

    it('expectType<"foo">().toEqual<"foo">()', () => {
      expectType<"foo">().toEqual<"foo">();
      expectType<"foo">()
        .not // @ts-expect-error
        .toEqual<"foo">();
    });

    it('expectType<"foo">().not.toEqual<string>()', () => {
      expectType<"foo">().not.toEqual<string>();
      expectType<"foo">() // @ts-expect-error
        .toEqual<string>();
    });

    it('expectType<"foo">().not.toEqual<"foo" | "bar">()', () => {
      expectType<"foo">().not.toEqual<"bar" | "foo">();
      expectType<"foo">() // @ts-expect-error
        .toEqual<"bar" | "foo">();
    });

    it('expectType<"foo" | "bar">().not.toEqual<"foo">()', () => {
      expectType<"bar" | "foo">().not.toEqual<"foo">();
      expectType<"bar" | "foo">() // @ts-expect-error
        .toEqual<"foo">();
    });

    it("expectType<symbol>().toEqual<symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toEqual<typeof B>();
      expectType<typeof A>()
        .not // @ts-expect-error
        .toEqual<typeof B>();
    });

    it("expectType<symbol>().not.toEqual<unique symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B");

      expectType<typeof A>().not.toEqual<typeof B>();
      expectType<typeof A>() // @ts-expect-error
        .toEqual<typeof B>();
    });

    it("expectType<unique symbol>().not.toEqual<unique symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B");

      expectType<typeof A>().not.toEqual<typeof B>();
      expectType<typeof A>() // @ts-expect-error
        .toEqual<typeof B>();
    });

    it("expectType<unique symbol>().toEqual<(same) unique symbol>()", () => {
      const Z = Symbol("A");
      const A: typeof Z = Z;
      const B: typeof Z = Z;

      expectType<typeof A>().toEqual<typeof B>();
      expectType<typeof A>()
        .not // @ts-expect-error
        .toEqual<typeof B>();
    });

    it("expectType<unique symbol>().not.toEqual<symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B") as symbol;

      expectType<typeof A>().not.toEqual<typeof B>();
      expectType<typeof A>() // @ts-expect-error
        .toEqual<typeof B>();
    });

    it("expectType<{ a: true }>().toEqual<{ a: true }>()", () => {
      expectType<{ a: true }>().toEqual<{ a: true }>();
      expectType<{ a: true }>()
        .not // @ts-expect-error
        .toEqual<{ a: true }>();
    });

    it("expectType<{ a: true }>().not.toEqual<{ b: true }>()", () => {
      expectType<{ a: true }>().not.toEqual<{ b: true }>();
      expectType<{ a: true }>()
        // @ts-expect-error
        .toEqual<{ b: true }>();
    });

    it("expectType<{ a: true; b: false }>().not.toEqual<{ a: true }>()", () => {
      expectType<{ a: true; b: false }>().not.toEqual<{ a: true }>();
      expectType<{ a: true; b: false }>()
        // @ts-expect-error
        .toEqual<{ a: true }>();
    });

    it("expectType<{ a: true; b: false }>().toEqual<{ a: true } & { b: false }>()", () => {
      expectType<{ a: true; b: false }>().toEqual<{ a: true } & { b: false }>();
      expectType<{ a: true; b: false }>()
        .not // @ts-expect-error
        .toEqual<{ a: true } & { b: false }>();
    });

    it("expectType<{ a: true } & { b: false }>().toEqual<{ a: true; b: false }>()", () => {
      expectType<{ a: true } & { b: false }>().toEqual<{ a: true; b: false }>();
      expectType<{ a: true } & { b: false }>()
        .not // @ts-expect-error
        .toEqual<{ a: true; b: false }>();
    });

    /* eslint-disable @typescript-eslint/no-invalid-void-type -- tests for void */

    it("expectType<null>().toEqual<null>()", () => {
      expectType<null>().toEqual<null>();
      expectType<null>()
        .not // @ts-expect-error
        .toEqual<null>();
    });

    it("expectType<null>().not.toEqual<undefined>()", () => {
      expectType<null>().not.toEqual<undefined>();
      expectType<null>() // @ts-expect-error
        .toEqual<undefined>();
    });

    it("expectType<null>().not.toEqual<any>()", () => {
      expectType<null>().not.toEqual<any>();
      expectType<null>() // @ts-expect-error
        .toEqual<any>();
    });

    it("expectType<null>().not.toEqual<unknown>()", () => {
      expectType<null>().not.toEqual<unknown>();
      expectType<null>() // @ts-expect-error
        .toEqual<unknown>();
    });

    it("expectType<null>().not.toEqual<void>()", () => {
      expectType<null>().not.toEqual<void>();
      expectType<null>() // @ts-expect-error
        .toEqual<void>();
    });

    it("expectType<null>().not.toEqual<never>()", () => {
      expectType<null>().not.toEqual<never>();
      expectType<null>() // @ts-expect-error
        .toEqual<never>();
    });

    it("expectType<undefined>().toEqual<undefined>()", () => {
      expectType<undefined>().toEqual<undefined>();
      expectType<undefined>()
        .not // @ts-expect-error
        .toEqual<undefined>();
    });

    it("expectType<undefined>().not.toEqual<null>()", () => {
      expectType<undefined>().not.toEqual<null>();
      expectType<undefined>() // @ts-expect-error
        .toEqual<null>();
    });

    it("expectType<undefined>().not.toEqual<any>()", () => {
      expectType<undefined>().not.toEqual<any>();
      expectType<undefined>() // @ts-expect-error
        .toEqual<any>();
    });

    it("expectType<undefined>().not.toEqual<unknown>()", () => {
      expectType<undefined>().not.toEqual<unknown>();
      expectType<undefined>() // @ts-expect-error
        .toEqual<unknown>();
    });

    it("expectType<undefined>().not.toEqual<void>()", () => {
      expectType<undefined>().not.toEqual<void>();
      expectType<undefined>() // @ts-expect-error
        .toEqual<void>();
    });

    it("expectType<undefined>().not.toEqual<never>()", () => {
      expectType<undefined>().not.toEqual<never>();
      expectType<undefined>() // @ts-expect-error
        .toEqual<never>();
    });

    it("expectType<any>().toEqual<any>()", () => {
      expectType<any>().toEqual<any>();
      expectType<any>()
        .not // @ts-expect-error
        .toEqual<any>();
    });

    it("expectType<any>().not.toEqual<null>()", () => {
      expectType<any>().not.toEqual<null>();
      expectType<any>() // @ts-expect-error
        .toEqual<null>();
    });

    it("expectType<any>().not.toEqual<undefined>()", () => {
      expectType<any>().not.toEqual<undefined>();
      expectType<any>() // @ts-expect-error
        .toEqual<undefined>();
    });

    it("expectType<any>().not.toEqual<unknown>()", () => {
      expectType<any>().not.toEqual<unknown>();
      expectType<any>() // @ts-expect-error
        .toEqual<unknown>();
    });

    it("expectType<any>().not.toEqual<void>()", () => {
      expectType<any>().not.toEqual<void>();
      expectType<any>() // @ts-expect-error
        .toEqual<void>();
    });

    it("expectType<any>().not.toEqual<never>()", () => {
      expectType<any>().not.toEqual<never>();
      expectType<any>() // @ts-expect-error
        .toEqual<never>();
    });

    it("expectType<unknown>().toEqual<unknown>()", () => {
      expectType<unknown>().toEqual<unknown>();
      expectType<unknown>()
        .not // @ts-expect-error
        .toEqual<unknown>();
    });

    it("expectType<unknown>().not.toEqual<null>()", () => {
      expectType<unknown>().not.toEqual<null>();
      expectType<unknown>() // @ts-expect-error
        .toEqual<null>();
    });

    it("expectType<unknown>().not.toEqual<undefined>()", () => {
      expectType<unknown>().not.toEqual<undefined>();
      expectType<unknown>() // @ts-expect-error
        .toEqual<undefined>();
    });

    it("expectType<unknown>().not.toEqual<any>()", () => {
      expectType<unknown>().not.toEqual<any>();
      expectType<unknown>() // @ts-expect-error
        .toEqual<any>();
    });

    it("expectType<unknown>().not.toEqual<void>()", () => {
      expectType<unknown>().not.toEqual<void>();
      expectType<unknown>() // @ts-expect-error
        .toEqual<void>();
    });

    it("expectType<unknown>().not.toEqual<never>()", () => {
      expectType<unknown>().not.toEqual<never>();
      expectType<unknown>() // @ts-expect-error
        .toEqual<never>();
    });

    it("expectType<void>().toEqual<void>()", () => {
      expectType<void>().toEqual<void>();
      expectType<void>()
        .not // @ts-expect-error
        .toEqual<void>();
    });

    it("expectType<void>().not.toEqual<null>()", () => {
      expectType<void>().not.toEqual<null>();
      expectType<void>() // @ts-expect-error
        .toEqual<null>();
    });

    it("expectType<void>().not.toEqual<undefined>()", () => {
      expectType<void>().not.toEqual<undefined>();
      expectType<void>() // @ts-expect-error
        .toEqual<undefined>();
    });

    it("expectType<void>().not.toEqual<any>()", () => {
      expectType<void>().not.toEqual<any>();
      expectType<void>() // @ts-expect-error
        .toEqual<any>();
    });

    it("expectType<void>().not.toEqual<unknown>()", () => {
      expectType<void>().not.toEqual<unknown>();
      expectType<void>() // @ts-expect-error
        .toEqual<unknown>();
    });

    it("expectType<void>().not.toEqual<never>()", () => {
      expectType<void>().not.toEqual<never>();
      expectType<void>() // @ts-expect-error
        .toEqual<never>();
    });

    it("expectType<never>().toEqual<never>()", () => {
      expectType<never>().toEqual<never>();
      expectType<never>()
        .not // @ts-expect-error
        .toEqual<never>();
    });

    it("expectType<never>().not.toEqual<null>()", () => {
      expectType<never>().not.toEqual<null>();
      expectType<never>() // @ts-expect-error
        .toEqual<null>();
    });

    it("expectType<never>().not.toEqual<undefined>()", () => {
      expectType<never>().not.toEqual<undefined>();
      expectType<never>() // @ts-expect-error
        .toEqual<undefined>();
    });

    it("expectType<never>().not.toEqual<any>()", () => {
      expectType<never>().not.toEqual<any>();
      expectType<never>() // @ts-expect-error
        .toEqual<any>();
    });

    it("expectType<never>().not.toEqual<unknown>()", () => {
      expectType<never>().not.toEqual<unknown>();
      expectType<never>() // @ts-expect-error
        .toEqual<unknown>();
    });

    it("expectType<never>().not.toEqual<void>()", () => {
      expectType<never>().not.toEqual<void>();
      expectType<never>() // @ts-expect-error
        .toEqual<void>();
    });

    /* eslint-enable @typescript-eslint/no-invalid-void-type */
  });

  describe("toStrictEqual", () => {
    it("expectType<boolean>().toStrictEqual<boolean>()", () => {
      expectType<boolean>().toStrictEqual<boolean>();
      expectType<boolean>()
        .not // @ts-expect-error
        .toStrictEqual<boolean>();
    });

    it("expectType<boolean>().not.toStrictEqual<true>()", () => {
      expectType<boolean>().not.toStrictEqual<true>();
      expectType<boolean>() // @ts-expect-error
        .toStrictEqual<true>();
    });

    it("expectType<true>().toStrictEqual<true>()", () => {
      expectType<true>().toStrictEqual<true>();
      expectType<true>()
        .not // @ts-expect-error
        .toStrictEqual<true>();
    });

    it("expectType<true>().not.toStrictEqual<boolean>()", () => {
      expectType<true>().not.toStrictEqual<boolean>();
      expectType<true>() // @ts-expect-error
        .toStrictEqual<boolean>();
    });

    it("expectType<number>().toStrictEqual<number>()", () => {
      expectType<number>().toStrictEqual<number>();
      expectType<number>()
        .not // @ts-expect-error
        .toStrictEqual<number>();
    });

    it("expectType<number>().not.toStrictEqual<1>()", () => {
      expectType<number>().not.toStrictEqual<1>();
      expectType<number>() // @ts-expect-error
        .toStrictEqual<1>();
    });

    it("expectType<1>().toStrictEqual<1>()", () => {
      expectType<1>().toStrictEqual<1>();
      expectType<1>()
        .not // @ts-expect-error
        .toStrictEqual<1>();
    });

    it("expectType<1>().not.toStrictEqual<number>()", () => {
      expectType<1>().not.toStrictEqual<number>();
      expectType<1>() // @ts-expect-error
        .toStrictEqual<number>();
    });

    it("expectType<1>().not.toStrictEqual<1 | 2>()", () => {
      expectType<1>().not.toStrictEqual<1 | 2>();
      expectType<1>() // @ts-expect-error
        .toStrictEqual<1 | 2>();
    });

    it("expectType<1 | 2>().not.toStrictEqual<1>()", () => {
      expectType<1 | 2>().not.toStrictEqual<1>();
      expectType<1 | 2>() // @ts-expect-error
        .toStrictEqual<1>();
    });

    it("expectType<string>().toStrictEqual<string>()", () => {
      expectType<string>().toStrictEqual<string>();
      expectType<string>()
        .not // @ts-expect-error
        .toStrictEqual<string>();
    });

    it('expectType<string>().not.toStrictEqual<"foo">()', () => {
      expectType<string>().not.toStrictEqual<"foo">();
      expectType<string>() // @ts-expect-error
        .toStrictEqual<"foo">();
    });

    it('expectType<"foo">().toStrictEqual<"foo">()', () => {
      expectType<"foo">().toStrictEqual<"foo">();
      expectType<"foo">()
        .not // @ts-expect-error
        .toStrictEqual<"foo">();
    });

    it('expectType<"foo">().not.toStrictEqual<string>()', () => {
      expectType<"foo">().not.toStrictEqual<string>();
      expectType<"foo">() // @ts-expect-error
        .toStrictEqual<string>();
    });

    it('expectType<"foo">().not.toStrictEqual<"foo" | "bar">()', () => {
      expectType<"foo">().not.toStrictEqual<"bar" | "foo">();
      expectType<"foo">() // @ts-expect-error
        .toStrictEqual<"bar" | "foo">();
    });

    it('expectType<"foo" | "bar">().not.toStrictEqual<"foo">()', () => {
      expectType<"bar" | "foo">().not.toStrictEqual<"foo">();
      expectType<"bar" | "foo">() // @ts-expect-error
        .toStrictEqual<"foo">();
    });

    it("expectType<symbol>().toStrictEqual<symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B") as symbol;

      expectType<typeof A>().toStrictEqual<typeof B>();
      expectType<typeof A>()
        .not // @ts-expect-error
        .toStrictEqual<typeof B>();
    });

    it("expectType<symbol>().not.toStrictEqual<unique symbol>()", () => {
      const A = Symbol("A") as symbol;
      const B = Symbol("B");

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>() // @ts-expect-error
        .toStrictEqual<typeof B>();
    });

    it("expectType<unique symbol>().not.toStrictEqual<unique symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B");

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>() // @ts-expect-error
        .toStrictEqual<typeof B>();
    });

    it("expectType<unique symbol>().toStrictEqual<(same) unique symbol>()", () => {
      const Z = Symbol("A");
      const A: typeof Z = Z;
      const B: typeof Z = Z;

      expectType<typeof A>().toStrictEqual<typeof B>();
      expectType<typeof A>()
        .not // @ts-expect-error
        .toStrictEqual<typeof B>();
    });

    it("expectType<unique symbol>().not.toStrictEqual<symbol>()", () => {
      const A = Symbol("A");
      const B = Symbol("B") as symbol;

      expectType<typeof A>().not.toStrictEqual<typeof B>();
      expectType<typeof A>() // @ts-expect-error
        .toStrictEqual<typeof B>();
    });

    it("expectType<{ a: true }>().toStrictEqual<{ a: true }>()", () => {
      expectType<{ a: true }>().toStrictEqual<{ a: true }>();
      expectType<{ a: true }>()
        .not // @ts-expect-error
        .toStrictEqual<{ a: true }>();
    });

    it("expectType<{ a: true }>().not.toStrictEqual<{ b: true }>()", () => {
      expectType<{ a: true }>().not.toStrictEqual<{ b: true }>();
      expectType<{ a: true }>()
        // @ts-expect-error
        .toStrictEqual<{ b: true }>();
    });

    it("expectType<{ a: true; b: false }>().not.toStrictEqual<{ a: true }>()", () => {
      expectType<{ a: true; b: false }>().not.toStrictEqual<{ a: true }>();
      expectType<{ a: true; b: false }>()
        // @ts-expect-error
        .toStrictEqual<{ a: true }>();
    });

    it("expectType<{ a: true; b: false }>().not.toStrictEqual<{ a: true } & { b: false }>()", () => {
      expectType<{ a: true; b: false }>().not.toStrictEqual<
        { a: true } & { b: false }
      >();
      expectType<{ a: true; b: false }>()
        // @ts-expect-error
        .toStrictEqual<{ a: true } & { b: false }>();
    });

    it("expectType<{ a: true } & { b: false }>().not.toStrictEqual<{ a: true; b: false }>()", () => {
      expectType<{ a: true } & { b: false }>().not.toStrictEqual<{
        a: true;
        b: false;
      }>();
      expectType<{ a: true } & { b: false }>()
        // @ts-expect-error
        .toStrictEqual<{ a: true; b: false }>();
    });

    /* eslint-disable @typescript-eslint/no-invalid-void-type -- tests for void */

    it("expectType<null>().toStrictEqual<null>()", () => {
      expectType<null>().toStrictEqual<null>();
      expectType<null>()
        .not // @ts-expect-error
        .toStrictEqual<null>();
    });

    it("expectType<null>().not.toStrictEqual<undefined>()", () => {
      expectType<null>().not.toStrictEqual<undefined>();
      expectType<null>() // @ts-expect-error
        .toStrictEqual<undefined>();
    });

    it("expectType<null>().not.toStrictEqual<any>()", () => {
      expectType<null>().not.toStrictEqual<any>();
      expectType<null>() // @ts-expect-error
        .toStrictEqual<any>();
    });

    it("expectType<null>().not.toStrictEqual<unknown>()", () => {
      expectType<null>().not.toStrictEqual<unknown>();
      expectType<null>() // @ts-expect-error
        .toStrictEqual<unknown>();
    });

    it("expectType<null>().not.toStrictEqual<void>()", () => {
      expectType<null>().not.toStrictEqual<void>();
      expectType<null>() // @ts-expect-error
        .toStrictEqual<void>();
    });

    it("expectType<null>().not.toStrictEqual<never>()", () => {
      expectType<null>().not.toStrictEqual<never>();
      expectType<null>() // @ts-expect-error
        .toStrictEqual<never>();
    });

    it("expectType<undefined>().toStrictEqual<undefined>()", () => {
      expectType<undefined>().toStrictEqual<undefined>();
      expectType<undefined>()
        .not // @ts-expect-error
        .toStrictEqual<undefined>();
    });

    it("expectType<undefined>().not.toStrictEqual<null>()", () => {
      expectType<undefined>().not.toStrictEqual<null>();
      expectType<undefined>() // @ts-expect-error
        .toStrictEqual<null>();
    });

    it("expectType<undefined>().not.toStrictEqual<any>()", () => {
      expectType<undefined>().not.toStrictEqual<any>();
      expectType<undefined>() // @ts-expect-error
        .toStrictEqual<any>();
    });

    it("expectType<undefined>().not.toStrictEqual<unknown>()", () => {
      expectType<undefined>().not.toStrictEqual<unknown>();
      expectType<undefined>() // @ts-expect-error
        .toStrictEqual<unknown>();
    });

    it("expectType<undefined>().not.toStrictEqual<void>()", () => {
      expectType<undefined>().not.toStrictEqual<void>();
      expectType<undefined>() // @ts-expect-error
        .toStrictEqual<void>();
    });

    it("expectType<undefined>().not.toStrictEqual<never>()", () => {
      expectType<undefined>().not.toStrictEqual<never>();
      expectType<undefined>() // @ts-expect-error
        .toStrictEqual<never>();
    });

    it("expectType<any>().toStrictEqual<any>()", () => {
      expectType<any>().toStrictEqual<any>();
      expectType<any>()
        .not // @ts-expect-error
        .toStrictEqual<any>();
    });

    it("expectType<any>().not.toStrictEqual<null>()", () => {
      expectType<any>().not.toStrictEqual<null>();
      expectType<any>() // @ts-expect-error
        .toStrictEqual<null>();
    });

    it("expectType<any>().not.toStrictEqual<undefined>()", () => {
      expectType<any>().not.toStrictEqual<undefined>();
      expectType<any>() // @ts-expect-error
        .toStrictEqual<undefined>();
    });

    it("expectType<any>().not.toStrictEqual<unknown>()", () => {
      expectType<any>().not.toStrictEqual<unknown>();
      expectType<any>() // @ts-expect-error
        .toStrictEqual<unknown>();
    });

    it("expectType<any>().not.toStrictEqual<void>()", () => {
      expectType<any>().not.toStrictEqual<void>();
      expectType<any>() // @ts-expect-error
        .toStrictEqual<void>();
    });

    it("expectType<any>().not.toStrictEqual<never>()", () => {
      expectType<any>().not.toStrictEqual<never>();
      expectType<any>() // @ts-expect-error
        .toStrictEqual<never>();
    });

    it("expectType<unknown>().toStrictEqual<unknown>()", () => {
      expectType<unknown>().toStrictEqual<unknown>();
      expectType<unknown>()
        .not // @ts-expect-error
        .toStrictEqual<unknown>();
    });

    it("expectType<unknown>().not.toStrictEqual<null>()", () => {
      expectType<unknown>().not.toStrictEqual<null>();
      expectType<unknown>() // @ts-expect-error
        .toStrictEqual<null>();
    });

    it("expectType<unknown>().not.toStrictEqual<undefined>()", () => {
      expectType<unknown>().not.toStrictEqual<undefined>();
      expectType<unknown>() // @ts-expect-error
        .toStrictEqual<undefined>();
    });

    it("expectType<unknown>().not.toStrictEqual<any>()", () => {
      expectType<unknown>().not.toStrictEqual<any>();
      expectType<unknown>() // @ts-expect-error
        .toStrictEqual<any>();
    });

    it("expectType<unknown>().not.toStrictEqual<void>()", () => {
      expectType<unknown>().not.toStrictEqual<void>();
      expectType<unknown>() // @ts-expect-error
        .toStrictEqual<void>();
    });

    it("expectType<unknown>().not.toStrictEqual<never>()", () => {
      expectType<unknown>().not.toStrictEqual<never>();
      expectType<unknown>() // @ts-expect-error
        .toStrictEqual<never>();
    });

    it("expectType<void>().toStrictEqual<void>()", () => {
      expectType<void>().toStrictEqual<void>();
      expectType<void>()
        .not // @ts-expect-error
        .toStrictEqual<void>();
    });

    it("expectType<void>().not.toStrictEqual<null>()", () => {
      expectType<void>().not.toStrictEqual<null>();
      expectType<void>() // @ts-expect-error
        .toStrictEqual<null>();
    });

    it("expectType<void>().not.toStrictEqual<undefined>()", () => {
      expectType<void>().not.toStrictEqual<undefined>();
      expectType<void>() // @ts-expect-error
        .toStrictEqual<undefined>();
    });

    it("expectType<void>().not.toStrictEqual<any>()", () => {
      expectType<void>().not.toStrictEqual<any>();
      expectType<void>() // @ts-expect-error
        .toStrictEqual<any>();
    });

    it("expectType<void>().not.toStrictEqual<unknown>()", () => {
      expectType<void>().not.toStrictEqual<unknown>();
      expectType<void>() // @ts-expect-error
        .toStrictEqual<unknown>();
    });

    it("expectType<void>().not.toStrictEqual<never>()", () => {
      expectType<void>().not.toStrictEqual<never>();
      expectType<void>() // @ts-expect-error
        .toStrictEqual<never>();
    });

    it("expectType<never>().toStrictEqual<never>()", () => {
      expectType<never>().toStrictEqual<never>();
      expectType<never>()
        .not // @ts-expect-error
        .toStrictEqual<never>();
    });

    it("expectType<never>().not.toStrictEqual<null>()", () => {
      expectType<never>().not.toStrictEqual<null>();
      expectType<never>() // @ts-expect-error
        .toStrictEqual<null>();
    });

    it("expectType<never>().not.toStrictEqual<undefined>()", () => {
      expectType<never>().not.toStrictEqual<undefined>();
      expectType<never>() // @ts-expect-error
        .toStrictEqual<undefined>();
    });

    it("expectType<never>().not.toStrictEqual<any>()", () => {
      expectType<never>().not.toStrictEqual<any>();
      expectType<never>() // @ts-expect-error
        .toStrictEqual<any>();
    });

    it("expectType<never>().not.toStrictEqual<unknown>()", () => {
      expectType<never>().not.toStrictEqual<unknown>();
      expectType<never>() // @ts-expect-error
        .toStrictEqual<unknown>();
    });

    it("expectType<never>().not.toStrictEqual<void>()", () => {
      expectType<never>().not.toStrictEqual<void>();
      expectType<never>() // @ts-expect-error
        .toStrictEqual<void>();
    });

    /* eslint-enable @typescript-eslint/no-invalid-void-type */
  });
});
