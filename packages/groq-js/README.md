# @sanity-typed/groq-js

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/groq-js?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/groq-js)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/groq-js?style=flat)](https://www.npmjs.com/package/@sanity-typed/groq-js?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

[groq-js](https://github.com/sanity-io/groq-js) with typed GROQ Results

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Breaking Changes](#breaking-changes)
  - [2 to 3](#2-to-3)
    - [Typescript version from 5.7.2 <= x <= 5.7.3](#typescript-version-from-572--x--573)
  - [1 to 2](#1-to-2)
    - [Typescript version from 5.4.2 <= x <= 5.6.3](#typescript-version-from-542--x--563)
- [Considerations](#considerations)
  - [Using your derived types](#using-your-derived-types)
  - [The parsed tree changes in seemingly breaking ways](#the-parsed-tree-changes-in-seemingly-breaking-ways)
  - [GROQ Query results changes in seemingly breaking ways](#groq-query-results-changes-in-seemingly-breaking-ways)
  - [Typescript Errors in IDEs](#typescript-errors-in-ides)
    - [VSCode](#vscode)
  - [`Type instantiation is excessively deep and possibly infinite`](#type-instantiation-is-excessively-deep-and-possibly-infinite)

## Install

```bash
npm install groq-js @sanity-typed/groq-js
```

## Usage

Use `parse` and `evaluate` exactly as you would from [`groq-js`](https://github.com/sanity-io/groq-js). Then, use the results with the typescript types!

Typically, this isn't used directly, but via [`@sanity-typed/client-mock`'s](../client-mock) methods that produce groq results. But it can be done directly:

```your-typed-groq-js.ts```:
```typescript
// import { evaluate, parse } from "groq-js";
import { evaluate, parse } from "@sanity-typed/groq-js";

const input = '*[_type == "product"]{productName}';

const tree = parse(input);
/**
 *  typeof tree === {
 *    type: "Projection";
 *    base: {
 *      type: "Filter";
 *      base: {
 *        type: "Everything";
 *      };
 *      expr: {
 *        type: "OpCall";
 *        op: "==";
 *        left: {
 *          name: "_type";
 *          type: "AccessAttribute";
 *        };
 *        right: {
 *          type: "Value";
 *          value: "product";
 *        };
 *      };
 *    };
 *    expr: {
 *      type: "Object";
 *      attributes: [{
 *        type: "ObjectAttributeValue";
 *        name: "productName";
 *        value: {
 *          type: "AccessAttribute";
 *          name: "productName";
 *        };
 *      }];
 *    };
 *  }
 */

const value = await evaluate(tree, {
  dataset: [
    {
      _type: "product",
      productName: "Some Cool Product",
      // ...
    },
    {
      _type: "someOtherType",
      otherField: "foo",
      // ...
    },
  ],
});

const result = await value.get();
/**
 *  typeof result === [{
 *    productName: "Some Cool Product";
 *  }]
 */
```

## Breaking Changes

### 2 to 3

#### Typescript version from 5.7.2 <= x <= 5.7.3

The supported Typescript version is now 5.7.2 <= x <= 5.7.3. Older versions are no longer supported and newer versions will be added as we validate them.

### 1 to 2

#### Typescript version from 5.4.2 <= x <= 5.6.3

The supported Typescript version is now 5.4.2 <= x <= 5.6.3. Older versions are no longer supported and newer versions will be added as we validate them.

## Considerations

### Using your derived types

You can also use [your typed schema](../types) to keep parity with the types [your typed client](../client) would receive.

```bash
npm install sanity groq-js @sanity-typed/types @sanity-typed/groq-js
```

```product.ts```:
```typescript
// import { defineArrayMember, defineField, defineType } from "sanity";
import {
  defineArrayMember,
  defineField,
  defineType,
} from "@sanity-typed/types";

/** No changes using defineType, defineField, and defineArrayMember */
export const product = defineType({
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    defineField({
      name: "productName",
      type: "string",
      title: "Product name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags for item",
      of: [
        defineArrayMember({
          type: "object",
          name: "tag",
          fields: [
            defineField({ type: "string", name: "label" }),
            defineField({ type: "string", name: "value" }),
          ],
        }),
      ],
    }),
  ],
});
```
```sanity.config.ts```:
```typescript
import { structureTool } from "sanity/structure";

// import { defineConfig } from "sanity";
import { defineConfig } from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { post } from "./schemas/post";
import { product } from "./schemas/product";

/** No changes using defineConfig */
const config = defineConfig({
  projectId: "59t1ed5o",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [
      product,
      // ...
      post,
    ],
  },
});

export default config;

/** Typescript type of all types! */
export type SanityValues = InferSchemaValues<typeof config>;
/**
 *  SanityValues === {
 *    product: {
 *      _createdAt: string;
 *      _id: string;
 *      _rev: string;
 *      _type: "product";
 *      _updatedAt: string;
 *      productName: string;
 *      tags?: {
 *        _key: string;
 *        _type: "tag";
 *        label?: string;
 *        value?: string;
 *      }[];
 *    };
 *    // ... all your types!
 *  }
 */
```
```your-typed-groq-js-with-sanity-types.ts```:
```typescript
// import { evaluate, parse } from "groq-js";
import { evaluate, parse } from "@sanity-typed/groq-js";
import type { DocumentValues } from "@sanity-typed/types";

import type { SanityValues } from "./sanity.config";

const input = '*[_type == "product"]{productName}';

const tree = parse(input);

const value = await evaluate(tree, {
  dataset: [
    {
      _type: "product",
      productName: "Some Cool Product",
      // ...
    },
    {
      _type: "someOtherType",
      otherField: "foo",
      // ...
    },
  ] satisfies DocumentValues<SanityValues>[],
});

const result = await value.get();
/**
 *  typeof result === {
 *    productName: string;
 *  }[]
 */

// Notice how `productName` is inferred as a `string`, not as `"Some Cool Product"`.
// Also, it's in an array as opposed to a tuple.
// This resembles the types you'd receive from @sanity-typed/client,
// which wouldn't be statically aware of `"Some Cool Product"` either.
```

### The parsed tree changes in seemingly breaking ways

`@sanity-typed/groq` attempts to type its parsed types as close as possible to [`groq-js`](https://github.com/sanity-io/groq-js)'s `parse` function output. Any fixes to match it more correctly won't be considered a major change and, if `groq-js` changes it's output in a version update, we're likely to match it. If you're using the parsed tree's types directly, this might cause your code to break. We don't consider this a breaking change because the intent of these groq libraries is to match the types of a groq query as closely as possible.
### GROQ Query results changes in seemingly breaking ways

Similar to [parsing](#the-parsed-tree-changes-in-seemingly-breaking-ways), evaluating groq queries will attempt to match how sanity actually evaluates queries. Again, any fixes to match that or changes to groq evaluation will likely not be considered a major change but, rather, a bug fix.

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
