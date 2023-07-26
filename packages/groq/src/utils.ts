// TODO TupleOfLength somewhere more reusable

export type TupleOfLength<
  T,
  Min extends number = number,
  Max extends number = number,
  Result extends T[] = []
> = Result["length"] extends Min
  ? number extends Max
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

export type TupleToString<
  T extends (bigint | boolean | number | string | null | undefined)[],
  Result extends string = ""
> = T extends [
  infer Element extends bigint | boolean | number | string | null | undefined,
  ...infer Remaining extends (
    | bigint
    | boolean
    | number
    | string
    | null
    | undefined
  )[]
]
  ? TupleToString<Remaining, `${Result}${Element}`>
  : Result;
