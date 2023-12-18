import { toHTML as toHTMLNative } from "@portabletext/to-html";
import type {
  PortableTextComponentOptions,
  PortableTextHtmlComponents as PortableTextHtmlComponentsNative,
  PortableTextOptions as PortableTextOptionsNative,
  PortableTextTypeComponentOptions,
} from "@portabletext/to-html";
import type {
  Except,
  RequiredKeysOf,
  SetOptional,
  SetRequired,
} from "type-fest";

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

type DefaultToHTMLPortableTextBlockStyles =
  | "blockquote"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "normal";

export type PortableTextHtmlComponents<
  TBlock extends PortableTextBlock<any, any, any, any>,
  TChildSibling extends { _type: string },
  TBlockStyle extends string,
  TSibling extends { _type: string }
> = SetRequired<
  Partial<
    MergeOld<
      PortableTextHtmlComponentsNative,
      {
        block:
          | SetOptional<
              {
                [TStyle in TBlockStyle]: (
                  options: PortableTextComponentOptions<
                    TBlock & { style: TStyle }
                  >
                ) => string;
              },
              DefaultToHTMLPortableTextBlockStyles & TBlockStyle
            >
          | ((options: PortableTextComponentOptions<TBlock>) => string);
        types: {
          [TType in TChildSibling | TSibling as TType["_type"]]: (
            options: MergeOld<
              PortableTextTypeComponentOptions<TType>,
              {
                isInline:
                  | (TType extends TChildSibling ? true : never)
                  | (TType extends TSibling ? false : never);
              }
            >
          ) => string;
        };
      }
    >
  >,
  | (TBlockStyle extends DefaultToHTMLPortableTextBlockStyles ? never : "block")
  | (TChildSibling | TSibling extends never ? never : "types")
>;

export type PortableTextOptions<
  TBlock extends PortableTextBlock<any, any, any, any>,
  TChildSibling extends { _type: string },
  TBlockStyle extends string,
  TSibling extends { _type: string }
> = SetRequired<
  Partial<
    MergeOld<
      PortableTextOptionsNative,
      {
        components: PortableTextHtmlComponents<
          TBlock,
          TChildSibling,
          TBlockStyle,
          TSibling
        >;
      }
    >
  >,
  RequiredKeysOf<
    PortableTextHtmlComponents<TBlock, TChildSibling, TBlockStyle, TSibling>
  > extends never
    ? never
    : "components"
>;

export const toHTML = <
  TItem extends { _type: string },
  TBlock extends Extract<TItem, PortableTextBlock<any, any, any, any>>,
  TChildSibling extends Exclude<TBlock["children"][number], PortableTextSpan>,
  TBlockStyle extends TBlock["style"],
  TSibling extends Exclude<
    string extends TItem["_type"] ? never : TItem,
    TBlock
  >
>(
  blocks: MaybeArray<TItem>,
  ...args: RequiredKeysOf<
    PortableTextOptions<TBlock, TChildSibling, TBlockStyle, TSibling>
  > extends never
    ? [
        options?: PortableTextOptions<
          TBlock,
          TChildSibling,
          TBlockStyle,
          TSibling
        >
      ]
    : [
        options: PortableTextOptions<
          TBlock,
          TChildSibling,
          TBlockStyle,
          TSibling
        >
      ]
) => toHTMLNative(blocks, ...args);
