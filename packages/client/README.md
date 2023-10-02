<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/client/_README.md -->
# @sanity-typed/client

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/client?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/client)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/client?style=flat)](https://www.npmjs.com/package/@sanity-typed/client?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

[@sanity/client](https://github.com/sanity-io/client) with typed GROQ Results

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Typing an untyped client (and vice versa)](#typing-an-untyped-client-and-vice-versa)
- [Considerations](#considerations)
  - [Types match config but not actual documents](#types-match-config-but-not-actual-documents)
  - [GROQ Query results changes in seemingly breaking ways](#groq-query-results-changes-in-seemingly-breaking-ways)
- [Alternatives](#alternatives)

## Install

```bash
npm install sanity @sanity-typed/client
```

## Usage

Use `createClient` exactly as you would from [`@sanity/client`](https://github.com/sanity-io/client) with a minor change for proper type inference.

<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE docs/schemas/product.ts -->
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
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE docs/schemas/product.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE docs/sanity.config.ts -->
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
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE docs/sanity.config.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE docs/your-super-cool-application.ts -->
```your-super-cool-application.ts```:
```typescript
// import { createClient } from "@sanity/client";
import { createClient } from "@sanity-typed/client";

import type { SanityValues } from "./sanity.schema";

/** Small change using createClient */
// const client = createClient({
const client = createClient<SanityValues>()({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  useCdn: true,
  apiVersion: "2023-05-23",
});

/** Typescript type from GROQ queries! */
const data = await client.fetch('*[_type=="product"]{productName,tags}');
/**
 *  typeof data === {
 *    productName: string | null;
 *    tags: {
 *      _key: string;
 *      label?: string;
 *      value?: string;
 *    }[] | null;
 *  }[]
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE docs/your-super-cool-application.ts -->

The `createClient<SanityValues>()(config)` syntax is due to having to infer one generic (the config shape) while explicitly providing the Sanity Values' type, [which can't be done in the same generics](https://github.com/microsoft/TypeScript/issues/10571).

<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE /Users/shayan/Workspace/docs/client-cast-to-typed.md -->
## Typing an untyped client (and vice versa)

Sometimes, you'll have a preconfigured client from a separate library (notably, [`next-sanity`](https://github.com/sanity-io/next-sanity)) that you will still want typed results from. A `castToTyped` function is provided to do just that.

```typescript
import { createClient } from "next-sanity";

import { castToTyped } from "@sanity-typed/client";

import type { SanityValues } from "./sanity.schema";

const client = createClient({
  // ...
});

// Same function signature as the typed `createClient`
const typedClient = castToTyped<SanityValues>()(client);

// Also, if you need the config in the client (eg. for queries using $param),
// you can provide the same config again to include it in the types.

// const typedClient = castToTyped<SanityValues>()(client, {
//   ...same contents from createClient
// });

const data = await typedClient.fetch("*");
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

Similarly, if you have a typed client that you want to untype (presumably to export from a library for general consumption), the opposite exists as well:

```typescript
import { castFromTyped, createClient } from "@sanity-typed/client";

import type { SanityValues } from "./sanity.schema";

const client = createClient<SanityValues>()({
  // ...
});

export const typedClient = client;

export const untypedClient = castFromTyped(client);

export default untypedClient;
```

Neither of these functions (nor the `createClient` function) have any runtime implications; they pass through the initial client unaltered.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE /Users/shayan/Workspace/docs/client-cast-to-typed.md -->

## Considerations

<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/types-vs-content-lake.md -->
### Types match config but not actual documents

As your sanity driven application grows over time, your config is likely to change. Keep in mind that you can only derive types of your current config, while documents in your Sanity Content Lake will have shapes from older configs. This can be a problem when adding new fields or changing the type of old fields, as the types won't can clash with the old documents.

Ultimately, there's nothing that can automatically solve this; we can't derive types from a no longer existing config. This is a consideration with or without types: your application needs to handle all existing documents. Be sure to make changes in a backwards compatible manner (ie, make new fields optional, don't change the type of old fields, etc).

Another solution would be to keep old configs around, just to derive their types:

```typescript
const config = defineConfig({
  schema: {
    types: [foo],
  },
  plugins: [myPlugin()],
});

const oldConfig = defineConfig({
  schema: {
    types: [oldFoo],
  },
  plugins: [myPlugin()],
});

type SanityValues =
  | InferSchemaValues<typeof config>
  | InferSchemaValues<typeof oldConfig>;
```

This can get unweildy although, if you're deligent about data migrations of your old documents to your new types, you may be able to deprecate old configs and remove them from your codebase.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/types-vs-content-lake.md -->
<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/evaluate-type-flakiness.md -->
### GROQ Query results changes in seemingly breaking ways

Similar to [parsing](#the-parsed-tree-changes-in-seemingly-breaking-ways), evaluating groq queries will attempt to match how sanity actually evaluates queries. Again, any fixes to match that or changes to groq evaluation will likely not be considered a major change but, rather, a bug fix.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/evaluate-type-flakiness.md -->

## Alternatives

- [`@sanity-codegen/client`](https://www.npmjs.com/package/@sanity-codegen/client)
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/client/_README.md -->
