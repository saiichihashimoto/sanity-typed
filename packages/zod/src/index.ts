import type { IsNumericLiteral, IsStringLiteral } from "type-fest";
import { z } from "zod";

import { _referenced } from "@sanity-typed/types";
import type {
  InferSchemaValues,
  _ArrayMemberDefinition,
  _ConfigBase,
  _FieldDefinition,
  _TypeDefinition,
} from "@sanity-typed/types";

type _SchemaTypeDefinition<TType extends string, TOptionsHelper> =
  | _ArrayMemberDefinition<
      TType,
      any,
      any,
      any,
      TOptionsHelper,
      any,
      any,
      any,
      any
    >
  | _FieldDefinition<TType, any, any, any, TOptionsHelper, any, any, any, any>
  | _TypeDefinition<TType, any, any, any, TOptionsHelper, any, any, any>;

const zodUnion = <Zods extends z.ZodTypeAny[]>(types: Zods) =>
  (types.length === 1
    ? types[0]
    : z.union(
        types as unknown as [Zods[number], Zods[number], ...Zods[number][]]
      )) as unknown as Zods extends [
    z.ZodTypeAny,
    z.ZodTypeAny,
    ...z.ZodTypeAny[]
  ]
    ? z.ZodUnion<Zods>
    : Zods[number];

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
  slug: z.object({
    _type: z.literal("slug"),
    current: z.string(),
  }),
  text: z.string(),
  url: z.string(),
};

const numberZod = <
  TSchemaType extends _SchemaTypeDefinition<"number", number>
>({
  options: { list } = {},
}: TSchemaType) =>
  (!list
    ? z.number()
    : zodUnion(
        list.map((maybeTitledListValue) =>
          z.literal(
            typeof maybeTitledListValue === "number"
              ? maybeTitledListValue
              : maybeTitledListValue.value!
          )
        )
      )) as TSchemaType extends _SchemaTypeDefinition<
    "number",
    infer TOptionsHelper
  >
    ? IsNumericLiteral<TOptionsHelper> extends false
      ? z.ZodNumber
      : ReturnType<
          typeof zodUnion<
            (TOptionsHelper extends never
              ? never
              : z.ZodLiteral<TOptionsHelper>)[]
          >
        >
    : never;

const stringZod = <
  TSchemaType extends _SchemaTypeDefinition<"string", string>
>({
  options: { list } = {},
}: TSchemaType) =>
  (!list
    ? z.string()
    : zodUnion(
        list.map((maybeTitledListValue) =>
          z.literal(
            typeof maybeTitledListValue === "string"
              ? maybeTitledListValue
              : maybeTitledListValue.value!
          )
        )
      )) as TSchemaType extends _SchemaTypeDefinition<
    "string",
    infer TOptionsHelper
  >
    ? IsStringLiteral<TOptionsHelper> extends false
      ? z.ZodString
      : ReturnType<
          typeof zodUnion<
            (TOptionsHelper extends never
              ? never
              : z.ZodLiteral<TOptionsHelper>)[]
          >
        >
    : never;

const referenceZod = <
  TSchemaType extends _SchemaTypeDefinition<"reference", any>
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

const addTypeFieldsZods = <Type extends string>(type: Type) => ({
  _type: z.literal(type),
});

type AddType<
  Type extends string | undefined,
  Zod extends z.ZodTypeAny
> = IsStringLiteral<Type> extends false
  ? Zod
  : Zod extends z.ZodObject<infer T, infer UnknownKeys, infer CatchAll>
  ? z.ZodObject<
      // TODO Should be able to get this from ZodObject<...>['extend']<...> somehow
      Omit<
        T,
        keyof ReturnType<typeof addTypeFieldsZods<Exclude<Type, undefined>>>
      > &
        ReturnType<typeof addTypeFieldsZods<Exclude<Type, undefined>>>,
      UnknownKeys,
      CatchAll,
      /* eslint-disable @typescript-eslint/sort-type-constituents -- It's getting stuck in a loop */
      z.objectOutputType<
        Omit<
          T,
          keyof ReturnType<typeof addTypeFieldsZods<Exclude<Type, undefined>>>
        >,
        CatchAll,
        UnknownKeys
      > &
        z.objectOutputType<
          ReturnType<typeof addTypeFieldsZods<Exclude<Type, undefined>>>,
          CatchAll,
          UnknownKeys
        >,
      z.objectInputType<
        Omit<
          T,
          keyof ReturnType<typeof addTypeFieldsZods<Exclude<Type, undefined>>>
        >,
        CatchAll,
        UnknownKeys
      > &
        z.objectInputType<
          ReturnType<typeof addTypeFieldsZods<Exclude<Type, undefined>>>,
          CatchAll,
          UnknownKeys
        >
      /* eslint-enable @typescript-eslint/sort-type-constituents */
    >
  : Zod extends z.ZodLazy<infer TZod extends z.ZodTypeAny>
  ? z.ZodLazy<AddType<Type, TZod>>
  : Zod;

