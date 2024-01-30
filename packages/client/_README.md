# @sanity-typed/client

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/client?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/client)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/client?style=flat)](https://www.npmjs.com/package/@sanity-typed/client?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

[@sanity/client](https://github.com/sanity-io/client) with typed GROQ Results

[![Watch How to Type Your Sanity Document and Client](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/886bd64a-00fb-473c-a60a-205a8a6767ad)](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/13c28e6a-74a7-4b3c-8162-61fae921323b)

@[:page_toc](## Page Contents)

## Install

```bash
npm install sanity @sanity-typed/client
```

## Usage

Use `createClient` exactly as you would from [`@sanity/client`](https://github.com/sanity-io/client).

@[typescript](../example-studio/schemas/product.ts)
@[typescript](../example-studio/sanity.config.ts)
@[typescript](../example-app/src/sanity/client.ts)

@[:markdown](../../docs/usage-with-groqd.md)

## Typing an untyped client (and vice versa)

Sometimes, you'll have a preconfigured client from a separate library that you will still want typed results from. A `castToTyped` function is provided to do just that.

```typescript
import { createClient } from "some-other-create-client";

import { castToTyped } from "@sanity-typed/client";

import type { SanityValues } from "./sanity.config";

const client = createClient({
  // ...
});

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

This function (nor the `createClient` function) have any runtime implications; it passes through the initial client unaltered.

Similarly, if you have a typed client that you want to untype (presumably to export from a library for general consumption), you can always cast it:

```typescript
import type { SanityClient as SanityClientNative } from "@sanity/client";

import { createClient } from "@sanity-typed/client";

import type { SanityValues } from "./sanity.config";

const client = createClient<SanityValues>({
  // ...
});

export const typedClient = client;

export const untypedClient = client as SanityClientNative;

export default untypedClient;
```

## Considerations

@[:markdown](../../docs/considerations/types-vs-content-lake.md)
@[:markdown](../../docs/considerations/evaluate-type-flakiness.md)
@[:markdown](../../docs/considerations/typescript-errors-in-ides.md)
@[:markdown](../../docs/considerations/type-instantiation-is-excessively-deep-and-possibly-infinite-query.md)

## Breaking Changes

### 2 to 3

#### No more `createClient<SanityValues>()(config)`

Removing the double function signature from `createClient`:

```diff
- const client = createClient<SanityValues>()({
+ const client = createClient<SanityValues>({
  // ...
});
```

We no longer derive types from your config values. Most of the types weren't significant, but the main loss will be `_originalId` when the `perspective` was `"previewDrafts"`.

### 1 to 2

#### Removal of `castFromTyped`

Casting from typed to untyped is now just a simple cast:

```diff
+ import type { SanityClient as SanityClientNative } from "@sanity/client";

- import { castFromTyped, createClient } from "@sanity-typed/client";
+ import { createClient } from "@sanity-typed/client";

import type { SanityValues } from "./sanity.config";

const client = createClient<SanityValues>()({
  // ...
});

export const typedClient = client;

- export const untypedClient = castFromTyped(client);
+ export const untypedClient = client as SanityClientNative;

export default untypedClient;
```

`castToTyped` still exists.

## Alternatives

- [`@sanity-codegen/client`](https://www.npmjs.com/package/@sanity-codegen/client)
