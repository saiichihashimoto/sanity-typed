# @sanity-typed/types

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/types?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/types)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/types?style=flat)](https://www.npmjs.com/package/@sanity-typed/types?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](https://github.com/saiichihashimoto/sanity-typed/blob/main/LICENSE)

Typed Sanity Documents with zero schema changes!

## Install

```bash
npm install @sanity-typed/types sanity
```

## Usage

Use `defineType`, `defineField`, and `defineArrayMember` from this library exactly as you would from [sanity's own exports](https://www.sanity.io/docs/schema-field-types#e5642a3e8506). Then, you can `InferValue` to have the typescript type!

```typescript
// From sanity's docs: https://www.sanity.io/docs/schema-field-types#e5642a3e8506
// import { defineField, defineType } from "sanity";
import { defineField, defineType } from "@sanity-typed/types";
// This is where the magic happens
import { InferValue } from "@sanity-typed/types";

// Import this into sanity's createSchema, as usual.
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

// Import this into your application!
export type Product = InferValue<typeof product>;

/**
 *  Product === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: string;
 *    _updatedAt: string;
 *    productName?: string;
 *    tags?: ({
 *      label?: string;
 *      value: string;
 *    })[];
 *  };
 **/
```

## Goals

Typescript was an after-the-fact concern with sanity, since the rise of typescript happened after sanity took off. The `define*` methods are a good start, but they only help restrict the schema, not type the document types. There's been attempts, namely [`sanity-codegen`](https://github.com/ricokahler/sanity-codegen) and [`@sanity-typed/schema-builder`](https://github.com/saiichihashimoto/sanity-typed/tree/main/packages/schema-builder), but they take the approach of creating a new way of building schemas. The drop-in replacement approach allows for zero migration cost.

The long term goal is to deprecate `@sanity-typed/types` altogether. Building this seperately was in service of moving quickly and these should be in sanity directly (and is likely one of their internal goals). The idea is to introduce these changes iteratively into sanity itself while removing them from this library, until it's reduced to simply passing through the `define*` methods directly, and will then be deprecated.

This shouldn't deter you from using it! Under the hood, it's passing all the inputs to sanity's native `define*` methods, so you shouldn't have any runtime differences. With all the typings being attempting to make their way into sanity, you should keep all the benefits of just importing the `define*` methods and noticing no differences.
