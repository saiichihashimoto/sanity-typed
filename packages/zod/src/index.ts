import type { StrictDefinition } from "sanity";
import { z } from "zod";

import type {
  IntrinsicTypeName,
  _ArrayMemberDefinition,
  _FieldDefinition,
  _TypeDefinition,
} from "@sanity-typed/types";

type _SchemaTypeDefinition<
  TType extends string,
  TName extends string,
  TAlias extends IntrinsicTypeName,
  TStrict extends StrictDefinition,
  TReferenced extends string
> =
  | _ArrayMemberDefinition<
      TType,
      TName,
      TAlias,
      TStrict,
      TReferenced,
      any,
      any,
      any
    >
  | _FieldDefinition<TType, TName, TAlias, TStrict, TReferenced, any, any, any>
  | _TypeDefinition<TType, TName, TAlias, TStrict, TReferenced, any, any>;

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
    _type: z.literal("reference"),
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
  TSchemaType extends _SchemaTypeDefinition<"array", any, any, any, any>
> = TSchemaType extends {
  of?: (infer TMemberDefinition extends _ArrayMemberDefinition<
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
  TSchemaType extends _SchemaTypeDefinition<"array", any, any, any, any>
>({
  of,
}: TSchemaType) =>
  z.array(
    zodUnion(
      (
        of as _ArrayMemberDefinition<any, any, any, any, any, any, any, any>[]
      ).map(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
        _sanityTypeToZod
      )
    )
  ) as SanityZodArrayReturn<TSchemaType>;

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
  field: _FieldDefinition<any, any, any, any, any, any, any, any>
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
  TSchemaType extends _SchemaTypeDefinition<
    "document" | "file" | "image" | "object",
    any,
    any,
    any,
    any
  >
> = TSchemaType extends {
  fields?: (infer TFieldDefinition extends _FieldDefinition<
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
        _FieldDefinition<any, any, any, any, any, any, any, false>
      >["name"]]: z.ZodOptional<
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
        SanityZodReturn<Extract<TFieldDefinition, { name: Name }>>
      >;
    } & {
      [Name in Extract<
        TFieldDefinition,
        _FieldDefinition<any, any, any, any, any, any, any, true>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
      >["name"]]: SanityZodReturn<Extract<TFieldDefinition, { name: Name }>>;
    }
  : never;

const sanityZodFields = <
  TSchemaType extends _SchemaTypeDefinition<
    "document" | "file" | "image" | "object",
    any,
    any,
    any,
    any
  >
>({
  fields = [],
}: TSchemaType) =>
  Object.fromEntries(
    (fields as _FieldDefinition<any, any, any, any, any, any, any, any>[]).map(
      (field) => [
        field.name,
        isFieldRequired(field)
          ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
            _sanityTypeToZod(field)
          : z.optional(
              // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
              _sanityTypeToZod(field)
            ),
      ]
    )
  ) as SanityZodFields<TSchemaType>;

type SanityZodObjectReturn<
  TSchemaType extends _SchemaTypeDefinition<"object", any, any, any, any>
> = z.ZodObject<SanityZodFields<TSchemaType>>;

const sanityZodObject = <
  TSchemaType extends _SchemaTypeDefinition<"object", any, any, any, any>
>(
  schema: TSchemaType
) => z.object(sanityZodFields(schema)) as SanityZodObjectReturn<TSchemaType>;

const sanityZodDocumentFields = <
  TSchemaType extends _SchemaTypeDefinition<"document", any, any, any, any>
>({
  name,
}: TSchemaType) => ({
  _createdAt: z.string(),
  _id: z.string(),
  _rev: z.string(),
  _type: z.literal(
    name as TSchemaType extends _SchemaTypeDefinition<
      "document",
      infer TName extends string,
      any,
      any,
      any
    >
      ? TName
      : never
  ),
  _updatedAt: z.string(),
});

type SanityZodDocumentReturn<
  TSchemaType extends _SchemaTypeDefinition<"document", any, any, any, any>
> = z.ZodObject<
  ReturnType<typeof sanityZodDocumentFields<TSchemaType>> &
    SanityZodFields<TSchemaType>
>;

const sanityZodDocument = <
  TSchemaType extends _SchemaTypeDefinition<"document", any, any, any, any>
>(
  schema: TSchemaType
) =>
  z.object({
    ...sanityZodFields(schema),
    ...sanityZodDocumentFields(schema),
  }) as unknown as SanityZodDocumentReturn<TSchemaType>;

const assetZod = z.object({
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
});

const sanityZodFileFields = {
  _type: z.literal("file"),
  asset: z.optional(assetZod),
};

type SanityZodFileReturn<
  TSchemaType extends _SchemaTypeDefinition<"file", any, any, any, any>
> = z.ZodObject<SanityZodFields<TSchemaType> & typeof sanityZodFileFields>;

const sanityZodFile = <
  TSchemaType extends _SchemaTypeDefinition<"file", any, any, any, any>
>(
  schema: TSchemaType
) =>
  z.object({
    ...sanityZodFields(schema),
    ...sanityZodFileFields,
  }) as unknown as SanityZodFileReturn<TSchemaType>;

const sanityZodImageFields = {
  _type: z.literal("image"),
  asset: z.optional(assetZod),
  crop: z.optional(
    z.object({
      _type: z.optional(z.literal("sanity.imageCrop")),
      bottom: z.number(),
      left: z.number(),
      right: z.number(),
      top: z.number(),
    })
  ),
  hotspot: z.optional(
    z.object({
      _type: z.optional(z.literal("sanity.imageHotspot")),
      height: z.number(),
      width: z.number(),
      x: z.number(),
      y: z.number(),
    })
  ),
};

type SanityZodImageReturn<
  TSchemaType extends _SchemaTypeDefinition<"image", any, any, any, any>
> = z.ZodObject<SanityZodFields<TSchemaType> & typeof sanityZodImageFields>;

const sanityZodImage = <
  TSchemaType extends _SchemaTypeDefinition<"image", any, any, any, any>
>(
  schema: TSchemaType
) =>
  z.object({
    ...sanityZodFields(schema),
    ...sanityZodImageFields,
  }) as unknown as SanityZodImageReturn<TSchemaType>;

type SanityZodReturn<
  TSchemaType extends _SchemaTypeDefinition<any, any, any, any, any>
> = TSchemaType["type"] extends keyof typeof constantZods
  ? (typeof constantZods)[TSchemaType["type"]]
  : TSchemaType["type"] extends "array"
  ? SanityZodArrayReturn<
      Extract<TSchemaType, _SchemaTypeDefinition<"array", any, any, any, any>>
    >
  : TSchemaType["type"] extends "block"
  ? SanityZodBlockReturn
  : TSchemaType["type"] extends "object"
  ? SanityZodObjectReturn<
      Extract<TSchemaType, _SchemaTypeDefinition<"object", any, any, any, any>>
    >
  : TSchemaType["type"] extends "document"
  ? SanityZodDocumentReturn<
      Extract<
        TSchemaType,
        _SchemaTypeDefinition<"document", any, any, any, any>
      >
    >
  : TSchemaType["type"] extends "file"
  ? SanityZodFileReturn<
      Extract<TSchemaType, _SchemaTypeDefinition<"file", any, any, any, any>>
    >
  : TSchemaType["type"] extends "image"
  ? SanityZodImageReturn<
      Extract<TSchemaType, _SchemaTypeDefinition<"image", any, any, any, any>>
    >
  : never;

/** @private */
export const _sanityTypeToZod = <
  TSchemaType extends _SchemaTypeDefinition<any, any, any, any, any>
>(
  schema: TSchemaType
): SanityZodReturn<TSchemaType> =>
  (schema.type in constantZods
    ? constantZods[
        schema.type as TSchemaType["type"] & keyof typeof constantZods
      ]
    : schema.type === "array"
    ? sanityZodArray(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"array", any, any, any, any>
        >
      )
    : schema.type === "block"
    ? sanityZodBlock
    : schema.type === "object"
    ? sanityZodObject(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"object", any, any, any, any>
        >
      )
    : schema.type === "document"
    ? sanityZodDocument(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"document", any, any, any, any>
        >
      )
    : schema.type === "file"
    ? sanityZodFile(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"file", any, any, any, any>
        >
      )
    : schema.type === "image"
    ? sanityZodImage(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"image", any, any, any, any>
        >
      )
    : // FIXME aliasedType: () =>
      (undefined as never)) as SanityZodReturn<TSchemaType>;
