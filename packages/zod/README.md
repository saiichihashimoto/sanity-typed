<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/zod/_README.md -->
# @sanity-typed/zod

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/zod?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/zod)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/zod?style=flat)](https://www.npmjs.com/package/@sanity-typed/zod?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

[![Watch How to Generate Zod Schemas for Sanity Documents](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/d46bc235-827e-4fa6-ac8b-d653505b2d61)](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/c014f8aa-a97a-4093-9924-94a2ecee4584)

Generate [Zod](https://zod.dev) Schemas from Sanity Schemas

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [`sanityDocumentsZod`](#sanitydocumentszod)
- [Validations](#validations)
- [Considerations](#considerations)
  - [Config in Runtime](#config-in-runtime)
  - [Types match config but not actual documents](#types-match-config-but-not-actual-documents)

## Install

```bash
npm install sanity zod @sanity-typed/zod
```

## Usage

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
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/example-app/src/sanity/client-with-zod.ts -->
```client-with-zod.ts```:
```typescript
import config from "sanity.config";
import type { SanityValues } from "sanity.config";

import { createClient } from "@sanity-typed/client";
import { sanityConfigToZods } from "@sanity-typed/zod";

export const client = createClient<SanityValues>({
  projectId: "59t1ed5o",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-23",
});

/** Zod Parsers for all your types! */
const sanityZods = sanityConfigToZods(config);
/**
 * typeof sanityZods === {
 *   [type in keyof SanityValues]: ZodType<SanityValues[type]>;
 * }
 */

export const makeTypedQuery = async () => {
  const results = await client.fetch('*[_type=="product"]');

  return results.map((result) => sanityZods.product.parse(result));
};
/**
 *  typeof makeTypedQuery === () => Promise<{
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
 *  }[]>
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/example-app/src/sanity/client-with-zod.ts -->

## `sanityDocumentsZod`

While `sanityConfigToZods` gives you all the types for a given config keyed by type, sometimes you just want a zod union of all the `SanityDocument`s. Drop it into `sanityDocumentsZod`:

```typescript
import type { sanityConfigToZods, sanityDocumentsZod } from "@sanity-typed/zod";

const config = defineConfig({
  /* ... */
});

const zods = sanityConfigToZods(config);
/**
 *  zods === { [type: string]: typeZodParserButSomeTypesArentDocuments }
 */

const documentsZod = sanityDocumentsZod(config, zods);
/**
 *  documentsZod === z.union([Each, Document, In, A, Union])
 */
```

## Validations

All validations except for `custom` are included in the zod parsers. However, if there are custom validators you want to include, using `enableZod` on the validations includes it:

```typescript
import { defineConfig, defineField, defineType } from "@sanity-typed/types";
import { enableZod, sanityConfigToZods } from "@sanity-typed/zod";

export const product = defineType({
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    defineField({
      name: "productName",
      type: "string",
      title: "Product name",
      validation: (Rule) =>
        Rule.custom(
          () => "fail for no reason, but only in sanity studio"
        ).custom(
          enableZod((value) => "fail for no reason, but also in zod parser")
        ),
    }),
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

const zods = sanityConfigToZods(config);

expect(() =>
  zods.product.parse({
    productName: "foo",
    /* ... */
  })
).toThrow("fail for no reason, but also in zod parser");
```

## Considerations

<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/config-in-runtime.md -->
### Config in Runtime

`@sanity-typed/*` generally has the goal of only having effect to types and no runtime effects. This package is an exception. This means that you will have to import your sanity config to use this. While sanity v3 is better than v2 at having a standard build environment, you will have to handle any nuances, including having a much larger build.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/config-in-runtime.md -->
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

This can get unwieldy although, if you're diligent about data migrations of your old documents to your new types, you may be able to deprecate old configs and remove them from your codebase.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/types-vs-content-lake.md -->
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/zod/_README.md -->
