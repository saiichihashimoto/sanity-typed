import type {
  PortableTextMarkDefinition,
  PortableTextSpan as PortableTextSpanNative,
} from "@portabletext/types";
import type { SetRequired } from "type-fest";

export type BlockMarkDecoratorDefault =
  | "code"
  | "em"
  // TODO https://github.com/sanity-io/sanity/issues/5344
  | "strike-through"
  | "strike"
  | "strong"
  | "underline";

/**
 * **WARNING!!!**
 *
 * This is *not* used during runtime in any way.
 *
 * PortableTextSpan will not actually have a key of this symbol.
 *
 * This is only used to help with type inference.
 *
 * DO NOT rely on or use this symbol in runtime in any way. Typescript won't complain but it won't be there. We *cannot* change the output of sanity's content lake to include anything, especially symbols.
 *
 * This is also true for the other `@sanity-typed/*` and `@portabletext-typed/*` packages. Although they import this symbol, it's only for type inference.
 */
const decorator: unique symbol = Symbol("decorator");
// HACK The declaration and export can't be on the same line https://stackoverflow.com/a/67074360
export { decorator };

export type PortableTextSpan<
  TBlockMarkDecorator extends string = BlockMarkDecoratorDefault
> = SetRequired<
  Omit<PortableTextSpanNative, "_key"> & { [decorator]: TBlockMarkDecorator },
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
  TBlockMarkDecorator extends string = BlockMarkDecoratorDefault,
  TMarkDef extends PortableTextMarkDefinition = PortableTextMarkDefinition,
  TChild extends { _type: string } = PortableTextSpan<TBlockMarkDecorator>,
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
