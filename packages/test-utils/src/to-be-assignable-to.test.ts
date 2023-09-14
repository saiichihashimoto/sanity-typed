/* eslint-disable @typescript-eslint/ban-ts-comment -- we use @ts-expect-error as part of the test suite */
import { describe, it } from "@jest/globals";

import { expectType } from ".";

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
