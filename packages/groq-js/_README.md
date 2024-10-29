# @sanity-typed/groq-js

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/groq-js?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/groq-js)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/groq-js?style=flat)](https://www.npmjs.com/package/@sanity-typed/groq-js?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

[groq-js](https://github.com/sanity-io/groq-js) with typed GROQ Results

@[:page_toc](## Page Contents)

## Install

```bash
npm install groq-js @sanity-typed/groq-js
```

## Usage

Use `parse` and `evaluate` exactly as you would from [`groq-js`](https://github.com/sanity-io/groq-js). Then, use the results with the typescript types!

Typically, this isn't used directly, but via [`@sanity-typed/client-mock`'s](../client-mock) methods that produce groq results. But it can be done directly:

@[typescript](../../docs/your-typed-groq-js.ts)

## Breaking Changes

### 1 to 2

#### Typescript version from 5.4.2 <= x <= 5.6.3

The supported Typescript version is now 5.4.2 <= x <= 5.6.3. Older versions are no longer supported and newer versions will be added as we validate it.

## Considerations

### Using your derived types

You can also use [your typed schema](../types) to keep parity with the types [your typed client](../client) would receive.

```bash
npm install sanity groq-js @sanity-typed/types @sanity-typed/groq-js
```

@[typescript](../example-studio/schemas/product.ts)
@[typescript](../example-studio/sanity.config.ts)
@[typescript](../../docs/your-typed-groq-js-with-sanity-types.ts)

@[:markdown](../../docs/considerations/parse-type-flakiness.md)
@[:markdown](../../docs/considerations/evaluate-type-flakiness.md)

@[:markdown](../../docs/considerations/typescript-errors-in-ides.md)
@[:markdown](../../docs/considerations/type-instantiation-is-excessively-deep-and-possibly-infinite-query.md)
