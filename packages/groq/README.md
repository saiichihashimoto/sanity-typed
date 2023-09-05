<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/groq/_README.md -->
# @sanity-typed/groq

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/groq?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/groq)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/groq?style=flat)](https://www.npmjs.com/package/@sanity-typed/groq?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Typed [GROQ](https://github.com/sanity-io/groq) Results, all inferred, no query changes!

## Page Contents
- [Install](#install)
- [Usage](#usage)

## Install

```bash
npm install @sanity-typed/groq
```

## Usage

Typically, this isn't used directly, but via [`@sanity-typed/client`'s](../client) and [`@sanity-typed/groq-js`'s](../groq-js) methods that use groq strings. But it can be done directly:

```typescript
import { ExecuteQuery } from "@sanity-typed/groq";

type Foo = ExecuteQuery<
  '*[_type=="foo"]',
  {
    dataset: ({ _type: "bar" } | { _type: "foo" })[];
    // If you have SanityValues from @sanity-typed/types, use those types:
    // dataset: Extract<SanityValues[keyof SanityValues], Omit<SanityDocument, "_type">>[]
  }
>;
/**
 *  Foo === {
 *    _type: "foo";
 *  }[]
 */
```

There is also a `Parse` and `Evaluate` if you need the AST:

```typescript
import { Evaluate, Parse } from "@sanity-typed/groq";

type Tree = Parse<'*[_type=="foo"]'>;
/**
 *  Tree === {
 *    type: "Filter";
 *    base: { type: "Everything" };
 *    expr: {
 *      type: "OpCall";
 *      op: "==";
 *      left: { type: "AccessAttribute"; name: "_type" };
 *      right: { type: "Value"; value: "foo" };
 *    };
 *  }
 */

type Foo = Evaluate<
  Tree,
  {
    dataset: ({ _type: "bar" } | { _type: "foo" })[];
    // If you have SanityValues from @sanity-typed/types, use those types:
    // dataset: Extract<SanityValues[keyof SanityValues], Omit<SanityDocument, "_type">>[]
  }
>;
/**
 *  Foo === {
 *    _type: "foo";
 *  }[]
 */
```

Chances are, you don't need this package directly.
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/groq/_README.md -->
