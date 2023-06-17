// TODO Release expect-type as it's own package

declare const EXPECTED: unique symbol;
declare const RECEIVED: unique symbol;

type ToBeAssignableTo<Expected, Received, Inverted extends boolean> = [
  Expected
] extends [Received]
  ? Inverted extends false
    ? any
    : {
        [EXPECTED]: { not: Expected };
        [RECEIVED]: Received;
      }
  : Inverted extends true
  ? any
  : {
      [EXPECTED]: Expected;
      [RECEIVED]: Received;
    };

// https://twitter.com/mattpocockuk/status/1646452585006604291
type ToStrictEqual<Expected, Received, Inverted extends boolean> = (<
  T
>() => T extends Expected ? 1 : 2) extends <T>() => T extends Received ? 1 : 2
  ? Inverted extends false
    ? any
    : {
        [EXPECTED]: { not: Expected };
        [RECEIVED]: Received;
      }
  : Inverted extends true
  ? any
  : {
      [EXPECTED]: Expected;
      [RECEIVED]: Received;
    };

// https://twitter.com/mattpocockuk/status/1625173887590842369
const inverted: unique symbol = Symbol("Inverted Brand");

type TypeMatchers<Expected, Inverted extends boolean = false> = {
  [inverted]: Inverted;
  /** Inverse next matcher. If you know how to test something, .not lets you test its opposite. */
  not: TypeMatchers<Expected, Inverted extends true ? false : true>;
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
  >() => void;
};

export const expectType = <Expected>() => {
  const valWithoutNot: Omit<TypeMatchers<Expected>, "not"> = {
    [inverted]: undefined as unknown as false,
    toBeAssignableTo: () => {},
    toStrictEqual: () => {},
  };

  const val = valWithoutNot as TypeMatchers<Expected>;

  // eslint-disable-next-line fp/no-mutation -- recursion requires mutation
  val.not = val as unknown as typeof val.not;

  return val;
};