const addType = <
  const Type extends string | undefined,
  Zod extends z.ZodTypeAny
>(
  type: Type,
  zod: Zod
): AddType<Type, Zod> =>
  (typeof type !== "string"
    ? zod
    : zod instanceof z.ZodObject
    ? zod.extend(addTypeFieldsZods(type))
    : zod instanceof z.ZodLazy
    ? z.lazy(() => addType(type, zod.schema))
    : zod) as AddType<Type, Zod>;

const addKeyFieldsZods = {
  _key: z.string(),
};

type AddKey<Zod extends z.ZodTypeAny> = Zod extends z.ZodObject<
  infer T,
  infer UnknownKeys,
  infer CatchAll
>
  ? z.ZodObject<
      // TODO Should be able to get this from ZodObject<...>['extend']<...> somehow
      Omit<T, keyof typeof addKeyFieldsZods> & typeof addKeyFieldsZods,
      UnknownKeys,
      CatchAll,
      z.objectOutputType<
        Omit<T, keyof typeof addKeyFieldsZods>,
        CatchAll,
        UnknownKeys
      > &
        z.objectOutputType<typeof addKeyFieldsZods, CatchAll, UnknownKeys>,
      z.objectInputType<
        Omit<T, keyof typeof addKeyFieldsZods>,
        CatchAll,
        UnknownKeys
      > &
        z.objectInputType<typeof addKeyFieldsZods, CatchAll, UnknownKeys>
    >
  : Zod extends z.ZodLazy<infer TZod extends z.ZodTypeAny>
  ? z.ZodLazy<AddKey<TZod>>
  : Zod;

const addKey = <Zod extends z.ZodTypeAny>(zod: Zod): AddKey<Zod> =>
  (zod instanceof z.ZodObject
    ? zod.extend(addKeyFieldsZods)
    : zod instanceof z.ZodLazy
    ? z.lazy(() => addKey(zod.schema))
    : zod) as AddKey<Zod>;

type SanityConfigZods<
  TTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  TPluginTypeDefinition extends _TypeDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  > = _TypeDefinition<any, any, any, any, any, any, any, any>
> = {
  // @ts-expect-error -- Type instantiation is excessively deep and possibly infinite.
  [Name in TTypeDefinition["name"]]: AddType<
    Name,
    // @ts-expect-error -- TODO IDK
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
    SanityTypeToZod<
      Extract<TTypeDefinition, { name: Name }>,
      SanityConfigZods<
        | TTypeDefinition
        | (_TypeDefinition<
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any
          > extends TPluginTypeDefinition
            ? never
            : TPluginTypeDefinition)
      >
    >
  >;
};

type MembersZods<
  TMemberDefinitions extends _ArrayMemberDefinition<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >[],
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
> = TMemberDefinitions extends (infer TMemberDefinition extends _ArrayMemberDefinition<
  any,
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
    : // @ts-expect-error -- Type instantiation is excessively deep and possibly infinite.
      AddKey<
        AddType<
          TMemberDefinition["name"],
          // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
          SanityTypeToZod<TMemberDefinition, TSanityConfigZods>
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
    any,
    any
  >[],
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
>(
  members: TMemberDefinitions,
  getZods: () => TSanityConfigZods
) =>
  members.map((member) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
    const zod = schemaTypeToZod(member, getZods);

    // TODO use lodash-fp flow
    return addKey("name" in member ? addType(member.name, zod) : zod);
  }) as MembersZods<TMemberDefinitions, TSanityConfigZods>;

type ArrayZod<
  TSchemaType extends _SchemaTypeDefinition<"array", any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
