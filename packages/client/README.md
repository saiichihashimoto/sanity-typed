<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/client/_README.md -->
# @sanity-typed/client

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/client?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/client)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/client?style=flat)](https://www.npmjs.com/package/@sanity-typed/client?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Infer Sanity types from your client without any explicit typing!

## Page Contents
- [Install](#install)
- [Usage](#usage)

## Install

```bash
npm install @sanity-typed/client
```

## Usage

Use `createClient` from this library like you would from [sanity's own exports](https://www.sanity.io/docs/config-api-reference#dd1dc18716de) with a minor change for proper type inference.

<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/client/docs/your-super-cool-application.ts -->
```your-super-cool-application.ts```:
```typescript
// import { createClient } from "@sanity/client";
import { createClient } from "@sanity-typed/client";

// See the API for this in https://github.com/saiichihashimoto/sanity-typed/tree/main/packages/types
import type { SanityValues } from "./sanity.schema";

/** Small change using createClient https://www.sanity.io/docs/config-api-reference#dd1dc18716de */
// const client = createClient({
const client = createClient<SanityValues>()({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  useCdn: true,
  apiVersion: "2023-05-23",
});

/** Typescript type from GROQ queries! */
const data = await client.fetch('*[_type=="product"]');
/**
 *  typeof data === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: "product";
 *    _updatedAt: string;
 *    productName?: string;
 *    tags?: {
 *      _key: string;
 *      label?: string;
 *      value?: string;
 *    }[];
 *  }[]
 */
```
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/client/docs/your-super-cool-application.ts -->

The `createClient<SanityValues>()(config)` syntax is due to having to infer one generic (the config shape) while explicitly providing the Sanity Values' type, [which can't be done in the same generics](https://github.com/microsoft/TypeScript/issues/10571).
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/client/_README.md -->
