# @sanity-typed/types

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/types?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/types)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/types?style=flat)](https://www.npmjs.com/package/@sanity-typed/types?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](https://github.com/saiichihashimoto/sanity-typed/blob/main/LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Typed Sanity Documents with zero schema changes!

## Install

```bash
npm install @sanity-typed/types sanity
```

## Usage

Use `defineConfig`, `defineType`, `defineField`, and `defineArrayMember` from this library exactly as you would from [sanity's own exports](https://www.sanity.io/docs/schema-field-types#e5642a3e8506). Then, you can `InferSchemaValues` to have the typescript types!

```typescript
// import { defineArrayMember, defineConfig, defineField, defineType } from "sanity";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

// Corresponding example: https://www.sanity.io/docs/schema-field-types#e5642a3e8506
// No changes using defineArrayMember, defineField, and defineArrayMember https://www.sanity.io/docs/schema-field-types
const product = defineType({
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    defineField({
      name: "productName",
      type: "string",
      title: "Product name",
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
            { type: "string", name: "label" },
            { type: "string", name: "value" },
          ],
        }),
      ],
    }),
  ],
});

// No changes using defineConfig https://www.sanity.io/docs/config-api-reference
const config = defineConfig({
  // ...
  schema: {
    types: [
      product,
      // ...
    ],
  },
});

export default config;

// This is where the magic happens!
type Values = InferSchemaValues<typeof config>;

// Import Product type into your application!
export type Product = Extract<Values, { _type: "product" }>;
/**
 *  Product === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: "product";
 *    _updatedAt: string;
 *    productName?: string;
 *    tags?: ({
 *      label?: string;
 *      value: string;
 *    })[];
 *  };
 **/
```

### Named/Aliased Types

```typescript
const foo = defineType({
  name: "foo",
  type: "document",
  fields: [
    defineField({
      name: "bar",
      type: "bar",
    }),
  ],
});

const bar = defineType({
  name: "bar",
  type: "object",
  fields: [
    defineField({
      name: "baz",
      type: "boolean",
    }),
  ],
});

const config = defineConfig({
  // ...
  schema: {
    types: [
      foo,
      bar,
      // ...
    ],
  },
});

export default config;

type Values = InferSchemaValues<typeof config>;

export type Foo = Extract<Values, { _type: "foo" }>;
/**
 *  Foo === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: "foo";
 *    _updatedAt: string;
 *    bar?: {
 *      _type: "bar";
 *    } & {
 *      baz?: boolean;
 *    };
 *  };
 **/
```

### Plugin Types

```typescript
// import { definePlugin } from "sanity";
import { definePlugin } from "@sanity-typed/types";

const foo = defineType({
  name: "foo",
  type: "document",
  fields: [
    defineField({
      name: "bar",
      type: "bar",
    }),
  ],
});

// No changes using definePlugin https://www.sanity.io/docs/developing-plugins
const barPlugin = definePlugin({
  name: "plugin",
  schema: {
    types: [
      defineType({
        name: "bar",
        type: "object",
        fields: [
          defineField({
            name: "baz",
            type: "boolean",
          }),
        ],
      }),
    ],
  },
});

const config = defineConfig({
  // ...
  schema: {
    types: [
      foo,
      // ...
    ],
  },
  plugins: [barPlugin()],
});

export default config;

type Values = InferSchemaValues<typeof config>;

export type Foo = Extract<Values, { _type: "foo" }>;
/**
 *  Foo === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: "foo";
 *    _updatedAt: string;
 *    bar?: {
 *      _type: "bar";
 *    } & {
 *      baz?: boolean;
 *    };
 *  };
 **/
```

## Goals

Typescript was an after-the-fact concern with sanity, since the rise of typescript happened after sanity took off. The `define*` methods are a good start, but they only help restrict the schema, not type the document types. There's been attempts, namely [`sanity-codegen`](https://github.com/ricokahler/sanity-codegen) and [`@sanity-typed/schema-builder`](https://github.com/saiichihashimoto/sanity-typed/tree/%40sanity-typed/schema-builder%403.0.1/packages/schema-builder), but they take the approach of creating a new way of building schemas. The drop-in replacement approach allows for zero migration cost.

The long term goal is to deprecate the monorepo altogether. Building this seperately was to move quickly and these features should be in sanity directly (and is likely one of their internal goals). The idea is to introduce these changes iteratively into sanity itself while removing them from this library, until it's reduced to simply passing through the `define*` methods directly, and will then be deprecated.

This shouldn't deter you from using it! Under the hood, it's passing all the inputs to sanity's native `define*` methods, so you shouldn't have any runtime differences. With all the typings being attempting to make their way into sanity, you should keep all the benefits of just importing the `define*` methods and noticing no differences.
