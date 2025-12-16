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
  - [Typescript Errors in IDEs](#typescript-errors-in-ides)
    - [VSCode](#vscode)
  - [`Type instantiation is excessively deep and possibly infinite`](#type-instantiation-is-excessively-deep-and-possibly-infinite)
- [Breaking Changes](#breaking-changes)
  - [2 to 3](#2-to-3)
    - [Typescript version from 5.7.2 <= x <= 5.7.3](#typescript-version-from-572--x--573)
  - [1 to 2](#1-to-2)
    - [Typescript version from 5.4.2 <= x <= 5.6.3](#typescript-version-from-542--x--563)
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
        | { after: { _type: "bar" } | null; before: { _type: "bar" } | null }
        | { after: { _type: "foo" } | null; before: { _type: "foo" } | null };
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

### The parsed tree changes in seemingly breaking ways

`@sanity-typed/groq` attempts to type its parsed types as close as possible to [`groq-js`](https://github.com/sanity-io/groq-js)'s `parse` function output. Any fixes to match it more correctly won't be considered a major change and, if `groq-js` changes it's output in a version update, we're likely to match it. If you're using the parsed tree's types directly, this might cause your code to break. We don't consider this a breaking change because the intent of these groq libraries is to match the types of a groq query as closely as possible.
### Typescript Errors in IDEs

Often you'll run into an issue where you get typescript errors in your IDE but, when building workspace (either you studio or app using types), there are no errors. This only occurs because your IDE is using a different version of typescript than the one in your workspace. A few debugging steps:

#### VSCode

- The [`JavaScript and TypeScript Nightly` extension (identifier `ms-vscode.vscode-typescript-next`)](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next) creates issues here by design. It will always attempt to use the newest version of typescript instead of your workspace's version. I ended up uninstalling it.
- [Check that VSCode is actually using your workspace's version](https://code.visualstudio.com/docs/typescript/typescript-compiling#_compiler-versus-language-service) even if you've [defined the workspace version in `.vscode/settings.json`](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript). Use `TypeScript: Select TypeScript Version` to explictly pick the workspace version.
- Open any typescript file and you can [see which version is being used in the status bar](https://code.visualstudio.com/docs/typescript/typescript-compiling#_compiler-versus-language-service). Please check this (and provide a screenshot confirming this) before creating an issue. Spending hours debugging your issue ony to find that you're not using your workspace's version is very frustrating.
### `Type instantiation is excessively deep and possibly infinite`

**🚨 CHECK [`Typescript Errors in IDEs`](#typescript-errors-in-ides) FIRST!!! ISSUES WILL GET CLOSED IMMEDIATELY!!! 🚨**

You might run into the dreaded `Type instantiation is excessively deep and possibly infinite` error when writing GROQ queries. This isn't [too uncommon with more complex GROQ queries](https://github.com/saiichihashimoto/sanity-typed/issues?q=is%3Aissue+instantiation+is%3Aclosed). Unfortunately, this isn't a completely avoidable problem, as typescript has limits on complexity and parsing types from a string is an inherently complex problem. A set of steps for a workaround:

1. While not ideal, use [`@ts-expect-error`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments) to disable the error. You could use [`@ts-ignore` instead](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#ts-ignore-or-ts-expect-error), but ideally you'd like to remove the comment if a fix is released.
2. You still likely want manual types. Intersect the returned type with whatever is missing as a patch.
3. Create a PR in [`groq/src/specific-issues.test.ts`](../groq/src/specific-issues.test.ts) with your issue. [#642](https://github.com/saiichihashimoto/sanity-typed/pull/642/files) is a great example for this. Try to reduce your query and config as much as possible. The goal is a minimal reproduction.
4. If a PR isn't possible, make an issue with the same content. ie, the query and config you're using. Again, reduce them as much as possible. And then, now that you've done all the work, move it into a PR instead!
5. I'm one person and some of these issues are quite complex. Take a stab at fixing the bug! There's a ridiculous amount of tests so it's relatively safe to try things out.

People will sometimes create a repo with their issue. _Please_ open a PR with a minimal test instead. Without a PR there will be no tests reflecting your issue and it may appear again in a regression. Forking a github repo to make a PR is a more welcome way to contribute to an open source library.

## Breaking Changes

### 2 to 3

#### Typescript version from 5.7.2 <= x <= 5.7.3

The supported Typescript version is now 5.7.2 <= x <= 5.7.3. Older versions are no longer supported and newer versions will be added as we validate them.

### 1 to 2

#### Typescript version from 5.4.2 <= x <= 5.6.3

The supported Typescript version is now 5.4.2 <= x <= 5.6.3. Older versions are no longer supported and newer versions will be added as we validate them.

## Alternatives

- [`@sanity-codegen/cli`](https://www.npmjs.com/package/@sanity-codegen/cli)
- [`sanity-generator`](https://www.npmjs.com/package/sanity-generator)
- [`sanity-typed-queries`](https://www.npmjs.com/package/sanity-generator)
- [`@sanity-codegen/groq-codegen`](https://www.npmjs.com/package/@sanity-codegen/groq-codegen)
- [`sanity-query-helper`](https://www.npmjs.com/package/sanity-query-helper)