> = TSchemaType extends {
  of: infer TMemberDefinitions extends _ArrayMemberDefinition<
    any,
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
  ? z.ZodArray<
      ReturnType<
        typeof zodUnion<MembersZods<TMemberDefinitions, TSanityConfigZods>>
      >
    >
  : never;

const arrayZod = <
  TSchemaType extends _SchemaTypeDefinition<"array", any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
>(
  { of }: TSchemaType,
  getZods: () => TSanityConfigZods
): ArrayZod<TSchemaType, TSanityConfigZods> =>
  z.array(
    zodUnion(
      memberZods(
        of as _ArrayMemberDefinition<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >[],
        getZods
      )
    )
  ) as ArrayZod<TSchemaType, TSanityConfigZods>;

const spanZod = z.object({
  _key: z.string(),
  _type: z.literal("span"),
  marks: z.optional(z.array(z.string())),
  text: z.string(),
});

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
  TSchemaType extends _SchemaTypeDefinition<"block", any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
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
          any,
          any
        >[];
      }
        ? MembersZods<TMemberDefinitions, TSanityConfigZods>[number] | SpanZod
        : SpanZod
    >;
  }
>;

const blockZod = <
  TSchemaType extends _SchemaTypeDefinition<"block", any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
>(
  { of }: TSchemaType,
  getZods: () => TSanityConfigZods
): BlockZod<TSchemaType, TSanityConfigZods> =>
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
                any,
                any
              >[],
              getZods
            ),
          ])
    ),
  }) as BlockZod<TSchemaType, TSanityConfigZods>;

const isFieldRequired = (
  field: _FieldDefinition<any, any, any, any, any, any, any, any, any>
): field is _FieldDefinition<any, any, any, any, any, any, any, any, true> => {
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
    any
  >,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
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
    any,
    any
  >)[];
}
  ? {
      [Name in Extract<
        TFieldDefinition,
        _FieldDefinition<any, any, any, any, any, any, any, any, false>
      >["name"]]: z.ZodOptional<
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
        SanityTypeToZod<
          Extract<TFieldDefinition, { name: Name }>,
          TSanityConfigZods
        >
      >;
    } & {
      [Name in Extract<
        TFieldDefinition,
        _FieldDefinition<any, any, any, any, any, any, any, any, true>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
      >["name"]]: SanityTypeToZod<
        Extract<TFieldDefinition, { name: Name }>,
        TSanityConfigZods
      >;
    }
  : never;

const fieldsZods = <
  TSchemaType extends _SchemaTypeDefinition<
    "document" | "file" | "image" | "object",
    any
  >,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
>(
  { fields = [] }: TSchemaType,
  getZods: () => TSanityConfigZods
) =>
  Object.fromEntries(
    (
      fields as _FieldDefinition<any, any, any, any, any, any, any, any, any>[]
    ).map((field) => [
      field.name,
      isFieldRequired(field)
        ? // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
          schemaTypeToZod(field, getZods)
        : z.optional(
            // eslint-disable-next-line @typescript-eslint/no-use-before-define -- recursive
            schemaTypeToZod(field, getZods)
          ),
    ])
  ) as FieldsZods<TSchemaType, TSanityConfigZods>;

type ObjectZod<
  TSchemaType extends _SchemaTypeDefinition<"object", any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
> = z.ZodObject<FieldsZods<TSchemaType, TSanityConfigZods>>;

const objectZod = <
  TSchemaType extends _SchemaTypeDefinition<"object", any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
>(
  schema: TSchemaType,
  getZods: () => TSanityConfigZods
): ObjectZod<TSchemaType, TSanityConfigZods> =>
  z.object(fieldsZods(schema, getZods)) as ObjectZod<
    TSchemaType,
    TSanityConfigZods
  >;

const documentFieldsZods = {
  _createdAt: z.string(),
  _id: z.string(),
  _rev: z.string(),
  _type: z.literal("document"),
  _updatedAt: z.string(),
};

type DocumentZod<
  TSchemaType extends _SchemaTypeDefinition<"document", any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
> = z.ZodObject<
  FieldsZods<TSchemaType, TSanityConfigZods> & typeof documentFieldsZods
>;

const documentZod = <
  TSchemaType extends _SchemaTypeDefinition<"document", any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
>(
  schema: TSchemaType,
  getZods: () => TSanityConfigZods
): DocumentZod<TSchemaType, TSanityConfigZods> =>
  z.object({
    ...fieldsZods(schema, getZods),
    ...documentFieldsZods,
  }) as unknown as DocumentZod<TSchemaType, TSanityConfigZods>;

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
  asset: assetZod,
};

