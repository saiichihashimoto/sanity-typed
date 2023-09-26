# @sanity-typed/zod

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/zod?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/zod)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/zod?style=flat)](https://www.npmjs.com/package/@sanity-typed/zod?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Generate [Zod](https://zod.dev) Schemas from Sanity Schemas

@[:page_toc](## Page Contents)

## Install

```bash
npm install sanity zod @sanity-typed/zod
```

## Usage

@[typescript](../types/docs/schemas/product.ts)
@[typescript](../types/docs/sanity.config.ts)
@[typescript](docs/your-zod-parsers.ts)

## Considerations

### Config in Runtime

`@sanity-typed/*` generally has the goal of only having effect to types and no runtime effects. This package is an exception. This means that, to do `const zods = sanityConfigToZods(config)`, you will have to import your sanity config into the environment you're using the parsers. While sanity v3 is better than v2 at having a standard build environment, you will have to handle any nuances, including having a much larger build.

If this is something you cannot have, there's still a (mostly) manual option:

```typescript
import { z } from "zod";

import type { SanityValues } from "./sanity.schema";

const productZod: z.Type<SanityValues["product"]> = z.object({
  // All the zod fields
});
```

It isn't perfect and is prone to errors, but it's a decent option if importing the config isn't viable.

@[:markdown](../types/docs/considerations/types-vs-content-lake.md)

### Doesn't run `custom` validations

Sanity validations are run while parsing (eg `zod.parse(...)` will run `Rule.regex(...)`) except for the `custom` validator. There are a few reasons. The first one being that we can't provide the proper context fields:

- `document`: possible
- `path`: possible
- `type`: possible
- `parent`: possible
- `schema`: not possible
- `getClient`: not possible
- `getDocumentExists`: not possible

Besides that, specific validations are inpractical (or undesirable) to run. You may want to run validations against a service in the sanity studio but not where the zods are used.

Finally, deciding which validations to run with zod is awkward. Any API which requires changing the native schema changes this project's promise and any extra fields to the zod function would be confusing. We could use environment variables (sanity prefixes all environment variables with `SANITY_`) but that's confusing and a difficult "opt in" experience, which can lead to accidentally calling unintended services in production.
