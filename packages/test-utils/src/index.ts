import type { IsAny, IsEqual, IsNever } from "type-fest";

declare const EXPECTED: unique symbol;
declare const RECEIVED: unique symbol;

type Negate<Value extends boolean> = Value extends true ? false : true;

declare const README: unique symbol;

type ToStrictEqual<Expected, Inverted extends boolean> = <
  Received extends IsEqual<Expected, Received> extends Negate<Inverted>
    ? any
    : IsAny<Received> extends true
    ? // Typescript can only create errors when a type mismatch occurs, which is why TypeMatchers has Received extends ToStrictEqual<Expected, Received, Inverted>
      // The is generally fine, unless Received is `any`, because it can be assigned to anything.
      // Anything except `never`.
      never
    : {
        [EXPECTED]: Expected;
        [RECEIVED]: Received;
      }
>(
  ...args: IsNever<Received> extends false
    ? []
    : [
        warning: {
          [README]: "⛔️ The provided type should never be `never` ⛔️";
        }
      ]
) => void;

type AssignableTo<Expected, Received> = [Expected] extends [Received]
  ? true
  : false;

type ToBeAssignableTo<Expected, Inverted extends boolean> = <
  Received extends AssignableTo<Expected, Received> extends Negate<Inverted>
    ? any
    : IsAny<Received> extends true
    ? // Typescript can only create errors when a type mismatch occurs, which is why TypeMatchers has Received extends ToStrictEqual<Expected, Received, Inverted>
      // The is generally fine, unless Received is `any`, because it can be assigned to anything.
      // Anything except `never`.
      never
    : {
        [EXPECTED]: Expected;
        [RECEIVED]: Received;
      }
>(
  ...args: IsNever<Received> extends false
    ? []
    : [
        warning: {
          [README]: "⛔️ The provided type should never be `never` ⛔️";
        }
      ]
) => void;

// https://twitter.com/mattpocockuk/status/1625173887590842369
declare const inverted: unique symbol;

type NeverTypeMatchers = {
  toBeNever: () => void;
};

type TypeMatchers<Expected, Inverted extends boolean = false> = {
  [inverted]: Inverted;
  /** Inverse next matcher. If you know how to test something, .not lets you test its opposite. */
  not: TypeMatchers<Expected, Negate<Inverted>>;
  /**
   * Checks if Expected is assignable to Received.
   *
   * @example
   * ```typescript
   * // Equivalent Checks:
   * expectType<typeof a>().toBeAssignableTo<B>();
   *
   * const something: B = a;
   * ```
   */
  toBeAssignableTo: ToBeAssignableTo<Expected, Inverted>;
  /**
   * Checks if Expected and Received are exactly the same type.
   *
   * @link https://twitter.com/mattpocockuk/status/1646452585006604291
   */
  toStrictEqual: ToStrictEqual<Expected, Inverted>;
};

export const expectType = <Expected>() => {
  const valWithoutNot: Omit<
    NeverTypeMatchers & TypeMatchers<Expected>,
    typeof inverted | "not"
  > = {
    toBeAssignableTo: () => {},
    toBeNever: () => {},
    toStrictEqual: () => {},
  };

  const val = valWithoutNot as NeverTypeMatchers & TypeMatchers<Expected>;

  // eslint-disable-next-line fp/no-mutation -- recursion requires mutation
  val.not = val as unknown as typeof val.not;

  return val as IsNever<Expected> extends true
    ? NeverTypeMatchers
    : TypeMatchers<Expected>;
};
