# @sanity-typed/schema-builder

[![NPM Downloads](https://img.shields.io/npm/dw/@sanity-typed/schema-builder?style=flat&logo=npm)](https://www.npmjs.com/package/@sanity-typed/schema-builder)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/@sanity-typed/schema-builder?style=flat)](https://www.npmjs.com/package/@sanity-typed/schema-builder?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](https://github.com/saiichihashimoto/sanity-typed/blob/main/LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat)](https://github.com/sponsors/saiichihashimoto)

Build [Sanity schemas](https://www.sanity.io/docs/content-modelling) declaratively and get typescript types of schema values for free!

- Typescript types for Sanity Values!
- _ALL_ types are inferred! No messing with generics, awkward casting, or code generation.
- [Zod](https://zod.dev/) schemas for [parsing & transforming values](#parsing-and-zod) (most notably, `datetime` values into javascript `Date`)!
- [Automatically generated mocks](#mocking) for testing!
- Support for any [additional types](#additional-types)!

## 🛑🛑🛑 **Deprecation Path (PLEASE READ!!!!)**

> The focus will shift from this schema builder to [`@sanity-typed/types`](https://github.com/saiichihashimoto/sanity-typed/tree/main/packages/types). It's approach is as close as possible to sanity's native schema definitions and will ideally solve this problem in a more maintainable way. This builder was a necessity of the time but, with the introduction of the `defineType`, `defineField`, and `defineArrayMember` methods, direct inference of typed values should be possible.

> We will continue to welcome bug fixes! `@sanity-typed/types` is still a work in progress and, as of now, this schema builder is widely used enough to warrant support. I encourage new users (and those interested in helping move this forward) to use [`@sanity-typed/types`](https://github.com/saiichihashimoto/sanity-typed/tree/main/packages/types) directly.

**TLDR:** Use [`@sanity-typed/types`](https://github.com/saiichihashimoto/sanity-typed/tree/main/packages/types) instead, unless you're already heavily invested in this. Then maybe migrate, anyways.

## Install

```bash
npm install @sanity-typed/schema-builder sanity
```

## Usage

```typescript
import { s } from "@sanity-typed/schema-builder";

const foo = s.document({
  name: "foo",
  fields: [
    {
      name: "foo",
      type: s.string(),
    },
    {
      name: "bar",
      type: s.array({
        of: [s.datetime(), s.number({ readOnly: true })],
      }),
    },
    {
      name: "hello",
      optional: true,
      type: s.object({
        fields: [
          {
            name: "world",
            type: s.number(),
          },
        ],
      }),
    },
  ],
});

// Use schemas in Sanity https://www.sanity.io/docs/schema-types
export default defineConfig({
  schema: {
    types: [foo.schema()],
  },
});
```

Your sanity client's return values can be typed with `s.infer`:

```typescript
import { createClient } from "@sanity/client";

const client = createClient(/* ... */);

// results are automatically typed from the schema!
const result: s.infer<typeof foo> = await client.fetch(`* [_type == "foo"][0]`);

/**
 *  typeof result === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: "foo";
 *    _updatedAt: string;
 *    bar: (string | number)[];
 *    foo: string;
 *    hello?: {
 *      world: number;
 *    };
 *  };
 **/
```

Because sanity returns JSON values, some values require conversion (ie changing most date strings into `Date`s). This is available with `.parse`:

```typescript
const parsedValue: s.output<typeof foo> = foo.parse(result);

/**
 *  typeof parsedValue === {
 *    _createdAt: Date;
 *    _id: string;
 *    _rev: string;
 *    _type: "foo";
 *    _updatedAt: Date;
 *    bar: (Date | number)[];
 *    foo: string;
 *    hello?: {
 *      world: number;
 *    };
 *  };
 **/
```

Mocks that match your schema can be generated with `.mock`:

```typescript
// Use @faker-js/faker to create mocks for tests!
import { faker } from "@faker-js/faker";

const mock = foo.mock(faker);

/**
 *  Same type as s.infer<typeof foo>
 *
 *  typeof mock === {
 *    _createdAt: string;
 *    _id: string;
 *    _rev: string;
 *    _type: "foo";
 *    _updatedAt: string;
 *    bar: (string | number)[];
 *    foo: string;
 *    hello?: {
 *      world: number;
 *    };
 *  };
 **/
```

## Types

All methods correspond to a [Schema Type](https://www.sanity.io/docs/schema-types) and pass through their corresponding [Schema Type Properties](https://www.sanity.io/docs/schema-types) as-is. For example, `s.string(def)` takes the usual properties of the sanity string type. Sanity's types documentation should "just work" with these types.

The notable difference is between how the sanity schema, the `type` property, and the `name` / `title` / `description` property are defined. The differentiator is that the `s.*` methods replace `type`, not the entire field:

```typescript
// This is how schemas are defined in sanity
const schema = {
  type: "document",
  name: "foo",
  fields: [
    {
      name: "bar",
      title: "Bar",
      description: "The Bar",
      type: "string",
    },
  ],
};

// This is the corresponding type in @sanity-typed/schema-builder
const type = s.document({
  name: "foo",
  fields: [
    {
      name: "bar",
      title: "Bar",
      description: "The Bar",
      type: s.string(),
    },
  ],
});

// INVALID!!!
const invalidType = s.document({
  name: "foo",
  fields: [
    // This is invalid. s.string is a type, not an entire field.
    s.string({
      name: "bar",
      title: "Bar",
      description: "The Bar",
    }),
  ],
});
```

The only types with names directly in the type are [`s.document`](#document) (because all documents are named and not nested) and [`s.objectNamed`](#object-named) (because named objects have unique behavior from nameless objects).

### Types with Fields

For types with `fields` (ie [`s.document`](#document), [`s.object`](#object), [`s.objectNamed`](#object-named), [`s.file`](#file), and [`s.image`](#image)) all `fields` are required by default (rather than sanity's default, which is optional by default). You can set it to `optional: true`.

```typescript
const type = s.object({
  fields: [
    {
      name: "foo",
      type: s.number(),
    },
    {
      name: "bar",
      optional: true,
      type: s.number(),
    },
  ],
});

type Value = s.infer<typeof type>;

/**
 * type Value === {
 *   foo: number;
 *   bar?: number;
 * }
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === {
 *   foo: number;
 *   bar?: number;
 * }
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "object",
 *   fields: [
 *     {
 *       name: "foo",
 *       type: "number",
 *       validation: (Rule) => Rule.validation(),
 *     },
 *     {
 *       name: "bar",
 *       type: "number",
 *     },
 *   ],
 * };
 */
```

### Array

All [array type](https://www.sanity.io/docs/array-type) properties pass through with the exceptions noted in [Types](#types).

Other exceptions include `min`, `max`, and `length`. These values are used in the zod validations, the sanity validations, and the inferred types.

```typescript
const type = s.array({
  of: [s.boolean(), s.datetime()],
});

type Value = s.infer<typeof type>;

/**
 * type Value === (boolean | string)[];
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === (boolean | Date)[];
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "array",
 *   of: [{ type: "boolean" }, { type: "datetime" }],
 *   ...
 * };
 */
```

```typescript
const type = s.array({
  min: 1,
  of: [s.boolean()],
});

type Value = s.infer<typeof type>;

/**
 * type Value === [boolean, ...boolean[]];
 */
```

```typescript
const type = s.array({
  max: 2,
  of: [s.boolean()],
});

type Value = s.infer<typeof type>;

/**
 * type Value === [] | [boolean] | [boolean, boolean];
 */
```

```typescript
const type = s.array({
  min: 1,
  max: 2,
  of: [s.boolean()],
});

type Value = s.infer<typeof type>;

/**
 * type Value === [boolean] | [boolean, boolean];
 */
```

```typescript
const type = s.array({
  length: 3,
  of: [s.boolean()],
});

type Value = s.infer<typeof type>;

/**
 * type Value === [boolean, boolean, boolean];
 */
```

### Block

All [block type](https://www.sanity.io/docs/block-type) properties pass through with the exceptions noted in [Types](#types).

```typescript
const type = s.block();

type Value = s.infer<typeof type>;

/**
 * type Value === PortableTextBlock;
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === PortableTextBlock;
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "block",
 *   ...
 * };
 */
```

### Boolean

All [boolean type](https://www.sanity.io/docs/boolean-type) properties pass through with the exceptions noted in [Types](#types).

```typescript
const type = s.boolean();

type Value = s.infer<typeof type>;

/**
 * type Value === boolean;
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === boolean;
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "boolean",
 *   ...
 * };
 */
```

### Date

All [date type](https://www.sanity.io/docs/date-type) properties pass through with the exceptions noted in [Types](#types).

```typescript
const type = s.date();

type Value = s.infer<typeof type>;

/**
 * type Value === string;
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === string;
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "date",
 *   ...
 * };
 */
```

### Datetime

All [datetime type](https://www.sanity.io/docs/datetime-type) properties pass through with the exceptions noted in [Types](#types).

Other exceptions include `min` and `max`. These values are used in the zod validations and the sanity validations.

Datetime parses into a javascript `Date`.

```typescript
const type = s.datetime();

type Value = s.infer<typeof type>;

/**
 * type Value === string;
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === Date;
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "datetime",
 *   ...
 * };
 */
```

### Document

All [document type](https://www.sanity.io/docs/document-type) properties pass through with the exceptions noted in [Types](#types) and [Types with Fields](#types-with-fields).

```typescript
const type = s.document({
  name: "foo",
  fields: [
    {
      name: "foo",
      type: s.number(),
    },
    {
      name: "bar",
      optional: true,
      type: s.number(),
    },
  ],
});

type Value = s.infer<typeof type>;

/**
 * type Value === {
 *   _createdAt: string;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: string;
 *   foo: number;
 *   bar?: number;
 * };
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === {
 *   _createdAt: Date;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: Date;
 *   foo: number;
 *   bar?: number;
 * };
 */

const schema = type.schema();

/**
 * const schema = {
 *   name: "foo",
 *   type: "document",
 *   fields: [...],
 *   ...
 * };
 */
```

### File

All [file type](https://www.sanity.io/docs/file-type) properties pass through with the exceptions noted in [Types](#types) and [Types with Fields](#types-with-fields).

```typescript
const type = s.file({
  fields: [
    {
      name: "foo",
      type: s.number(),
    },
    {
      name: "bar",
      optional: true,
      type: s.number(),
    },
  ],
});

type Value = s.infer<typeof type>;

/**
 * type Value === {
 *   _type: "file";
 *   asset: {
 *     _type: "reference";
 *     _ref: string;
 *   };
 *   foo: number;
 *   bar?: number;
 * };
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === {
 *   _type: "file";
 *   asset: {
 *     _type: "reference";
 *     _ref: string;
 *   };
 *   foo: number;
 *   bar?: number;
 * };
 */

const schema = type.schema();

/**
 * const schema = {
 *   name: "foo",
 *   type: "file",
 *   fields: [...],
 *   ...
 * };
 */
```

### Geopoint

All [geopoint type](https://www.sanity.io/docs/geopoint-type) properties pass through with the exceptions noted in [Types](#types).

```typescript
const type = s.geopoint();

type Value = s.infer<typeof type>;

/**
 * type Value === {
 *   _type: "geopoint";
 *   alt: number;
 *   lat: number;
 *   lng: number;
 * };
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === {
 *   _type: "geopoint";
 *   alt: number;
 *   lat: number;
 *   lng: number;
 * };
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "geopoint",
 *   ...
 * };
 */
```

### Image

All [image type](https://www.sanity.io/docs/image-type) properties pass through with the exceptions noted in [Types](#types) and [Types with Fields](#types-with-fields).

Other exceptions include `hotspot`. Including `hotspot: true` adds the `crop` and `hotspot` properties in the infer types.

```typescript
const type = s.image({
  fields: [
    {
      name: "foo",
      type: s.number(),
    },
    {
      name: "bar",
      optional: true,
      type: s.number(),
    },
  ],
});

type Value = s.infer<typeof type>;

/**
 * type Value === {
 *   _type: "image";
 *   asset: {
 *     _type: "reference";
 *     _ref: string;
 *   };
 *   foo: number;
 *   bar?: number;
 * };
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === {
 *   _type: "image";
 *   asset: {
 *     _type: "reference";
 *     _ref: string;
 *   };
 *   foo: number;
 *   bar?: number;
 * };
 */

const schema = type.schema();

/**
 * const schema = {
 *   name: "foo",
 *   type: "image",
 *   fields: [...],
 *   ...
 * };
 */
```

### Number

All [number type](https://www.sanity.io/docs/number-type) properties pass through with the exceptions noted in [Types](#types).

Other exceptions include `greaterThan`, `integer`, `lessThan`, `max`, `min`, `negative`, `positive`, and `precision`. These values are used in the zod validations and the sanity validations.

```typescript
const type = s.number();

type Value = s.infer<typeof type>;

/**
 * type Value === number;
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === number;
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "number",
 *   ...
 * };
 */
```

### Object

All [object type](https://www.sanity.io/docs/object-type) properties pass through with the exceptions noted in [Types](#types) and [Types with Fields](#types-with-fields).

```typescript
const type = s.object({
  fields: [
    {
      name: "foo",
      type: s.number(),
    },
    {
      name: "bar",
      optional: true,
      type: s.number(),
    },
  ],
});

type Value = s.infer<typeof type>;

/**
 * type Value === {
 *   foo: number;
 *   bar?: number;
 * };
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === {
 *   foo: number;
 *   bar?: number;
 * };
 */

const schema = type.schema();

/**
 * const schema = {
 *   name: "foo",
 *   type: "object",
 *   fields: [...],
 *   ...
 * };
 */
```

### Object (Named)

All [object type](https://www.sanity.io/docs/object-type) properties pass through with the exceptions noted in [Types](#types) and [Types with Fields](#types-with-fields).

This is separate from [`s.object`](#object) because, when objects are named in sanity, there are significant differences:

- The value has a `_type` field equal to the object's name.
- They can be used directly in schemas (like any other schema).
- They can also be registered as a top level object and simply referenced by type within another schema.

```typescript
const type = s.objectNamed({
  name: "aNamedObject",
  fields: [
    {
      name: "foo",
      type: s.number(),
    },
    {
      name: "bar",
      optional: true,
      type: s.number(),
    },
  ],
});

type Value = s.infer<typeof type>;

/**
 * type Value === {
 *   _type: "aNamedObject";
 *   foo: number;
 *   bar?: number;
 * };
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === {
 *   _type: "aNamedObject";
 *   foo: number;
 *   bar?: number;
 * };
 */

const schema = type.schema();

/**
 * const schema = {
 *   name: "foo",
 *   type: "object",
 *   fields: [...],
 *   ...
 * };
 */
```

```typescript
// Use `.namedType()` to reference it in another schema.
const someOtherType = s.array({ of: [type.namedType()] });

// The reference value is used directly.
type SomeOtherValue = s.infer<typeof someOtherType>;

/**
 * type SomeOtherValue = [{
 *   _type: "aNamedObject";
 *   foo: number;
 *   bar?: number;
 * }];
 */

// The schema is made within the referencing schema
const someOtherTypeSchema = someOtherType.schema();

/**
 * const someOtherTypeSchema = {
 *   type: "array",
 *   of: [{ type: "" }],
 *   ...
 * };
 */

defineConfig({
  schema: {
    types: [type.schema(), someOtherType.schema()],
  },
});
```

### Reference

All [reference type](https://www.sanity.io/docs/reference-type) properties pass through with the exceptions noted in [Types](#types).

Reference resolves into the [referenced document's mock](#resolving-mocks).

Other exceptions include `weak`. Including `weak: true` adds the `_weak: true` properties in the infer types.

```typescript
const type = s.reference({
  to: [someDocumentType, someOtherDocumentType],
});

type Value = s.infer<typeof type>;

/**
 * type Value === {
 *   _ref: string;
 *   _type: "reference";
 *   _weak?: boolean;
 * };
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === {
 *   _ref: string;
 *   _type: "reference";
 *   _weak?: boolean;
 * };
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "reference",
 *   to: [...],
 *   ...
 * };
 */
```

```typescript
const type = s.reference({
  weak: true,
  to: [someDocumentType, someOtherDocumentType],
});

type Value = s.infer<typeof type>;

/**
 * type Value === {
 *   _ref: string;
 *   _type: "reference";
 *   _weak: true;
 * };
 */
```

### Slug

All [slug type](https://www.sanity.io/docs/slug-type) properties pass through with the exceptions noted in [Types](#types).

Slug parses into a string.

```typescript
const type = s.slug();

type Value = s.infer<typeof type>;

/**
 * type Value === {
 *   _type: "slug";
 *   current: string;
 * };
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === string;
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "slug",
 *   ...
 * };
 */
```

### String

All [string type](https://www.sanity.io/docs/string-type) properties pass through with the exceptions noted in [Types](#types).

Other exceptions include `min`, `max`, and `length`. These values are used in the zod validations and the sanity validations.

```typescript
const type = s.string();

type Value = s.infer<typeof type>;

/**
 * type Value === string;
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === string;
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "string",
 *   ...
 * };
 */
```

### Text

All [text type](https://www.sanity.io/docs/text-type) properties pass through with the exceptions noted in [Types](#types).

Other exceptions include `min`, `max`, and `length`. These values are used in the zod validations and the sanity validations.

```typescript
const type = s.text();

type Value = s.infer<typeof type>;

/**
 * type Value === string;
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === string;
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "text",
 *   ...
 * };
 */
```

### URL

All [url type](https://www.sanity.io/docs/url-type) properties pass through with the exceptions noted in [Types](#types).

```typescript
const type = s.url();

type Value = s.infer<typeof type>;

/**
 * type Value === string;
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === string;
 */

const schema = type.schema();

/**
 * const schema = {
 *   type: "url",
 *   ...
 * };
 */
```

## Additional Types

In addition to the default [sanity schema types](#types), you may have nonstandard types ([custom asset sources](https://www.sanity.io/docs/custom-asset-sources) like [MUX Input](https://www.sanity.io/plugins/sanity-plugin-mux-input) or unique inputs like [code input](https://www.sanity.io/plugins/code-input)).

`s.createType` allows for creation of a custom type. It returns an object of type `s.SanityType<Definition, Value, ParsedValue, ResolvedValue>`. All provided `s.*` methods use this, so it should be fully featured for any use case.

An example using [Mux Input](https://www.sanity.io/plugins/sanity-plugin-mux-input) (not including installing the plugin):

```typescript
import { faker } from "@faker-js/faker";
import { z } from "zod";

import { s } from "@sanity-typed/schema-builder";

const muxVideo = () =>
  s.createType({
    // `schema` returns the sanity schema type
    schema: () => ({ type: "mux.video" } as const),

    // `mock` returns an instance of the native sanity value
    // `faker` will have a stable `seed` value
    mock: (faker) =>
      ({
        _type: "mux.video",
        asset: {
          _type: "reference",
          _ref: faker.datatype.uuid(),
        },
      } as const),

    // `zod` is used for parsing this type
    zod: z.object({
      _type: z.literal("mux.video"),
      asset: z.object({
        _type: z.literal("reference"),
        _ref: z.string(),
      }),
    }),

    // `zodResolved` is used for parsing into the resolved value
    // defaults to reusing `zod`
    zodResolved: z
      .object({
        _type: z.literal("mux.video"),
        asset: z.object({
          _type: z.literal("reference"),
          _ref: z.string(),
        }),
      })
      .transform(
        ({ asset: { _ref: playbackId } }) => resolvedValues[playbackId]
      ),
  });

const type = document({
  name: "foo",
  fields: [
    {
      name: "video",
      type: muxVideo(),
    },
  ],
});

const value = type.mock(faker);

/**
 * typeof value === {
 *   _createdAt: string;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: string;
 *   video: {
 *     _type: "mux.video";
 *     asset: {
 *       _ref: string;
 *       _type: "reference";
 *     };
 *   };
 * };
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === {
 *   _createdAt: Date;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: Date;
 *   video: {
 *     _type: "mux.video";
 *     asset: {
 *       _ref: string;
 *       _type: "reference";
 *     };
 *   };
 * };
 */

const resolvedValue: s.resolved<typeof type> = type.resolve(value);

/**
 * typeof resolvedValue === {
 *   _createdAt: Date;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: Date;
 *   video: (typeof resolvedValues)[string];
 * };
 */

const schema = type.schema();

/**
 * const schema = {
 *   name: "foo",
 *   type: "document",
 *   fields: [
 *     {
 *       name: "video",
 *       type: "mux.video",
 *     },
 *   ],
 * };
 */
```

## Parsing and zod

Due to sanity's transport layer being JSON (and whatever reason `slug` has for being wrapped in an object), some of sanity's return values require some transformation in application logic. Every type includes a `.parse(value)` method that transforms values to a more convenient value.

We accomplish that using [Zod](https://zod.dev/), a powerful schema validation library with full typescript support. A few of the types have default transformations (most notably [`s.datetime`](#datetime) parsing into a javascript `Date` object). The zod types are available for customization, allowing your own transformations.

```typescript
const type = s.document({
  name: "foo",
  // If you dislike the dangling underscore on `_id`, this transforms it to `id`:
  zod: (zod) => zod.transform(({ _id: id, ...doc }) => ({ id, ...doc })),
  fields: [
    {
      name: "aString",
      type: s.string(),
    },
    {
      name: "aStringLength",
      type: s.string({
        // For whatever reason, if you want the length of the string instead of the string itself:
        zod: (zod) => zod.transform((value) => value.length),
      }),
    },
    {
      name: "aDateTime",
      type: s.datetime(),
    },
    {
      name: "aSlug",
      type: s.slug(),
    },
  ],
});

const value: type Value === {
  /* ... */
};

/**
 * This remains the same:
 *
 * typeof value === {
 *   _createdAt: string;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: string;
 *   aString: string;
 *   aStringLength: string;
 *   aDateTime: string;
 *   aSlug: {
 *     _type: "slug";
 *     current: string;
 *   };
 * }
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * Notice the changes:
 *
 * typeof parsedValue === {
 *   _createdAt: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: string;
 *   id: string;
 *   aString: string;
 *   aStringLength: number;
 *   aDateTime: Date;
 *   aSlug: string;
 * }
 */
```

## Mocking

Sanity values are used directly in react components or application code that needs to be tested. While tests tend to need mocks that are specific to isolated tests, autogenerated mocks are extremely helpful. Every type includes a `.mock(faker)` method that generates mocks of that type.

We accomplish that using [Faker](https://fakerjs.dev/guide/), a powerful mocking library with full typescript support. All of the types have default mocks. The mock methods are available for customization, allowing your own mocks.

Note: Each type will create it's own instance of `Faker` with a `seed` based on it's path in the document, so mocked values for any field should remain consistent as long as it remains in the same position.

```typescript
import { faker } from "@faker-js/faker";

const type = s.document({
  name: "foo",
  fields: [
    {
      name: "aString",
      type: s.string(),
    },
    {
      name: "aFirstName",
      type: s.string({
        mock: (faker) => faker.name.firstName(),
      }),
    },
  ],
});

const value = type.mock(faker);

/**
 * typeof value === {
 *   _createdAt: string;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: string;
 *   aString: string;
 *   aFirstName: string;
 * }
 *
 * value.aString === "Seamless"
 * value.aFirstName === "Katelynn"
 */
```

## Resolving Mocks

Sanity values often reference something outside of itself, most notably [`s.reference`](#reference) referencing other documents. Applications determine how those resolutions happen (in the case of `s.reference`, usually via groq queries) but tests that require resolved values shouldn't rebuild that logic. Every type includes a `.resolve(value)` method that resolves mocks of that type.

We accomplish that using [Zod](https://zod.dev/), a powerful schema validation library with full typescript support. All of the types have default resolutions. The resolution methods are available for customization, allowing your own resolution.

```typescript
import { faker } from "@faker-js/faker";

const barType = s.document({
  name: "bar",
  fields: [
    {
      name: "value",
      type: s.string(),
    },
  ],
});

const nonSanityMocks: Record<string, NonSanity> = {
  /* ... */
};

const type = s.document({
  name: "foo",
  fields: [
    {
      name: "bar",
      type: s.reference({ to: [barType] }),
    },
    {
      name: "aString",
      type: s.string(),
    },
    {
      name: "nonSanity",
      type: s.string({
        zodResolved: (zod) => zod.transform((value) => nonSanityMocks[value]!),
      }),
    },
  ],
});

const value = type.resolve(type.mock(faker));

/**
 * typeof value === {
 *   _createdAt: Date;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: Date;
 *   bar: {
 *     _createdAt: Date;
 *     _id: string;
 *     _rev: string;
 *     _type: "bar";
 *     _updatedAt: Date;
 *     value: string;
 *   };
 *   aString: string;
 *   nonSanity: NonSanity;
 * }
 */
```
