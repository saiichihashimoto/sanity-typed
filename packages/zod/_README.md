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

@[:page_toc](## Page Contents)

## Install

```bash
npm install sanity zod @sanity-typed/zod
```

## Usage

@[typescript](../example-studio/schemas/product.ts)
@[typescript](../example-studio/sanity.config.ts)
@[typescript](../example-app/src/sanity/client-with-zod.ts)

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

@[:markdown](../../docs/considerations/config-in-runtime.md)
@[:markdown](../../docs/considerations/types-vs-content-lake.md)
