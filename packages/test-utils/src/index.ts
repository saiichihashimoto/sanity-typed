import type { IsEqual, Simplify } from "type-fest";

declare const EXPECTED: unique symbol;
declare const RECEIVED: unique symbol;

type Negate<Value extends boolean> = Value extends true ? false : true;

type AssignableTo<Received, Expected> = [Received] extends [Expected]
  ? true
  : false;

// https://twitter.com/mattpocockuk/status/1625173887590842369
declare const inverted: unique symbol;

type TypeMatchers<Received, Inverted extends boolean = false> = {
  [inverted]: Inverted;
  /** Inverse next matcher. If you know how to test something, .not lets you test its opposite. */
  not: TypeMatchers<Received, Negate<Inverted>>;
  /**
   * Checks if Received is assignable to Expected.
   *
   * @example
   * ```typescript
   * // Equivalent Checks:
   * expectType<typeof a>().toBeAssignableTo<B>();
   *
   * const something: B = a;
   * ```
   */
  toBeAssignableTo: <
    Expected extends AssignableTo<Received, Expected> extends Negate<Inverted>
      ? any
      : {
          [EXPECTED]: Expected;
          [RECEIVED]: Received;
        }
  >(
    ...args: AssignableTo<Received, Expected> extends Negate<Inverted>
      ? []
      : [
          error: {
            [EXPECTED]: Expected;
            [RECEIVED]: Received;
          }
        ]
  ) => void;
  // TODO Test ToEqual
  // TODO Make ToEqual recursive
  /**
   * Checks if Received and Expected are exactly the same type after Simplify.
   *
   * Super duper experimental.
   */
  toEqual: <
    Expected extends IsEqual<
      Simplify<Received>,
      Simplify<Expected>
    > extends Negate<Inverted>
      ? any
      : {
          [EXPECTED]: Simplify<Expected>;
          [RECEIVED]: Simplify<Received>;
        }
  >(
    ...args: IsEqual<
      Simplify<Received>,
      Simplify<Expected>
    > extends Negate<Inverted>
      ? []
      : [
          error: {
            [EXPECTED]: Simplify<Expected>;
            [RECEIVED]: Simplify<Received>;
          }
        ]
  ) => void;
  /**
   * Checks if Received and Expected are exactly the same type.
   */
  toStrictEqual: <
    Expected extends IsEqual<Received, Expected> extends Negate<Inverted>
      ? any
      : {
          [EXPECTED]: Expected;
          [RECEIVED]: Received;
        }
  >(
    ...args: IsEqual<Received, Expected> extends Negate<Inverted>
      ? []
      : [
          error: {
            [EXPECTED]: Expected;
            [RECEIVED]: Received;
          }
        ]
  ) => void;
};

export const expectType = <Received>() => {
  const valWithoutNot: Omit<TypeMatchers<Received>, typeof inverted | "not"> = {
    toBeAssignableTo: () => {},
    toEqual: () => {},
    toStrictEqual: () => {},
  };

  const val = valWithoutNot as TypeMatchers<Received>;

  // eslint-disable-next-line fp/no-mutation -- recursion requires mutation
  val.not = val as unknown as typeof val.not;

  return val;
};
