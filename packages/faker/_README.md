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

@[:page_toc](## Page Contents)

## Install

```bash
npm install sanity @faker-js/faker @sanity-typed/faker
```

## Usage

@[typescript](../../docs/schemas/product.ts)
@[typescript](../../docs/sanity.config.ts)
@[typescript](../../docs/mocks.ts)

### Features

- `reference._ref` will point to the correct `document._id`, so you can use [`groq-js` or `@sanity-typed/groq-js`](../groq-js) and be certain that your references will work.
  - How this works is that, for any `sanityConfigToFaker(...).type()`, the first 5 documents will have references that only point to ids of the first 5 documents of that type. For example, if type `foo` had references that pointed to type `bar`, then all references in the first 5 mocks of `foo` could only point to the first 5 mocks of `bar`. If you want to change this number, pass a different `referencedChunkSize` to `sanityConfigToFaker(config, { faker, referencedChunkSize })`. The [tests for this](./src/document-id-memo.test.ts) are a good explanation.
  - TLDR, mock 5 of every document, all their references will point to each other. If you want more or less, change `referencedChunkSize`.
- Any field's mocked values should stay consistent, even as you change the other fields. If you're using `slug` for url paths, this will keep your emails consistent as schemas change.
  - Fakers are instantiated per schema type with a seed corresponding to the field's path. This will hopefully keep "mock flux" to a minimum, so only fields you change should generate new mock data. The [tests for this](./src/consistency.test.ts) are a good explanation.

## Considerations

@[:markdown](../../docs/considerations/config-in-runtime.md)
