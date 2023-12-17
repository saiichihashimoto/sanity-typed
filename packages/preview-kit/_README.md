# @sanity-typed/preview-kit

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/preview-kit?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/preview-kit)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/preview-kit?style=flat)](https://www.npmjs.com/package/@sanity-typed/preview-kit?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

Typed [@sanity/preview-kit](https://github.com/sanity-io/preview-kit)

@[:page_toc](## Page Contents)

## Install

```bash
npm install @sanity/preview-kit @sanity-typed/preview-kit
```

## Usage

Use `createClient` exactly as you would from [`@sanity-typed/client`](../client/).

@[typescript](../example-studio/schemas/product.ts)
@[typescript](../example-studio/sanity.config.ts)

`client.ts`:

```typescript
import type { PreviewKitClientConfig } from "@sanity/preview-kit/client";
import type { SanityValues } from "sanity.config";

// import { createClient } from "@sanity/preview-kit/client";
import { createClient } from "@sanity-typed/preview-kit";

const config: PreviewKitClientConfig = {
  // ...base config options

  studioUrl: "/studio",

  encodeSourceMap: "auto",
};

/** Small change using createClient */
// export const client = createClient(config);
export const client = createClient<SanityValues>()(config);
```

## Considerations

@[:markdown](../../docs/considerations/types-vs-content-lake.md)
@[:markdown](../../docs/considerations/evaluate-type-flakiness.md)
