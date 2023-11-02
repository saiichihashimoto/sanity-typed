<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/groq-js/_README.md -->
# @sanity-typed/groq-js

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/groq-js?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/groq-js)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/groq-js?style=flat)](https://www.npmjs.com/package/@sanity-typed/groq-js?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

[groq-js](https://github.com/sanity-io/groq-js) with typed GROQ Results

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Considerations](#considerations)
  - [Using your derived types](#using-your-derived-types)
  - [The parsed tree changes in seemingly breaking ways](#the-parsed-tree-changes-in-seemingly-breaking-ways)
  - [GROQ Query results changes in seemingly breaking ways](#groq-query-results-changes-in-seemingly-breaking-ways)

## Install

```bash
npm install groq-js @sanity-typed/groq-js
```

## Usage

Use `parse` and `evaluate` exactly as you would from [`groq-js`](https://github.com/sanity-io/groq-js). Then, use the results with the typescript types!

<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE docs/your-typed-groq-js.ts -->
```your-typed-groq-js.ts```:
```typescript
// import { evaluate, parse } from "groq-js";
import { evaluate, parse } from "@sanity-typed/groq-js";

const input = '*[_type == "product"]{productName}';

const tree = parse(input);
/**
 *  typeof tree === {
 *    type: "Projection";
 *    base: {
 *      type: "Filter";
 *      base: {
 *        type: "Everything";
 *      };
 *      expr: {
 *        type: "OpCall";
 *        op: "==";
 *        left: {
 *          name: "_type";
 *          type: "AccessAttribute";
 *        };
 *        right: {
 *          type: "Value";
 *          value: "product";
 *        };
 *      };
 *    };
 *    expr: {
 *      type: "Object";
 *      attributes: [{
 *        type: "ObjectAttributeValue";
 *        name: "productName";
 *        value: {
 *          type: "AccessAttribute";
 *          name: "productName";
 *        };
 *      }];
 *    };
 *  }
 */

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
  ],
});

const result = await value.get();
/**
 *  typeof result === [{
 *    productName: "Some Cool Product";
 *  }]
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE docs/your-typed-groq-js.ts -->

## Considerations

### Using your derived types

You can also use [your typed schema](../types) to keep parity with the types [your typed client](../client) would receive.

```bash
npm install sanity groq-js @sanity-typed/types @sanity-typed/groq-js
```

<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/example-studio/schemas/product.ts -->
```product.ts```:
```typescript
// import { defineArrayMember, defineField, defineType } from "sanity";
import {
  defineArrayMember,
  defineField,
  defineType,
} from "@sanity-typed/types";

/** No changes using defineType, defineField, and defineArrayMember */
export const product = defineType({
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    defineField({
      name: "productName",
      type: "string",
      title: "Product name",
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags for item",
      of: [
        defineArrayMember({
          type: "object",
          name: "tag",
          fields: [
            defineField({ type: "string", name: "label" }),
            defineField({ type: "string", name: "value" }),
          ],
        }),
      ],
    }),
  ],
});
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/example-studio/schemas/product.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/example-studio/sanity.config.ts -->
```sanity.config.ts```:
```typescript
import { visionTool } from "@sanity/vision";
import { deskTool } from "sanity/desk";

// import { defineConfig } from "sanity";
import { defineConfig } from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { product } from "./schemas/product";

/** No changes using defineConfig */
const config = defineConfig({
  projectId: "59t1ed5o",
  dataset: "production",
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [
      product,
      // ...
    ],
  },
});

export default config;

/** Typescript type of all types! */
export type SanityValues = InferSchemaValues<typeof config>;
/**
 *  SanityValues === {
 *    product: {
 *      _createdAt: string;
 *      _id: string;
 *      _rev: string;
 *      _type: "product";
 *      _updatedAt: string;
 *      productName?: string;
 *      tags?: {
 *        _key: string;
 *        _type: "tag";
 *        label?: string;
 *        value?: string;
 *      }[];
 *    };
 *    // ... all your types!
 *  }
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/example-studio/sanity.config.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE docs/your-typed-groq-js-with-sanity-types.ts -->
```your-typed-groq-js-with-sanity-types.ts```:
```typescript
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
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE docs/your-typed-groq-js-with-sanity-types.ts -->

<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/parse-type-flakiness.md -->
### The parsed tree changes in seemingly breaking ways

`@sanity-typed/groq` attempts to type its parsed types as close as possible to [`groq-js`](https://github.com/sanity-io/groq-js)'s `parse` function output. Any fixes to match it more correctly won't be considered a major change and, if `groq-js` changes it's output in a version update, we're likely to match it. If you're using the parsed tree's types directly, this might cause your code to break. We don't consider this a breaking change because the intent of these groq libraries is to match the types of a groq query as closely as possible.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/parse-type-flakiness.md -->
<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/evaluate-type-flakiness.md -->
### GROQ Query results changes in seemingly breaking ways

Similar to [parsing](#the-parsed-tree-changes-in-seemingly-breaking-ways), evaluating groq queries will attempt to match how sanity actually evaluates queries. Again, any fixes to match that or changes to groq evaluation will likely not be considered a major change but, rather, a bug fix.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/evaluate-type-flakiness.md -->
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/groq-js/_README.md -->
