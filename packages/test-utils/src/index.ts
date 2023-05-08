// TODO Release expect-type as it's own package

// https://twitter.com/mattpocockuk/status/1646452585006604291
type ToStrictEqual<Expected, Received, Inverted extends boolean> = (<
  T
>() => T extends Expected ? 1 : 2) extends <T>() => T extends Received ? 1 : 2
  ? Inverted extends false
    ? any
    : {
        expected: { not: Expected };
        received: Received;
      }
  : Inverted extends true
  ? any
  : {
      expected: Expected;
      received: Received;
    };

// https://twitter.com/mattpocockuk/status/1625173887590842369
const inverted: unique symbol = Symbol("Inverted Brand");

type TypeMatchers<Expected, Inverted extends boolean = false> = {
  [inverted]: Inverted;
  not: TypeMatchers<Expected, Inverted extends true ? false : true>;
  toStrictEqual: <
    Received extends ToStrictEqual<Expected, Received, Inverted>
  >() => void;
};

export const expectType = <Expected>() => {
  const val = {
    [inverted]: undefined as unknown as false,
    toStrictEqual: () => {},
  } as TypeMatchers<Expected>;

  // eslint-disable-next-line fp/no-mutation -- recursion requires mutation
  val.not = val as unknown as typeof val.not;

  return val;
};
