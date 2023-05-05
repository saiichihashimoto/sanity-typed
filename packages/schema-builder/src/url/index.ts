import type { UrlDefinition } from "sanity";
import { z } from "zod";

import { createType } from "../types";
import type { SanityTypeDef } from "../types";

const zod = z.string().url();

export const url = <ParsedValue = string, ResolvedValue = string>({
  mock = (faker) => faker.internet.url(),
  zod: zodFn = (zod) => zod as unknown as z.ZodType<ParsedValue, any, string>,
  zodResolved,
  ...def
}: SanityTypeDef<UrlDefinition, string, ParsedValue, ResolvedValue> = {}) =>
  createType({
    mock,
    schema: () => ({
      ...def,
      type: "url",
    }),
    zod: zodFn(zod),
    zodResolved: zodResolved?.(zod),
  });
