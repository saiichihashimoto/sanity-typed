# @portabletext-typed/react

[![NPM Downloads](https://img.shields.io/npm/dw/@portabletext-typed/react?style=flat&logo=npm)](https://www.npmjs.com/package/@portabletext-typed/react)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/sanity-typed?style=flat&logo=github)](https://github.com/saiichihashimoto/sanity-typed/graphs/contributors)
[![GitHub issues by-label](https://img.shields.io/github/issues/saiichihashimoto/sanity-typed/help%20wanted?style=flat&logo=github&color=007286)](https://github.com/saiichihashimoto/sanity-typed/labels/help%20wanted)
[![Minified Size](https://img.shields.io/bundlephobia/min/@portabletext-typed/react?style=flat)](https://www.npmjs.com/package/@portabletext-typed/react?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/sanity-typed?style=flat)](LICENSE)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/saiichihashimoto?style=flat&logo=githubsponsors)](https://github.com/sponsors/saiichihashimoto)

[@portabletext/react](https://github.com/portabletext/react) with typed arguments

## Page Contents
- [Install](#install)
- [Usage](#usage)
- [Breaking Changes](#breaking-changes)
  - [3 to 4](#3-to-4)
    - [Node Requirement to ^22.14.0](#node-requirement-to-22140)
  - [2 to 3](#2-to-3)
    - [Typescript version from 5.7.2 <= x <= 5.7.3](#typescript-version-from-572--x--573)
  - [1 to 2](#1-to-2)
    - [Typescript version from 5.4.2 <= x <= 5.6.3](#typescript-version-from-542--x--563)

## Install

```bash
npm install @portabletext/react @portabletext-typed/react
```

## Usage

After using [@sanity-typed/types](../types) and [@sanity-typed/client](../client) and you have typed blocks, use `PortableText` from this library as you would from [`@portabletext/react`](https://github.com/portabletext/react) to get fully typed arguments!

```post.ts```:
```typescript
// import { defineArrayMember, defineField, defineType } from "sanity";
import {
  defineArrayMember,
  defineField,
  defineType,
} from "@sanity-typed/types";

/** No changes using defineType, defineField, and defineArrayMember */
export const post = defineType({
  name: "post",
  type: "document",
  title: "Post",
  fields: [
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      validation: (Rule) => Rule.required(),
      of: [
        defineArrayMember({ type: "image" }),
        defineArrayMember({
          type: "block",
          of: [defineArrayMember({ type: "file" })],
          styles: [
            { title: "Normal", value: "normal" as const },
            { title: "Foo", value: "foo" as const },
          ],
          lists: [
            { title: "Bullet", value: "bullet" as const },
            { title: "Bar", value: "bar" as const },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" as const },
              { title: "Baz", value: "baz" as const },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                  }),
                ],
              }),
              defineArrayMember({
                name: "qux",
                type: "object",
                title: "Qux",
                fields: [
                  defineField({
                    name: "value",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
  ],
});
```
```with-portabletext-react.tsx```:
```typescript
// import { PortableText } from "@portabletext/react";
import type { InferGetStaticPropsType } from "next";
import { Fragment } from "react";

import { PortableText } from "@portabletext-typed/react";

import { client } from "../sanity/client";

export const getStaticProps = async () => ({
  props: { posts: await client.fetch('*[_type=="post"]') },
});

const Index = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <>
    <h1>Posts</h1>
    {posts.map(({ _id, content }) => (
      <Fragment key={_id}>
        <h2>Post</h2>
        <PortableText
          value={content}
          components={{
            types: {
              // From Siblings
              image: ({ isInline, value }) => (
                <div>
                  typeof {isInline} === false,
                  <br />
                  typeof {JSON.stringify(value)} === ImageValue,
                </div>
              ),
              // From Children
              file: ({ isInline, value }) => (
                <span>
                  typeof {isInline} === true,
                  <span />
                  typeof {JSON.stringify(value)} === FileValue,
                </span>
              ),
            },
            block: {
              // Non-Default Styles
              foo: ({ children, value }) => (
                <div>
                  typeof {JSON.stringify(value)} === PortableTextBlock{"<"} ...
                  {">"} & {"{"} style: &quot;foo&quot; {"}"},
                  <span />
                  {children}
                </div>
              ),
            },
            list: {
              // Non-Default Lists
              bar: ({ children, value }) => (
                <ul>
                  <li>
                    typeof {JSON.stringify(value)} === ToolkitPortableTextList &
                    {"{"} listItem: &quot;bar&quot; {"}"},
                  </li>
                  {children}
                </ul>
              ),
            },
            listItem: {
              // Non-Default Lists
              bar: ({ children, value }) => (
                <li>
                  typeof {JSON.stringify(value)} === PortableTextBlock{"<"} ...
                  {">"} & {"{"} listItem: &quot;bar&quot; {"}"},
                  <span />
                  {children}
                </li>
              ),
            },
            marks: {
              // Non-Default Decorators
              baz: ({ children, markKey, markType, value }) => (
                <span>
                  typeof {value} === undefined,
                  <span />
                  typeof {markKey} === &quot;baz&quot;,
                  <span />
                  typeof {markType} === &quot;baz&quot;,
                  <span />
                  {children}
                </span>
              ),
              // Non-Default Annotations
              qux: ({ children, markKey, markType, value }) => (
                <span>
                  typeof {JSON.stringify(value)} === {"{"}
                  _key: string,
                  <span />
                  _type: &quot;qux&quot;,
                  <span />
                  value: typeof {value.value} === string,
                  {"}"},
                  <span />
                  typeof {markKey} === string,
                  <span />
                  typeof {markType} === &quot;qux&quot;,
                  <span />
                  {children}
                </span>
              ),
            },
          }}
        />
      </Fragment>
    ))}
  </>
);

export default Index;
```

## Breaking Changes

### 3 to 4

#### Node Requirement to ^22.14.0

The required Node version is now ^22.14.0. Older versions are no longer supported and newer versions will be added as we validate them.

### 2 to 3

#### Typescript version from 5.7.2 <= x <= 5.7.3

The supported Typescript version is now 5.7.2 <= x <= 5.7.3. Older versions are no longer supported and newer versions will be added as we validate them.

### 1 to 2

#### Typescript version from 5.4.2 <= x <= 5.6.3

The supported Typescript version is now 5.4.2 <= x <= 5.6.3. Older versions are no longer supported and newer versions will be added as we validate them.
