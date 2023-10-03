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
- [Reference Validity](#reference-validity)
- [Field Consistency](#field-consistency)
- [Custom Mocks](#custom-mocks)
- [Considerations](#considerations)
  - [Config in Runtime](#config-in-runtime)

## Install

```bash
npm install sanity @faker-js/faker @sanity-typed/faker
```

## Usage

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
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE docs/mocks.ts -->
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
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE docs/mocks.ts -->

## Reference Validity

Reference mocks point to document mocks, so you can use [`groq-js` or `@sanity-typed/groq-js`](../groq-js) and be certain that your references will work.

This is done in chunks of 5. For example, if `foo` has references that point to `bar`, you can be assured that the the first five mocks of `foo` has references that all refer to the first five mocks of `bar`. In other words, if you generate five `foo` mocks and five `bar` mocks, then all the references will be contained within those documents. If you want to change this number, pass a different `referencedChunkSize` to `sanityConfigToFaker(config, { faker, referencedChunkSize })`.

The [tests for this](./src/document-id-memo.test.ts) are a good explanation.

## Field Consistency

As much as is reasonable, a field's mocked values should stay consistent between runs of your application. This is why the `faker` parameter accepts a `FakerOptions` rather than a `Faker`: each field instantiates it's own `Faker` with a [seed](https://fakerjs.dev/guide/usage.html#reproducible-results) corresponding to the field's path. This means that, even when you change all the fields or array members around a field, that field will produce the same mocked values, as long as the path to it stays consistent. This becomes especially important when you're using `slug` for url paths, since you don't want your urls to change every time you change your schema. However, whenever you update your dependencies, we can't ensure that we generated mocks the same way, so don't be surprised if you see some changes in your mocked data.

The [tests for this](./src/consistency.test.ts) are a good explanation.

## Custom Mocks

If there are custom mocks you want to include, using `customMock` on the schema types includes it:

```typescript
import { customMock, sanityConfigToFaker } from "@sanity-typed/faker";
import { defineConfig, defineField, defineType } from "@sanity-typed/types";

export const product = defineType({
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    customMock(
      defineField({
        name: "productName",
        type: "string",
        title: "Product name",
      }),
      // `previous` is what the mocked value would have been, which is helpful
      //   to have when you only want to override one field in an object
      // `index` is the index of the mock overall, helping with the reference validity
      //   This is helpful if you want to override slugs, eg always having index === 0
      //   give a locally consistent url
      (faker, previous, index) => faker.commerce.productName()
    ),
    // ...
  ],
});

// Everything else the same as before...
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

const sanityFaker = sanityConfigToFaker(config, {
  faker: { locale: [en, base] },
});

const mock = sanityFaker.product();
// mock.productName is something like "Computer" rather than the default from "string"
```

Be aware that, besides typing, no validations or checks are done on the custom mocks. The validity of your custom mocked values are up to you.

## Considerations

<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/config-in-runtime.md -->
### Config in Runtime

`@sanity-typed/*` generally has the goal of only having effect to types and no runtime effects. This package is an exception. This means that you will have to import your sanity config to use this. While sanity v3 is better than v2 at having a standard build environment, you will have to handle any nuances, including having a much larger build.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/config-in-runtime.md -->
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/faker/_README.md -->
