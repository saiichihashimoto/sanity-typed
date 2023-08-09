# @sanity-typed

[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

End to end Sanity types without any explicit typing, from config to fetch!

@[:page_toc](## Page Contents)

## Install

```bash
npm install sanity @sanity-typed/client @sanity-typed/types
```

## Usage

@[typescript](packages/types/docs/schemas/product.ts)
@[typescript](packages/types/docs/sanity.config.ts)
@[typescript](packages/client/docs/your-super-cool-application.ts)

## Goals

The popularity of typescript happened after sanity took off and the typescript values haven't found their way in. The `define*` methods are a good start, but they type the schema, not the values. There's been attempts (ie [`sanity-codegen`](https://github.com/ricokahler/sanity-codegen), [`@sanity-typed/schema-builder`](https://github.com/saiichihashimoto/sanity-typed/tree/%40sanity-typed/schema-builder%403.0.1/packages/schema-builder)) but they take the approach of creating a new way of building schemas. The drop-in replacement approach allows for (close to) zero migration cost.

The long term goal is to deprecate the monorepo altogether. This was built seperately to move quickly and these features should be in sanity directly (and is likely one of their internal goals). The drop-in approach has kept this in mind; the closer the API is to the native API, the easier the merge could be. Ideally, this whole library can be iteratively merged in and eventually be deprecated.
