/* eslint-disable @typescript-eslint/ban-ts-comment -- we use @ts-expect-error as part of the test suite */
import { describe, it } from "@jest/globals";

import { expectType } from ".";

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
