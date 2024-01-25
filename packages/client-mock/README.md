<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/client-mock/_README.md -->
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
- [Considerations](#considerations)
  - [GROQ Query results changes in seemingly breaking ways](#groq-query-results-changes-in-seemingly-breaking-ways)
  - [`Type instantiation is excessively deep and possibly infinite`](#type-instantiation-is-excessively-deep-and-possibly-infinite)
- [Alternatives](#alternatives)

## Install

```bash
npm install sanity @sanity-typed/client-mock
```

## Usage

Use `createClient` instead of the `createClient` from [`@sanity-typed/client`](../client) and include initial documents.

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
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/example-studio/sanity.config.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/example-app/src/sanity/mocked-client.ts -->
```mocked-client.ts```:
```typescript
import type { SanityValues } from "sanity.config";

// import { createClient } from "@sanity-typed/client";
import { createClient } from "@sanity-typed/client-mock";

/** Small change using createClient */
// export const client = createClient({
export const client = createClient<SanityValues>({
  dataset: [
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
})({
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
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/example-app/src/sanity/mocked-client.ts -->

Depending on your tree-shaking setup, you'll want to swap between the real client and the mock client. Additionally, using [`@sanity-typed/faker`](../faker) along with the mock client can be a great way to generate fake data.

<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/example-app/src/sanity/mocks.ts -->
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
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/example-app/src/sanity/mocks.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/example-app/src/sanity/swapping-client.ts -->
```swapping-client.ts```:
```typescript
import type { SanityValues } from "sanity.config";

import { createClient as createLiveClient } from "@sanity-typed/client";
import { createClient as createMockClient } from "@sanity-typed/client-mock";

import { getMockDataset } from "./mocks";

const createClient = process.env.VERCEL
  ? createLiveClient<SanityValues>()
  : createMockClient<SanityValues>({ dataset: getMockDataset() });

export const client = createClient({
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
});

export const makeTypedQuery = async () =>
  client.fetch('*[_type=="product"]{_id,productName,tags}');
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/example-app/src/sanity/swapping-client.ts -->

## Considerations

<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/evaluate-type-flakiness.md -->
### GROQ Query results changes in seemingly breaking ways

Similar to [parsing](#the-parsed-tree-changes-in-seemingly-breaking-ways), evaluating groq queries will attempt to match how sanity actually evaluates queries. Again, any fixes to match that or changes to groq evaluation will likely not be considered a major change but, rather, a bug fix.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/evaluate-type-flakiness.md -->
<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/type-instantiation-is-excessively-deep-and-possibly-infinite-query.md -->
### `Type instantiation is excessively deep and possibly infinite`

You might run into the dreaded `Type instantiation is excessively deep and possibly infinite` error when writing GROQ queries. This isn't [too uncommon with more complex GROQ queries](https://github.com/saiichihashimoto/sanity-typed/issues?q=is%3Aissue+instantiation+is%3Aclosed). Unfortunately, this isn't a completely avoidable problem, as typescript has limits on complexity and parsing types from a string is an inherently complex problem. A set of steps for a workaround:

1. While not ideal, use [`@ts-expect-error`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments) to disable the error. You could use [`@ts-ignore` instead](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#ts-ignore-or-ts-expect-error), but ideally you'd like to remove the comment if a fix is released.
2. You still likely want manual types. Intersect the returned type with whatever is missing as a patch.
3. Create a PR in [`groq/src/specific-issues.test.ts`](../groq/src/specific-issues.test.ts) with your issue. [#642](https://github.com/saiichihashimoto/sanity-typed/pull/642/files) is a great example for this. Try to reduce your query and config as much as possible. The goal is a minimal reproduction.
4. If a PR isn't possible, make an issue with the same content. ie, the query and config you're using. Again, reduce them as much as possible. And then, now that you've done all the work, move it into a PR instead!
5. I'm one person and some of these issues are quite complex. Take a stab at fixing the bug! There's a ridiculous amount of tests so it's relatively safe to try things out.

People will sometimes create a repo with their issue. _Please_ open a PR with a minimal test instead. Without a PR there will be no tests reflecting your issue and it may appear again in a regression. Forking a github repo to make a PR is a more welcome way to contribute to an open source library.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/type-instantiation-is-excessively-deep-and-possibly-infinite-query.md -->

## Alternatives

- [`fake-sanity-client`](https://www.npmjs.com/package/fake-sanity-client)
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/client-mock/_README.md -->
