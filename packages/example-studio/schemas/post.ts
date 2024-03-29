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
