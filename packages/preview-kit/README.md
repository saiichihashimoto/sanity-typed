<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/preview-kit/_README.md -->
# @sanity-typed/preview-kit

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/preview-kit?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/preview-kit)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/preview-kit?style=flat)](https://www.npmjs.com/package/@sanity-typed/preview-kit?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

Typed [@sanity/preview-kit](https://github.com/sanity-io/preview-kit) similarly to [@sanity-typed/client](../client)

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Considerations](#considerations)
  - [Types match config but not actual documents](#types-match-config-but-not-actual-documents)
  - [GROQ Query results changes in seemingly breaking ways](#groq-query-results-changes-in-seemingly-breaking-ways)

## Install

```bash
npm install @sanity/preview-kit @sanity-typed/preview-kit
```

## Usage

```typescript
import type { PreviewKitClientConfig } from "@sanity/preview-kit/client";

// import { createClient } from "@sanity/preview-kit/client";
import { createClient } from "@sanity-typed/preview-kit";

const config: PreviewKitClientConfig = {
  // ...base config options

  studioUrl: "/studio",

  encodeSourceMap: "auto",
};

export const client = createClient(config);
```

See [@sanity-typed/client](../client) for further usage.

## Considerations

<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/types-vs-content-lake.md -->
### Types match config but not actual documents

As your sanity driven application grows over time, your config is likely to change. Keep in mind that you can only derive types of your current config, while documents in your Sanity Content Lake will have shapes from older configs. This can be a problem when adding new fields or changing the type of old fields, as the types won't can clash with the old documents.

Ultimately, there's nothing that can automatically solve this; we can't derive types from a no longer existing config. This is a consideration with or without types: your application needs to handle all existing documents. Be sure to make changes in a backwards compatible manner (ie, make new fields optional, don't change the type of old fields, etc).

Another solution would be to keep old configs around, just to derive their types:

```typescript
const config = defineConfig({
  schema: {
    types: [foo],
  },
  plugins: [myPlugin()],
});

const oldConfig = defineConfig({
  schema: {
    types: [oldFoo],
  },
  plugins: [myPlugin()],
});

type SanityValues =
  | InferSchemaValues<typeof config>
  | InferSchemaValues<typeof oldConfig>;
```

This can get unwieldy although, if you're diligent about data migrations of your old documents to your new types, you may be able to deprecate old configs and remove them from your codebase.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/types-vs-content-lake.md -->
<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/evaluate-type-flakiness.md -->
### GROQ Query results changes in seemingly breaking ways

Similar to [parsing](#the-parsed-tree-changes-in-seemingly-breaking-ways), evaluating groq queries will attempt to match how sanity actually evaluates queries. Again, any fixes to match that or changes to groq evaluation will likely not be considered a major change but, rather, a bug fix.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/evaluate-type-flakiness.md -->
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/preview-kit/_README.md -->
