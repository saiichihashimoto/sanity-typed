# @sanity-typed/client-mock

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/client-mock?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/client-mock)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/client-mock?style=flat)](https://www.npmjs.com/package/@sanity-typed/client-mock?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

Mock [@sanity-typed/client](../client) for local development and testing

[![Watch How to Offline Your Sanity Client and Generate Mock Data](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/fc2be145-d504-46e3-9e77-6090c3024885)](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/fed71d58-6b08-467a-a325-b197f563a328)

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Usage with `groqd` (actually `groq-builder`)](#usage-with-groqd-actually-groq-builder)
- [Considerations](#considerations)
  - [GROQ Query results changes in seemingly breaking ways](#groq-query-results-changes-in-seemingly-breaking-ways)
  - [`Type instantiation is excessively deep and possibly infinite`](#type-instantiation-is-excessively-deep-and-possibly-infinite)
- [Breaking Changes](#breaking-changes)
  - [1 to 2](#1-to-2)
    - [No more `createClient<SanityValues>()(config)`](#no-more-createclientsanityvaluesconfig)
- [Alternatives](#alternatives)

## Install

```bash
npm install sanity @sanity-typed/client-mock
```

## Usage

Use `createClient` instead of the `createClient` from [`@sanity-typed/client`](../client) and include initial documents.

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
import { deskTool } from "sanity/desk";

// import { defineConfig } from "sanity";
import { defineConfig } from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { post } from "./schemas/post";
import { product } from "./schemas/product";

/** No changes using defineConfig */
const config = defineConfig({
  projectId: "59t1ed5o",
  dataset: "production",
  plugins: [deskTool()],
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
```mocked-client.ts```:
```typescript
import type { SanityValues } from "sanity.config";

// import { createClient } from "@sanity-typed/client";
import { createClient } from "@sanity-typed/client-mock";

// export const client = createClient({
export const client = createClient<SanityValues>({
  documents: [
    {
      _createdAt: "2011-12-15T03:57:59.213Z",
      _id: "id",
      _rev: "rev",
      _type: "product",
      _updatedAt: "2029-01-01T06:23:59.079Z",
      productName: "Mock Product",
      tags: [
        {
          _key: "key",
          _type: "tag",
          label: "Mock Tag Label",
          value: "Mock Tag Value",
        },
      ],
    },
    // ...
  ],

  // ...@sanity/client options
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
});

export const makeTypedQuery = async () =>
  client.fetch('*[_type=="product"]{_id,productName,tags}');
/**
 *  makeTypedQuery() === Promise<[{
 *    _id: "id",
 *    productName: "Mock Product",
 *    tags: [
 *      {
 *        _key: "key",
 *        _type: "tag",
 *        label: "Mock Tag Label",
 *        value: "Mock Tag Value",
 *      },
 *    ],
 *  }]>
 */
```

Depending on your tree-shaking setup, you'll want to swap between the real client and the mock client. Additionally, using [`@sanity-typed/faker`](../faker) along with the mock client can be a great way to generate fake data.

```mocks.ts```:
```typescript
import { base, en } from "@faker-js/faker";
import config from "sanity.config";

import { sanityConfigToFaker, sanityDocumentsFaker } from "@sanity-typed/faker";

export const getMockDataset = () => {
  const sanityFaker = sanityConfigToFaker(config, {
    faker: { locale: [en, base] },
  });
  /**
   *  typeof sanityFaker === {
   *    [type in keyof SanityValues]: () => SanityValues[type];
   *  }
   */

  const documentsFaker = sanityDocumentsFaker(config, sanityFaker);
  /**
   *  typeof documentsFaker === () => SanityValues[keyof SanityValues][]
   */

  return documentsFaker();
};
```
```swapping-client.ts```:
```typescript
import type { SanityValues } from "sanity.config";

import { createClient as createLiveClient } from "@sanity-typed/client";
import { createClient as createMockClient } from "@sanity-typed/client-mock";

import { getMockDataset } from "./mocks";

const config = {
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
};

export const client = process.env.VERCEL
  ? createLiveClient<SanityValues>(config)
  : createMockClient<SanityValues>({ ...config, documents: getMockDataset() });

export const makeTypedQuery = async () =>
  client.fetch('*[_type=="product"]{_id,productName,tags}');
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

## Considerations

### GROQ Query results changes in seemingly breaking ways

Similar to [parsing](#the-parsed-tree-changes-in-seemingly-breaking-ways), evaluating groq queries will attempt to match how sanity actually evaluates queries. Again, any fixes to match that or changes to groq evaluation will likely not be considered a major change but, rather, a bug fix.
### `Type instantiation is excessively deep and possibly infinite`

You might run into the dreaded `Type instantiation is excessively deep and possibly infinite` error when writing GROQ queries. This isn't [too uncommon with more complex GROQ queries](https://github.com/saiichihashimoto/sanity-typed/issues?q=is%3Aissue+instantiation+is%3Aclosed). Unfortunately, this isn't a completely avoidable problem, as typescript has limits on complexity and parsing types from a string is an inherently complex problem. A set of steps for a workaround:

1. While not ideal, use [`@ts-expect-error`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments) to disable the error. You could use [`@ts-ignore` instead](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#ts-ignore-or-ts-expect-error), but ideally you'd like to remove the comment if a fix is released.
2. You still likely want manual types. Intersect the returned type with whatever is missing as a patch.
3. Create a PR in [`groq/src/specific-issues.test.ts`](../groq/src/specific-issues.test.ts) with your issue. [#642](https://github.com/saiichihashimoto/sanity-typed/pull/642/files) is a great example for this. Try to reduce your query and config as much as possible. The goal is a minimal reproduction.
4. If a PR isn't possible, make an issue with the same content. ie, the query and config you're using. Again, reduce them as much as possible. And then, now that you've done all the work, move it into a PR instead!
5. I'm one person and some of these issues are quite complex. Take a stab at fixing the bug! There's a ridiculous amount of tests so it's relatively safe to try things out.

People will sometimes create a repo with their issue. _Please_ open a PR with a minimal test instead. Without a PR there will be no tests reflecting your issue and it may appear again in a regression. Forking a github repo to make a PR is a more welcome way to contribute to an open source library.

## Breaking Changes

### 1 to 2

#### No more `createClient<SanityValues>()(config)`

Removing the double function signature from `createClient` and renaming `dataset` to `documents`:

```diff
- const client = createClient<SanityValues>({
-   dataset: [/* ... */],
- })({
+ const client = createClient<SanityValues>({
+ documents: [/* ... */],
  dataset: "production",
  // ...
});
```

We no longer derive types from your config values. Most of the types weren't significant, but the main loss will be `_originalId` when the `perspective` was `"previewDrafts"`.

## Alternatives

- [`fake-sanity-client`](https://www.npmjs.com/package/fake-sanity-client)
