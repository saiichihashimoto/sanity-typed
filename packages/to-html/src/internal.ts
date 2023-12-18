import { toHTML as toHTMLNative } from "@portabletext/to-html";
import type {
  PortableTextHtmlComponents as PortableTextHtmlComponentsNative,
  PortableTextOptions as PortableTextOptionsNative,
  PortableTextTypeComponentOptions,
} from "@portabletext/to-html";
import type {
  PortableTextMarkDefinition,
  TypedObject,
} from "@portabletext/types";
import type { Merge } from "type-fest";

import type { PortableTextBlock } from "@portabletext-typed/types";
import type { MaybeArray } from "@sanity-typed/utils";

export type PortableTextHtmlComponents<
  TChild extends { _type: string },
  TOtherType extends Required<TypedObject>
> = Merge<
  Partial<PortableTextHtmlComponentsNative>,
  TChild | TOtherType extends never
    ? { types?: never }
    : {
        types: {
          [TType in TChild | TOtherType as TType["_type"]]: (
            options: Merge<
              PortableTextTypeComponentOptions<TType>,
              {
                isInline:
                  | (TType extends TChild ? true : never)
                  | (TType extends TOtherType ? false : never);
              }
            >
          ) => string;
        };
      }
>;

export type PortableTextOptions<
  TChild extends { _type: string },
  TOtherType extends Required<TypedObject>
> = Merge<
  PortableTextOptionsNative,
  TChild | TOtherType extends never
    ? { components?: never }
    : { components: PortableTextHtmlComponents<TChild, TOtherType> }
>;

type IsStringOr<TValue, TOtherValue> = string extends TValue
  ? true
  : TValue extends TOtherValue
  ? true
  : false;

export const toHTML = <
  TMarkDef extends PortableTextMarkDefinition,
  TChild extends { _type: string },
  TBlockStyle extends string,
  TBlockListItem extends string,
  TOtherType extends Required<TypedObject>
>(
  blocks: MaybeArray<
    | TOtherType
    | (PortableTextBlock<TMarkDef, TChild, TBlockStyle, TBlockListItem> & {
        _key: string;
      })
  >,
  ...args:
    | (
        | IsStringOr<TChild["_type"], "span">
        | IsStringOr<TOtherType["_type"], "block"> extends true
        ? [] | [options: undefined]
        : never)
    | [
        options: PortableTextOptions<
          IsStringOr<TChild["_type"], "span"> extends true
            ? never
            : Exclude<TChild, { _type: "span" }>,
          IsStringOr<TOtherType["_type"], "block"> extends true
            ? never
            : Exclude<TOtherType, { _type: "block" }>
        >
      ]
) =>
  toHTMLNative(blocks, {
    onMissingComponent: false,
    ...(args.length ? args[0] : {}),
  });
