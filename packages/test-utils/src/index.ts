import type { ConditionalExcept, Simplify } from "type-fest";

declare const EXPECTED: unique symbol;
declare const RECEIVED: unique symbol;

type Negate<Value extends boolean> = Value extends true ? false : true;

// https://twitter.com/mattpocockuk/status/1646452585006604291
type StrictEqual<Expected, Received> = (<T>() => T extends Expected
  ? 1
  : 2) extends <T>() => T extends Received ? 1 : 2
  ? true
  : false;

type StrictDiff<Expected, Received> = StrictEqual<
  Expected,
  Received
> extends true
  ? never
  : Expected extends boolean | number | string | null | undefined
  ? {
      [EXPECTED]: Expected;
      [RECEIVED]: Received;
    }
  : Expected extends (infer ExpectedItem)[]
  ? Received extends (infer ReceivedItem)[]
    ? StrictEqual<Expected, Received> extends true
      ? never
      : StrictDiff<ExpectedItem, ReceivedItem>[]
    : {
        [EXPECTED]: Expected;
        [RECEIVED]: Received;
      }
  : Expected extends { [key in infer ExpectedKey extends string]?: any }
  ? Received extends { [key in infer ReceivedKey extends string]?: any }
    ? StrictEqual<Expected, Received> extends true
      ? never
      : Simplify<
          ConditionalExcept<
            {
              [key in ExpectedKey | ReceivedKey]: key extends ExpectedKey
                ? key extends ReceivedKey
                  ? StrictDiff<Expected[key], Received[key]>
                  : {
                      [EXPECTED]: Expected[key];
                    }
                : {
                    [RECEIVED]: Received[key & ReceivedKey];
                  };
            },
            never
          >
        >
    : {
        [EXPECTED]: Expected;
        [RECEIVED]: Received;
      }
  : {
      [EXPECTED]: Expected;
      [RECEIVED]: Received;
    };

type ToStrictEqual<Expected, Received, Inverted extends boolean> = StrictEqual<
  Expected,
  Received
> extends Negate<Inverted>
  ? any
  : StrictEqual<Received, any> extends true
  ? // Typescript can only create errors when a type mismatch occurs, which is why TypeMatchers has Received extends ToStrictEqual<Expected, Received, Inverted>
    // The is generally fine, unless Received is `any`, because it can be assigned to anything.
    // Anything except `never`.
    never
  : {
      [EXPECTED]: Expected;
      [RECEIVED]: Received;
    };

type AssignableTo<Expected, Received> = [Expected] extends [Received]
  ? true
  : false;

type ToBeAssignableTo<
  Expected,
  Received,
  Inverted extends boolean
> = AssignableTo<Expected, Received> extends Negate<Inverted>
  ? any
  : StrictEqual<Received, any> extends true
  ? // Typescript can only create errors when a type mismatch occurs, which is why TypeMatchers has Received extends ToStrictEqual<Expected, Received, Inverted>
    // The is generally fine, unless Received is `any`, because it can be assigned to anything.
    // Anything except `never`.
    never
  : {
      [EXPECTED]: Expected;
      [RECEIVED]: Received;
    };

// https://twitter.com/mattpocockuk/status/1625173887590842369
declare const inverted: unique symbol;

type NeverTypeMatchers = {
  toBeNever: () => void;
};

type NonNeverTypeMatchers<Expected, Inverted extends boolean = false> = {
  [inverted]: Inverted;
  /** Inverse next matcher. If you know how to test something, .not lets you test its opposite. */
  not: NonNeverTypeMatchers<Expected, Negate<Inverted>>;
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
  toBeAssignableTo: <
    Received extends ToBeAssignableTo<Expected, Received, Inverted>
  >() => void;
  /**
   * Checks if Expected and Received are exactly the same type.
   *
   * @link https://twitter.com/mattpocockuk/status/1646452585006604291
   */
  toStrictEqual: <
    Received extends ToStrictEqual<Expected, Received, Inverted>
  >() => StrictDiff<Expected, Received> extends never
    ? void
    : StrictDiff<Expected, Received>;
};

type TypeMatchers<Expected> = StrictEqual<Expected, never> extends true
  ? NeverTypeMatchers
  : NonNeverTypeMatchers<Expected>;

export const expectType = <Expected>() => {
  const valWithoutNot: Omit<
    NeverTypeMatchers & NonNeverTypeMatchers<Expected>,
    typeof inverted | "not"
  > = {
    toBeAssignableTo: () => {},
    toBeNever: () => {},
    toStrictEqual: <Received>() =>
      undefined as unknown as StrictDiff<Expected, Received> extends never
        ? void
        : StrictDiff<Expected, Received>,
  };

  const val = valWithoutNot as NeverTypeMatchers &
    NonNeverTypeMatchers<Expected>;

  // eslint-disable-next-line fp/no-mutation -- recursion requires mutation
  val.not = val as unknown as typeof val.not;

  return val as TypeMatchers<Expected>;
};
