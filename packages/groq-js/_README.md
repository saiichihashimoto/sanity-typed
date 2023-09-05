# @sanity-typed/groq-js

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/groq-js?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/groq-js)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/groq-js?style=flat)](https://www.npmjs.com/package/@sanity-typed/groq-js?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Typed [GROQ-JS](https://github.com/sanity-io/groq-js) Results, all inferred, no query changes!

@[:page_toc](## Page Contents)

## Install

```bash
npm install groq-js @sanity-typed/groq-js
```

## Usage

Use `parse` and `evaluate` exactly as you would from [`groq-js`](https://github.com/sanity-io/groq-js). Then, use the results with the typescript types!

@[typescript](docs/your-typed-groq-js.ts)

You can also use [your typed schema](../types) and creative use of the [`satisfies` operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator) to keep parity with your schema!

```bash
npm install sanity groq-js @sanity-typed/types @sanity-typed/groq-js
```

@[typescript](../types/docs/schemas/product.ts)
@[typescript](../types/docs/sanity.config.ts)
@[typescript](docs/your-provided-types-groq-js.ts)
