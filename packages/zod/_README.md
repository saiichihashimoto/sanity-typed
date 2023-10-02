# @sanity-typed/zod

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/zod?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/zod)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/zod?style=flat)](https://www.npmjs.com/package/@sanity-typed/zod?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Generate [Zod](https://zod.dev) Schemas from Sanity Schemas

@[:page_toc](## Page Contents)

## Install

```bash
npm install sanity zod @sanity-typed/zod
```

## Usage

@[typescript](../../docs/schemas/product.ts)
@[typescript](../../docs/sanity.config.ts)
@[typescript](../../docs/your-zod-parsers.ts)

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
