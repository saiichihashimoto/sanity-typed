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
export type Product = Values["product"];
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

export type Foo = Values["foo"];
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

export type Foo = Values["foo"];
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

### `castToTyped(arg: ReturnType<typeof definePluginNative | typeof defineTypeNative | typeof defineFieldNative | typeof defineArrayMemberNative>)`

Types that are defined externally using `sanity` (ie imported plugins) can be included in your typed config. `castToTyped` casts the type to ignore typescript errors. This will make it's best effort at including those types, but won't magically type everything.

```typescript
import {
  defineField as defineFieldNative,
  definePlugin as definePluginNative,
  defineType as defineTypeNative,
} from "sanity";

import { expectType } from "@sanity-typed/test-utils";

import { castToTyped, defineConfig, defineField, defineType } from ".";
import type { InferSchemaValues } from ".";

const config = defineConfig({
  dataset: "dataset",
  projectId: "projectId",
  schema: {
    types: [
      defineType({
        name: "foo",
        type: "document",
        fields: [
          defineField({
            name: "pluginValue",
            type: "pluginValue",
          }),
        ],
      }),
    ],
  },
  plugins: [
    // Plugin dependencies can be included this way!
    castToTyped(
      definePluginNative({
        name: "plugin",
        schema: {
          types: [
            defineTypeNative({
              name: "pluginValue",
              type: "object" as const,
              fields: [
                defineFieldNative({
                  name: "baz",
                  type: "boolean",
                }),
              ],
            }),
          ],
        },
      })()
    ),
  ],
});

type Values = InferSchemaValues<typeof config>;

export type Foo = Values["foo"];

/**
 *  Foo === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: "foo";
 *    _updatedAt: string;
 *    pluginValue?: unknown;
 *  };
 */
```

### `castFromTyped(arg: ReturnType<typeof definePlugin | typeof defineType | typeof defineField | typeof defineArrayMember>)`

Types that are defined `@sanity-typed` can be casted back (ie plugin authors wanting to provide the native plugin type). `castFromTyped` casts the type to ignore typescript errors. This will make it's best effort at including those types, but won't magically type everything.

```typescript
import {
  defineConfig as defineConfigNative,
  defineField as defineFieldNative,
  defineType as defineTypeNative,
} from "sanity";

import { castFromTyped, defineField, definePlugin, defineType } from ".";

const config = defineConfigNative({
  dataset: "dataset",
  projectId: "projectId",
  schema: {
    types: [
      defineTypeNative({
        name: "foo",
        type: "document" as const,
        fields: [
          defineFieldNative({
            name: "pluginValue",
            type: "pluginValue",
          }),
        ],
      }),
    ],
  },
  plugins: [
    // Plugin authors can export this return value for the natively typed plugin
    castFromTyped(
      // They COULD also export this type, for those who use @sanity-typed as well
      definePlugin({
        name: "plugin",
        schema: {
          types: [
            defineType({
              name: "pluginValue",
              type: "object" as const,
              fields: [
                defineField({
                  name: "baz",
                  type: "boolean",
                }),
              ],
            }),
          ],
        },
      })()
    ),
  ],
});

export { config };

/**
 *  typeof config === ReturnType<typeof defineConfig>;
 */
```

## Goals

Typescript was an after-the-fact concern with sanity, since the rise of typescript happened after sanity took off. The `define*` methods are a good start, but they only help restrict the schema, not type the document types. There's been attempts, namely [`sanity-codegen`](https://github.com/ricokahler/sanity-codegen) and [`@sanity-typed/schema-builder`](https://github.com/saiichihashimoto/sanity-typed/tree/%40sanity-typed/schema-builder%403.0.1/packages/schema-builder), but they take the approach of creating a new way of building schemas. The drop-in replacement approach allows for zero migration cost.

The long term goal is to deprecate the monorepo altogether. Building this seperately was to move quickly and these features should be in sanity directly (and is likely one of their internal goals). The idea is to introduce these changes iteratively into sanity itself while removing them from this library, until it's reduced to simply passing through the `define*` methods directly, and will then be deprecated.

This shouldn't deter you from using it! Under the hood, it's passing all the inputs to sanity's native `define*` methods, so you shouldn't have any runtime differences. With all the typings being attempting to make their way into sanity, you should keep all the benefits of just importing the `define*` methods and noticing no differences.

## Migrations

### Migrating from 2.x to 3.x

#### InferSchemaValues

`InferSchemaValues<typeof config>` used to return a union of all types but now returns an object keyed off by type. This is because using `Extract` to retrieve specific type was difficult. Object types would have a `_type` for easy extraction, but all the other types were less reliable (i.e. arrays and primitives).

```diff
export default config;

type Values = InferSchemaValues<typeof config>;

- export type Product = Extract<Values, { _type: "product" }>
+ export type Product = Values["product"];
```

#### InferValue

Types used to be inferred using `InferValue<typeof type>` for easy exporting. Now, `InferSchemaValues<typeof config>` needs to be used, and individual types keyed off of it. The reason for this is that only the config has context about aliased types, so `InferValue` was always going to be missing those values.

```diff
const product = defineType({
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    // ...
  ],
});

- export type Product = InferValue<typeof product>;

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

type Values = InferSchemaValues<typeof config>;

+ export type Product = Values["product"];
```

You can still use `_InferValue` but this is discouraged, because it will be missing the context from the config:

```diff
const product = defineType({
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    // ...
  ],
});

- export type Product = InferValue<typeof product>;
+ export type Product = _InferValue<typeof product>;
```
