import type { StrictDefinition } from "sanity";
import type { IsStringLiteral } from "type-fest";
import { z } from "zod";

import { _referenced } from "@sanity-typed/types";
import type {
  IntrinsicTypeName,
  _ArrayMemberDefinition,
  _ConfigBase,
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

const zodUnion = <Zods extends z.ZodTypeAny[]>(types: Zods) =>
  (types.length === 1
    ? types[0]
    : z.union(
        types as unknown as [Zods[number], Zods[number], ...Zods[number][]]
      )) as Zods[number];

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
  slug: z.object({
    _type: z.literal("slug"),
    current: z.string(),
  }),
  string: z.string(),
  text: z.string(),
  url: z.string(),
};

const referenceZod = <
  TSchemaType extends _SchemaTypeDefinition<"reference", any, any, any, any>
>() =>
  z.object({
    [_referenced]:
      z.custom<
        TSchemaType extends { to: { type: infer TReferenced }[] }
          ? TReferenced
          : never
      >(),
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
  });

type ReferenceZod<
  TSchemaType extends _SchemaTypeDefinition<"reference", any, any, any, any>
> = ReturnType<typeof referenceZod<TSchemaType>>;

const addTypeFieldsZods = <Type extends string>(type: Type) => ({
  _type: z.literal(type),
});

type AddType<
  Type extends string | undefined,
  Zod extends z.ZodTypeAny
> = IsStringLiteral<Type> extends false
  ? Zod
  : Zod extends z.ZodObject<infer T>
  ? z.ZodObject<
      // TODO Should be able to get this from ZodObject<...>['extend']<...> somehow
      Omit<
        T,
        keyof ReturnType<typeof addTypeFieldsZods<Exclude<Type, undefined>>>
      > &
        ReturnType<typeof addTypeFieldsZods<Exclude<Type, undefined>>>
    >
  : Zod;

const addType =
  <Type extends string | undefined>(type: Type) =>
  <Zod extends z.ZodTypeAny>(zod: Zod) =>
    (typeof type !== "string" || !(zod instanceof z.ZodObject)
      ? zod
      : zod.extend(addTypeFieldsZods(type))) as AddType<Type, Zod>;

const addKeyFieldsZods = {
  _key: z.string(),
};

type AddKey<Zod extends z.ZodTypeAny> = Zod extends z.ZodObject<infer T>
  ? z.ZodObject<
      // TODO Should be able to get this from ZodObject<...>['extend']<...> somehow
      Omit<T, keyof typeof addKeyFieldsZods> & typeof addKeyFieldsZods
    >
  : Zod;

const addKey = <Zod extends z.ZodTypeAny>(zod: Zod) =>
  (!(zod instanceof z.ZodObject)
    ? zod
    : zod.extend(addKeyFieldsZods)) as AddKey<Zod>;

type MembersZods<
  TMemberDefinitions extends _ArrayMemberDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >[]
> =
  TMemberDefinitions extends (infer TMemberDefinition extends _ArrayMemberDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >)[]
    ? TMemberDefinition extends never
      ? never
      : // @ts-expect-error -- TODO Type instantiation is excessively deep and possibly infinite.
        AddType<
          TMemberDefinition["name"],
          AddKey<
            // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
            SanityTypeToZod<TMemberDefinition>
          >
        >[]
    : never;

const memberZods = <
  TMemberDefinitions extends _ArrayMemberDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >[]
>(
  members: TMemberDefinitions
) =>
  members.map((member) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
    const zod = _sanityTypeToZod(member);

    // TODO use lodash-fp flow
    return "name" in member ? addType(member.name)(addKey(zod)) : addKey(zod);
  }) as MembersZods<TMemberDefinitions>;

type ArrayZod<
  TSchemaType extends _SchemaTypeDefinition<"array", any, any, any, any>
> = TSchemaType extends {
  of: infer TMemberDefinitions extends _ArrayMemberDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >[];
}
  ? z.ZodArray<MembersZods<TMemberDefinitions>[number]>
  : never;

const arrayZod = <
  TSchemaType extends _SchemaTypeDefinition<"array", any, any, any, any>
