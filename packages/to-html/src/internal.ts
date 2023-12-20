import { toHTML as toHTMLNative } from "@portabletext/to-html";
import type {
  HtmlPortableTextList,
  NodeRenderer,
  PortableTextComponent,
  PortableTextHtmlComponents as PortableTextHtmlComponentsNative,
  PortableTextOptions as PortableTextOptionsNative,
  PortableTextTypeComponentOptions,
} from "@portabletext/to-html";
import type {
  Except,
  IsStringLiteral,
  RequiredKeysOf,
  SetRequired,
} from "type-fest";

import type {
  PortableTextBlock,
  PortableTextSpan,
  decorator,
} from "@portabletext-typed/types";
import type { MaybeArray } from "@sanity-typed/utils";

// HACK Couldn't use type-fest's Merge >=3.0.0
type MergeOld<FirstType, SecondType> = Except<
  FirstType,
  Extract<keyof FirstType, keyof SecondType>
> &
  SecondType;

// https://github.com/portabletext/to-html/blob/6772048290f2d31d32908ee17a26eac499af89e9/src/components/marks.ts#L16
type BlockMarkDecoratorDefault =
  | "code"
  | "em"
  // TODO https://github.com/sanity-io/sanity/issues/5344
  | "strike-through"
  | "strike"
  | "strong"
  | "underline";

// https://github.com/portabletext/to-html/blob/6772048290f2d31d32908ee17a26eac499af89e9/src/components/marks.ts#L5
type MarkDefDefault = "link";

// https://github.com/portabletext/to-html/blob/6772048290f2d31d32908ee17a26eac499af89e9/src/components/defaults.ts#L15
type BlockStyleDefault =
  | "blockquote"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "normal";

// https://github.com/portabletext/to-html/blob/6772048290f2d31d32908ee17a26eac499af89e9/src/components/list.ts#L3
type BlockListItemDefault = "bullet" | "number";

export type PortableTextMarkComponentOptions<
  Value,
  TMarkKey extends string,
  TMarkType extends string
> = {
  children: string;
  markKey: TMarkKey;
  markType: TMarkType;
  renderNode: NodeRenderer;
  text: string;
  value: Value;
};

export type PortableTextHtmlComponents<
  TItem extends { _type: string },
  TBlock extends PortableTextBlock<any, any, any, any, any> = Extract<
    TItem,
    PortableTextBlock<any, any, any, any, any>
  >,
  TBlockMarkDecorator extends string = Extract<
    TBlock["children"][number],
    PortableTextSpan<any>
  >[typeof decorator],
  TMarkDef extends { _key: string; _type: string } = TBlock["markDefs"][number],
  TChildSibling extends { _type: string } = Exclude<
    TBlock["children"][number],
    PortableTextSpan<any>
  >,
  TBlockStyle extends string = TBlock["style"],
  TBlockListItem extends string = NonNullable<TBlock["listItem"]>,
  TSibling extends { _type: string } = Exclude<
    IsStringLiteral<TItem["_type"]> extends false ? never : TItem,
    PortableTextBlock<any, any, any, any, any>
  >
