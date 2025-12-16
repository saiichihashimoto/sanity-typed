import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { toHTML as toHTMLNative } from "@portabletext/to-html";
import type { HtmlPortableTextList } from "@portabletext/to-html";
import { expectType } from "@saiichihashimoto/test-utils";

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

import type { PortableTextOptions } from ".";
import { toHTML } from ".";

describe("toHTML", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(jest.fn());
  });

  it("works with empty array", () => {
    const blocks = [] as never[];

    expect(toHTML(blocks)).toStrictEqual(toHTMLNative(blocks));

    expectType<{ [key: string]: never }>().toBeAssignableTo<
      PortableTextOptions<(typeof blocks)[number]>
    >();
  });

  it("returns same value as @portabletext/to-html", () => {
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

    expect(toHTML(blocks)).toStrictEqual(toHTMLNative(blocks));

    expectType<{ [key: string]: never }>().toBeAssignableTo<
      PortableTextOptions<(typeof blocks)[number]>
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
            of: [defineArrayMember({ type: "block" })],
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

    expect(toHTML(blocks)).toStrictEqual(toHTMLNative(blocks));

    expectType<{ [key: string]: never }>().toBeAssignableTo<
      PortableTextOptions<(typeof blocks)[number]>
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
              defineArrayMember({ type: "block" }),
              defineArrayMember({ type: "slug" }),
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
      { _key: "key", _type: "slug", current: "current" },
    ];

    expect(
      // @ts-expect-error -- EXPECTED toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- EXPECTED toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks, {}));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- EXPECTED toHTML requires options.components.types
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- EXPECTED toHTML requires options.components.types.slug
          types: {},
        },
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: { types: {} } }));

    expect(
      toHTML(blocks, {
        components: {
          types: {
            // @ts-expect-error -- EXPECTED toHTML requires options.components.types.slug
            foo: () => "foo",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, { components: { types: { foo: () => "foo" } } })
    );

    expect(
      toHTML(blocks, {
        components: {
          types: {
            slug: ({ isInline, value }) => {
              expectType<typeof value>().toStrictEqual<
                SlugValue & { _key: string }
              >();
              expectType<typeof isInline>().toStrictEqual<false>();

              return value.current;
            },
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: { types: { slug: ({ value: { current } }) => current } },
      })
    );

    expectType<{
      components: { types: { slug: () => string } };
    }>().toBeAssignableTo<PortableTextOptions<(typeof blocks)[number]>>();
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
          { _key: "key", _type: "slug", current: "current" },
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
      // @ts-expect-error -- EXPECTED toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- EXPECTED toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks, {}));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- EXPECTED toHTML requires options.components.types
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- EXPECTED toHTML requires options.components.types.slug
          types: {},
        },
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: { types: {} } }));

    expect(
      toHTML(blocks, {
        components: {
          types: {
            // @ts-expect-error -- EXPECTED toHTML requires options.components.types.slug
            foo: () => "foo",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, { components: { types: { foo: () => "foo" } } })
    );

    expect(
      toHTML(blocks, {
        components: {
          types: {
            slug: ({ isInline, value }) => {
              expectType<typeof value>().toStrictEqual<
                SlugValue & { _key: string }
              >();
              expectType<typeof isInline>().toStrictEqual<true>();

              return value.current;
            },
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: { types: { slug: ({ value: { current } }) => current } },
      })
    );

    expectType<{
      components: { types: { slug: () => string } };
    }>().toBeAssignableTo<PortableTextOptions<(typeof blocks)[number]>>();
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
              defineArrayMember({ type: "slug" }),
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
          { _key: "key", _type: "slug", current: "current" },
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
      { _key: "key", _type: "slug", current: "current" },
    ];

    expect(
      // @ts-expect-error -- EXPECTED toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- EXPECTED toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- EXPECTED toHTML requires options.components.types
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- EXPECTED toHTML requires options.components.types.slug
          types: {},
        },
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: { types: {} } }));

    expect(
      toHTML(blocks, {
        components: {
          types: {
            // @ts-expect-error -- EXPECTED toHTML requires options.components.types.slug
            foo: () => "foo",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, { components: { types: { foo: () => "foo" } } })
    );

    expect(
      toHTML(blocks, {
        components: {
          types: {
            slug: ({ isInline, value }) => {
              expectType<typeof value>().toStrictEqual<
                SlugValue & { _key: string }
              >();
              expectType<typeof isInline>().toStrictEqual<boolean>();

              return value.current;
            },
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: { types: { slug: ({ value: { current } }) => current } },
      })
    );

    expectType<{
      components: { types: { slug: () => string } };
    }>().toBeAssignableTo<PortableTextOptions<(typeof blocks)[number]>>();
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
                    { title: "Strong", value: "strong" as const },
                    { title: "Foo", value: "foo" as const },
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
      // @ts-expect-error -- EXPECTED toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- EXPECTED toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- EXPECTED toHTML requires options.components.marks
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- EXPECTED toHTML requires options.components.marks.foo
          marks: {},
        },
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: { marks: {} } }));

    expect(
      toHTML(blocks, {
        components: {
          marks: {
            // @ts-expect-error -- EXPECTED toHTML requires options.components.marks.foo
            bar: () => "bar",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, { components: { marks: { bar: () => "bar" } } })
    );

    expect(
      toHTML(blocks, {
        components: {
          marks: {
            foo: ({ children, markKey, markType, value }) => {
              expectType<typeof markKey>().toStrictEqual<"foo">();
              expectType<typeof markType>().toStrictEqual<"foo">();
              expectType<typeof value>().toStrictEqual<undefined>();

              return `<blockquote>${children}</blockquote>`;
            },
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          marks: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
          },
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          marks: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
            // Retyping defaults is fine
            strong: ({ children, markKey, markType, value }) => {
              expectType<typeof markKey>().toStrictEqual<"strong">();
              expectType<typeof markType>().toStrictEqual<"strong">();
              expectType<typeof value>().toStrictEqual<undefined>();

              return `<i>${children}</i>`;
            },
            // @ts-expect-error -- EXPECTED Unless they're not provided
            underline: ({ children }) => `<code>${children}</code>`,
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          marks: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
            strong: ({ children }) => `<i>${children}</i>`,
            underline: ({ children }) => `<code>${children}</code>`,
          },
        },
      })
    );

    expectType<{
      components: { marks: { foo: () => string } };
    }>().toBeAssignableTo<PortableTextOptions<(typeof blocks)[number]>>();
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
                    defineArrayMember({ name: "foo", type: "slug" }),
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
          { _key: "linkKey", _type: "link", href: "https://www.google.com" },
          { _key: "fooKey", _type: "foo", current: "current" },
        ],
        style: "normal",
      },
    ];

    expect(
      // @ts-expect-error -- EXPECTED toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- EXPECTED toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- EXPECTED toHTML requires options.components.marks
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- EXPECTED toHTML requires options.components.marks.foo
          marks: {},
        },
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: { marks: {} } }));

    expect(
      toHTML(blocks, {
        components: {
          marks: {
            // @ts-expect-error -- EXPECTED toHTML requires options.components.marks.foo
            bar: () => "bar",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, { components: { marks: { bar: () => "bar" } } })
    );

    expect(
      toHTML(blocks, {
        components: {
          marks: {
            foo: ({ children, markKey, markType, value }) => {
              expectType<typeof markKey>().toStrictEqual<string>();
              expectType<typeof markType>().toStrictEqual<"foo">();
              expectType<typeof value>().toEqual<{
                _key: string;
                _type: "foo";
                current: string;
              }>();

              return `<blockquote>${children}</blockquote>`;
            },
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          marks: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
          },
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          marks: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
            // Retyping defaults is fine
            link: ({ children, markKey, markType, value }) => {
              expectType<typeof markKey>().toStrictEqual<string>();
              expectType<typeof markType>().toStrictEqual<"link">();
              expectType<typeof value>().toEqual<{
                _key: string;
                _type: "link";
                href: string;
              }>();

              return `<span>${value.href} ${children}</span>`;
            },
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          marks: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
            link: ({ children, value: { href } }) =>
              `<span>${href} ${children}</span>`,
          },
        },
      })
    );

    expectType<{
      components: { marks: { foo: () => string } };
    }>().toBeAssignableTo<PortableTextOptions<(typeof blocks)[number]>>();
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
                  { title: "Normal", value: "normal" as const },
                  { title: "Foo", value: "foo" as const },
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
      // @ts-expect-error -- EXPECTED toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- EXPECTED toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- EXPECTED toHTML requires options.components.block
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- EXPECTED toHTML requires options.components.block.foo
          block: {},
        },
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: { block: {} } }));

    expect(
      toHTML(blocks, {
        components: {
          block: {
            // @ts-expect-error -- EXPECTED toHTML requires options.components.block.foo
            bar: () => "bar",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, { components: { block: { bar: () => "bar" } } })
    );

    expect(
      toHTML(blocks, {
        components: {
          block: {
            foo: ({ children, value }) => {
              expectType<typeof value>().toEqual<
                PortableTextBlock<
                  BlockMarkDecoratorDefault,
                  never,
                  PortableTextSpan<BlockMarkDecoratorDefault> & {
                    _key: string;
                  },
                  "foo",
                  BlockListItemDefault
                > & { _key: string }
              >();

              return `<blockquote>${children}</blockquote>`;
            },
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          block: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
          },
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          block: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
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
                > & { _key: string }
              >();

              return `<div>${children}</div>`;
            },
            // @ts-expect-error -- EXPECTED Unless they're not provided
            h1: ({ children }) => `<h2>${children}</h2>`,
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          block: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
            normal: ({ children }) => `<div>${children}</div>`,
            h1: ({ children }) => `<h2>${children}</h2>`,
          },
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          block: ({ children, value }) => {
            expectType<typeof value>().toStrictEqual<
              PortableTextBlock<
                BlockMarkDecoratorDefault,
                never,
                PortableTextSpan<BlockMarkDecoratorDefault> & { _key: string },
                "foo" | "normal",
                BlockListItemDefault
              > & { _key: string }
            >();

            return `<div>${children}</div>`;
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: { block: ({ children }) => `<div>${children}</div>` },
      })
    );

    expectType<{
      components: { block: { foo: () => string } };
    }>().toBeAssignableTo<PortableTextOptions<(typeof blocks)[number]>>();
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
                  { title: "Bullet", value: "bullet" as const },
                  { title: "Foo", value: "foo" as const },
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
      // @ts-expect-error -- EXPECTED toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- EXPECTED toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- EXPECTED toHTML requires options.components.block
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- EXPECTED toHTML requires options.components.block.foo
          list: {},
        },
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: { list: {} } }));

    expect(
      toHTML(blocks, {
        components: {
          list: {
            // @ts-expect-error -- EXPECTED toHTML requires options.components.block.foo
            bar: () => "bar",
          },
          listItem: {
            // @ts-expect-error -- EXPECTED listItem is optional, but it will type with the correct keys
            bar: () => "bar",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          list: { bar: () => "bar" },
          listItem: { bar: () => "bar" },
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          list: {
            foo: ({ children, value }) => {
              expectType<typeof value>().toStrictEqual<
                HtmlPortableTextList & { listItem: "foo" }
              >();

              return `<blockquote>${children}</blockquote>`;
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
                > & { _key: string; listItem: "foo" }
              >();

              return `<span>${children}</span>`;
            },
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          list: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
          },
          listItem: { foo: ({ children }) => `<span>${children}</span>` },
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          list: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
            // Retyping defaults is fine
            bullet: ({ children, value }) => {
              expectType<typeof value>().toStrictEqual<
                HtmlPortableTextList & { listItem: "bullet" }
              >();

              return `<ol>${children}</ol>`;
            },
            // @ts-expect-error -- EXPECTED Unless they're not provided
            number: ({ children }) => `<ul>${children}</ul>`,
          },
          listItem: {
            foo: ({ children }) => `<span>${children}</span>`,
            // Retyping defaults is fine
            bullet: ({ children }) => `<b>${children}</b>`,
            // @ts-expect-error -- EXPECTED Unless they're not provided
            number: ({ children }) => `<i>${children}</i>`,
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          list: {
            foo: ({ children }) => `<blockquote>${children}</blockquote>`,
            bullet: ({ children }) => `<ol>${children}</ol>`,
            number: ({ children }) => `<ul>${children}</ul>`,
          },
          listItem: {
            foo: ({ children }) => `<span>${children}</span>`,
            bullet: ({ children }) => `<b>${children}</b>`,
            number: ({ children }) => `<i>${children}</i>`,
          },
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          list: ({ children, value }) => {
            expectType<typeof value>().toStrictEqual<
              HtmlPortableTextList & { listItem: "bullet" | "foo" }
            >();

            return `<div>${children}</div>`;
          },
          listItem: ({ children, value }) => {
            expectType<typeof value>().toEqual<
              PortableTextBlock<
                BlockMarkDecoratorDefault,
                never,
                PortableTextSpan<BlockMarkDecoratorDefault> & { _key: string },
                BlockStyleDefault,
                "bullet" | "foo"
              > & { _key: string; listItem: "bullet" | "foo" }
            >();

            return `<span>${children}</span>`;
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          list: ({ children }) => `<div>${children}</div>`,
          listItem: ({ children }) => `<span>${children}</span>`,
        },
      })
    );

    expectType<{
      components: {
        list: { foo: () => string };
        listItem: { foo: () => string };
      };
    }>().toBeAssignableTo<PortableTextOptions<(typeof blocks)[number]>>();
  });
});
