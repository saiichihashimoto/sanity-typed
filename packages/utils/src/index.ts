import { isPlainObject as isPlainObjectNative, reduce } from "lodash/fp";
import type { IsNumericLiteral } from "type-fest";

export type Negate<T> = T extends true ? false : true;

export type IsPlainObject<T> = T extends any[]
  ? false
  : T extends object
    ? true
    : false;

export const isPlainObject = <T>(value: T) =>
  isPlainObjectNative(value) as IsPlainObject<T>;

export type MaybeArray<T> = T | T[];

export type ReadonlyTupleOfLength<
  T,
  Min extends number = number,
  Max extends number = number,
  Result extends T[] = [],
> = Result["length"] extends Min
  ? IsNumericLiteral<Max> extends false
    ? readonly [...Result, ...T[]]
    : Result["length"] extends Max
      ? Result
      :
          | ReadonlyTupleOfLength<
              T,
              [T, ...Result]["length"] & number,
              Max,
              [T, ...Result]
            >
          | Result
  : ReadonlyTupleOfLength<T, Min, Max, [T, ...Result]>;

export type TupleOfLength<
  T,
  Min extends number = number,
  Max extends number = number,
  Result extends T[] = [],
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

export const ternary = <Condition extends boolean, TrueValue, FalseValue>(
  condition: Condition,
  ifTrue: () => TrueValue,
  ifFalse: () => FalseValue
) =>
  (condition ? ifTrue() : ifFalse()) as Condition extends true
    ? TrueValue
    : FalseValue;

export const addIndexSignature = <Obj>(obj: Obj) =>
  obj as Obj & { [key: string]: unknown };

export const values = <Obj>(obj: Obj) =>
  Object.values(obj as any) as Obj[keyof Obj][];

export const reduceAcc =
  <T, TResult>(
    collection: T[] | null | undefined,
    // eslint-disable-next-line promise/prefer-await-to-callbacks -- lodash/fp reorder
    callback: (prev: TResult, current: T) => TResult
  ) =>
  (accumulator: TResult) =>
    reduce(callback, accumulator, collection);
