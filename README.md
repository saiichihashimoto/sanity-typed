<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE _README.md -->
# @sanity-typed

[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Completing [sanity](https://www.sanity.io/)'s developer experience with typescript (and more)!

## Page Contents
- [Packages](#packages)
- [Features](#features)
- [Quick Start](#quick-start)

## Packages

- [`@sanity-typed/types`](packages/types): Infer Sanity Document Types from Sanity Schemas
- [`@sanity-typed/client`](packages/client): [@sanity/client](https://github.com/sanity-io/client) with typed GROQ Results
- [`@sanity-typed/zod`](packages/zod): Generate [Zod](https://zod.dev) Schemas from Sanity Schemas
- [`@sanity-typed/faker`](packages/faker): Generate Mock Data from Sanity Schemas
- [`@sanity-typed/client-mock`](packages/client-mock): Mock @sanity-typed/client for local development and testing
- [`@sanity-typed/groq`](packages/groq): Infer [GROQ](https://github.com/sanity-io/groq) Result Types from GROQ strings
- [`@sanity-typed/groq-js`](packages/groq-js): [groq-js](https://github.com/sanity-io/groq-js) with typed GROQ Results

## Features

This project aims to complete sanity's developer experience with (almost) completely drop-in solutions. It's scope includes:

1. Typescript for all Sanity results

- [x] [Typed Sanity Documents](packages/types)
- [x] [Typed GROQ Queries](packages/groq)
- [x] [Typed Sanity Client](packages/client)

2. Fully local development environment

- [x] [Mocked Sanity Documents](packages/faker)
- [x] [Local GROQ execution](packages/groq-js)
- [x] [Mocked Sanity Client](packages/client-mock)

3. Runtime safety for all Sanity results

- [x] [Sanity Documents Zod Parser](packages/zod)
- [ ] [GROQ Queries Zod Parser](https://github.com/saiichihashimoto/sanity-typed/issues/306)

With the full suite, everything would be fully typed, runtime safe, and fully local. The drop-in nature means that working these solutions into native sanity is a possibility and keeps new documentation and learning curve to a minimum.

## Quick Start

```bash
npm install sanity @sanity-typed/client @sanity-typed/types
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
      validation: (Rule) => Rule.required(),
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
 *      productName: string;
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
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/example-app/src/sanity/client.ts -->
```client.ts```:
```typescript
import type { SanityValues } from "sanity.config";

// import { createClient } from "@sanity/client";
import { createClient } from "@sanity-typed/client";

/** Small change using createClient */
// export const client = createClient({
export const client = createClient<SanityValues>()({
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
});

export const makeTypedQuery = async () =>
  client.fetch('*[_type=="product"]{_id,productName,tags}');
/**
 *  typeof makeTypedQuery === () => Promise<{
 *    _id: string;
 *    productName: string;
 *    tags: {
 *      _key: string;
 *      _type: "tag";
 *      label?: string;
 *      value?: string;
 *    }[] | null;
 *  }[]>
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/example-app/src/sanity/client.ts -->
<!-- <<<<<< END GENERATED FILE (include): SOURCE _README.md -->
