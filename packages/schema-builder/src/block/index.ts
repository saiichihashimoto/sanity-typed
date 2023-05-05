import type {
  ArbitraryTypedObject,
  PortableTextBlock,
  PortableTextBlockStyle,
  PortableTextListItemType,
  PortableTextMarkDefinition,
  PortableTextSpan,
  TypedObject,
} from "@portabletext/types";
import type { BlockDefinition } from "sanity";
import type { Merge } from "type-fest";
import { z } from "zod";

import type { SanityTypeDef, TypedValues } from "../types";
import { createType } from "../types";

export type SanityBlock<
  M extends PortableTextMarkDefinition = PortableTextMarkDefinition,
  C extends TypedObject = ArbitraryTypedObject | PortableTextSpan,
  S extends string = PortableTextBlockStyle,
  L extends string = PortableTextListItemType
> = PortableTextBlock<M, C, S, L>;

const zod = <
  M extends PortableTextMarkDefinition,
  C extends TypedObject,
  S extends string,
  L extends string
>() =>
  z.object({
    _key: z.optional(z.string()),
    _type: z.string(),
    level: z.optional(z.number()),
    listItem: z.optional(z.string()),
    style: z.optional(z.string()),
    children: z.array(
      z
        .object({
          _type: z.string(),
          _key: z.optional(z.string()),
        })
        .catchall(z.unknown())
    ),
    markDefs: z.optional(
      z.array(
        z
          .object({
            _type: z.string(),
            _key: z.string(),
          })
          .catchall(z.unknown())
      )
    ),
  }) as z.ZodType<SanityBlock<M, C, S, L>, any, SanityBlock<M, C, S, L>>;

export const block = <
  M extends PortableTextMarkDefinition = PortableTextMarkDefinition,
  C extends TypedObject = ArbitraryTypedObject | PortableTextSpan,
  S extends string = PortableTextBlockStyle,
  L extends string = PortableTextListItemType,
  ParsedValue = SanityBlock<M, C, S, L>,
  ResolvedValue = SanityBlock<M, C, S, L>
>({
  mock = (faker) => ({
    style: "normal" as S,
    _type: "block",
    markDefs: [],
    children: [
      {
        _type: "span",
        text: faker.lorem.paragraph(),
        marks: [],
      } as unknown as C,
    ],
  }),
  zod: zodFn = (zod) =>
    zod as unknown as z.ZodType<ParsedValue, any, SanityBlock<M, C, S, L>>,
  zodResolved,
  ...def
}: SanityTypeDef<
  Merge<BlockDefinition, TypedValues<SanityBlock<M, C, S, L>>>,
  SanityBlock<M, C, S, L>,
  ParsedValue,
  ResolvedValue
> = {}) =>
  createType({
    mock,
    schema: () => ({
      ...def,
      type: "block",
    }),
    zod: zodFn(zod()),
    zodResolved: zodResolved?.(zod()),
  });
