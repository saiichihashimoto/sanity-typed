# @sanity-typed/client

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/client?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/client)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/client?style=flat)](https://www.npmjs.com/package/@sanity-typed/client?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Infer Sanity types from your client without any explicit typing!

@[:page_toc](## Page Contents)

## Install

```bash
npm install @sanity-typed/client
```

## Usage

Use `createClient` from this library like you would from [sanity's own exports](https://www.sanity.io/docs/config-api-reference#dd1dc18716de) with a minor change for proper type inference.

@[typescript](docs/your-super-cool-application.ts)

The `createClient<SanityValues>()(config)` syntax is due to having to infer one generic (the config shape) while explicitly providing the Sanity Values' type, [which can't be done in the same generics](https://github.com/microsoft/TypeScript/issues/10571).
