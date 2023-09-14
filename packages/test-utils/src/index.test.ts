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
});
