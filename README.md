<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE _README.md -->
# @sanity-typed

[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

End to end Sanity types without any explicit typing, from config to fetch!

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Goals](#goals)

## Install

```bash
npm install sanity @sanity-typed/client @sanity-typed/types
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

/** No changes using defineType, defineField, and defineArrayMember https://www.sanity.io/docs/schema-field-types#e5642a3e8506 */
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
import { deskTool } from "sanity/desk";

// import { defineConfig } from "sanity";
import { defineConfig } from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { product } from "./schemas/product";

/** No changes using defineConfig https://www.sanity.io/docs/config-api-reference#dd1dc18716de */
const config = defineConfig({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  plugins: [deskTool()],
  schema: {
    types: [product],
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
 *  }
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/types/docs/sanity.config.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/client/docs/your-super-cool-application.ts -->
```your-super-cool-application.ts```:
```typescript
// import { createClient } from "@sanity/client";
import { createClient } from "@sanity-typed/client";

// See the API for this in https://github.com/saiichihashimoto/sanity-typed/tree/main/packages/types
import type { SanityValues } from "./sanity.schema";

/** Small change using createClient https://www.sanity.io/docs/config-api-reference#dd1dc18716de */
// const client = createClient({
const client = createClient<SanityValues>()({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  useCdn: true,
  apiVersion: "2023-05-23",
});

/** Typescript type from GROQ queries! */
const data = await client.fetch('*[_type=="product"]');
/**
 *  typeof data === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: "product";
 *    _updatedAt: string;
 *    productName?: string;
 *    tags?: {
 *      _key: string;
 *      label?: string;
 *      value?: string;
 *    }[];
 *  }[]
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/client/docs/your-super-cool-application.ts -->

## Goals

The popularity of typescript happened after sanity took off and the typescript values haven't found their way in. The `define*` methods are a good start, but they type the schema, not the values. There's been attempts (ie [`sanity-codegen`](https://github.com/ricokahler/sanity-codegen), [`@sanity-typed/schema-builder`](https://github.com/saiichihashimoto/sanity-typed/tree/%40sanity-typed/schema-builder%403.0.1/packages/schema-builder)) but they take the approach of creating a new way of building schemas. The drop-in replacement approach allows for (close to) zero migration cost.

The long term goal is to deprecate the monorepo altogether. This was built seperately to move quickly and these features should be in sanity directly (and is likely one of their internal goals). The drop-in approach has kept this in mind; the closer the API is to the native API, the easier the merge could be. Ideally, this whole library can be iteratively merged in and eventually be deprecated.
<!-- <<<<<< END GENERATED FILE (include): SOURCE _README.md -->
