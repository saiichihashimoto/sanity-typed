<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/zod/_README.md -->
# @sanity-typed/zod

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/zod?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/zod)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/zod?style=flat)](https://www.npmjs.com/package/@sanity-typed/zod?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Generate [Zod](https://zod.dev) Schemas from Sanity Schemas

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Considerations](#considerations)
  - [Config in Runtime](#config-in-runtime)
  - [Types match config but not actual documents](#types-match-config-but-not-actual-documents)
  - [Doesn't run `custom` validations](#doesnt-run-custom-validations)

## Install

```bash
npm install sanity zod @sanity-typed/zod
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
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/types/docs/schemas/product.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/types/docs/sanity.config.ts -->
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
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/types/docs/sanity.config.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/zod/docs/your-zod-parsers.ts -->
```your-zod-parsers.ts```:
```typescript
import { sanityConfigToZods } from "@sanity-typed/zod";

import config from "./sanity.schema";
import type { SanityValues } from "./sanity.schema";

/** Zod Parsers for all your types! */
export const sanityZods = sanityConfigToZods(config);
/**
 * typeof sanityZods === {
 *   product: ZodType<...>;
 *    // ... parsers for all your types!
 * }
 */

/** Parsed Document! */
const product = sanityZods.product.parse(getInputFromWherever);
/**
 *  typeof product === SanityValues['product'] === {
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
 *  }
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/zod/docs/your-zod-parsers.ts -->

## Considerations

### Config in Runtime

`@sanity-typed/*` generally has the goal of only having effect to types and no runtime effects. This package is an exception. This means that, to do `const zods = sanityConfigToZods(config)`, you will have to import your sanity config into the environment you're using the parsers. While sanity v3 is better than v2 at having a standard build environment, you will have to handle any nuances, including having a much larger build.

If this is something you cannot have, there's still a (mostly) manual option:

```typescript
import { z } from "zod";

import type { SanityValues } from "./sanity.schema";

const productZod: z.Type<SanityValues["product"]> = z.object({
  // All the zod fields
});
```

It isn't perfect and is prone to errors, but it's a decent option if importing the config isn't viable.

<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE packages/types/docs/types/docs/considerations/types-vs-content-lake.md -->
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
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE packages/types/docs/types/docs/considerations/types-vs-content-lake.md -->

### Doesn't run `custom` validations

Sanity validations are run while parsing (eg `zod.parse(...)` will run `Rule.regex(...)`) except for the `custom` validator. There are a few reasons. The first one being that we can't provide the proper context fields:

- `document`: possible
- `path`: possible
- `type`: possible
- `parent`: possible
- `schema`: not possible
- `getClient`: not possible
- `getDocumentExists`: not possible

Besides that, specific validations are inpractical (or undesirable) to run. You may want to run validations against a service in the sanity studio but not where the zods are used.

Finally, deciding which validations to run with zod is awkward. Any API which requires changing the native schema changes this project's promise and any extra fields to the zod function would be confusing. We could use environment variables (sanity prefixes all environment variables with `SANITY_`) but that's confusing and a difficult "opt in" experience, which can lead to accidentally calling unintended services in production.
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/zod/_README.md -->
