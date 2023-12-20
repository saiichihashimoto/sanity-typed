<!-- >>>>>> BEGIN GENERATED FILE (include): SOURCE packages/react/_README.md -->
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

## Install

```bash
npm install @portabletext/react @portabletext-typed/react
```

## Usage

After using [@sanity-typed/types](../types) and [@sanity-typed/client](../client) and you have typed blocks, use `PortableText` from this library as you would from [`@portabletext/react`](https://github.com/portabletext/react) to get fully typed arguments!

<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/example-studio/schemas/post.ts -->
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
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/example-studio/schemas/post.ts -->
<!-- >>>>>> BEGIN INCLUDED FILE (typescript): SOURCE packages/example-app/src/pages/with-portabletext-react.tsx -->
```with-portabletext-react.tsx```:
```typescript
import type { InferGetStaticPropsType } from "next";
import { Fragment } from "react";

// import { PortableText } from "@portabletext/react";
import { PortableText } from "@portabletext-typed/react";

import { client } from "../sanity/client";

export const getStaticProps = async () => ({
  props: {
    posts: await client.fetch('*[_type=="post"]'),
  },
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
<!-- <<<<<< END INCLUDED FILE (typescript): SOURCE packages/example-app/src/pages/with-portabletext-react.tsx -->
<!-- <<<<<< END GENERATED FILE (include): SOURCE packages/react/_README.md -->
