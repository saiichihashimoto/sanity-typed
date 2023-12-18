import type {
  PortableTextMarkDefinition,
  PortableTextSpan as PortableTextSpanNative,
} from "@portabletext/types";
import type { SetRequired } from "type-fest";

export type PortableTextSpan = SetRequired<
  Omit<PortableTextSpanNative, "_key">,
  "marks"
>;

export type BlockStyleDefault =
  | "blockquote"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "normal";

export type BlockListItemDefault = "bullet" | "number";

export type PortableTextBlock<
  TMarkDef extends PortableTextMarkDefinition = PortableTextMarkDefinition,
  TChild extends { _type: string } = PortableTextSpan,
  TBlockStyle extends string = BlockStyleDefault,
  TBlockListItem extends string = BlockListItemDefault
> =
  // TODO PortableTextBlock is too complex for some reason https://github.com/saiichihashimoto/sanity-typed/issues/415
  // Omit<
  //   SetRequired<
  //     PortableTextBlockNative<TMarkDef, TChild, TBlockStyle, TBlockListItem>,
  //     "markDefs" | "style"
  //   >,
  //   "_key"
  // > & {
  //   _type: "block";
  // };
  {
    _type: "block";
    children: TChild[];
    // TODO https://github.com/saiichihashimoto/sanity-typed/issues/538
    level?: number;
    listItem?: TBlockListItem;
    markDefs: TMarkDef[];
    style: TBlockStyle;
  };
