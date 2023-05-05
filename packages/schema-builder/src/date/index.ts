import type { DateDefinition } from "sanity";
import { z } from "zod";

import { createType } from "../types";
import type { SanityTypeDef } from "../types";

export const date = <ParsedValue = string, ResolvedValue = string>({
  mock = (faker) =>
    `${`${faker.datatype.number({
      min: 1990,
      max: 2020,
    })}`.padStart(4, "0")}-${`${faker.datatype.number({
      min: 1,
      max: 12,
    })}`.padStart(2, "0")}-${`${faker.datatype.number({
      min: 1,
      max: 28,
    })}`.padStart(2, "0")}`,
  zod: zodFn = (zod) => zod as unknown as z.ZodType<ParsedValue, any, string>,
  zodResolved,
  ...def
}: SanityTypeDef<DateDefinition, string, ParsedValue, ResolvedValue> = {}) =>
  createType({
    mock,
    schema: () => ({
      ...def,
      type: "date",
    }),
    // TODO Check date validity against dateFormat with something like moment (moment is too big)
    zod: zodFn(z.string()),
    zodResolved: zodResolved?.(z.string()),
  });
