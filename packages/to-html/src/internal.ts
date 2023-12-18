import { toHTML as toHTMLNative } from "@portabletext/to-html";
import type {
  PortableTextHtmlComponents as PortableTextHtmlComponentsNative,
  PortableTextOptions as PortableTextOptionsNative,
  PortableTextTypeComponentOptions,
} from "@portabletext/to-html";
import type { Except, RequiredKeysOf, SetRequired } from "type-fest";

import type {
  PortableTextBlock,
  PortableTextSpan,
} from "@portabletext-typed/types";
import type { MaybeArray } from "@sanity-typed/utils";

// HACK Couldn't use type-fest's Merge >=3.0.0
type MergeOld<FirstType, SecondType> = Except<
  FirstType,
  Extract<keyof FirstType, keyof SecondType>
> &
  SecondType;

export type PortableTextHtmlComponents<
  TChild extends { _type: string },
  TSibling extends { _type: string }
> = SetRequired<
  Partial<
    MergeOld<
      PortableTextHtmlComponentsNative,
      {
        types: {
          [TType in TChild | TSibling as TType["_type"]]: (
            options: MergeOld<
              PortableTextTypeComponentOptions<TType>,
              {
                isInline:
                  | (TType extends TChild ? true : never)
                  | (TType extends TSibling ? false : never);
              }
            >
          ) => string;
        };
      }
    >
  >,
  TChild | TSibling extends never ? never : "types"
>;

export type PortableTextOptions<
  TChild extends { _type: string },
  TSibling extends { _type: string }
> = SetRequired<
  Partial<
    MergeOld<
      PortableTextOptionsNative,
      { components: PortableTextHtmlComponents<TChild, TSibling> }
    >
  >,
  RequiredKeysOf<PortableTextHtmlComponents<TChild, TSibling>> extends never
    ? never
    : "components"
>;

export const toHTML = <
  TItem extends { _type: string },
  TChild extends Exclude<
    Extract<TItem, PortableTextBlock<any, any, any, any>>["children"][number],
    PortableTextSpan
  >,
  TSibling extends Exclude<
    string extends TItem["_type"] ? never : TItem,
    PortableTextBlock<any, any, any, any>
  >
>(
  blocks: MaybeArray<TItem>,
  ...args: RequiredKeysOf<PortableTextOptions<TChild, TSibling>> extends never
    ? [options?: PortableTextOptions<TChild, TSibling>]
    : [options: PortableTextOptions<TChild, TSibling>]
) => toHTMLNative(blocks, ...args);
