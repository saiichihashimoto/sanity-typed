// import { evaluate, parse } from "groq-js";
import { evaluate, parse } from "@sanity-typed/groq-js";
import type { SanityDocument } from "@sanity-typed/types";

import type { SanityValues } from "./sanity.schema";

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
    // The satisfies will throw an error if any inconsistent types are provided
  ] satisfies Extract<
    SanityValues[keyof SanityValues],
    Omit<SanityDocument, "_type">
  >[],
});

const result = await value.get();
/**
 *  typeof result === {
 *    productName: "Some Cool Product";
 *  }[]
 */
