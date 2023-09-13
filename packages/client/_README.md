# @sanity-typed/client

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/client?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/client)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/client?style=flat)](https://www.npmjs.com/package/@sanity-typed/client?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

[@sanity/client](https://github.com/sanity-io/client) with typed GROQ Results

@[:page_toc](## Page Contents)

## Install

```bash
npm install sanity @sanity-typed/client
```

## Usage

Use `createClient` exactly as you would from [`@sanity/client`](https://github.com/sanity-io/client) with a minor change for proper type inference.

@[typescript](../types/docs/schemas/product.ts)
@[typescript](../types/docs/sanity.config.ts)
@[typescript](docs/your-super-cool-application.ts)

The `createClient<SanityValues>()(config)` syntax is due to having to infer one generic (the config shape) while explicitly providing the Sanity Values' type, [which can't be done in the same generics](https://github.com/microsoft/TypeScript/issues/10571).

@[:markdown](docs/cast-to-typed.md)

## Considerations

@[:markdown](../types/docs/considerations/types-vs-content-lake.md)
@[:markdown](../groq-js/docs/considerations/evaluate-type-flakiness.md)
