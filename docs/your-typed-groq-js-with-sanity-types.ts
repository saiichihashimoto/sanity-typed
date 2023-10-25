// import { evaluate, parse } from "groq-js";
import { evaluate, parse } from "@sanity-typed/groq-js";
import type { SanityDocument } from "@sanity-typed/types";

import type { SanityValues } from "./sanity.config";

const input = '*[_type == "product"]{productName}';

const tree = parse(input);

const value = await evaluate(tree, {
  dataset: [
    {
      _type: "product",
      productName: "Some Cool Product",
      // ...
    },
    {
      _type: "someOtherType",
      otherField: "foo",
      // ...
    },
  ] satisfies Extract<
    SanityValues[keyof SanityValues],
    Omit<SanityDocument, "_type">
  >[],
});

const result = await value.get();
/**
 *  typeof result === {
 *    productName: string;
 *  }[]
 */

// Notice how `productName` is inferred as a `string`, not as `"Some Cool Product"`.
// Also, it's in an array as opposed to a tuple.
// This resembles the types you'd receive from @sanity-typed/client,
// which wouldn't be statically aware of `"Some Cool Product"` either.