type FileZod<
  TSchemaType extends _SchemaTypeDefinition<"file", any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
> = z.ZodObject<
  FieldsZods<TSchemaType, TSanityConfigZods> & typeof fileFieldsZods
>;

const fileZod = <
  TSchemaType extends _SchemaTypeDefinition<"file", any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
>(
  schema: TSchemaType,
  getZods: () => TSanityConfigZods
): FileZod<TSchemaType, TSanityConfigZods> =>
  z.object({
    ...fieldsZods(schema, getZods),
    ...fileFieldsZods,
  }) as unknown as FileZod<TSchemaType, TSanityConfigZods>;

const imageFieldsZods = {
  _type: z.literal("image"),
  asset: assetZod,
};

const imageHotspotFields = {
  crop: z.object({
    _type: z.optional(z.literal("sanity.imageCrop")),
    bottom: z.number(),
    left: z.number(),
    right: z.number(),
    top: z.number(),
  }),
  hotspot: z.object({
    _type: z.optional(z.literal("sanity.imageHotspot")),
    height: z.number(),
    width: z.number(),
    x: z.number(),
    y: z.number(),
  }),
};

type ImageZod<
  TSchemaType extends _SchemaTypeDefinition<"image", boolean>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
> = z.ZodObject<
  FieldsZods<TSchemaType, TSanityConfigZods> &
    typeof imageFieldsZods &
    (TSchemaType extends _SchemaTypeDefinition<"image", infer THotspot>
      ? THotspot extends true
        ? typeof imageHotspotFields
        : unknown
      : unknown)
>;

const imageZod = <
  TSchemaType extends _SchemaTypeDefinition<"image", boolean>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
>(
  schema: TSchemaType,
  getZods: () => TSanityConfigZods
): ImageZod<TSchemaType, TSanityConfigZods> =>
  z.object({
    ...fieldsZods(schema, getZods),
    ...imageFieldsZods,
    ...(!schema.options?.hotspot ? {} : imageHotspotFields),
  }) as unknown as ImageZod<TSchemaType, TSanityConfigZods>;

type AliasZod<
  TSchemaType extends _SchemaTypeDefinition<any, any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
> = z.ZodLazy<TSanityConfigZods[TSchemaType["type"]]>;

const aliasZod = <
  TSchemaType extends _SchemaTypeDefinition<any, any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
>(
  { type }: TSchemaType,
  getZods: () => TSanityConfigZods
): AliasZod<TSchemaType, TSanityConfigZods> =>
  z.lazy(() => getZods()[type]) as AliasZod<TSchemaType, TSanityConfigZods>;

type SanityTypeToZod<
  TSchemaType extends _SchemaTypeDefinition<any, any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
> = TSchemaType["type"] extends keyof typeof constantZods
  ? (typeof constantZods)[TSchemaType["type"]]
  : TSchemaType["type"] extends "number"
  ? ReturnType<
      typeof numberZod<
        Extract<TSchemaType, _SchemaTypeDefinition<"number", any>>
      >
    >
  : TSchemaType["type"] extends "string"
  ? ReturnType<
      typeof stringZod<
        Extract<TSchemaType, _SchemaTypeDefinition<"string", any>>
      >
    >
  : TSchemaType["type"] extends "reference"
  ? ReturnType<
      typeof referenceZod<
        Extract<TSchemaType, _SchemaTypeDefinition<"reference", any>>
      >
    >
  : TSchemaType["type"] extends "array"
  ? ReturnType<
      typeof arrayZod<
        Extract<TSchemaType, _SchemaTypeDefinition<"array", any>>,
        TSanityConfigZods
      >
    >
  : TSchemaType["type"] extends "block"
  ? ReturnType<
      typeof blockZod<
        Extract<TSchemaType, _SchemaTypeDefinition<"block", any>>,
        TSanityConfigZods
      >
    >
  : TSchemaType["type"] extends "object"
  ? ReturnType<
      typeof objectZod<
        Extract<TSchemaType, _SchemaTypeDefinition<"object", any>>,
        TSanityConfigZods
      >
    >
  : TSchemaType["type"] extends "document"
  ? ReturnType<
      typeof documentZod<
        Extract<TSchemaType, _SchemaTypeDefinition<"document", any>>,
        TSanityConfigZods
      >
    >
  : TSchemaType["type"] extends "file"
  ? ReturnType<
      typeof fileZod<
        Extract<TSchemaType, _SchemaTypeDefinition<"file", any>>,
        TSanityConfigZods
      >
    >
  : TSchemaType["type"] extends "image"
  ? ReturnType<
      typeof imageZod<
        Extract<TSchemaType, _SchemaTypeDefinition<"image", any>>,
        TSanityConfigZods
      >
    >
  : ReturnType<typeof aliasZod<TSchemaType, TSanityConfigZods>>;

