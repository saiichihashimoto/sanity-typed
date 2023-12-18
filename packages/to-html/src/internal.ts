import { toHTML as toHTMLNative } from "@portabletext/to-html";
import type { PortableTextOptions as PortableTextOptionsNative } from "@portabletext/to-html";
import type { PortableTextMarkDefinition } from "@portabletext/types";

import type { PortableTextBlock } from "@portabletext-typed/types";
import type { MaybeArray } from "@sanity-typed/utils";

export const toHTML = <
  TMarkDef extends PortableTextMarkDefinition,
  TChild extends { _type: string },
  TBlockStyle extends string,
  TBlockListItem extends string
>(
  blocks: MaybeArray<
    PortableTextBlock<TMarkDef, TChild, TBlockStyle, TBlockListItem> & {
      _key: string;
    }
  >,
  options: PortableTextOptionsNative = {}
) => toHTMLNative(blocks, options);
