import type { IsAny, IsEqual, IsNever } from "type-fest";

declare const EXPECTED: unique symbol;
declare const RECEIVED: unique symbol;

type Negate<Value extends boolean> = Value extends true ? false : true;

declare const README: unique symbol;

type ToStrictEqual<Received, Inverted extends boolean> = <
  Expected extends IsEqual<Received, Expected> extends Negate<Inverted>
    ? any
    : IsAny<Expected> extends true
    ? // Typescript can only create errors when a type mismatch occurs, which is why TypeMatchers has Expected extends ToStrictEqual<Received, Expected, Inverted>
      // The is generally fine, unless Expected is `any`, because it can be assigned to anything.
      // Anything except `never`.
      never
    : {
        [EXPECTED]: Expected;
        [RECEIVED]: Received;
      }
>(
  ...args: IsNever<Expected> extends false
    ? []
    : [
        warning: {
          [README]: "⛔️ The provided type should never be `never` ⛔️";
        }
      ]
) => void;

type AssignableTo<Received, Expected> = [Received] extends [Expected]
  ? true
  : false;

type ToBeAssignableTo<Received, Inverted extends boolean> = <
  Expected extends AssignableTo<Received, Expected> extends Negate<Inverted>
    ? any
    : IsAny<Expected> extends true
    ? // Typescript can only create errors when a type mismatch occurs, which is why TypeMatchers has Expected extends ToStrictEqual<Received, Expected, Inverted>
      // The is generally fine, unless Expected is `any`, because it can be assigned to anything.
      // Anything except `never`.
      never
    : {
        [EXPECTED]: Expected;
        [RECEIVED]: Received;
      }
>(
  ...args: IsNever<Expected> extends false
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
  toBeAssignableTo: ToBeAssignableTo<Received, Inverted>;
  /**
   * Checks if Received and Expected are exactly the same type.
   *
   * @link https://twitter.com/mattpocockuk/status/1646452585006604291
   */
  toStrictEqual: ToStrictEqual<Received, Inverted>;
};

export const expectType = <Received>() => {
  const valWithoutNot: Omit<
    NeverTypeMatchers & TypeMatchers<Received>,
    typeof inverted | "not"
  > = {
    toBeAssignableTo: () => {},
    toBeNever: () => {},
    toStrictEqual: () => {},
  };

  const val = valWithoutNot as NeverTypeMatchers & TypeMatchers<Received>;

  // eslint-disable-next-line fp/no-mutation -- recursion requires mutation
  val.not = val as unknown as typeof val.not;

  return val as IsNever<Received> extends true
    ? NeverTypeMatchers
    : TypeMatchers<Received>;
};
