<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/client-mock/_README.md -->
# @sanity-typed/client-mock

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/client-mock?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/client-mock)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/client-mock?style=flat)](https://www.npmjs.com/package/@sanity-typed/client-mock?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Mock [@sanity-typed/client](../client) for local development and testing

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Considerations](#considerations)
  - [Config in Runtime](#config-in-runtime)
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
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE docs/your-super-cool-mocked-application.ts -->
```your-super-cool-mocked-application.ts```:
```typescript
// import { createClient } from "@sanity-typed/client";
import { createClient } from "@sanity-typed/client-mock";

import type { SanityValues } from "./sanity.config";

// const client = createClient({
const client = createClient<SanityValues>({
  dataset: [
    {
      _createdAt: "2011-12-15T03:57:59.213Z",
      _id: "9bd9d8d6-9a67-44e0-af46-7cc8796ed151",
      _rev: "1mPXM8RRYtNNswMG7IDA8x",
      _type: "product",
      _updatedAt: "2029-01-01T06:23:59.079Z",
      productName: "Deduco tyrannus v",
      tags: [
        {
          _key: "4d8edf97d9df21feee3472a6",
          _type: "tag",
          label: "Cuppedi",
          value: "Defleo bis min",
        },
        {
          _key: "fec59aa5d372ee63b4e8ec02",
          _type: "tag",
          label: "Communis molestiae a",
          value: "Solitud",
        },
        {
          _key: "a0096f276a2f6d9e14fccd5b",
          _type: "tag",
          label: "Speculum alo v",
        },
        {
          _key: "c803ec5fa6f95ac8ddce4dee",
          _type: "tag",
          label: "Aliquid",
          value: "Turba c",
        },
      ],
    },
    // ...
  ],
})({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  useCdn: true,
  apiVersion: "2023-05-23",
});

const data = await client.fetch('*[_type=="product"]{productName,tags}');
/**
 *  typeof data === [
 *    {
 *      productName: "Deduco tyrannus v",
 *      tags: [
 *        {
 *          _key: "4d8edf97d9df21feee3472a6",
 *          _type: "tag",
 *          label: "Cuppedi",
 *          value: "Defleo bis min",
 *        },
 *        {
 *          _key: "fec59aa5d372ee63b4e8ec02",
 *          _type: "tag",
 *          label: "Communis molestiae a",
 *          value: "Solitud",
 *        },
 *        {
 *          _key: "a0096f276a2f6d9e14fccd5b",
 *          _type: "tag",
 *          label: "Speculum alo v",
 *        },
 *        {
 *          _key: "c803ec5fa6f95ac8ddce4dee",
 *          _type: "tag",
 *          label: "Aliquid",
 *          value: "Turba c",
 *        },
 *      ],
 *    },
 *  ]
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE docs/your-super-cool-mocked-application.ts -->

Depending on your tree-shaking setup, you'll want to swap between the real client and the mock client. Additionally, using [`@sanity-typed/faker`](../faker) along with the mock client can be a great way to generate fake data.

<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE docs/your-super-cool-fully-mocked-application.ts -->
```your-super-cool-fully-mocked-application.ts```:
```typescript
import { base, en } from "@faker-js/faker";

import { createClient } from "@sanity-typed/client";
import { createClient as createClientMock } from "@sanity-typed/client-mock";
import { sanityConfigToFaker } from "@sanity-typed/faker";

import { config } from "./sanity.config";
import type { SanityValues } from "./sanity.config";

const createMockClient = () => {
  const sanityFaker = sanityConfigToFaker(config, {
    faker: { locale: [en, base] },
  });

  return createClientMock<SanityValues>({
    dataset: [
      sanityFaker.product(),
      sanityFaker.product(),
      sanityFaker.product(),
      sanityFaker.product(),
      sanityFaker.product(),
    ],
  });
};

const client = (
  process.env.DETECT_PRODUCTION_SOMEHOW
    ? createClient<SanityValues>()
    : createMockClient()
)({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  useCdn: true,
  apiVersion: "2023-05-23",
});

const data = await client.fetch('*[_type=="product"]{productName,tags}');
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE docs/your-super-cool-fully-mocked-application.ts -->

## Considerations

<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/config-in-runtime.md -->
### Config in Runtime

`@sanity-typed/*` generally has the goal of only having effect to types and no runtime effects. This package is an exception. This means that you will have to import your sanity config to use this. While sanity v3 is better than v2 at having a standard build environment, you will have to handle any nuances, including having a much larger build.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/config-in-runtime.md -->

## Alternatives

- [`fake-sanity-client`](https://www.npmjs.com/package/fake-sanity-client)
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/client-mock/_README.md -->
