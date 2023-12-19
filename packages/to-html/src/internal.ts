import { toHTML as toHTMLNative } from "@portabletext/to-html";
import type {
  HtmlPortableTextList,
  PortableTextComponent,
  PortableTextComponentOptions,
  PortableTextHtmlComponents as PortableTextHtmlComponentsNative,
  PortableTextOptions as PortableTextOptionsNative,
  PortableTextTypeComponentOptions,
} from "@portabletext/to-html";
import type { Except, RequiredKeysOf, SetRequired } from "type-fest";

import type {
  PortableTextBlock,
  PortableTextSpan,
} from "@portabletext-typed/types";
import type { decorator } from "@portabletext-typed/types/src/internal";
import type { MaybeArray } from "@sanity-typed/utils";

// HACK Couldn't use type-fest's Merge >=3.0.0
type MergeOld<FirstType, SecondType> = Except<
  FirstType,
  Extract<keyof FirstType, keyof SecondType>
> &
  SecondType;

// https://github.com/portabletext/to-html/blob/6772048290f2d31d32908ee17a26eac499af89e9/src/components/defaults.ts#L15
type DefaultToHTMLPortableTextBlockStyles =
  | "blockquote"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "normal";

// https://github.com/portabletext/to-html/blob/6772048290f2d31d32908ee17a26eac499af89e9/src/components/list.ts#L3
type DefaultToHTMLPortableTextBlockListItems = "bullet" | "number";

export type PortableTextHtmlComponents<
  TBlock extends PortableTextBlock<any, any, any, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TODO
  TBlockMarkDecorator extends string,
  TChildSibling extends { _type: string },
  TBlockStyle extends string,
  TBlockListItem extends string,
  TSibling extends { _type: string }
> = SetRequired<
  Partial<
    MergeOld<
      PortableTextHtmlComponentsNative,
      {
        block:
          | ((options: PortableTextComponentOptions<TBlock>) => string)
          | ({
              [TStyle in DefaultToHTMLPortableTextBlockStyles &
                TBlockStyle]?: PortableTextComponent<
                TBlock & { style: TStyle }
              >;
            } & {
              [TStyle in Exclude<
                TBlockStyle,
                DefaultToHTMLPortableTextBlockStyles
              >]: PortableTextComponent<TBlock & { style: TStyle }>;
            });
        list: // TODO Type HtmlPortableTextList more specifically
        | PortableTextComponent<
              HtmlPortableTextList & { listItem: TBlockListItem }
            >
          | ({
              [TList in DefaultToHTMLPortableTextBlockListItems &
                TBlockListItem]?: PortableTextComponent<
                HtmlPortableTextList & { listItem: TList }
              >;
            } & {
              [TList in Exclude<
                TBlockListItem,
                DefaultToHTMLPortableTextBlockListItems
              >]: PortableTextComponent<
                HtmlPortableTextList & { listItem: TList }
              >;
            });
        listItem:
          | PortableTextComponent<TBlock & { listItem: TBlockListItem }>
          | ({
              [TList in DefaultToHTMLPortableTextBlockListItems &
                TBlockListItem]?: PortableTextComponent<
                TBlock & { listItem: TList }
              >;
            } & {
              [TList in Exclude<
                TBlockListItem,
                DefaultToHTMLPortableTextBlockListItems
              >]: PortableTextComponent<TBlock & { listItem: TList }>;
            });
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
  | (TBlockListItem extends DefaultToHTMLPortableTextBlockListItems
      ? never
      : "list")
  | (TBlockStyle extends DefaultToHTMLPortableTextBlockStyles ? never : "block")
  | (TChildSibling | TSibling extends never ? never : "types")
>;

export type PortableTextOptions<
  TBlock extends PortableTextBlock<any, any, any, any, any>,
  TBlockMarkDecorator extends string,
  TChildSibling extends { _type: string },
  TBlockStyle extends string,
  TBlockListItem extends string,
  TSibling extends { _type: string }
> = SetRequired<
  Partial<
    MergeOld<
      PortableTextOptionsNative,
      {
        components: PortableTextHtmlComponents<
          TBlock,
          TBlockMarkDecorator,
          TChildSibling,
          TBlockStyle,
          TBlockListItem,
          TSibling
        >;
      }
    >
  >,
  RequiredKeysOf<
    PortableTextHtmlComponents<
      TBlock,
      TBlockMarkDecorator,
      TChildSibling,
      TBlockStyle,
      TBlockListItem,
      TSibling
    >
  > extends never
    ? never
    : "components"
>;

export const toHTML = <
  TItem extends { _type: string },
  TBlock extends Extract<TItem, PortableTextBlock<any, any, any, any, any>>,
  TBlockMarkDecorator extends Extract<
    TBlock["children"][number],
    PortableTextSpan<any>
  >[typeof decorator],
  TChildSibling extends Exclude<
    TBlock["children"][number],
    PortableTextSpan<TBlockMarkDecorator>
  >,
  TBlockStyle extends TBlock["style"],
  TBlockListItem extends NonNullable<TBlock["listItem"]>,
  TSibling extends Exclude<
    string extends TItem["_type"] ? never : TItem,
    TBlock
  >
>(
  blocks: MaybeArray<TItem>,
  ...args: RequiredKeysOf<
    PortableTextOptions<
      TBlock,
      TBlockMarkDecorator,
      TChildSibling,
      TBlockStyle,
      TBlockListItem,
      TSibling
    >
  > extends never
    ? [
        options?: PortableTextOptions<
          TBlock,
          TBlockMarkDecorator,
          TChildSibling,
          TBlockStyle,
          TBlockListItem,
          TSibling
        >
      ]
    : [
        options: PortableTextOptions<
          TBlock,
          TBlockMarkDecorator,
          TChildSibling,
          TBlockStyle,
          TBlockListItem,
          TSibling
        >
      ]
) => toHTMLNative(blocks, ...args);
