import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";

import type { decorator } from "@portabletext-typed/types";

import { defineArrayMember, defineConfig, defineField, defineType } from ".";
import type { ImageValue, InferSchemaValues, ReferenceValue } from ".";
import type { referenced } from "./internal";

describe("specific issues", () => {
  it("#108 object -> array -> object -> object -> array -> object -> image", () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/108
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "object",
            fields: [
              defineField({
                name: "foo",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "object",
                    fields: [
                      defineField({
                        name: "foo",
                        type: "object",
                        fields: [
                          defineField({
                            name: "foo",
                            type: "array",
                            of: [
                              defineArrayMember({
                                type: "object",
                                fields: [
                                  defineField({
                                    name: "foo",
                                    type: "image",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
      _type: "foo";
      foo?: {
        _key: string;
        foo?: {
          foo?: {
            _key: string;
            foo?: ImageValue<false>;
          }[];
        };
      }[];
    }>();
  });

  it("#299 object -> array -> reference", () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/299
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            title: "Project slider",
            name: "section.projectSlider",
            type: "object",
            fields: [
              defineField({
                type: "string",
                name: "title",
              }),
              defineField({
                title: "Projects",
                name: "projects",
                type: "array",
                validation: (Rule) => Rule.min(3),
                of: [
                  defineArrayMember({
                    type: "reference",
                    to: [{ type: "project" as const }],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<
      InferSchemaValues<typeof config>["section.projectSlider"]
    >().toEqual<{
      _type: "section.projectSlider";
      projects?: (ReferenceValue<"project"> & { _key: string })[];
      title?: string;
    }>();
  });

  it("#415 object -> array -> block", () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/415
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            type: "object",
            name: "foo",
            fields: [
              defineField({
                name: "bar",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "block",
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
      _type: "foo";
      bar?: {
        _key: string;
        _type: "block";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: never[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }[];
    }>();
  });

  it("#589 object -> array -> block -> object -> field", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "object",
            fields: [
              defineField({
                name: "bar",
                type: "array",
                of: [
                  defineArrayMember({
                    name: "baz",
                    type: "block",
                    marks: {
                      annotations: [
                        defineArrayMember({
                          name: "qux",
                          type: "object",
                          fields: [
                            defineField({
                              name: "quux",
                              type: "string",
                            }),
                          ],
                        }),
                      ],
                    },
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    expectType<InferSchemaValues<typeof config>["foo"]>().toEqual<{
      _type: "foo";
      bar?: {
        _key: string;
        _type: "baz";
        children: {
          _key: string;
          _type: "span";
          [decorator]:
            | "code"
            | "em"
            | "strike-through"
            | "strike"
            | "strong"
            | "underline";
          marks: string[];
          text: string;
        }[];
        level?: number;
        listItem?: "bullet" | "number";
        markDefs: {
          _key: string;
          _type: "qux";
          quux?: string;
        }[];
        style:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
      }[];
    }>();
  });

  it("#822", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "productVariety",
            title: "Product Variety",
            description: "Relates a product to a variety of that product",
            type: "object",
            fields: [
              defineField({
                name: "varietyName",
                title: "Variety Name",
                type: "string",
              }),
              defineField({
                name: "price",
                title: "Price",
                type: "number",
                description:
                  "Price for this variety. Overrides the product base price.",
              }),
              defineField({
                name: "salePrice",
                title: "Sale Price",
                type: "number",
                description:
                  "Sale price for this variety. Overrides the product sale price.",
                validation: (rule) =>
                  rule
                    .max(rule.valueOfField("price"))
                    .error("Sale price must be less than the base price"),
              }),
              defineField({
                name: "varietyDescription",
                title: "Variety Description",
                type: "string",
                description:
                  "Description for only this variety. Shown in addition to the main product description.",
              }),
              defineField({
                name: "ingredients",
                title: "Ingredients",
                type: "string",
                description: "Comma separated list of ingredients",
              }),
              defineField({
                name: "size",
                title: "Size",
                type: "string",
                description: "Size of this variety",
              }),
              defineField({
                name: "color",
                title: "Color",
                type: "string",
                description: "Color of this variety",
              }),
              defineField({
                name: "images",
                title: "Images",
                type: "array",
                of: [defineArrayMember({ type: "image" })],
                validation: (Rule) =>
                  Rule.required()
                    .min(1)
                    .max(1)
                    .error("At least one image is required"),
              }),
            ],
          }),
          defineType({
            name: "product",
            title: "Product",
            type: "document",
            fields: [
              defineField({
                name: "name",
                title: "Name",
                type: "string",
                validation: (Rule) =>
                  Rule.required().error("Product name is required."),
              }),
              defineField({
                name: "slug",
                title: "Slug",
                type: "slug",
                description:
                  "Unique id for this product, typically the name with hyphens instead of spaces",
                options: {
                  source: "name",
                  maxLength: 100,
                },
              }),
              defineField({
                name: "varieties",
                title: "Varieties",
                type: "array",
                of: [defineArrayMember({ type: "productVariety" })],
              }),
              defineField({
                name: "description",
                title: "Description",
                description:
                  "Generic description of the product, used for all varieties.",
                type: "string",
              }),
              defineField({
                name: "price",
                title: "Price",
                description:
                  "Base price for this product. The price of each variety overrides this value.",
                type: "number",
                validation: (Rule) =>
                  Rule.required().error("Product base price is required."),
              }),
              defineField({
                name: "salePrice",
                title: "Sale Price",
                description:
                  "Sale price for this product. If the sale is only for one variety, set the sale price on that variety.",
                type: "number",
              }),
              defineField({
                name: "collections",
                title: "Collections",
                description:
                  "The collections this product belongs to, used for filtering",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "reference",
                    name: "collection",
                    to: [{ type: "collection" }],
                  }),
                ],
              }),
              defineField({
                name: "images",
                title: "Images",
                type: "array",
                of: [defineArrayMember({ type: "image" })],
              }),
            ],
            validation: (rule: any) =>
              rule.custom((fields: any) => {
                if (fields.salePrice >= fields.price) {
                  return {
                    message: "Sale price must be less than the base price",
                    path: ["salePrice"],
                  };
                }

                /// write a custom validation rule to check if at least one image is required if no varieties are defined
                if (
                  fields.varieties.length === 0 &&
                  fields.images.length === 0
                ) {
                  return {
                    message:
                      "At least one image is required if no varieties are defined",
                    path: ["images"],
                  };
                }

                return true;
              }),
          }),
        ],

        templates: (prev) => {
          const collectionChild = {
            id: "category-child",
            title: "Category: Child",
            schemaType: "collection",
            parameters: [
              { name: `parentId`, title: `Parent ID`, type: `string` },
            ],
            // This value will be passed-in from desk structure
            value: ({ parentId }: { parentId: string }) => ({
              parent: { _type: "reference", _ref: parentId },
            }),
          };

          return [...prev, collectionChild];
        },
      },
    });

    expectType<
      InferSchemaValues<typeof config>["productVariety"]
    >().toStrictEqual<
      {
        _type: "productVariety";
      } & {
        color?: string;
        images: ({
          _key: string;
        } & {
          _type: "image";
          asset: {
            _ref: string;
            _type: "reference";
            [referenced]: "sanity.imageAsset";
          };
        })[];
        ingredients?: string;
        price?: number;
        salePrice?: number;
        size?: string;
        varietyDescription?: string;
        varietyName?: string;
      }
    >();

    expectType<InferSchemaValues<typeof config>["product"]>().toStrictEqual<
      {
        _createdAt: string;
        _id: string;
        _rev: string;
        _updatedAt: string;
        collections?: ({
          _key: string;
        } & {
          _ref: string;
          _type: "collection";
          [referenced]: "collection";
        })[];
        description?: string;
        images?: ({
          _key: string;
        } & {
          _type: "image";
          asset: {
            _ref: string;
            _type: "reference";
            [referenced]: "sanity.imageAsset";
          };
        })[];
        name: string;
        price: number;
        salePrice?: number;
        slug?: {
          _type: "slug";
          current: string;
        };
        varieties?: ({
          _key: string;
        } & {
          _type: "productVariety";
        } & {
          color?: string;
          images: ({
            _key: string;
          } & {
            _type: "image";
            asset: {
              _ref: string;
              _type: "reference";
              [referenced]: "sanity.imageAsset";
            };
          })[];
          ingredients?: string;
          price?: number;
          salePrice?: number;
          size?: string;
          varietyDescription?: string;
          varietyName?: string;
        })[];
      } & {
        _type: "product";
      }
    >();
  });
});
