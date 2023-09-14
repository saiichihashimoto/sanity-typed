/* eslint-disable @typescript-eslint/ban-ts-comment -- we use @ts-expect-error as part of the test suite */
import { describe, it } from "@jest/globals";

import { expectType } from ".";

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
