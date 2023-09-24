import type { IsNumericLiteral } from "type-fest";

export type MaybeArray<T> = T | T[];

export type TupleOfLength<
  T,
  Min extends number = number,
  Max extends number = number,
  Result extends T[] = []
> = Result["length"] extends Min
  ? IsNumericLiteral<Max> extends false
    ? [...Result, ...T[]]
    : Result["length"] extends Max
    ? Result
    :
        | Result
        | TupleOfLength<
            T,
            [T, ...Result]["length"] & number,
            Max,
            [T, ...Result]
          >
  : TupleOfLength<T, Min, Max, [T, ...Result]>;

export const typedTernary = <Condition extends boolean, TrueValue, FalseValue>(
  condition: Condition,
  ifTrue: () => TrueValue,
  ifFalse: () => FalseValue
) =>
  (condition ? ifTrue() : ifFalse()) as Condition extends true
    ? TrueValue
    : FalseValue;