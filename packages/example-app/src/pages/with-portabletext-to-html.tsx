// import { toHTML } from "@portabletext/to-html";
import type { InferGetStaticPropsType } from "next";
import { Fragment } from "react";

import { toHTML } from "@portabletext-typed/to-html";

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
        <div
          dangerouslySetInnerHTML={{
            // Typed Components!
            __html: toHTML(content, {
              components: {
                types: {
                  // From Siblings
                  image: ({ isInline, value }) => `
                    <div>
                      typeof ${isInline} === false,
                      <br />
                      typeof ${JSON.stringify(value)} === ImageValue,
                    </div>`,
                  // From Children
                  file: ({ isInline, value }) => `
                    <span>
                      typeof ${isInline} === true,
                      typeof ${JSON.stringify(value)} === FileValue,
                    </span>`,
                },
                block: {
                  // Non-Default Styles
                  foo: ({ children, value }) => `
                    <div>
                      typeof ${JSON.stringify(
                        value
                      )} === PortableTextBlock\\< ... \\> & { style: "foo" },
                      ${children}
                    </div>`,
                },
                list: {
                  // Non-Default Lists
                  bar: ({ children, value }) => `
                    <ul>
                      <li>typeof ${JSON.stringify(
                        value
                      )} === ToolkitPortableTextList & { listItem: "bar"; },</li>
                      ${children}
                    </ul>`,
                },
                listItem: {
                  // Non-Default Lists
                  bar: ({ children, value }) => `
                    <li>
                      typeof ${JSON.stringify(
                        value
                      )} === PortableTextBlock\\< ... \\> & { listItem: "bar" },
                      ${children}
                    </li>`,
                },
                marks: {
                  // Non-Default Decorators
                  baz: ({ children, markKey, markType, value }) => `
                    <span>
                      typeof ${value} === undefined,
                      typeof ${markKey} === "baz",
                      typeof ${markType} === "baz",
                      ${children}
                    </span>`,
                  // Non-Default Annotations
                  qux: ({ children, markKey, markType, value }) => `
                    <span>
                      typeof ${JSON.stringify(value)} === {
                        _key: string,
                        _type: "qux",
                        value: typeof ${value.value} === string,
                      },
                      typeof ${markKey} === string,
                      typeof ${markType} === "qux",
                      ${children}
                    </span>`,
                },
              },
            }),
          }}
        />
      </Fragment>
    ))}
  </>
);

export default Index;
