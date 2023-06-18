// TODO Release expect-type as it's own package

declare const EXPECTED: unique symbol;
declare const RECEIVED: unique symbol;

// https://twitter.com/mattpocockuk/status/1646452585006604291
type StrictEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? true
  : false;

type ToStrictEqual<Expected, Received, Inverted extends boolean> = StrictEqual<
  Expected,
  Received
> extends Inverted
  ? StrictEqual<Received, any> extends true
    ? // Typescript can only create errors when a type mismatch occurs, which is why TypeMatchers has Received extends ToStrictEqual<Expected, Received, Inverted>
      // The is generally fine, unless Received is `any`, because it can be assigned to anything.
      // Anything except `never`.
      never
    : {
        [EXPECTED]: Inverted extends false ? Expected : { not: Expected };
        [RECEIVED]: Received;
      }
  : any;

type AssignableTo<A, B> = [A] extends [B] ? true : false;

type ToBeAssignableTo<
  Expected,
  Received,
  Inverted extends boolean
> = AssignableTo<Expected, Received> extends Inverted
  ? StrictEqual<Received, any> extends true
    ? // Typescript can only create errors when a type mismatch occurs, which is why TypeMatchers has Received extends ToStrictEqual<Expected, Received, Inverted>
      // The is generally fine, unless Received is `any`, because it can be assigned to anything.
      // Anything except `never`.
      never
    : {
        [EXPECTED]: Inverted extends false ? Expected : { not: Expected };
        [RECEIVED]: Received;
      }
  : any;

// https://twitter.com/mattpocockuk/status/1625173887590842369
declare const inverted: unique symbol;

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
  const valWithoutNot: Omit<TypeMatchers<Expected>, typeof inverted | "not"> = {
    toBeAssignableTo: () => {},
    toStrictEqual: () => {},
  };

  const val = valWithoutNot as TypeMatchers<Expected>;

  // eslint-disable-next-line fp/no-mutation -- recursion requires mutation
  val.not = val as unknown as typeof val.not;

  return val;
};
