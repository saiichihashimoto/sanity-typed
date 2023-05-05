import type { BooleanDefinition } from "sanity";
import { z } from "zod";

import { createType } from "../types";
import type { SanityTypeDef } from "../types";

export const boolean = <ParsedValue = boolean, ResolvedValue = boolean>({
  mock = (faker) => faker.datatype.boolean(),
  zod: zodFn = (zod) => zod as unknown as z.ZodType<ParsedValue, any, boolean>,
  zodResolved,
  ...def
}: SanityTypeDef<
  BooleanDefinition,
  boolean,
  ParsedValue,
  ResolvedValue
> = {}) =>
  createType({
    mock,
    schema: () => ({
      ...def,
      type: "boolean",
    }),
    zod: zodFn(z.boolean()),
    zodResolved: zodResolved?.(z.boolean()),
  });
