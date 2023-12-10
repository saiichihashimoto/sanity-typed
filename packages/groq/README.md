<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/groq/_README.md -->
# @sanity-typed/groq

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/groq?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/groq)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/groq?style=flat)](https://www.npmjs.com/package/@sanity-typed/groq?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

Infer [GROQ](https://github.com/sanity-io/groq) Result Types from GROQ strings

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Considerations](#considerations)
  - [The parsed tree changes in seemingly breaking ways](#the-parsed-tree-changes-in-seemingly-breaking-ways)
- [Alternatives](#alternatives)

## Install

```bash
npm install @sanity-typed/groq
```

## Usage

Typically, this isn't used directly, but via [`@sanity-typed/client`'s](../client) and [`@sanity-typed/groq-js`'s](../groq-js) methods that use groq strings. But it can be done directly:

```typescript
import { ExecuteQuery, RootScope } from "@sanity-typed/groq";

type Foo = ExecuteQuery<
  '*[_type=="foo"]',
  RootScope<
    // If you have SanityValues from @sanity-typed/types, use those types:
    // import { DocumentValues } from "@sanity-typed/types";
    // DocumentValues<SanityValues>
    ({ _type: "bar" } | { _type: "foo" })[],
    { _type: "bar" } | { _type: "foo" }
  >
>;
/**
 *  Foo === {
 *    _type: "foo";
 *  }[]
 */
```

There is also a `Parse` and `Evaluate` if you need the AST:

```typescript
import { Evaluate, Parse, RootScope } from "@sanity-typed/groq";

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
  RootScope<
    // If you have SanityValues from @sanity-typed/types, use those types:
    // import { DocumentValues } from "@sanity-typed/types";
    // DocumentValues<SanityValues>
    ({ _type: "bar" } | { _type: "foo" })[],
    { _type: "bar" } | { _type: "foo" }
  >
>;
/**
 *  Foo === {
 *    _type: "foo";
 *  }[]
 */
```

For either, you can pass in a full scope:

```typescript
import { ExecuteQuery } from "@sanity-typed/groq";

type Foo = ExecuteQuery<
  '*[_type=="foo"]',
  {
    context: {
      client: ClientConfig;
      dataset: ({ _type: "bar" } | { _type: "foo" })[];
      delta:
        | {
            after: { _type: "bar" } | null;
            before: { _type: "bar" } | null;
          }
        | {
            after: { _type: "foo" } | null;
            before: { _type: "foo" } | null;
          };
      identity: string;
      parameters: { [param: string]: any };
    };
    parent: null;
    this: null;
  }
>;
```

Chances are, you don't need this package directly.

## Considerations

<!-- >>>>>> BEGIN INCLUDED FILE (markdown): SOURCE docs/considerations/parse-type-flakiness.md -->
### The parsed tree changes in seemingly breaking ways

`@sanity-typed/groq` attempts to type its parsed types as close as possible to [`groq-js`](https://github.com/sanity-io/groq-js)'s `parse` function output. Any fixes to match it more correctly won't be considered a major change and, if `groq-js` changes it's output in a version update, we're likely to match it. If you're using the parsed tree's types directly, this might cause your code to break. We don't consider this a breaking change because the intent of these groq libraries is to match the types of a groq query as closely as possible.
<!-- <<<<<< END INCLUDED FILE (markdown): SOURCE docs/considerations/parse-type-flakiness.md -->

## Alternatives

- [`@sanity-codegen/cli`](https://www.npmjs.com/package/@sanity-codegen/cli)
- [`sanity-generator`](https://www.npmjs.com/package/sanity-generator)
- [`sanity-typed-queries`](https://www.npmjs.com/package/sanity-generator)
- [`@sanity-codegen/groq-codegen`](https://www.npmjs.com/package/@sanity-codegen/groq-codegen)
- [`sanity-query-helper`](https://www.npmjs.com/package/sanity-query-helper)
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/groq/_README.md -->
