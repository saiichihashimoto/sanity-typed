import { describe, expect, it, jest } from "@jest/globals";
import { toHTML as toHTMLNative } from "@portabletext/to-html";
import { expectType } from "@saiichihashimoto/test-utils";

import {
  defineArrayMember,
  defineConfig,
  defineType,
} from "@sanity-typed/types";
import type { InferSchemaValues } from "@sanity-typed/types";

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
            slug: ({ isInline, value }) => {
              expectType<typeof isInline>().toStrictEqual<boolean>();

              return value.current;
            },
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
            slug: ({ isInline, value }) => {
              expectType<typeof isInline>().toStrictEqual<boolean>();

              return value.current;
            },
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
            slug: ({ isInline, value }) => {
              expectType<typeof isInline>().toStrictEqual<boolean>();

              return value.current;
            },
          },
        },
      })
    );
  });

  it.todo("types decorator overrides");

  it.todo("types markDef overrides");

  it.todo("types style overrides");

  it.todo("types list/listItem overrides");
});
