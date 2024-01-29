# @sanity-typed/next-sanity

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/next-sanity?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/next-sanity)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/next-sanity?style=flat)](https://www.npmjs.com/package/@sanity-typed/next-sanity?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

[next-sanity](https://github.com/sanity-io/next-sanity) with typed GROQ Results

@[:page_toc](## Page Contents)

## Install

```bash
npm install next-sanity @sanity-typed/next-sanity
```

## Usage

Use `createClient` exactly as you would from [`@sanity-typed/client`](../client).

@[typescript](../example-studio/schemas/product.ts)
@[typescript](../example-studio/sanity.config.ts)
@[typescript](../example-app/src/sanity/next-sanity-client.ts)

@[:markdown](../../docs/usage-with-groqd.md)

## Considerations

@[:markdown](../../docs/considerations/types-vs-content-lake.md)
@[:markdown](../../docs/considerations/evaluate-type-flakiness.md)
@[:markdown](../../docs/considerations/typescript-errors-in-ides.md)
@[:markdown](../../docs/considerations/type-instantiation-is-excessively-deep-and-possibly-infinite-query.md)

## Breaking Changes

### 1 to 2

#### No more `createClient<SanityValues>()(config)`

Removing the double function signature from `createClient`:

```diff
- const client = createClient<SanityValues>()({
+ const client = createClient<SanityValues>({
  // ...
});
```

We no longer derive types from your config values. Most of the types weren't significant, but the main loss will be `_originalId` when the `perspective` was `"previewDrafts"`.