>({
  of,
}: TSchemaType) =>
  z.array(
    zodUnion(
      memberZods(
        of as _ArrayMemberDefinition<any, any, any, any, any, any, any, any>[]
      )
    )
  ) as ArrayZod<TSchemaType>;

const spanZod = addKey(
  z.object({
    _type: z.literal("span"),
    marks: z.optional(z.array(z.string())),
    text: z.string(),
  })
);

type SpanZod = typeof spanZod;

const blockFieldsZods = {
  _type: z.literal("block"),
  level: z.optional(z.number()),
  listItem: z.optional(z.string()),
  style: z.optional(z.string()),
  markDefs: z.optional(
    z.array(
      z.object({
        _key: z.string(),
        _type: z.string(),
      })
    )
  ),
};

type BlockZod<
  TSchemaType extends _SchemaTypeDefinition<"block", any, any, any, any>
> = z.ZodObject<
  typeof blockFieldsZods & {
    children: z.ZodArray<
      TSchemaType extends {
        of?: infer TMemberDefinitions extends _ArrayMemberDefinition<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >[];
      }
        ? MembersZods<TMemberDefinitions>[number] | SpanZod
        : SpanZod
    >;
  }
>;

const blockZod = <
  TSchemaType extends _SchemaTypeDefinition<"block", any, any, any, any>
>({
  of,
}: TSchemaType) =>
  z.object({
    ...blockFieldsZods,
    children: z.array(
      !of
        ? spanZod
        : zodUnion([
            spanZod,
            ...memberZods(
              of as _ArrayMemberDefinition<
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >[]
            ),
          ])
    ),
  }) as BlockZod<TSchemaType>;

const isFieldRequired = (
  field: _FieldDefinition<any, any, any, any, any, any, any, any>
): field is _FieldDefinition<any, any, any, any, any, any, any, true> => {
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
    // @ts-expect-error -- TODO Honestly, idk
    rule
  );

  return isRequired;
};

type FieldsZods<
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
        SanityTypeToZod<Extract<TFieldDefinition, { name: Name }>>
      >;
    } & {
      [Name in Extract<
        TFieldDefinition,
        _FieldDefinition<any, any, any, any, any, any, any, true>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
      >["name"]]: SanityTypeToZod<Extract<TFieldDefinition, { name: Name }>>;
    }
  : never;

const fieldsZods = <
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
  ) as FieldsZods<TSchemaType>;

type ObjectZod<
  TSchemaType extends _SchemaTypeDefinition<"object", any, any, any, any>
> = z.ZodObject<FieldsZods<TSchemaType>>;

const objectZod = <
  TSchemaType extends _SchemaTypeDefinition<"object", any, any, any, any>
>(
  schema: TSchemaType
) => z.object(fieldsZods(schema)) as ObjectZod<TSchemaType>;

const documentFieldsZods = {
  _createdAt: z.string(),
  _id: z.string(),
  _rev: z.string(),
  _type: z.literal("document"),
  _updatedAt: z.string(),
};

type DocumentZod<
  TSchemaType extends _SchemaTypeDefinition<"document", any, any, any, any>
> = z.ZodObject<FieldsZods<TSchemaType> & typeof documentFieldsZods>;

const documentZod = <
  TSchemaType extends _SchemaTypeDefinition<"document", any, any, any, any>
>(
  schema: TSchemaType
) =>
  z.object({
    ...fieldsZods(schema),
    ...documentFieldsZods,
  }) as unknown as DocumentZod<TSchemaType>;

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

const fileFieldsZods = {
  _type: z.literal("file"),
  asset: z.optional(assetZod),
};

type FileZod<
  TSchemaType extends _SchemaTypeDefinition<"file", any, any, any, any>
> = z.ZodObject<FieldsZods<TSchemaType> & typeof fileFieldsZods>;

const fileZod = <
  TSchemaType extends _SchemaTypeDefinition<"file", any, any, any, any>
>(
  schema: TSchemaType
) =>
  z.object({
    ...fieldsZods(schema),
    ...fileFieldsZods,
  }) as unknown as FileZod<TSchemaType>;

