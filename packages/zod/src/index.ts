import { z } from "zod";

import type { _ArrayMember, _Field, _Type } from "@sanity-typed/types";

const zodUnion = <Zod extends z.ZodTypeAny>(types: Zod[]) =>
  types.length === 1 ? types[0] : z.union(types as [Zod, Zod, ...Zod[]]);

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
  TSchema extends
    | _ArrayMember<"array", any, any, any, any, any, any, any>
    | _Field<"array", any, any, any, any, any, any, any>
    | _Type<"array", any, any, any, any, any, any>
> = TSchema extends {
  of?: (infer TMemberDefinition extends _ArrayMember<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >)[];
}
  ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
    z.ZodArray<SanityZodReturn<TMemberDefinition>>
  : never;

const sanityZodArray = <
  TSchema extends
    | _ArrayMember<"array", any, any, any, any, any, any, any>
    | _Field<"array", any, any, any, any, any, any, any>
    | _Type<"array", any, any, any, any, any, any>
>({
  of,
}: TSchema) =>
  z.array(
    zodUnion(
      (of as _ArrayMember<any, any, any, any, any, any, any, any>[]).map(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
        sanityZod
      )
    )
  ) as SanityZodArrayReturn<TSchema>;

const sanityZodBlock = z.object({
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
});

type SanityZodBlockReturn = typeof sanityZodBlock;

const isFieldRequired = (
  field: _Field<any, any, any, any, any, any, any, any>
) => {
  // eslint-disable-next-line fp/no-let -- mutation
  let isRequired = false;

  const rule = {
    custom: () => rule,
    email: () => rule,
    error: () => rule,
    greaterThan: () => rule,
    integer: () => rule,
    length: () => rule,
    lessThan: () => rule,
    lowercase: () => rule,
    max: () => rule,
    min: () => rule,
    precision: () => rule,
    regex: () => rule,
    uppercase: () => rule,
    valueOfField: () => rule,
    warning: () => rule,
    required: (): any => {
      // eslint-disable-next-line fp/no-mutation -- mutation
      isRequired = true;
      return rule;
    },
  } as unknown as Parameters<NonNullable<(typeof field)["validation"]>>[0];

  // eslint-disable-next-line fp/no-unused-expression -- mutation
  field.validation?.(
    // @ts-expect-error -- Honestly, idk
    rule
  );

  return isRequired;
};

type SanityZodFields<
  TSchema extends Extract<
    | _ArrayMember<any, any, any, any, any, any, any, any>
    | _Field<any, any, any, any, any, any, any, any>
    | _Type<any, any, any, any, any, any, any>,
    {
      fields?: _Field<any, any, any, any, any, any, any, any>[];
    }
  >
> = TSchema extends {
  fields?: (infer TFieldDefinition extends _Field<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >)[];
}
  ? {
      [Name in Extract<
        TFieldDefinition,
        _Field<any, any, any, any, any, any, any, false>
      >["name"]]: z.ZodOptional<
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
        SanityZodReturn<Extract<TFieldDefinition, { name: Name }>>
      >;
    } & {
      [Name in Extract<
        TFieldDefinition,
        _Field<any, any, any, any, any, any, any, true>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
      >["name"]]: SanityZodReturn<Extract<TFieldDefinition, { name: Name }>>;
    }
  : never;

const sanityZodFields = <
  TSchema extends Extract<
    | _ArrayMember<any, any, any, any, any, any, any, any>
    | _Field<any, any, any, any, any, any, any, any>
    | _Type<any, any, any, any, any, any, any>,
    {
      fields?: _Field<any, any, any, any, any, any, any, any>[];
    }
  >
>({
  fields = [],
}: TSchema) =>
  Object.fromEntries(
    (fields as _Field<any, any, any, any, any, any, any, any>[]).map(
      (field) => [
        field.name,
        isFieldRequired(field)
          ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
            sanityZod(field)
          : z.optional(
              // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
              sanityZod(field)
            ),
      ]
    )
  ) as SanityZodFields<TSchema>;

type SanityZodObjectReturn<
  TSchema extends
    | _ArrayMember<"object", any, any, any, any, any, any, any>
    | _Field<"object", any, any, any, any, any, any, any>
    | _Type<"object", any, any, any, any, any, any>
> = z.ZodObject<SanityZodFields<TSchema>>;

const sanityZodObject = <
  TSchema extends
    | _ArrayMember<"object", any, any, any, any, any, any, any>
    | _Field<"object", any, any, any, any, any, any, any>
    | _Type<"object", any, any, any, any, any, any>
>(
  schema: TSchema
) => z.object(sanityZodFields(schema)) as SanityZodObjectReturn<TSchema>;

const sanityZodDocumentFields = <
  TSchema extends
    | _ArrayMember<"document", any, any, any, any, any, any, any>
    | _Field<"document", any, any, any, any, any, any, any>
    | _Type<"document", any, any, any, any, any, any>
>({
  name,
}: TSchema) => ({
  _createdAt: z.string(),
  _id: z.string(),
  _rev: z.string(),
  _type: z.literal(
    name as TSchema extends
      | _ArrayMember<
          "document",
          infer TName extends string,
          any,
          any,
          any,
          any,
          any,
          any
        >
      | _Field<
          "document",
          infer TName extends string,
          any,
          any,
          any,
          any,
          any,
          any
        >
      | _Type<"document", infer TName extends string, any, any, any, any, any>
      ? TName
      : never
  ),
  _updatedAt: z.string(),
});