> = MergeOld<
  Partial<PortableTextHtmlComponentsNative>,
  SetRequired<
    {
      block?:
        | PortableTextComponent<TBlock>
        | SetRequired<
            {
              [TStyle in TBlockStyle]?: PortableTextComponent<
                TBlock & { style: TStyle }
              >;
            },
            Exclude<TBlockStyle, BlockStyleDefault>
          >;
      // TODO Type HtmlPortableTextList more specifically
      list?:
        | PortableTextComponent<
            HtmlPortableTextList & { listItem: TBlockListItem }
          >
        | SetRequired<
            {
              [TList in TBlockListItem]?: PortableTextComponent<
                HtmlPortableTextList & { listItem: TList }
              >;
            },
            Exclude<TBlockListItem, BlockListItemDefault>
          >;
      listItem?:
        | PortableTextComponent<TBlock & { listItem: TBlockListItem }>
        | SetRequired<
            {
              [TList in TBlockListItem]?: PortableTextComponent<
                TBlock & { listItem: TList }
              >;
            },
            Exclude<TBlockListItem, BlockListItemDefault>
          >;
      marks?: SetRequired<
        {
          [TMark in TBlockMarkDecorator]?: (
            options: PortableTextMarkComponentOptions<undefined, TMark, TMark>
          ) => string;
        } & {
          [TMark in TMarkDef as TMark["_type"]]?: (
            options: PortableTextMarkComponentOptions<
              TMark,
              string,
              TMark["_type"]
            >
          ) => string;
        },
        | Exclude<TBlockMarkDecorator, BlockMarkDecoratorDefault>
        | Exclude<TMarkDef["_type"], MarkDefDefault>
      >;
      types?: {
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
    },
    | (TBlockListItem extends BlockListItemDefault ? never : "list")
    | (TBlockMarkDecorator extends BlockMarkDecoratorDefault ? never : "marks")
    | (TBlockStyle extends BlockStyleDefault ? never : "block")
    | (TChildSibling | TSibling extends never ? never : "types")
    | (TMarkDef["_type"] extends MarkDefDefault ? never : "marks")
  >
>;

export type PortableTextOptions<
  TItem extends { _type: string },
  TBlock extends PortableTextBlock<any, any, any, any, any> = Extract<
    TItem,
    PortableTextBlock<any, any, any, any, any>
  >,
  TBlockMarkDecorator extends string = Extract<
    TBlock["children"][number],
    PortableTextSpan<any>
  >[typeof decorator],
  TMarkDef extends { _key: string; _type: string } = TBlock["markDefs"][number],
  TChildSibling extends { _type: string } = Exclude<
    TBlock["children"][number],
    PortableTextSpan<any>
  >,
  TBlockStyle extends string = TBlock["style"],
  TBlockListItem extends string = NonNullable<TBlock["listItem"]>,
  TSibling extends { _type: string } = Exclude<
    IsStringLiteral<TItem["_type"]> extends false ? never : TItem,
    PortableTextBlock<any, any, any, any, any>
  >
> = MergeOld<
  Partial<PortableTextOptionsNative>,
  SetRequired<
    {
      components?: PortableTextHtmlComponents<
        TItem,
        TBlock,
        TBlockMarkDecorator,
        TMarkDef,
        TChildSibling,
        TBlockStyle,
        TBlockListItem,
        TSibling
      >;
    },
    RequiredKeysOf<
      PortableTextHtmlComponents<
        TItem,
        TBlock,
        TBlockMarkDecorator,
        TMarkDef,
        TChildSibling,
        TBlockStyle,
        TBlockListItem,
        TSibling
      >
    > extends never
      ? never
      : "components"
  >
>;

export const toHTML = <
  TItem extends { _type: string },
  TBlock extends Extract<TItem, PortableTextBlock<any, any, any, any, any>>,
  TBlockMarkDecorator extends Extract<
    TBlock["children"][number],
    PortableTextSpan<any>
  >[typeof decorator],
  TMarkDef extends TBlock["markDefs"][number],
  TChildSibling extends Exclude<
    TBlock["children"][number],
    PortableTextSpan<any>
  >,
  TBlockStyle extends TBlock["style"],
  TBlockListItem extends NonNullable<TBlock["listItem"]>,
  TSibling extends Exclude<
    IsStringLiteral<TItem["_type"]> extends false ? never : TItem,
    PortableTextBlock<any, any, any, any, any>
  >
>(
  blocks: MaybeArray<TItem>,
  ...args: RequiredKeysOf<
    PortableTextOptions<
      TItem,
      TBlock,
      TBlockMarkDecorator,
      TMarkDef,
      TChildSibling,
      TBlockStyle,
      TBlockListItem,
      TSibling
    >
  > extends never
    ? [
        options?: PortableTextOptions<
          TItem,
          TBlock,
          TBlockMarkDecorator,
          TMarkDef,
          TChildSibling,
          TBlockStyle,
          TBlockListItem,
          TSibling
        >
      ]
    : [
        options: PortableTextOptions<
          TItem,
          TBlock,
          TBlockMarkDecorator,
          TMarkDef,
          TChildSibling,
          TBlockStyle,
          TBlockListItem,
          TSibling
        >
      ]
) => toHTMLNative(blocks, ...(args as any));