const imageFieldsZods = {
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

type ImageZod<
  TSchemaType extends _SchemaTypeDefinition<"image", any, any, any, any>
> = z.ZodObject<FieldsZods<TSchemaType> & typeof imageFieldsZods>;

const imageZod = <
  TSchemaType extends _SchemaTypeDefinition<"image", any, any, any, any>
>(
  schema: TSchemaType
) =>
  z.object({
    ...fieldsZods(schema),
    ...imageFieldsZods,
  }) as unknown as ImageZod<TSchemaType>;

type SanityTypeToZod<
  TSchemaType extends _SchemaTypeDefinition<any, any, any, any, any>
> = TSchemaType["type"] extends keyof typeof constantZods
  ? (typeof constantZods)[TSchemaType["type"]]
  : TSchemaType["type"] extends "reference"
  ? ReferenceZod<
      Extract<
        TSchemaType,
        _SchemaTypeDefinition<"reference", any, any, any, any>
      >
    >
  : TSchemaType["type"] extends "array"
  ? ArrayZod<
      Extract<TSchemaType, _SchemaTypeDefinition<"array", any, any, any, any>>
    >
  : TSchemaType["type"] extends "block"
  ? BlockZod<
      Extract<TSchemaType, _SchemaTypeDefinition<"block", any, any, any, any>>
    >
  : TSchemaType["type"] extends "object"
  ? ObjectZod<
      Extract<TSchemaType, _SchemaTypeDefinition<"object", any, any, any, any>>
    >
  : TSchemaType["type"] extends "document"
  ? DocumentZod<
      Extract<
        TSchemaType,
        _SchemaTypeDefinition<"document", any, any, any, any>
      >
    >
  : TSchemaType["type"] extends "file"
  ? FileZod<
      Extract<TSchemaType, _SchemaTypeDefinition<"file", any, any, any, any>>
    >
  : TSchemaType["type"] extends "image"
  ? ImageZod<
      Extract<TSchemaType, _SchemaTypeDefinition<"image", any, any, any, any>>
    >
  : never;

/** @private */
export const _sanityTypeToZod = <
  TSchemaType extends _SchemaTypeDefinition<any, any, any, any, any>
>(
  schema: TSchemaType
): SanityTypeToZod<TSchemaType> =>
  (schema.type in constantZods
    ? constantZods[
        schema.type as TSchemaType["type"] & keyof typeof constantZods
      ]
    : schema.type === "reference"
    ? referenceZod<
        Extract<
          TSchemaType,
          _SchemaTypeDefinition<"reference", any, any, any, any>
        >
      >()
    : schema.type === "array"
    ? arrayZod(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"array", any, any, any, any>
        >
      )
    : schema.type === "block"
    ? blockZod(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"block", any, any, any, any>
        >
      )
    : schema.type === "object"
    ? objectZod(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"object", any, any, any, any>
        >
      )
    : schema.type === "document"
    ? documentZod(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"document", any, any, any, any>
        >
      )
    : schema.type === "file"
    ? fileZod(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"file", any, any, any, any>
        >
      )
    : schema.type === "image"
    ? imageZod(
        schema as Extract<
          TSchemaType,
          _SchemaTypeDefinition<"image", any, any, any, any>
        >
      )
    : // FIXME aliasedType: () =>
      (undefined as never)) as SanityTypeToZod<TSchemaType>;

export const sanityConfigToZods = <
  const TConfig extends _ConfigBase<any, any>
>({
  schema: { types: typesUntyped = [] } = {},
}: TConfig) => {
  type TTypeDefinition = TConfig extends _ConfigBase<infer TTypeDefinition, any>
    ? TTypeDefinition
    : never;

  const types = typesUntyped as NonNullable<
    NonNullable<_ConfigBase<TTypeDefinition, any>["schema"]>["types"]
  >;

  return Array.isArray(types)
    ? (Object.fromEntries(
        types.map((type) => [type.name, _sanityTypeToZod(type)])
      ) as {
        [Name in TTypeDefinition["name"]]: SanityTypeToZod<
          Extract<TTypeDefinition, { name: Name }>
        >;
      })
    : // TODO https://www.sanity.io/docs/configuration#1ed5d17ef21e
      (undefined as never);
};
