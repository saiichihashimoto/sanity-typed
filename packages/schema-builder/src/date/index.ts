import type { DateDefinition } from "sanity";
import { z } from "zod";

import { createType } from "../types";
import type { SanityTypeDef } from "../types";

export const date = <ParsedValue = string, ResolvedValue = string>({
  mock = (faker) =>
    faker.date
      .between({
        from: "1990-01-01T00:00:00.000Z",
        to: "2020-12-31T00:00:00.000Z",
      })
      .toLocaleDateString("fr-CA"),
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
