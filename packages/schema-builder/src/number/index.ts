import { flow, map } from "lodash/fp";
import type { NumberDefinition } from "sanity";
import { z } from "zod";

import { listMock, listValueToValue } from "../list";
import type { WithTypedOptionsList } from "../list";
import { createType, zodUnion } from "../types";
import type { GetRule, SanityTypeDef } from "../types";

export const number = <
  TypedValue extends number,
  ParsedValue = TypedValue,
  ResolvedValue = TypedValue
>({
  greaterThan,
  integer,
  lessThan,
  max,
  min,
  options,
  negative,
  positive,
  precision,
  validation,
  options: { list } = {},
  mock = !list
    ? (faker) =>
        faker.datatype.number({
          max,
          min,
          precision: 1 / 10 ** (precision ?? 0),
        }) as TypedValue
    : listMock<TypedValue>(list),
  zod: zodFn = (zod) =>
    zod as unknown as z.ZodType<ParsedValue, any, TypedValue>,
  zodResolved,
  ...def
}: SanityTypeDef<
  WithTypedOptionsList<TypedValue, NumberDefinition>,
  TypedValue,
  ParsedValue,
  ResolvedValue
> & {
  greaterThan?: number;
  integer?: boolean;
  lessThan?: number;
  max?: number;
  min?: number;
  negative?: boolean;
  positive?: boolean;
  precision?: number;
} = {}) => {
  const zod = !list
    ? flow(
        flow(
          (zod: z.ZodNumber) => (!min ? zod : zod.min(min)),
          (zod) => (!max ? zod : zod.max(max)),
          (zod) => (!greaterThan ? zod : zod.gt(greaterThan)),
          (zod) => (!lessThan ? zod : zod.lt(lessThan)),
          (zod) => (!integer ? zod : zod.int()),
          (zod) => (!positive ? zod : zod.nonnegative()),
          (zod) => (!negative ? zod : zod.negative())
        ),
        (zod) =>
          !precision
            ? zod
            : zod.transform(
                (value) => Math.round(value * 10 ** precision) / 10 ** precision
              ),
        (zod) => zod as unknown as z.ZodType<TypedValue, any, TypedValue>
      )(z.number())
    : flow(
        (value: typeof list) => value,
        map(flow(listValueToValue, z.literal)),
        zodUnion
      )(list);

  return createType({
    mock,
    schema: () => ({
      ...def,
      options,
      type: "number",
      validation: flow(
        flow(
          (rule: GetRule<NumberDefinition>) => (!min ? rule : rule.min(min)),
          (rule) => (!max ? rule : rule.max(max)),
          (rule) => (!greaterThan ? rule : rule.greaterThan(greaterThan)),
          (rule) => (!lessThan ? rule : rule.lessThan(lessThan)),
          (rule) => (!integer ? rule : rule.integer()),
          (rule) => (!positive ? rule : rule.positive()),
          (rule) => (!negative ? rule : rule.negative())
        ),
        (rule) => (!precision ? rule : rule.precision(precision)),
        (rule) => validation?.(rule) ?? rule
      ),
    }),
    zod: zodFn(zod),
    zodResolved: zodResolved?.(zod),
  });
};
