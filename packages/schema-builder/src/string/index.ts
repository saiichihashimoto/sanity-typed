import { flow, map } from "lodash/fp";
import type { StringDefinition } from "sanity";
import { z } from "zod";

import { listMock, listValueToValue } from "../list";
import type { WithTypedOptionsList } from "../list";
import { createType, zodUnion } from "../types";
import type { GetRule, SanityTypeDef } from "../types";

export const string = <
  TypedValue extends string,
  ParsedValue = TypedValue,
  ResolvedValue = TypedValue
>({
  length,
  max,
  min,
  options,
  regex,
  validation,
  options: { list } = {},
  mock = !list
    ? (faker) => faker.random.word() as TypedValue
    : listMock<TypedValue>(list),
  zod: zodFn = (zod) =>
    zod as unknown as z.ZodType<ParsedValue, any, TypedValue>,
  zodResolved,
  ...def
}: SanityTypeDef<
  WithTypedOptionsList<TypedValue, StringDefinition>,
  TypedValue,
  ParsedValue,
  ResolvedValue
> & {
  length?: number;
  max?: number;
  min?: number;
  regex?: RegExp;
} = {}) => {
  const zod = !list
    ? flow(
        (zod: z.ZodString) => (!min ? zod : zod.min(min)),
        (zod) => (!max ? zod : zod.max(max)),
        (zod) => (!length ? zod : zod.length(length)),
        (zod) => (!regex ? zod : zod.regex(regex)),
        (zod: z.ZodType<string, any, string>) =>
          zod as z.ZodType<TypedValue, any, TypedValue>
      )(z.string())
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
      type: "string",
      validation: flow(
        (rule: GetRule<StringDefinition>) => (!min ? rule : rule.min(min)),
        (rule) => (!max ? rule : rule.max(max)),
        (rule) => (!length ? rule : rule.length(length)),
        (rule) => (!regex ? rule : rule.regex(regex)),
        (rule) => validation?.(rule) ?? rule
      ),
    }),
    zod: zodFn(zod),
    zodResolved: zodResolved?.(zod),
  });
};