type SanityZodDocumentReturn<
  TSchema extends
    | _ArrayMember<"document", any, any, any, any, any, any, any>
    | _Field<"document", any, any, any, any, any, any, any>
    | _Type<"document", any, any, any, any, any, any>
> = z.ZodObject<
  ReturnType<typeof sanityZodDocumentFields<TSchema>> & SanityZodFields<TSchema>
>;

const sanityZodDocument = <
  TSchema extends
    | _ArrayMember<"document", any, any, any, any, any, any, any>
    | _Field<"document", any, any, any, any, any, any, any>
    | _Type<"document", any, any, any, any, any, any>
>(
  schema: TSchema
) =>
  z.object({
    ...sanityZodFields(schema),
    ...sanityZodDocumentFields(schema),
  }) as unknown as SanityZodDocumentReturn<TSchema>;

const sanityZodFileFields = {
  asset: z.optional(
    z.object({
      _key: z.optional(z.string()),
      _ref: z.string(),
      _type: z.string(),
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
    })
  ),
};

type SanityZodFileReturn<
  TSchema extends
    | _ArrayMember<"file", any, any, any, any, any, any, any>
    | _Field<"file", any, any, any, any, any, any, any>
    | _Type<"file", any, any, any, any, any, any>
> = z.ZodObject<SanityZodFields<TSchema> & typeof sanityZodFileFields>;

const sanityZodFile = <
  TSchema extends
    | _ArrayMember<"file", any, any, any, any, any, any, any>
    | _Field<"file", any, any, any, any, any, any, any>
    | _Type<"file", any, any, any, any, any, any>
>(
  schema: TSchema
) =>
  z.object({
    ...sanityZodFields(schema),
    ...sanityZodFileFields,
  }) as unknown as SanityZodFileReturn<TSchema>;

type SanityZodReturn<
  TSchema extends
    | _ArrayMember<any, any, any, any, any, any, any, any>
    | _Field<any, any, any, any, any, any, any, any>
    | _Type<any, any, any, any, any, any, any>
> = TSchema["type"] extends keyof typeof constantZods
  ? (typeof constantZods)[TSchema["type"]]
  : TSchema["type"] extends "array"
  ? SanityZodArrayReturn<
      Extract<
        TSchema,
        | _ArrayMember<"array", any, any, any, any, any, any, any>
        | _Field<"array", any, any, any, any, any, any, any>
        | _Type<"array", any, any, any, any, any, any>
      >
    >
  : TSchema["type"] extends "block"
  ? SanityZodBlockReturn
  : TSchema["type"] extends "object"
  ? SanityZodObjectReturn<
      Extract<
        TSchema,
        | _ArrayMember<"object", any, any, any, any, any, any, any>
        | _Field<"object", any, any, any, any, any, any, any>
        | _Type<"object", any, any, any, any, any, any>
      >
    >
  : TSchema["type"] extends "document"
  ? SanityZodDocumentReturn<
      Extract<
        TSchema,
        | _ArrayMember<"document", any, any, any, any, any, any, any>
        | _Field<"document", any, any, any, any, any, any, any>
        | _Type<"document", any, any, any, any, any, any>
      >
    >
  : TSchema["type"] extends "file"
  ? SanityZodFileReturn<
      Extract<
        TSchema,
        | _ArrayMember<"file", any, any, any, any, any, any, any>
        | _Field<"file", any, any, any, any, any, any, any>
        | _Type<"file", any, any, any, any, any, any>
      >
    >
  : never;

export const sanityZod = <
  TSchema extends
    | _ArrayMember<any, any, any, any, any, any, any, any>
    | _Field<any, any, any, any, any, any, any, any>
    | _Type<any, any, any, any, any, any, any>
>(
  schema: TSchema
): SanityZodReturn<TSchema> =>
  (schema.type in constantZods
    ? constantZods[schema.type as TSchema["type"] & keyof typeof constantZods]
    : schema.type === "array"
    ? sanityZodArray(
        schema as Extract<
          TSchema,
          | _ArrayMember<"array", any, any, any, any, any, any, any>
          | _Field<"array", any, any, any, any, any, any, any>
          | _Type<"array", any, any, any, any, any, any>
        >
      )
    : schema.type === "block"
    ? sanityZodBlock
    : schema.type === "object"
    ? sanityZodObject(
        schema as Extract<
          TSchema,
          | _ArrayMember<"object", any, any, any, any, any, any, any>
          | _Field<"object", any, any, any, any, any, any, any>
          | _Type<"object", any, any, any, any, any, any>
        >
      )
    : schema.type === "document"
    ? sanityZodDocument(
        schema as Extract<
          TSchema,
          | _ArrayMember<"document", any, any, any, any, any, any, any>
          | _Field<"document", any, any, any, any, any, any, any>
          | _Type<"document", any, any, any, any, any, any>
        >
      )
    : schema.type === "file"
    ? sanityZodFile(
        schema as Extract<
          TSchema,
          | _ArrayMember<"file", any, any, any, any, any, any, any>
          | _Field<"file", any, any, any, any, any, any, any>
          | _Type<"file", any, any, any, any, any, any>
        >
      )
    : // TODO image: () =>
      // TODO aliasedType: () =>
      (undefined as never)) as SanityZodReturn<TSchema>;
