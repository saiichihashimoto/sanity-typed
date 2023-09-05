<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/groq-js/_README.md -->
# @sanity-typed/groq-js

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/groq-js?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/groq-js)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/groq-js?style=flat)](https://www.npmjs.com/package/@sanity-typed/groq-js?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Typed [GROQ-JS](https://github.com/sanity-io/groq-js) Results, all inferred, no query changes!

## Page Contents
- [Install](#install)
- [Usage](#usage)

## Install

```bash
npm install groq-js @sanity-typed/groq-js
```

## Usage

Use `parse` and `evaluate` exactly as you would from [`groq-js`](https://github.com/sanity-io/groq-js). Then, use the results with the typescript types!

<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/groq-js/docs/your-typed-groq-js.ts -->
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
 *  typeof result === {
 *    productName: "Some Cool Product";
 *  }[]
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/groq-js/docs/your-typed-groq-js.ts -->

You can also use [your typed schema](../types) and creative use of the [`satisfies` operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator) to keep parity with your schema!

```bash
npm install sanity groq-js @sanity-typed/types @sanity-typed/groq-js
```

<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/types/docs/schemas/product.ts -->
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
            { type: "string", name: "label" },
            { type: "string", name: "value" },
          ],
        }),
      ],
    }),
  ],
});
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/types/docs/schemas/product.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/types/docs/sanity.config.ts -->
```sanity.config.ts```:
```typescript
// import { defineConfig } from "sanity";
import { defineConfig } from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { product } from "./schemas/product";

/** No changes using defineConfig */
const config = defineConfig({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
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
 *        label?: string;
 *        value?: string;
 *      }[];
 *    };
 *    // ... all your types!
 *  }
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/types/docs/sanity.config.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/groq-js/docs/your-provided-types-groq-js.ts -->
```your-provided-types-groq-js.ts```:
```typescript
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
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/groq-js/docs/your-provided-types-groq-js.ts -->
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/groq-js/_README.md -->
