# @sanity-typed

[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Completing [sanity](https://www.sanity.io/)'s developer experience with typescript (and more)!

@[:page_toc](## Page Contents)

## Packages

- [`@sanity-typed/types`](packages/types): Infer Sanity Document Types from Sanity Schemas
- [`@sanity-typed/client`](packages/client): [@sanity/client](https://github.com/sanity-io/client) with typed GROQ Results
- [`@sanity-typed/zod`](packages/zod): Generate [Zod](https://zod.dev) Schemas from Sanity Schemas
- [`@sanity-typed/faker`](packages/faker): Generate Mock Data from Sanity Schemas
- [`@sanity-typed/client-mock`](packages/client-mock): FIXME
- [`@sanity-typed/groq`](packages/groq): Infer [GROQ](https://github.com/sanity-io/groq) Result Types from GROQ strings
- [`@sanity-typed/groq-js`](packages/groq-js): [groq-js](https://github.com/sanity-io/groq-js) with typed GROQ Results

## Features

This project aims to complete sanity's developer experience with (almost) completely drop-in solutions. It's scope includes:

1. Typescript for all Sanity results

- [x] [Typed Sanity Documents](packages/types)
- [x] [Typed GROQ Queries](packages/groq)
- [x] [Typed Sanity Client](packages/client)

2. Fully local development environment

- [x] [Mocked Sanity Documents](packages/faker)
- [x] [Local GROQ execution](packages/groq-js)
- [x] [Mocked Sanity Client](packages/client-mock)

3. Runtime safety for all Sanity results

- [x] [Sanity Documents Zod Parser](packages/zod)
- [ ] [GROQ Queries Zod Parser](https://github.com/saiichihashimoto/sanity-typed/issues/306)

With the full suite, everything would be fully typed, runtime safe, and fully local. The drop-in nature means that working these solutions into native sanity is a possibility and keeps new documentation and learning curve to a minimum.

## Quick Start

```bash
npm install sanity @sanity-typed/client @sanity-typed/types
```

@[typescript](docs/schemas/product.ts)
@[typescript](docs/sanity.config.ts)
@[typescript](docs/your-super-cool-application.ts)
