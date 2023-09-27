<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/faker/_README.md -->
# @sanity-typed/faker

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/faker?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/faker)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/faker?style=flat)](https://www.npmjs.com/package/@sanity-typed/faker?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Generate Mock Data from Sanity Schemas

## Page Contents
- [Install](#install)
- [Usage](#usage)
  - [Features](#features)

## Install

```bash
npm install sanity @faker-js/faker @sanity-typed/faker
```

## Usage

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
            defineField({ type: "string", name: "label" }),
            defineField({ type: "string", name: "value" }),
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
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/faker/docs/mocks.ts -->
```mocks.ts```:
```typescript
import { base, en } from "@faker-js/faker";

import { sanityConfigToFaker } from "@sanity-typed/faker";

import { config } from "./sanity.schema";

const sanityFaker = sanityConfigToFaker(config, {
  faker: { locale: [en, base] },
});

const mock = sanityFaker.product();
/**
 *  mock === {
 *    _createdAt: "2011-12-15T03:57:59.213Z",
 *    _id: "9bd9d8d6-9a67-44e0-af46-7cc8796ed151",
 *    _rev: "1mPXM8RRYtNNswMG7IDA8x",
 *    _type: "product",
 *    _updatedAt: "2029-01-01T06:23:59.079Z",
 *    productName: "Deduco tyrannus v",
 *    tags: [
 *      {
 *        _key: "4d8edf97d9df21feee3472a6",
 *        _type: "tag",
 *        label: "Cuppedi",
 *        value: "Defleo bis min"
 *      },
 *      {
 *        _key: "fec59aa5d372ee63b4e8ec02",
 *        _type: "tag",
 *        label: "Communis molestiae a",
 *        value: "Solitud"
 *      },
 *      {
 *        _key: "a0096f276a2f6d9e14fccd5b",
 *        _type: "tag",
 *        label: "Speculum alo v"
 *      },
 *      {
 *        _key: "c803ec5fa6f95ac8ddce4dee",
 *        _type: "tag",
 *        label: "Aliquid",
 *        value: "Turba c"
 *      }
 *    ]
 *  }
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/faker/docs/mocks.ts -->

### Features

- `reference._ref` will point to the correct `document._id`, so you can use [`groq-js` or `@sanity-typed/groq-js`](../groq-js) and be certain that your references will work.
  - How this works is that, for any `sanityConfigToFaker(...).type()`, the first 5 documents will have references that only point to ids of the first 5 documents of that type. For example, if type `foo` had references that pointed to type `bar`, then all references in the first 5 mocks of `foo` could only point to the first 5 mocks of `bar`. If you want to change this number, pass a different `referencedChunkSize` to `sanityConfigToFaker(config, { faker, referencedChunkSize })`. The [tests for this](./src/document-id-memo.test.ts) are a good explanation.
  - TLDR, mock 5 of every document, all their references will point to each other. If you want more or less, change `referencedChunkSize`.
- Any field's mocked values should stay consistent, even as you change the other fields. If you're using `slug` for url paths, this will keep your emails consistent as schemas change.
  - Fakers are instantiated per schema type with a seed corresponding to the field's path. This will hopefully keep "mock flux" to a minimum, so only fields you change should generate new mock data. The [tests for this](./src/consistency.test.ts) are a good explanation.
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/faker/_README.md -->
