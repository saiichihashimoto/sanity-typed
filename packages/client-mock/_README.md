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

@[:page_toc](## Page Contents)

## Install

```bash
npm install sanity @sanity-typed/client-mock
```

## Usage

Use `createClient` instead of the `createClient` from [`@sanity-typed/client`](../client) and include initial documents.

@[typescript](../example-studio/schemas/product.ts)
@[typescript](../example-studio/sanity.config.ts)
@[typescript](../example-app/src/sanity/mocked-client.ts)

Depending on your tree-shaking setup, you'll want to swap between the real client and the mock client. Additionally, using [`@sanity-typed/faker`](../faker) along with the mock client can be a great way to generate fake data.

@[typescript](../example-app/src/sanity/mocks.ts)
@[typescript](../example-app/src/sanity/swapping-client.ts)

## Considerations

@[:markdown](../../docs/considerations/evaluate-type-flakiness.md)
@[:markdown](../../docs/considerations/type-instantiation-is-excessively-deep-and-possibly-infinite-query.md)

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