const schemaTypeToZod = <
  TSchemaType extends _SchemaTypeDefinition<any, any>,
  TSanityConfigZods extends SanityConfigZods<
    _TypeDefinition<any, any, any, any, any, any, any, any>
  >
>(
  schema: TSchemaType,
  getZods: () => TSanityConfigZods
): SanityTypeToZod<TSchemaType, TSanityConfigZods> =>
  (schema.type in constantZods
    ? constantZods[
        schema.type as TSchemaType["type"] & keyof typeof constantZods
      ]
    : schema.type === "number"
    ? numberZod(
        schema as Extract<TSchemaType, _SchemaTypeDefinition<"number", number>>
      )
    : schema.type === "string"
    ? stringZod(
        schema as Extract<TSchemaType, _SchemaTypeDefinition<"string", string>>
      )
    : schema.type === "reference"
    ? referenceZod<
        Extract<TSchemaType, _SchemaTypeDefinition<"reference", any>>
      >()
    : schema.type === "array"
    ? arrayZod(
        schema as Extract<TSchemaType, _SchemaTypeDefinition<"array", any>>,
        getZods
      )
    : schema.type === "block"
    ? blockZod(
        schema as Extract<TSchemaType, _SchemaTypeDefinition<"block", any>>,
        getZods
      )
    : schema.type === "object"
    ? objectZod(
        schema as Extract<TSchemaType, _SchemaTypeDefinition<"object", any>>,
        getZods
      )
    : schema.type === "document"
    ? documentZod(
        schema as Extract<TSchemaType, _SchemaTypeDefinition<"document", any>>,
        getZods
      )
    : schema.type === "file"
    ? fileZod(
        schema as Extract<TSchemaType, _SchemaTypeDefinition<"file", any>>,
        getZods
      )
    : schema.type === "image"
    ? imageZod(
        schema as Extract<TSchemaType, _SchemaTypeDefinition<"image", any>>,
        getZods
      )
    : aliasZod(schema, getZods)) as SanityTypeToZod<
    TSchemaType,
    TSanityConfigZods
  >;

/** @private */
export const _sanityConfigToZods = <
  const TConfig extends _ConfigBase<any, any>
>({
  schema: { types: typesUntyped = [] } = {},
  plugins: pluginsUntyped = [],
}: TConfig) => {
  type TTypeDefinition = TConfig extends _ConfigBase<infer TTypeDefinition, any>
    ? TTypeDefinition
    : never;

  const types = typesUntyped as NonNullable<
    NonNullable<_ConfigBase<TTypeDefinition, any>["schema"]>["types"]
  >;

  type TPluginTypeDefinition = TConfig extends _ConfigBase<
    any,
    infer TPluginTypeDefinition
  >
    ? TPluginTypeDefinition
    : never;

  const plugins = pluginsUntyped as _ConfigBase<TPluginTypeDefinition, any>[];

  const pluginsZods = plugins
    .map(
      (plugin) =>
        _sanityConfigToZods(plugin) as SanityConfigZods<
          TPluginTypeDefinition,
          any
        >
    )
    .reduce(
      (acc, zods) => ({ ...acc, ...zods }),
      {} as SanityConfigZods<TPluginTypeDefinition, any>
    );

  const zods: SanityConfigZods<TTypeDefinition, TPluginTypeDefinition> =
    Array.isArray(types)
      ? Object.fromEntries(
          types.map((type) => [
            type.name,
            addType(
              type.name,
              schemaTypeToZod(type, () => ({ ...pluginsZods, ...zods }))
            ),
          ])
        )
      : // TODO https://www.sanity.io/docs/configuration#1ed5d17ef21e
        (undefined as never);

  return zods;
};

export const sanityConfigToZods = <const TConfig extends _ConfigBase<any, any>>(
  config: TConfig
) =>
  _sanityConfigToZods(config) as {
    [TType in keyof InferSchemaValues<TConfig>]: z.ZodType<
      InferSchemaValues<TConfig>[TType]
    >;
  };
