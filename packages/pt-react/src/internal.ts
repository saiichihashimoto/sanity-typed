import { PortableText as PortableTextNative } from "@portabletext/react";
import type {
  NodeRenderer,
  PortableTextComponent,
  PortableTextProps as PortableTextPropsNative,
  PortableTextReactComponents as PortableTextReactComponentsNative,
  PortableTextTypeComponentProps,
  ReactPortableTextList,
} from "@portabletext/react";
import type { ComponentType, ReactNode } from "react";
import type {
  IsStringLiteral,
  Merge,
  RequiredKeysOf,
  SetRequired,
} from "type-fest";

import type {
  PortableTextBlock,
  PortableTextSpan,
  decorator,
} from "@portabletext-typed/types";
import type { MaybeArray } from "@sanity-typed/utils";

// https://github.com/portabletext/react-portabletext/blob/534fd4693b39cd1860a3c2c7c308df7bba534d24/src/components/marks.tsx#L15
type BlockMarkDecoratorDefault =
  | "code"
  | "em"
  // TODO https://github.com/sanity-io/sanity/issues/5344
  | "strike-through"
  | "strike"
  | "strong"
  | "underline";

// https://github.com/portabletext/react-portabletext/blob/534fd4693b39cd1860a3c2c7c308df7bba534d24/src/components/marks.tsx#L9
type MarkDefDefault = "link";

// https://github.com/portabletext/react-portabletext/blob/534fd4693b39cd1860a3c2c7c308df7bba534d24/src/components/defaults.tsx#L15
type BlockStyleDefault =
  | "blockquote"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "normal";

// https://github.com/portabletext/react-portabletext/blob/534fd4693b39cd1860a3c2c7c308df7bba534d24/src/components/list.tsx#L3
type BlockListItemDefault = "bullet" | "number";

export type PortableTextMarkComponent<
  Value,
  TMarkKey extends string,
  TMarkType extends string,
> = ComponentType<{
  children: ReactNode;
  markKey: TMarkKey;
  markType: TMarkType;
  renderNode: NodeRenderer;
  text: string;
  value: Value;
}>;

export type PortableTextReactComponents<
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
  >,
> = Merge<
  Partial<PortableTextReactComponentsNative>,
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
      // TODO Type ReactPortableTextList more specifically
      list?:
        | PortableTextComponent<
            ReactPortableTextList & { listItem: TBlockListItem }
          >
        | SetRequired<
            {
              [TList in TBlockListItem]?: PortableTextComponent<
                ReactPortableTextList & { listItem: TList }
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
          [TMark in TBlockMarkDecorator]?: PortableTextMarkComponent<
            undefined,
            TMark,
            TMark
          >;
        } & {
          [TMark in TMarkDef as TMark["_type"]]?: PortableTextMarkComponent<
            TMark,
            string,
            TMark["_type"]
          >;
        },
        | Exclude<TBlockMarkDecorator, BlockMarkDecoratorDefault>
        | Exclude<TMarkDef["_type"], MarkDefDefault>
      >;
      types?: {
        [TType in TChildSibling | TSibling as TType["_type"]]: ComponentType<
          Merge<
            PortableTextTypeComponentProps<TType>,
            {
              isInline:
                | (TType extends TChildSibling ? true : never)
                | (TType extends TSibling ? false : never);
            }
          >
        >;
      };
    },
    | (TBlockListItem extends BlockListItemDefault ? never : "list")
    | (TBlockMarkDecorator extends BlockMarkDecoratorDefault ? never : "marks")
    | (TBlockStyle extends BlockStyleDefault ? never : "block")
    | (TChildSibling | TSibling extends never ? never : "types")
    | (TMarkDef["_type"] extends MarkDefDefault ? never : "marks")
  >
>;

export type PortableTextProps<
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
  >,
> = Merge<
  Partial<Omit<PortableTextPropsNative<TItem>, "value">>,
  SetRequired<
    {
      components?: PortableTextReactComponents<
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
      PortableTextReactComponents<
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
> & { value: MaybeArray<TItem> };

export const PortableText = <
  const TItem extends { _type: string },
  const TBlock extends Extract<
    TItem,
    PortableTextBlock<any, any, any, any, any>
  >,
>(
  props: PortableTextProps<
    TItem,
    Extract<TItem, PortableTextBlock<any, any, any, any, any>>,
    Extract<
      TBlock["children"][number],
      PortableTextSpan<any>
    >[typeof decorator],
    TBlock["markDefs"][number],
    Exclude<TBlock["children"][number], PortableTextSpan<any>>,
    TBlock["style"],
    NonNullable<TBlock["listItem"]>,
    Exclude<
      IsStringLiteral<TItem["_type"]> extends false ? never : TItem,
      PortableTextBlock<any, any, any, any, any>
    >
  >
) => PortableTextNative(props as any);
