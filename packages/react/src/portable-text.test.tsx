import { describe, expect, it, jest } from "@jest/globals";
import { PortableText as PortableTextNative } from "@portabletext/react";
import type { ReactPortableTextList } from "@portabletext/react";
import { expectType } from "@saiichihashimoto/test-utils";
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";

import type {
  PortableTextBlock,
  PortableTextSpan,
  decorator,
} from "@portabletext-typed/types";
import type {
  BlockListItemDefault,
  BlockMarkDecoratorDefault,
  BlockStyleDefault,
} from "@portabletext-typed/types/src/internal";
import {
  defineArrayMember,
  defineConfig,
  defineField,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, SlugValue } from "@sanity-typed/types";

import type { PortableTextProps } from ".";
import { PortableText } from ".";

describe("PortableText", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(jest.fn());
  });

  it("works with empty array", () => {
    const blocks = [] as never[];

    expect(renderToString(<PortableText value={blocks} />)).toStrictEqual(
      renderToString(<PortableTextNative value={blocks} />)
    );

    expectType<{ value: typeof blocks }>().toBeAssignableTo<
      PortableTextProps<(typeof blocks)[number]>
    >();
  });

  it("returns same value as @portabletext/react", () => {
    const blocks = [
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            _key: "cZUQGmh4",
            _type: "span",
            marks: [],
            text: "Span number one. ",
          },
          {
            _key: "toaiCqIK",
            _type: "span",
            marks: [],
            text: "And span number two.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ];

    expect(renderToString(<PortableText value={blocks} />)).toStrictEqual(
      renderToString(<PortableTextNative value={blocks} />)
    );

    expectType<{ value: typeof blocks }>().toBeAssignableTo<
      PortableTextProps<(typeof blocks)[number]>
    >();
  });

  it("accepts blocks from @sanity-typed/types", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "array",
            of: [
              defineArrayMember({
                type: "block",
              }),
            ],
          }),
        ],
      },
    });

    const blocks: InferSchemaValues<typeof config>["foo"] = [
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "cZUQGmh4",
            _type: "span",
            marks: [],
            text: "Span number one. ",
          },
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "toaiCqIK",
            _type: "span",
            marks: [],
            text: "And span number two.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ];

    expect(renderToString(<PortableText value={blocks} />)).toStrictEqual(
      renderToString(<PortableTextNative value={blocks} />)
    );

    expectType<{ value: typeof blocks }>().toBeAssignableTo<
      PortableTextProps<(typeof blocks)[number]>
    >();
  });

  it("types sibling overrides", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "array",
            of: [
              defineArrayMember({
                type: "block",
              }),
              defineArrayMember({
                type: "slug",
              }),
            ],
          }),
        ],
      },
    });

    const blocks: InferSchemaValues<typeof config>["foo"] = [
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "cZUQGmh4",
            _type: "span",
            marks: [],
            text: "Span number one. ",
          },
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "toaiCqIK",
            _type: "span",
            marks: [],
            text: "And span number two.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "key",
        _type: "slug",
        current: "current",
      },
    ];

    expect(
      renderToString(
        // @ts-expect-error -- PortableText requires components
        <PortableText value={blocks} />
      )
    ).toStrictEqual(renderToString(<PortableTextNative value={blocks} />));

    expect(
      renderToString(
        <PortableText
          value={blocks}
          // @ts-expect-error -- PortableText requires components.types
          components={{}}
        />
      )
    ).toStrictEqual(
      renderToString(<PortableTextNative value={blocks} components={{}} />)
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            // @ts-expect-error -- PortableText requires components.types.slug
            types: {},
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            types: {},
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            types: {
              // @ts-expect-error -- PortableText requires components.types.slug
              foo: () => "foo",
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            types: {
              foo: () => "foo",
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            types: {
              slug: ({ isInline, value }) => {
                expectType<typeof value>().toStrictEqual<
                  SlugValue & { _key: string }
                >();
                expectType<typeof isInline>().toStrictEqual<false>();

                return value.current;
              },
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            types: {
              slug: ({ value: { current } }) => current,
            },
          }}
        />
      )
    );

    expectType<{
      components: {
        types: {
          slug: () => string;
        };
      };
      value: typeof blocks;
    }>().toBeAssignableTo<PortableTextProps<(typeof blocks)[number]>>();
  });

  it("types child overrides", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "array",
            of: [
              defineArrayMember({
                type: "block",
                of: [defineArrayMember({ type: "slug" })],
              }),
            ],
          }),
        ],
      },
    });

    const blocks: InferSchemaValues<typeof config>["foo"] = [
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "cZUQGmh4",
            _type: "span",
            marks: [],
            text: "Span number one. ",
          },
          {
            _key: "key",
            _type: "slug",
            current: "current",
          },
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "toaiCqIK",
            _type: "span",
            marks: [],
            text: "And span number two.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ];

    expect(
      renderToString(
        // @ts-expect-error -- PortableText requires components
        <PortableText value={blocks} />
      )
    ).toStrictEqual(renderToString(<PortableTextNative value={blocks} />));

    expect(
      renderToString(
        <PortableText
          value={blocks}
          // @ts-expect-error -- PortableText requires components.types
          components={{}}
        />
      )
    ).toStrictEqual(
      renderToString(<PortableTextNative value={blocks} components={{}} />)
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            // @ts-expect-error -- PortableText requires components.types.slug
            types: {},
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            types: {},
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            types: {
              // @ts-expect-error -- PortableText requires components.types.slug
              foo: () => "foo",
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            types: {
              foo: () => "foo",
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            types: {
              slug: ({ isInline, value }) => {
                expectType<typeof value>().toStrictEqual<
                  SlugValue & { _key: string }
                >();
                expectType<typeof isInline>().toStrictEqual<true>();

                return value.current;
              },
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            types: {
              slug: ({ value: { current } }) => current,
            },
          }}
        />
      )
    );

    expectType<{
      components: {
        types: {
          slug: () => string;
        };
      };
      value: typeof blocks;
    }>().toBeAssignableTo<PortableTextProps<(typeof blocks)[number]>>();
  });

  it("doesn't collide with siblings and children", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "array",
            of: [
              defineArrayMember({
                type: "block",
                of: [defineArrayMember({ type: "slug" })],
              }),
              defineArrayMember({
                type: "slug",
              }),
            ],
          }),
        ],
      },
    });

    const blocks: InferSchemaValues<typeof config>["foo"] = [
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "cZUQGmh4",
            _type: "span",
            marks: [],
            text: "Span number one. ",
          },
          {
            _key: "key",
            _type: "slug",
            current: "current",
          },
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "toaiCqIK",
            _type: "span",
            marks: [],
            text: "And span number two.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "key",
        _type: "slug",
        current: "current",
      },
    ];

    expect(
      renderToString(
        // @ts-expect-error -- PortableText requires components
        <PortableText value={blocks} />
      )
    ).toStrictEqual(renderToString(<PortableTextNative value={blocks} />));

    expect(
      renderToString(
        <PortableText
          value={blocks}
          // @ts-expect-error -- PortableText requires components.types
          components={{}}
        />
      )
    ).toStrictEqual(
      renderToString(<PortableTextNative value={blocks} components={{}} />)
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            // @ts-expect-error -- PortableText requires components.types.slug
            types: {},
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            types: {},
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            types: {
              // @ts-expect-error -- PortableText requires components.types.slug
              foo: () => "foo",
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            types: {
              foo: () => "foo",
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            types: {
              slug: ({ isInline, value }) => {
                expectType<typeof value>().toStrictEqual<
                  SlugValue & { _key: string }
                >();
                expectType<typeof isInline>().toStrictEqual<boolean>();

                return value.current;
              },
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            types: {
              slug: ({ value: { current } }) => current,
            },
          }}
        />
      )
    );

    expectType<{
      components: {
        types: {
          slug: () => string;
        };
      };
      value: typeof blocks;
    }>().toBeAssignableTo<PortableTextProps<(typeof blocks)[number]>>();
  });

  it("types decorator overrides", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "array",
            of: [
              defineArrayMember({
                type: "block",
                marks: {
                  decorators: [
                    { title: "Strong", value: "strong" },
                    { title: "Foo", value: "foo" },
                  ],
                },
              }),
            ],
          }),
        ],
      },
    });

    const blocks: InferSchemaValues<typeof config>["foo"] = [
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            ...({} as { [decorator]: "foo" | "strong" }),
            _key: "cZUQGmh4",
            _type: "span",
            marks: ["foo"],
            text: "Span number one. ",
          },
          {
            ...({} as { [decorator]: "foo" | "strong" }),
            _key: "toaiCqIK",
            _type: "span",
            marks: ["strong"],
            text: "And span number two.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ];

    expect(
      renderToString(
        // @ts-expect-error -- PortableText requires components
        <PortableText value={blocks} />
      )
    ).toStrictEqual(renderToString(<PortableTextNative value={blocks} />));

    expect(
      renderToString(
        <PortableText
          value={blocks}
          // @ts-expect-error -- PortableText requires components.marks
          components={{}}
        />
      )
    ).toStrictEqual(
      renderToString(<PortableTextNative value={blocks} components={{}} />)
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            // @ts-expect-error -- PortableText requires components.marks.foo
            marks: {},
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            marks: {},
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            marks: {
              // @ts-expect-error -- PortableText requires components.marks.foo
              bar: () => "bar",
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            marks: {
              bar: () => "bar",
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            marks: {
              foo: ({ children, markKey, markType, value }) => {
                expectType<typeof markKey>().toStrictEqual<"foo">();
                expectType<typeof markType>().toStrictEqual<"foo">();
                expectType<typeof value>().toStrictEqual<undefined>();

                return <blockquote>{children}</blockquote>;
              },
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            marks: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            marks: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
              // Retyping defaults is fine
              strong: ({ children, markKey, markType, value }) => {
                expectType<typeof markKey>().toStrictEqual<"strong">();
                expectType<typeof markType>().toStrictEqual<"strong">();
                expectType<typeof value>().toStrictEqual<undefined>();

                return <i>{children}</i>;
              },
              // @ts-expect-error -- Unless they're not provided
              underline: ({ children }) => <code>${children}</code>,
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            marks: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
              strong: ({ children }) => <i>{children}</i>,
              underline: ({ children }) => <code>{children}</code>,
            },
          }}
        />
      )
    );

    expectType<{
      components: {
        marks: {
          foo: () => string;
        };
      };
      value: typeof blocks;
    }>().toBeAssignableTo<PortableTextProps<(typeof blocks)[number]>>();
  });

  it("types markDef overrides", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "array",
            of: [
              defineArrayMember({
                type: "block",
                marks: {
                  annotations: [
                    defineArrayMember({
                      name: "link",
                      type: "object",
                      fields: [
                        defineField({
                          name: "href",
                          type: "url",
                          validation: (Rule) => Rule.required(),
                        }),
                      ],
                    }),
                    defineArrayMember({
                      name: "foo",
                      type: "slug",
                    }),
                  ],
                },
              }),
            ],
          }),
        ],
      },
    });

    const blocks: InferSchemaValues<typeof config>["foo"] = [
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "cZUQGmh4",
            _type: "span",
            marks: ["linkKey"],
            text: "Span number one. ",
          },
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "toaiCqIK",
            _type: "span",
            marks: ["fooKey"],
            text: "And span number two.",
          },
        ],
        markDefs: [
          {
            _key: "linkKey",
            _type: "link",
            href: "https://www.google.com",
          },
          {
            _key: "fooKey",
            _type: "foo",
            current: "current",
          },
        ],
        style: "normal",
      },
    ];

    expect(
      renderToString(
        // @ts-expect-error -- PortableText requires components
        <PortableText value={blocks} />
      )
    ).toStrictEqual(renderToString(<PortableTextNative value={blocks} />));

    expect(
      renderToString(
        <PortableText
          value={blocks}
          // @ts-expect-error -- PortableText requires components.marks
          components={{}}
        />
      )
    ).toStrictEqual(
      renderToString(<PortableTextNative value={blocks} components={{}} />)
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            // @ts-expect-error -- PortableText requires components.marks.foo
            marks: {},
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            marks: {},
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            marks: {
              // @ts-expect-error -- PortableText requires components.marks.foo
              bar: () => "bar",
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            marks: {
              bar: () => "bar",
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            marks: {
              foo: ({ children, markKey, markType, value }) => {
                expectType<typeof markKey>().toStrictEqual<string>();
                expectType<typeof markType>().toStrictEqual<"foo">();
                expectType<typeof value>().toEqual<{
                  _key: string;
                  _type: "foo";
                  current: string;
                }>();

                return <blockquote>{children}</blockquote>;
              },
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            marks: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            marks: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
              // Retyping defaults is fine
              link: ({ children, markKey, markType, value }) => {
                expectType<typeof markKey>().toStrictEqual<string>();
                expectType<typeof markType>().toStrictEqual<"link">();
                expectType<typeof value>().toEqual<{
                  _key: string;
                  _type: "link";
                  href: string;
                }>();

                return (
                  <span>
                    {value.href} {children}
                  </span>
                );
              },
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            marks: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
              link: ({ children, value: { href } }) => (
                <span>
                  {href} {children}
                </span>
              ),
            },
          }}
        />
      )
    );

    expectType<{
      components: {
        marks: {
          foo: () => string;
        };
      };
      value: typeof blocks;
    }>().toBeAssignableTo<PortableTextProps<(typeof blocks)[number]>>();
  });

  it("types style overrides", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "array",
            of: [
              defineArrayMember({
                type: "block",
                styles: [
                  { title: "Normal", value: "normal" },
                  { title: "Foo", value: "foo" },
                ],
              }),
            ],
          }),
        ],
      },
    });

    const blocks: InferSchemaValues<typeof config>["foo"] = [
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "cZUQGmh4",
            _type: "span",
            marks: [],
            text: "Span number one. ",
          },
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "toaiCqIK",
            _type: "span",
            marks: [],
            text: "And span number two.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "cZUQGmh4",
            _type: "span",
            marks: [],
            text: "Span number one. ",
          },
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "toaiCqIK",
            _type: "span",
            marks: [],
            text: "And span number two.",
          },
        ],
        markDefs: [],
        style: "foo",
      },
    ];

    expect(
      renderToString(
        // @ts-expect-error -- PortableText requires components
        <PortableText value={blocks} />
      )
    ).toStrictEqual(renderToString(<PortableTextNative value={blocks} />));

    expect(
      renderToString(
        <PortableText
          value={blocks}
          // @ts-expect-error -- PortableText requires components.block
          components={{}}
        />
      )
    ).toStrictEqual(
      renderToString(<PortableTextNative value={blocks} components={{}} />)
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            // @ts-expect-error -- PortableText requires components.block.foo
            block: {},
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            block: {},
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            block: {
              // @ts-expect-error -- PortableText requires components.block.foo
              bar: () => "bar",
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            block: {
              bar: () => "bar",
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            block: {
              foo: ({ children, value }) => {
                expectType<typeof children>().toStrictEqual<ReactNode>();
                expectType<typeof value>().toEqual<
                  PortableTextBlock<
                    BlockMarkDecoratorDefault,
                    never,
                    PortableTextSpan<BlockMarkDecoratorDefault> & {
                      _key: string;
                    },
                    "foo",
                    BlockListItemDefault
                  > & {
                    _key: string;
                  }
                >();

                return <blockquote>{children}</blockquote>;
              },
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            block: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            block: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
              // Retyping defaults is fine
              normal: ({ children, value }) => {
                expectType<typeof value>().toEqual<
                  PortableTextBlock<
                    BlockMarkDecoratorDefault,
                    never,
                    PortableTextSpan<BlockMarkDecoratorDefault> & {
                      _key: string;
                    },
                    "normal",
                    BlockListItemDefault
                  > & {
                    _key: string;
                  }
                >();

                return <div>{children}</div>;
              },
              // @ts-expect-error -- Unless they're not provided
              h1: ({ children }) => <h2>{children}</h2>,
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            block: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
              normal: ({ children }) => <div>{children}</div>,
              h1: ({ children }) => <h2>{children}</h2>,
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            block: ({ children, value }) => {
              expectType<typeof value>().toStrictEqual<
                PortableTextBlock<
                  BlockMarkDecoratorDefault,
                  never,
                  PortableTextSpan<BlockMarkDecoratorDefault> & {
                    _key: string;
                  },
                  "foo" | "normal",
                  BlockListItemDefault
                > & {
                  _key: string;
                }
              >();

              return <div>{children}</div>;
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            block: ({ children }) => <div>{children}</div>,
          }}
        />
      )
    );

    expectType<{
      components: {
        block: {
          foo: () => string;
        };
      };
      value: typeof blocks;
    }>().toBeAssignableTo<PortableTextProps<(typeof blocks)[number]>>();
  });

  it("types list/listItem overrides", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "array",
            of: [
              defineArrayMember({
                type: "block",
                lists: [
                  { title: "Bullet", value: "bullet" },
                  { title: "Foo", value: "foo" },
                ],
              }),
            ],
          }),
        ],
      },
    });

    const blocks: InferSchemaValues<typeof config>["foo"] = [
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "cZUQGmh4",
            _type: "span",
            marks: [],
            text: "Span number one. ",
          },
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "toaiCqIK",
            _type: "span",
            marks: [],
            text: "And span number two.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "R5FvMrjo",
        _type: "block",
        children: [
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "cZUQGmh4",
            _type: "span",
            marks: [],
            text: "Span number one. ",
          },
          {
            ...({} as { [decorator]: BlockMarkDecoratorDefault }),
            _key: "toaiCqIK",
            _type: "span",
            marks: [],
            text: "And span number two.",
          },
        ],
        level: 1,
        listItem: "bullet",
        markDefs: [],
        style: "normal",
      },
    ];

    expect(
      renderToString(
        // @ts-expect-error -- PortableText requires components
        <PortableText value={blocks} />
      )
    ).toStrictEqual(renderToString(<PortableTextNative value={blocks} />));

    expect(
      renderToString(
        <PortableText
          value={blocks}
          // @ts-expect-error -- PortableText requires components.block
          components={{}}
        />
      )
    ).toStrictEqual(
      renderToString(<PortableTextNative value={blocks} components={{}} />)
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            // @ts-expect-error -- PortableText requires components.block.foo
            list: {},
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            list: {},
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            list: {
              // @ts-expect-error -- PortableText requires components.block.foo
              bar: () => "bar",
            },
            listItem: {
              // @ts-expect-error -- listItem is optional, but it will type with the correct keys
              bar: () => "bar",
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            list: {
              bar: () => "bar",
            },
            listItem: {
              bar: () => "bar",
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            list: {
              foo: ({ children, value }) => {
                expectType<typeof value>().toStrictEqual<
                  ReactPortableTextList & { listItem: "foo" }
                >();

                return <blockquote>{children}</blockquote>;
              },
            },
            listItem: {
              foo: ({ children, value }) => {
                expectType<typeof value>().toEqual<
                  PortableTextBlock<
                    BlockMarkDecoratorDefault,
                    never,
                    PortableTextSpan<BlockMarkDecoratorDefault> & {
                      _key: string;
                    },
                    BlockStyleDefault,
                    "foo"
                  > & {
                    _key: string;
                    listItem: "foo";
                  }
                >();

                return <span>{children}</span>;
              },
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            list: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
            },
            listItem: {
              foo: ({ children }) => <span>{children}</span>,
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            list: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
              // Retyping defaults is fine
              bullet: ({ children, value }) => {
                expectType<typeof value>().toStrictEqual<
                  ReactPortableTextList & { listItem: "bullet" }
                >();

                return <ol>{children}</ol>;
              },
              // @ts-expect-error -- Unless they're not provided
              number: ({ children }) => <ul>{children}</ul>,
            },
            listItem: {
              foo: ({ children }) => <span>{children}</span>,
              // Retyping defaults is fine
              bullet: ({ children }) => <b>{children}</b>,
              // @ts-expect-error -- Unless they're not provided
              number: ({ children }) => <i>{children}</i>,
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            list: {
              foo: ({ children }) => <blockquote>{children}</blockquote>,
              bullet: ({ children }) => <ol>{children}</ol>,
              number: ({ children }) => <ul>{children}</ul>,
            },
            listItem: {
              foo: ({ children }) => <span>{children}</span>,
              bullet: ({ children }) => <b>{children}</b>,
              number: ({ children }) => <i>{children}</i>,
            },
          }}
        />
      )
    );

    expect(
      renderToString(
        <PortableText
          value={blocks}
          components={{
            list: ({ children, value }) => {
              expectType<typeof value>().toStrictEqual<
                ReactPortableTextList & { listItem: "bullet" | "foo" }
              >();

              return <div>{children}</div>;
            },
            listItem: ({ children, value }) => {
              expectType<typeof value>().toEqual<
                PortableTextBlock<
                  BlockMarkDecoratorDefault,
                  never,
                  PortableTextSpan<BlockMarkDecoratorDefault> & {
                    _key: string;
                  },
                  BlockStyleDefault,
                  "bullet" | "foo"
                > & {
                  _key: string;
                  listItem: "bullet" | "foo";
                }
              >();

              return <span>{children}</span>;
            },
          }}
        />
      )
    ).toStrictEqual(
      renderToString(
        <PortableTextNative
          value={blocks}
          components={{
            list: ({ children }) => <div>{children}</div>,
            listItem: ({ children }) => <span>{children}</span>,
          }}
        />
      )
    );

    expectType<{
      components: {
        list: {
          foo: () => string;
        };
        listItem: {
          foo: () => string;
        };
      };
      value: typeof blocks;
    }>().toBeAssignableTo<PortableTextProps<(typeof blocks)[number]>>();
  });
});
