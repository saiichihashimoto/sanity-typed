import { flow, map } from "lodash/fp";
import type {
  ArrayDefinition,
  ArrayRule,
  IntrinsicDefinitions,
  TypeAliasDefinition,
} from "sanity";
import type { Merge } from "type-fest";
import { z } from "zod";

import { createType, zodDiscriminatedUnionMaybe } from "../types";
import type {
  InferParsedValue,
  InferResolvedValue,
  InferValue,
  NamedSchemaFields,
  SanityType,
  SanityTypeDef,
  TupleOfLength,
  TypedValues,
} from "../types";

type AddKey<T> = T extends object ? Merge<T, { _key: string }> : T;

const addKeyToZod = <Input, Output>(zod: z.ZodType<Output, any, Input>) =>
  !(zod instanceof z.ZodObject)
    ? (zod as z.ZodType<AddKey<Output>, any, AddKey<Input>>)
    : (zod.extend({
        _key: z.string(),
      }) as unknown as z.ZodType<AddKey<Output>, any, AddKey<Input>>);

type Precedence<A extends number, B extends number> = number extends A ? B : A;

const zodArrayOfLength =
  <Length extends number, Min extends number, Max extends number>({
    length,
    max,
    min,
  }: {
    length?: Length;
    max?: Max;
    min?: Min;
  }) =>
  <Input, Output>(zods: z.ZodType<Output, any, Input>[]) =>
    flow(
      flow(
        (value: typeof zods) => value,
        map(addKeyToZod),
        zodDiscriminatedUnionMaybe("_type"),
        z.array,
        (zod) => (min === undefined ? zod : zod.min(min)),
        (zod) => (max === undefined ? zod : zod.max(max)),
        (zod) => (length === undefined ? zod : zod.length(length))
      ),
      (zod) =>
        zod as unknown as z.ZodType<
          TupleOfLength<
            AddKey<Output>,
            Precedence<Length, Min>,
            Precedence<Length, Max>
          >,
          any,
          TupleOfLength<
            AddKey<Input>,
            Precedence<Length, Min>,
            Precedence<Length, Max>
          >
        >
    )(zods);

// HACK Shouldn't have to omit NamedSchemaFields because arrays don't need names
type ItemDefinitions = Omit<
  // Schema.ArrayDefinition["of"][number],
  | IntrinsicDefinitions[keyof IntrinsicDefinitions]
  | TypeAliasDefinition<string, undefined>,
  NamedSchemaFields
>;

export const array = <
  ItemValue,
  ParsedItemValue,
  ResolvedItemValue,
  ItemsArray extends TupleOfLength<
    SanityType<ItemDefinitions, ItemValue, ParsedItemValue, ResolvedItemValue>,
    1
  >,
  Length extends number,
  Min extends number,
  Max extends number,
  Value extends TupleOfLength<
    AddKey<InferValue<ItemsArray[number]>>,
    Precedence<Length, Min>,
    Precedence<Length, Max>
  >,
  ParsedValue = TupleOfLength<
    AddKey<InferParsedValue<ItemsArray[number]>>,
    Precedence<Length, Min>,
    Precedence<Length, Max>
  >,
  ResolvedValue = TupleOfLength<
    AddKey<InferResolvedValue<ItemsArray[number]>>,
    Precedence<Length, Min>,
    Precedence<Length, Max>
  >
>({
  length,
  max,
  min,
  validation,
  of: items,
  // FIXME Mock the array element types. Not sure how to allow an override, since the function has to be defined before we know the element types.
  mock = () => [] as unknown as Value,
  zod: zodFn = (zod) => zod as unknown as z.ZodType<ParsedValue, any, Value>,
  zodResolved = (zod) => zod as unknown as z.ZodType<ResolvedValue, any, Value>,
  ...def
}: Merge<
  SanityTypeDef<
    Merge<ArrayDefinition, TypedValues<Value, ArrayRule<Value>>>,
    Value,
    ParsedValue,
    ResolvedValue,
    TupleOfLength<
      AddKey<InferParsedValue<ItemsArray[number]>>,
      Precedence<Length, Min>,
      Precedence<Length, Max>
    >,
    TupleOfLength<
      AddKey<InferResolvedValue<ItemsArray[number]>>,
      Precedence<Length, Min>,
      Precedence<Length, Max>
    >
  >,
  {
    length?: Length;
    max?: Max;
    min?: Min;
    of: ItemsArray;
  }
>) =>
  createType({
    mock,
    zod: zodFn(
      flow(
        (value: typeof items) => value,
        map(
          ({ zod }) =>
            zod as z.ZodType<
              InferParsedValue<ItemsArray[number]>,
              any,
              InferValue<ItemsArray[number]>
            >
        ),
        zodArrayOfLength({ length, max, min }),
        <Output>(value: z.ZodType<Output, any, any>) =>
          value as z.ZodType<Output, any, Value>
      )(items)
    ),
    zodResolved: zodResolved(
      flow(
        (value: typeof items) => value,
        map(
          ({ zodResolved }) =>
            zodResolved as z.ZodType<
              InferResolvedValue<ItemsArray[number]>,
              any,
              InferValue<ItemsArray[number]>
            >
        ),
        zodArrayOfLength({ length, max, min }),
        <Output>(value: z.ZodType<Output, any, any>) =>
          value as z.ZodType<Output, any, Value>
      )(items)
    ),
    schema: () => ({
      ...def,
      type: "array",
      of: items.map(({ schema }) => schema()),
      validation: flow(
        (rule: ArrayRule<Value>) => (!min ? rule : rule.min(min)),
        (rule) => (!max ? rule : rule.max(max)),
        (rule) => (length === undefined ? rule : rule.length(length)),
        (rule) => validation?.(rule) ?? rule
      ),
    }),
  });
