// https://twitter.com/mattpocockuk/status/1646452585006604291
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? X
  : {
      expect: X;
      toStrictEqual: Y;
    };

export const expectType = <T>() => ({
  toStrictEqual: <U extends Equal<T, U>>() => {},
});
