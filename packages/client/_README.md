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

[![Watch How to Type Your Sanity Document and Client](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/886bd64a-00fb-473c-a60a-205a8a6767ad)](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/13c28e6a-74a7-4b3c-8162-61fae921323b)

@[:page_toc](## Page Contents)

## Install

```bash
npm install sanity @sanity-typed/client
```

## Usage

Use `createClient` exactly as you would from [`@sanity/client`](https://github.com/sanity-io/client) with a minor change for proper type inference.

@[typescript](../example-studio/schemas/product.ts)
@[typescript](../example-studio/sanity.config.ts)
@[typescript](../example-app/src/sanity/client.ts)

The `createClient<SanityValues>()(config)` syntax is due to having to infer one generic (the config shape) while explicitly providing the Sanity Values' type, [which can't be done in the same generics](https://github.com/microsoft/TypeScript/issues/10571).

## Typing an untyped client (and vice versa)

Sometimes, you'll have a preconfigured client from a separate library (notably, [`next-sanity`](https://github.com/sanity-io/next-sanity)) that you will still want typed results from. A `castToTyped` function is provided to do just that.

```typescript
import { createClient } from "next-sanity";

import { castToTyped } from "@sanity-typed/client";

import type { SanityValues } from "./sanity.config";

import type { SanityClient } from "sanity";

const client = createClient({
  // ...
});

// Same function signature as the typed `createClient`
const typedClient = castToTyped<SanityValues>()(client as SanityClient);

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

import type { SanityValues } from "./sanity.config";

const client = createClient<SanityValues>()({
  // ...
});

export const typedClient = client;

export const untypedClient = castFromTyped(client);

export default untypedClient;
```

Neither of these functions (nor the `createClient` function) have any runtime implications; they pass through the initial client unaltered.

## Considerations

@[:markdown](../../docs/considerations/types-vs-content-lake.md)
@[:markdown](../../docs/considerations/evaluate-type-flakiness.md)

## Alternatives

- [`@sanity-codegen/client`](https://www.npmjs.com/package/@sanity-codegen/client)
