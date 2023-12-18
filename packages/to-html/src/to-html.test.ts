import { describe, expect, it, jest } from "@jest/globals";
import { toHTML as toHTMLNative } from "@portabletext/to-html";
import type { HtmlPortableTextList } from "@portabletext/to-html";
import { expectType } from "@saiichihashimoto/test-utils";

import type {
  PortableTextBlock,
  PortableTextSpan,
} from "@portabletext-typed/types";
import type {
  BlockListItemDefault,
  BlockStyleDefault,
} from "@portabletext-typed/types/src/internal";
import {
  defineArrayMember,
  defineConfig,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues, SlugValue } from "@sanity-typed/types";

import { toHTML } from ".";

describe("toHTML", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(jest.fn());
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
      {
        _key: "key",
        _type: "slug",
        current: "current",
      },
    ];

    expect(
      // @ts-expect-error -- toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks, {}));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- toHTML requires options.components.types
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- toHTML requires options.components.types.slug
          types: {},
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          types: {},
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          types: {
            // @ts-expect-error -- toHTML requires options.components.types.slug
            foo: () => "foo",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          types: {
            foo: () => "foo",
          },
        },
      })
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
        components: {
          types: {
            slug: ({ value: { current } }) => current,
          },
        },
      })
    );
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
      // @ts-expect-error -- toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks, {}));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- toHTML requires options.components.types
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- toHTML requires options.components.types.slug
          types: {},
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          types: {},
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          types: {
            // @ts-expect-error -- toHTML requires options.components.types.slug
            foo: () => "foo",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          types: {
            foo: () => "foo",
          },
        },
      })
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
        components: {
          types: {
            slug: ({ value: { current } }) => current,
          },
        },
      })
    );
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
      // @ts-expect-error -- toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- toHTML requires options.components.types
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- toHTML requires options.components.types.slug
          types: {},
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          types: {},
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          types: {
            // @ts-expect-error -- toHTML requires options.components.types.slug
            foo: () => "foo",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          types: {
            foo: () => "foo",
          },
        },
      })
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
        components: {
          types: {
            slug: ({ value: { current } }) => current,
          },
        },
      })
    );
  });

  it.todo("types decorator overrides");

  it.todo("types markDef overrides");

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
        style: "foo",
      },
    ];

    expect(
      // @ts-expect-error -- toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- toHTML requires options.components.block
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- toHTML requires options.components.block.foo
          block: {},
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          block: {},
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          block: {
            // @ts-expect-error -- toHTML requires options.components.block.foo
            bar: () => "bar",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          block: {
            bar: () => "bar",
          },
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          block: {
            foo: ({ children, value }) => {
              expectType<typeof value>().toEqual<
                PortableTextBlock<
                  never,
                  PortableTextSpan & { _key: string },
                  "foo",
                  BlockListItemDefault
                > & {
                  _key: string;
                }
              >();

              return `<marquee>${children}</marquee>`;
            },
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          block: {
            foo: ({ children }) => `<marquee>${children}</marquee>`,
          },
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          block: {
            foo: ({ children }) => `<marquee>${children}</marquee>`,
            // Retyping defaults is fine
            normal: ({ children, value }) => {
              expectType<typeof value>().toEqual<
                PortableTextBlock<
                  never,
                  PortableTextSpan & { _key: string },
                  "normal",
                  BlockListItemDefault
                > & {
                  _key: string;
                }
              >();

              return `<div>${children}</div>`;
            },
            // @ts-expect-error -- Unless they're not provided
            h1: ({ children }) => `<h2>${children}</h2>`,
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          block: {
            foo: ({ children }) => `<marquee>${children}</marquee>`,
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
                never,
                PortableTextSpan & { _key: string },
                "foo" | "normal",
                BlockListItemDefault
              > & {
                _key: string;
              }
            >();

            return `<div>${children}</div>`;
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          block: ({ children }) => `<div>${children}</div>`,
        },
      })
    );
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
        level: 1,
        listItem: "bullet",
        markDefs: [],
        style: "normal",
      },
    ];

    expect(
      // @ts-expect-error -- toHTML requires options
      toHTML(blocks)
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(
        blocks,
        // @ts-expect-error -- toHTML requires options.components
        {}
      )
    ).toStrictEqual(toHTMLNative(blocks));

    expect(
      toHTML(blocks, {
        // @ts-expect-error -- toHTML requires options.components.block
        components: {},
      })
    ).toStrictEqual(toHTMLNative(blocks, { components: {} }));

    expect(
      toHTML(blocks, {
        components: {
          // @ts-expect-error -- toHTML requires options.components.block.foo
          list: {},
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          list: {},
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          list: {
            // @ts-expect-error -- toHTML requires options.components.block.foo
            bar: () => "bar",
          },
          listItem: {
            // @ts-expect-error -- listItem is optional, but it will type with the correct keys
            bar: () => "bar",
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          list: {
            bar: () => "bar",
          },
          listItem: {
            bar: () => "bar",
          },
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

              return `<marquee>${children}</marquee>`;
            },
          },
          listItem: {
            foo: ({ children, value }) => {
              expectType<typeof value>().toEqual<
                PortableTextBlock<
                  never,
                  PortableTextSpan & { _key: string },
                  BlockStyleDefault,
                  "foo"
                > & {
                  _key: string;
                  listItem: "foo";
                }
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
            foo: ({ children }) => `<marquee>${children}</marquee>`,
          },
          listItem: {
            foo: ({ children }) => `<span>${children}</span>`,
          },
        },
      })
    );

    expect(
      toHTML(blocks, {
        components: {
          list: {
            foo: ({ children }) => `<marquee>${children}</marquee>`,
            // Retyping defaults is fine
            bullet: ({ children, value }) => {
              expectType<typeof value>().toStrictEqual<
                HtmlPortableTextList & { listItem: "bullet" }
              >();

              return `<ol>${children}</ol>`;
            },
            // @ts-expect-error -- Unless they're not provided
            number: ({ children }) => `<ul>${children}</ul>`,
          },
          listItem: {
            foo: ({ children }) => `<span>${children}</span>`,
            // Retyping defaults is fine
            bullet: ({ children }) => `<b>${children}</b>`,
            // @ts-expect-error -- Unless they're not provided
            number: ({ children }) => `<i>${children}</i>`,
          },
        },
      })
    ).toStrictEqual(
      toHTMLNative(blocks, {
        components: {
          list: {
            foo: ({ children }) => `<marquee>${children}</marquee>`,
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
                never,
                PortableTextSpan & { _key: string },
                BlockStyleDefault,
                "bullet" | "foo"
              > & {
                _key: string;
                listItem: "bullet" | "foo";
              }
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
  });
});
