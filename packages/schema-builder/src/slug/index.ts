import type { SlugDefinition, SlugValue } from "sanity";
import { z } from "zod";

import { createType } from "../types";
import type { SanityTypeDef } from "../types";

const zod: z.ZodType<SlugValue, any, SlugValue> = z.object({
  _type: z.literal("slug"),
  current: z.string(),
});

export const slug = <ParsedValue = string, ResolvedValue = string>({
  mock = (faker) => ({
    _type: "slug",
    current: faker.lorem.slug(),
  }),
  zod: zodFn = (zod) =>
    zod.transform(({ current }) => current) as unknown as z.ZodType<
      ParsedValue,
      any,
      SlugValue
    >,
  zodResolved,
  ...def
}: SanityTypeDef<SlugDefinition, SlugValue, ParsedValue, ResolvedValue> = {}) =>
  createType({
    mock,
    schema: () => ({
      ...def,
      type: "slug",
    }),
    zod: zodFn(zod),
    zodResolved: zodResolved?.(zod),
  });
