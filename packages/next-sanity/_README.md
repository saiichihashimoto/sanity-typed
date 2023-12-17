# @sanity-typed/next-sanity

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/next-sanity?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/next-sanity)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/next-sanity?style=flat)](https://www.npmjs.com/package/@sanity-typed/next-sanity?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

Typed [next-sanity](https://github.com/sanity-io/next-sanity)

@[:page_toc](## Page Contents)

## Install

```bash
npm install next-sanity @sanity-typed/next-sanity
```

## Usage

Use `createClient` exactly as you would from [`@sanity-typed/client`](../client/).

@[typescript](../example-studio/schemas/product.ts)
@[typescript](../example-studio/sanity.config.ts)

`client.ts`:

```typescript
import type { SanityValues } from "sanity.config";

// import { createClient } from "next-sanity";
import { createClient } from "@sanity-typed/next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID; // "pv8y60vp"
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET; // "production"
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03";

/** Small change using createClient */
// export const client = createClient({
export const client = createClient<SanityValues>()({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: true, // if you're using ISR or only static generation at build time then you can set this to `false` to guarantee no stale content
});
```

## Considerations

@[:markdown](../../docs/considerations/types-vs-content-lake.md)
@[:markdown](../../docs/considerations/evaluate-type-flakiness.md)
