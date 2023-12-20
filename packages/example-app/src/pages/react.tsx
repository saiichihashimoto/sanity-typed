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
    <style
      dangerouslySetInnerHTML={{
        __html: "body{background:black;color:white;font-size:18px;}",
      }}
    />
  </>
);

export default Index;
