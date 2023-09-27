# @sanity-typed/types

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/types?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/types)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/types?style=flat)](https://www.npmjs.com/package/@sanity-typed/types?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Infer Sanity Document Types from Sanity Schemas

@[:page_toc](## Page Contents)

## Install

```bash
npm install sanity @sanity-typed/types
```

## Usage

Use `defineConfig`, `defineType`, `defineField`, and `defineArrayMember` from this library exactly as you would from [`sanity`](https://www.sanity.io/docs/schema-field-types#e5642a3e8506). Then, use `InferSchemaValues` to get the typescript types!

@[typescript](docs/schemas/product.ts)
@[typescript](docs/sanity.config.ts)

## Plugins

### Writing typed plugins

Use `definePlugin` from this library exactly as you would from [sanity's own exports](https://www.sanity.io/docs/developing-plugins).

`my-plugin.ts`:

```typescript
// import { defineField, definePlugin, defineType } from "sanity";
import { defineField, definePlugin, defineType } from "@sanity-typed/types";

/** No changes using definePlugin */
export const myPlugin = definePlugin({
  name: "plugin",
  schema: {
    types: [
      defineType({
        name: "myPlugin",
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
```

`sanity.config.ts`:

```typescript
// import { defineConfig, defineField, defineType } from "sanity";
import { defineConfig, defineField, defineType } from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

import { myPlugin } from "./my-plugin";

const foo = defineType({
  name: "foo",
  type: "document",
  fields: [
    defineField({
      name: "bar",
      type: "myPlugin",
    }),
  ],
});

const config = defineConfig({
  schema: {
    types: [foo],
  },
  plugins: [myPlugin()],
});

export default config;

type SanityValues = InferSchemaValues<typeof config>;

export type Foo = SanityValues["foo"];
/**
 *  Foo === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: "foo";
 *    _updatedAt: string;
 *    bar?: {
 *      _type: "myPlugin";
 *      baz?: boolean;
 *    };
 *  };
 **/
```

However, this export won't work for users who are using sanity's default methods. So that you won't have to define your plugin twice, we provide a `castFromTyped` method, which converts the outputs of any `define*` method to their native `sanity` counterparts:

```typescript
import { castFromTyped, definePlugin } from "@sanity-typed/types";

export const myTypedPlugin = definePlugin({
  name: "plugin",
  schema: {
    types: [
      // ...
    ],
  },
});

// You'll likely want this as a default export as well!
export const myUntypedPlugin = castFromTyped(myTypedPlugin);
```

### Using external untyped plugins

sanity-typed also works directly with untyped `definePlugin` directly, so you can import and use plugins directly (although they type as `unknown` values). It doesn't handle untyped `defineField`/`defineArrayMember`/`defineType` though, and some plugins export some for convenience. `castToTyped` similarly converts untyped `define*` methods to `sanity-typed` versions with `unknown` values:

```typescript
import { orderRankField } from "@sanity/orderable-document-list";

import { castToTyped } from "@sanity-typed/types";

const nav = defineType({
  name: "nav",
  type: "document",
  title: "Navigation",
  fields: [
    castToTyped(orderRankField({ type: "nav" })),
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
```

## Considerations

@[:markdown](docs/considerations/types-vs-content-lake.md)

## Breaking Changes

### 4 to 5

#### Removed `_InferValue` and `AliasValue`

Use [`InferSchemaValues`](#inferschemavalues) instead. Neither `_InferValue` nor `AliasValue` are directly usable, while `InferSchemaValues` is the only real world use case.

### 3 to 4

#### Referenced `_type` needs `as const`

For `@sanity-typed/groq` to infer the right types from references, the reference type needs to carry the type it's referencing along with it. Unfortunately, it isn't deriving the literal so an `as const` is needed.

```diff
const product = defineType({
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    defineField({
      name: "foo",
      type: "reference",
-     to: [{ type: "referencedType" }],
+     to: [{ type: "referencedType" as const }],
    }),
  ],
});
```

#### Renamed `DocumentValue` to `SanityDocument`

```diff
- import type { DocumentValue } from "@sanity-typed/types";
+ import type { SanityDocument } from "@sanity-typed/types";
```

### 2 to 3

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

You can still use `_InferValue` but this is discouraged, because it will be missing the context from the config (and is removed in v5):

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

## Alternatives

- [`sanity-codegen`](https://www.npmjs.com/package/sanity-codegen)
- [`@sanity-codegen/cli`](https://www.npmjs.com/package/@sanity-codegen/cli)
- [`sanity-generator`](https://www.npmjs.com/package/sanity-generator)
- [`sanity-typed-queries`](https://www.npmjs.com/package/sanity-generator)
- [`sanity-typed-schema`](https://www.npmjs.com/package/sanity-typed-schema)
- [`sanity-schema-builder`](https://www.npmjs.com/package/sanity-typed-schema)
- [`@sanity-typed/schema-builder`](https://www.npmjs.com/package/@sanity-typed/schema-builder)
- [`sanity-typed-schema-builder`](https://www.npmjs.com/package/sanity-typed-schema-builder)
