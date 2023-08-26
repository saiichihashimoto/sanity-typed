import { z } from "zod";

import type { _ArrayMember, _Field, _Type } from "@sanity-typed/types";

const constantZods = {
  boolean: z.boolean(),
  crossDatasetReference: z.object({
    _dataset: z.string(),
    _projectId: z.string(),
    _ref: z.string(),
    _type: z.literal("crossDatasetReference"),
    _weak: z.optional(z.boolean()),
  }),
  date: z.string(),
  datetime: z.string(),
  email: z.string(),
  geopoint: z.object({
    _type: z.literal("geopoint"),
    alt: z.optional(z.number()),
    lat: z.number(),
    lng: z.number(),
  }),
  number: z.number(),
  reference: z.object({
    _ref: z.string(),
    _weak: z.optional(z.boolean()),
    _strengthenOnPublish: z.optional(
      z.object({
        type: z.string(),
        weak: z.optional(z.boolean()),
        template: z.optional(
          z.object({
            id: z.string(),
            params: z.record(z.union([z.string(), z.number(), z.boolean()])),
          })
        ),
      })
    ),
  }),
  slug: z.object({
    _type: z.literal("slug"),
    current: z.string(),
  }),
  string: z.string(),
  text: z.string(),
  url: z.string(),
};

type SanityZodArrayReturn<
  Schema extends
    | _ArrayMember<"array", any, any, any, any, any, any, any>
    | _Field<"array", any, any, any, any, any, any, any>
    | _Type<"array", any, any, any, any, any, any>
> = z.ZodArray<
  Schema extends {
    of?: (infer TMemberDefinition extends
      | _ArrayMember<any, any, any, any, any, any, any, any>
      | _Field<any, any, any, any, any, any, any, any>
      | _Type<any, any, any, any, any, any, any>)[];
  }
    ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
      SanityZodReturn<TMemberDefinition>
    : never
>;

type SanityZodBlockReturn = z.ZodObject<{
  _type: z.ZodLiteral<"block">;
  children: z.ZodArray<
    z.ZodObject<{
      _key: z.ZodOptional<z.ZodString>;
      _type: z.ZodLiteral<"span">;
      marks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      text: z.ZodString;
    }>
  >;
  level: z.ZodOptional<z.ZodNumber>;
  listItem: z.ZodOptional<z.ZodString>;
  markDefs: z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        _key: z.ZodString;
        _type: z.ZodString;
      }>
    >
  >;
  style: z.ZodOptional<z.ZodString>;
}>;

type SanityZodReturn<
  Schema extends
    | _ArrayMember<any, any, any, any, any, any, any, any>
    | _Field<any, any, any, any, any, any, any, any>
    | _Type<any, any, any, any, any, any, any>
> = Schema["type"] extends keyof typeof constantZods
  ? (typeof constantZods)[Schema["type"]]
  : Schema["type"] extends "array"
  ? SanityZodArrayReturn<
      Extract<
        Schema,
        | _ArrayMember<"array", any, any, any, any, any, any, any>
        | _Field<"array", any, any, any, any, any, any, any>
        | _Type<"array", any, any, any, any, any, any>
      >
    >
  : Schema["type"] extends "block"
  ? SanityZodBlockReturn
  : never;

export const sanityZod = <
  Schema extends
    | _ArrayMember<any, any, any, any, any, any, any, any>
    | _Field<any, any, any, any, any, any, any, any>
    | _Type<any, any, any, any, any, any, any>
>(
  schema: Schema
): SanityZodReturn<Schema> =>
  (schema.type in constantZods
    ? constantZods[schema.type as Schema["type"] & keyof typeof constantZods]
    : schema.type === "array"
    ? z.array(
        (() => {
          const { of } = schema as Extract<
            Schema,
            | _ArrayMember<"array", any, any, any, any, any, any, any>
            | _Field<"array", any, any, any, any, any, any, any>
            | _Type<"array", any, any, any, any, any, any>
          >;

          return of.length === 1
            ? sanityZod(of[0])
            : z.union(
                of.map((member) => sanityZod(member)) as [
                  z.ZodTypeAny,
                  z.ZodTypeAny,
                  ...z.ZodTypeAny[]
                ]
              );
        })()
      )
    : schema.type === "block"
    ? z.object({
        _type: z.literal("block"),
        level: z.optional(z.number()),
        listItem: z.optional(z.string()),
        style: z.optional(z.string()),
        children: z.array(
          z.object({
            _key: z.optional(z.string()),
            _type: z.literal("span"),
            marks: z.optional(z.array(z.string())),
            text: z.string(),
          })
        ),
        markDefs: z.optional(
          z.array(
            z.object({
              _key: z.string(),
              _type: z.string(),
            })
          )
        ),
      })
    : // TODO object: () =>
      // TODO document: () =>
      // TODO file: () =>
      // TODO image: () =>
      // TODO aliasedType: () =>
      (undefined as never)) as SanityZodReturn<Schema>;
