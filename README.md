# @sanity-typed

[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

Completing [sanity](https://www.sanity.io/)'s developer experience with typescript (and more)!

## Page Contents
- [Fully Typed Sanity Client](#fully-typed-sanity-client)
  - [Packages](#packages)
- [Fully Offline Sanity Client](#fully-offline-sanity-client)
  - [Packages](#packages-1)
- [Runtime Validated Sanity Documents](#runtime-validated-sanity-documents)
  - [Packages](#packages-2)
- [More Typed Packages](#more-typed-packages)
  - [Packages](#packages-3)

## Fully Typed Sanity Client

[![Watch How to Type Your Sanity Document and Client](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/886bd64a-00fb-473c-a60a-205a8a6767ad)](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/13c28e6a-74a7-4b3c-8162-61fae921323b)

### Packages

- [`@sanity-typed/types`](packages/types): Infer Sanity Document Types from Sanity Schemas
- [`@sanity-typed/client`](packages/client): [@sanity/client](https://github.com/sanity-io/client) with typed GROQ Results
- [`@sanity-typed/groq`](packages/groq): Infer [GROQ](https://github.com/sanity-io/groq) Result Types from GROQ strings

## Fully Offline Sanity Client

[![Watch How to Offline Your Sanity Client and Generate Mock Data](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/fc2be145-d504-46e3-9e77-6090c3024885)](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/fed71d58-6b08-467a-a325-b197f563a328)

### Packages

- [`@sanity-typed/faker`](packages/faker): Generate Mock Data from Sanity Schemas
- [`@sanity-typed/client-mock`](packages/client-mock): Mock @sanity-typed/client for local development and testing
- [`@sanity-typed/groq-js`](packages/groq-js): [groq-js](https://github.com/sanity-io/groq-js) with typed GROQ Results

## Runtime Validated Sanity Documents

[![Watch How to Generate Zod Schemas for Sanity Documents](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/d46bc235-827e-4fa6-ac8b-d653505b2d61)](https://github.com/saiichihashimoto/sanity-typed/assets/2819256/c014f8aa-a97a-4093-9924-94a2ecee4584)

### Packages

- [`@sanity-typed/zod`](packages/zod): Generate [Zod](https://zod.dev) Schemas from Sanity Schemas

## More Typed Packages

### Packages

- [`@sanity-typed/next-sanity`](packages/next-sanity): [next-sanity](https://github.com/sanity-io/next-sanity) with typed GROQ Results
- [`@sanity-typed/preview-kit`](packages/preview-kit): [@sanity/preview-kit](https://github.com/sanity-io/preview-kit) with typed GROQ Results (deprecated)
- [`@portabletext-typed/react`](packages/pt-react): [@portabletext/react](https://github.com/portabletext/react) with typed arguments
- [`@portabletext-typed/to-html`](packages/pt-to-html): [@portabletext/to-html](https://github.com/portabletext/to-html) with typed arguments
