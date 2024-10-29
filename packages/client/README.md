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

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Usage with `groqd` (actually `groq-builder`)](#usage-with-groqd-actually-groq-builder)
- [Typing an untyped client (and vice versa)](#typing-an-untyped-client-and-vice-versa)
- [Considerations](#considerations)
  - [Types match config but not actual documents](#types-match-config-but-not-actual-documents)
  - [GROQ Query results changes in seemingly breaking ways](#groq-query-results-changes-in-seemingly-breaking-ways)
  - [Typescript Errors in IDEs](#typescript-errors-in-ides)
    - [VSCode](#vscode)
  - [`Type instantiation is excessively deep and possibly infinite`](#type-instantiation-is-excessively-deep-and-possibly-infinite)
- [Breaking Changes](#breaking-changes)
  - [3 to 4](#3-to-4)
    - [Typescript version from 5.4.2 <= x <= 5.6.3](#typescript-version-from-542--x--563)
  - [2 to 3](#2-to-3)
    - [No more `createClient<SanityValues>()(config)`](#no-more-createclientsanityvaluesconfig)
  - [1 to 2](#1-to-2)
    - [Removal of `castFromTyped`](#removal-of-castfromtyped)
- [Alternatives](#alternatives)

## Install

```bash
npm install sanity @sanity-typed/client
```

## Usage

Use `createClient` exactly as you would from [`@sanity/client`](https://github.com/sanity-io/client).

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
```sanity.config.ts```:
```typescript
import { structureTool } from "sanity/structure";

// import { defineConfig } from "sanity";
import { defineConfig } from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { post } from "./schemas/post";
import { product } from "./schemas/product";

/** No changes using defineConfig */
const config = defineConfig({
  projectId: "59t1ed5o",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [
      product,
      // ...
      post,
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
```client.ts```:
```typescript
import type { SanityValues } from "sanity.config";

// import { createClient } from "@sanity/client";
import { createClient } from "@sanity-typed/client";

// export const client = createClient({
export const client = createClient<SanityValues>({
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

## Usage with `groqd` (actually `groq-builder`)

[@scottrippey](https://github.com/scottrippey) is working on an amazing typed [`groqd`](https://formidable.com/open-source/groqd/) called [`groq-builder`](https://github.com/FormidableLabs/groqd/tree/main/packages/groq-builder), a schema-aware, strongly-typed GROQ query builder with auto-completion and type-checking for your GROQ queries. When given a function, `fetch` will provide a GROQ builder for your use:

```bash
npm install groq-builder
```

```client-with-groq-builder.ts```:
```typescript
import type { SanityValues } from "sanity.config";

import { createClient } from "@sanity-typed/client";

export const client = createClient<SanityValues>({
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
});

export const makeTypedQuery = async () =>
  /** No need for createGroqBuilder, `q` is already typed! */
  client.fetch((q) =>
    q.star
      .filterByType("product")
      .project({ _id: true, productName: true, tags: true })
  );
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

It will use the returned `query` and `parse` directly so you get typed results and runtime validation.

Deciding between using `groq-builder` or directly typed queries is your decision! There are pros or cons to consider:

- Typescript isn't optimized for parsing strings the way [`@sanity-typed/groq`](../packages/groq) does, which can run into strange errors. Meanwhile, a builder is typescript-first, allowing for complex structures without any issues.
- Runtime validation is amazing! It was something [I considered and abandoned](https://github.com/saiichihashimoto/sanity-typed/issues/306) so it's great to have a solution.
- The way `@sanity-typed/groq` had to be written, it can't do any auto-completion in IDEs like `groq-builder` can. There was no way around this. Typed objects and methods are going to be superior to parsing a string. Again, typescript wasn't made for it.
- There _is_ something to be said for writing queries in their native syntax with less layers between. Writing GROQ queries directly lets you concern yourself only with their documentation, especially when issues arise.
- I'm not 100% certain that `groq-builder` handles all GROQ operations.
- `groq-builder` is currently in beta. You'll need to reference [`groqd`'s documentation](https://formidable.com/open-source/groqd/) and sometimes they don't match 1-to-1.

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

This can get unwieldy although, if you're diligent about data migrations of your old documents to your new types, you may be able to deprecate old configs and remove them from your codebase.
### GROQ Query results changes in seemingly breaking ways

Similar to [parsing](#the-parsed-tree-changes-in-seemingly-breaking-ways), evaluating groq queries will attempt to match how sanity actually evaluates queries. Again, any fixes to match that or changes to groq evaluation will likely not be considered a major change but, rather, a bug fix.
### Typescript Errors in IDEs

Often you'll run into an issue where you get typescript errors in your IDE but, when building workspace (either you studio or app using types), there are no errors. This only occurs because your IDE is using a different version of typescript than the one in your workspace. A few debugging steps:

#### VSCode

- The [`JavaScript and TypeScript Nightly` extension (identifier `ms-vscode.vscode-typescript-next`)](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next) creates issues here by design. It will always attempt to use the newest version of typescript instead of your workspace's version. I ended up uninstalling it.
- [Check that VSCode is actually using your workspace's version](https://code.visualstudio.com/docs/typescript/typescript-compiling#_compiler-versus-language-service) even if you've [defined the workspace version in `.vscode/settings.json`](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript). Use `TypeScript: Select TypeScript Version` to explictly pick the workspace version.
- Open any typescript file and you can [see which version is being used in the status bar](https://code.visualstudio.com/docs/typescript/typescript-compiling#_compiler-versus-language-service). Please check this (and provide a screenshot confirming this) before creating an issue. Spending hours debugging your issue ony to find that you're not using your workspace's version is very frustrating.
### `Type instantiation is excessively deep and possibly infinite`

**🚨 CHECK [`Typescript Errors in IDEs`](#typescript-errors-in-ides) FIRST!!! ISSUES WILL GET CLOSED IMMEDIATELY!!! 🚨**

You might run into the dreaded `Type instantiation is excessively deep and possibly infinite` error when writing GROQ queries. This isn't [too uncommon with more complex GROQ queries](https://github.com/saiichihashimoto/sanity-typed/issues?q=is%3Aissue+instantiation+is%3Aclosed). Unfortunately, this isn't a completely avoidable problem, as typescript has limits on complexity and parsing types from a string is an inherently complex problem. A set of steps for a workaround:

1. While not ideal, use [`@ts-expect-error`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments) to disable the error. You could use [`@ts-ignore` instead](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#ts-ignore-or-ts-expect-error), but ideally you'd like to remove the comment if a fix is released.
2. You still likely want manual types. Intersect the returned type with whatever is missing as a patch.
3. Create a PR in [`groq/src/specific-issues.test.ts`](../groq/src/specific-issues.test.ts) with your issue. [#642](https://github.com/saiichihashimoto/sanity-typed/pull/642/files) is a great example for this. Try to reduce your query and config as much as possible. The goal is a minimal reproduction.
4. If a PR isn't possible, make an issue with the same content. ie, the query and config you're using. Again, reduce them as much as possible. And then, now that you've done all the work, move it into a PR instead!
5. I'm one person and some of these issues are quite complex. Take a stab at fixing the bug! There's a ridiculous amount of tests so it's relatively safe to try things out.

People will sometimes create a repo with their issue. _Please_ open a PR with a minimal test instead. Without a PR there will be no tests reflecting your issue and it may appear again in a regression. Forking a github repo to make a PR is a more welcome way to contribute to an open source library.

## Breaking Changes

### 3 to 4

#### Typescript version from 5.4.2 <= x <= 5.6.3

The supported Typescript version is now 5.4.2 <= x <= 5.6.3. Older versions are no longer supported and newer versions will be added as we validate it.

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
