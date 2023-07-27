import { describe, it } from "@jest/globals";

import { expectType } from "@sanity-typed/test-utils";

import { defineArrayMember, defineField } from ".";
import type { _InferValue } from ".";

describe("number", () => {
  it("infers number with options", () => {
    const field = defineField({
      name: "foo",
      type: "number",
      options: {
        list: [
          { value: 1, title: "One" } as const,
          { value: 2, title: "Two" } as const,
        ],
      },
    });

    expectType<_InferValue<typeof field>>().toStrictEqual<1 | 2>();
  });

  it("infers SanityDocument with fields", () => {
    const field = defineArrayMember({
      name: "foo",
      type: "document",
      fields: [
        defineField({
          name: "bar",
          type: "boolean",
        }),
        defineField({
          name: "tar",
          type: "number",
          options: {
            list: [
              { value: 1, title: "One" } as const,
              { value: 2, title: "Two" } as const,
            ],
          },
        }),
      ],
    });

    expectType<_InferValue<typeof field>>().toStrictEqual<{
      _createdAt: string;
      _id: string;
      _rev: string;
      _type: "foo";
      _updatedAt: string;
      bar?: boolean;
      tar?: 1 | 2 | undefined;
    }>();
  });
});

describe("string", () => {
  it("infers string with options", () => {
    const field = defineField({
      name: "foo",
      type: "string",
      options: {
        list: [
          { title: "Sci-Fi", value: "sci-fi" } as const,
          { title: "Western", value: "western" } as const,
        ],
      },
    });

    expectType<_InferValue<typeof field>>().toStrictEqual<
      "sci-fi" | "western"
    >();
  });

  it("infers SanityDocument with fields", () => {
    const field = defineArrayMember({
      name: "foo",
      type: "document",
      fields: [
        defineField({
          name: "bar",
          type: "boolean",
        }),
        defineField({
          name: "tar",
          type: "string",
          options: {
            list: [
              { title: "Sci-Fi", value: "sci-fi" } as const,
              { title: "Western", value: "western" } as const,
            ],
          },
        }),
      ],
    });

    expectType<_InferValue<typeof field>>().toStrictEqual<{
      _createdAt: string;
      _id: string;
      _rev: string;
      _type: "foo";
      _updatedAt: string;
      bar?: boolean;
      tar?: "sci-fi" | "western" | undefined;
    }>();
  });
});
