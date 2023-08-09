<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/groq/_README.md -->
# @sanity-typed/groq

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/groq?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/groq)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/groq?style=flat)](https://www.npmjs.com/package/@sanity-typed/groq?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Infer Sanity types from your groq queries without any explicit typing!

## Page Contents
- [Install](#install)
- [Usage](#usage)

## Install

```bash
npm install @sanity-typed/groq
```

## Usage

Typically, this isn't used directly, but via [`@sanity-typed/client`'s](../client/README.md) methods that use groq strings. But it can be done directly:

```typescript
import { ExecuteQuery } from "@sanity-typed/groq";

type Foo = ExecuteQuery<
  '*[_type=="foo"]',
  { dataset: ({ _type: "bar" } | { _type: "foo" })[] }
>;
/**
 *  Foo === {
 *    _type: "foo";
 *  }[]
 */
```

There is also a `Parse` if you need the AST:

```typescript
import { Parse } from "@sanity-typed/groq";

type Query = Parse<'*[_type=="foo"]'>;
/**
 *  Foo === {
 *    base: { type: "Everything" };
 *    expr: {
 *      left: { name: "_type"; type: "AccessAttribute" };
 *      op: "==";
 *      right: { type: "Value"; value: "foo" };
 *      type: "OpCall";
 *    };
 *    type: "Filter";
 *  }
 */
```
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/groq/_README.md -->
